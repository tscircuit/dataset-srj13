import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { pack } from "calculate-packing"
import { fp } from "@tscircuit/footprinter"

const definitionsDir = "dataset/definitions"
const placementsDir = "dataset/placements"
const circuitsDir = "circuits"

const connectorCatalog = {
  rj45: {
    footprint: "pinrow8_p1mm",
    pins: 8,
    jlcpcb: ["C386757", "C163507"],
  },
  usbc: {
    footprint: "imported:TYPE_C_16PIN_2MD_073_",
    pins: 16,
    bounds: [10.4, 8.5],
    jlcpcb: ["C2765186", "C393939"],
  },
  usbb: {
    footprint: "pinrow4_rows2_p2mm",
    pins: 4,
    jlcpcb: ["C46392"],
  },
  microusb: {
    footprint: "pinrow5_p0.65mm",
    pins: 5,
    jlcpcb: ["C10418"],
  },
  rs232: {
    footprint: "imported:SP3232EEN_L_TR",
    pins: 16,
    bounds: [10.9, 7.6],
    jlcpcb: ["C9378"],
  },
  hdmi: {
    footprint: "imported:A_3110_30MG0BK00P1",
    pins: 30,
    bounds: [46.6, 11.1],
    jlcpcb: ["C720743"],
  },
  barrel_jack: {
    footprint: "pinrow3_p2.5mm",
    pins: 3,
    jlcpcb: ["C16214"],
  },
  esp32_wroom: {
    footprint: "pinrow38_rows2_p2.54mm",
    pins: 38,
    jlcpcb: ["C701342"],
    allowOffBoard: true,
  },
}

const mcuCatalog = [
  { family: "bga", footprint: "bga64_p0.8mm", pins: 64, bounds: [8, 8] },
  { family: "qfn", footprint: "qfn48_w7_h7_p0.5mm", pins: 48, bounds: [9, 9] },
  { family: "qfp", footprint: "qfp48_w7_h7_p0.5mm", pins: 48, bounds: [10, 10] },
  { family: "lqfp", footprint: "lqfp64_w10_h10_p0.5mm", pins: 64, bounds: [12, 12] },
  { family: "tssop", footprint: "tssop38_p0.5mm", pins: 38, bounds: [11, 7] },
]

const subcircuitCatalog = [
  { kind: "soic_subcircuit", componentType: "chip", footprint: "soic8_p1.27mm", pins: 8, bounds: [7, 6] },
  { kind: "tssop_subcircuit", componentType: "chip", footprint: "tssop16_p0.65mm", pins: 16, bounds: [8, 6] },
  { kind: "mosfet_subcircuit", componentType: "mosfet", footprint: "sot23", pins: 3, bounds: [4, 3] },
]

const passiveFootprints = [
  { footprint: "0201", bounds: [1.12, 0.4] },
  { footprint: "0402", bounds: [1.56, 0.64] },
  { footprint: "0603", bounds: [2.45, 0.95] },
]

const targetUtilization = 0.35

const round = (value) => Math.round(value * 1000) / 1000

const getFootprintBounds = (footprint) => {
  const elements = fp.string(footprint).circuitJson()
  const points = []
  for (const element of elements) {
    if ("x" in element && "y" in element) {
      points.push([element.x, element.y])
    }
    if (element.center) {
      const diameter = Number.isFinite(element.radius)
        ? element.radius * 2
        : Number.isFinite(element.outer_diameter)
          ? element.outer_diameter
          : 0
      const width = Number.isFinite(element.width) ? element.width : diameter
      const height = Number.isFinite(element.height) ? element.height : diameter
      points.push([element.center.x - width / 2, element.center.y - height / 2])
      points.push([element.center.x + width / 2, element.center.y + height / 2])
    }
    if (Array.isArray(element.points)) {
      for (const point of element.points) {
        if (Number.isFinite(point.x) && Number.isFinite(point.y)) points.push([point.x, point.y])
      }
    }
  }

  if (points.length === 0) return [4, 4]
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  return [
    Math.max(0.8, Math.max(...xs) - Math.min(...xs) + 1.5),
    Math.max(0.8, Math.max(...ys) - Math.min(...ys) + 1.5),
  ]
}

const withBounds = (catalog) => ({
  ...catalog,
  bounds: catalog.bounds ?? getFootprintBounds(catalog.footprint),
})

const makeRng = (seed) => {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

const pick = (rng, items) => items[Math.floor(rng() * items.length)]

const rectFor = (component, clearance = 0) => ({
  left: component.x - component.bounds.width / 2 - clearance,
  right: component.x + component.bounds.width / 2 + clearance,
  bottom: component.y - component.bounds.height / 2 - clearance,
  top: component.y + component.bounds.height / 2 + clearance,
})

const intersects = (a, b) =>
  a.left < b.right && a.right > b.left && a.bottom < b.top && a.top > b.bottom

const overlapsAny = (candidate, components, clearance = 0) => {
  const candidateRect = rectFor(candidate, clearance)
  return components.some((component) => intersects(candidateRect, rectFor(component, clearance)))
}

const isInsideBoard = (component, board, clearance = 0) => {
  const rect = rectFor(component, clearance)
  return (
    rect.left >= -board.width / 2 &&
    rect.right <= board.width / 2 &&
    rect.bottom >= -board.height / 2 &&
    rect.top <= board.height / 2
  )
}

const addComponent = (components, component, clearance = 1) => {
  if (overlapsAny(component, components, clearance)) {
    throw new Error(`Generated overlapping component ${component.ref}`)
  }
  components.push(component)
}

const getUtilization = (components, board) => {
  const occupiedArea = components.reduce(
    (sum, component) => sum + component.bounds.width * component.bounds.height,
    0,
  )
  return occupiedArea / (board.width * board.height)
}

const boundsForRotation = (bounds, rotation) => {
  const normalized = ((rotation % 180) + 180) % 180
  return normalized === 90
    ? { width: bounds[1], height: bounds[0] }
    : { width: bounds[0], height: bounds[1] }
}

const getEdgeRotation = (edge, kind) => {
  if (kind === "usbc") {
    return edge === "left" ? 0 : edge === "right" ? 180 : edge === "top" ? -90 : 90
  }
  return edge === "left" ? 90 : edge === "right" ? -90 : edge === "top" ? 180 : 0
}

const parsePinHeader = (kind) => {
  const match = kind.match(/^pinheader(\d+)(?:_rows(\d+))?$/)
  if (!match) return null
  const pinCount = Number(match[1])
  const rows = Number(match[2] ?? 1)
  return {
    kind,
    componentType: "pinheader",
    footprint: `pinrow${pinCount}_rows${rows}_p2.54mm`,
    pins: pinCount,
    doubleRow: rows === 2,
    pitch: 2.54,
    jlcpcb: [],
  }
}

const connectorFor = (kind) => {
  const pinHeader = parsePinHeader(kind)
  if (pinHeader) return withBounds(pinHeader)
  const entry = connectorCatalog[kind]
  if (!entry) throw new Error(`Unknown connector kind "${kind}"`)
  return withBounds({ kind, componentType: "connector", ...entry })
}

const placeEdge = (components, definition) => {
  const edges = [
    ["left", definition.leftEdge],
    ["right", definition.rightEdge],
    ["top", definition.topEdge],
    ["bottom", definition.bottomEdge],
  ]

  let connectorIndex = 1
  for (const [edge, kinds] of edges) {
    const horizontal = edge === "top" || edge === "bottom"
    const boardSpan = horizontal ? definition.board.width : definition.board.height
    const catalogs = kinds.map(connectorFor)
    const rotations = catalogs.map((catalog, index) => getEdgeRotation(edge, kinds[index] ?? catalog.kind))
    const renderedBounds = catalogs.map((catalog, index) => boundsForRotation(catalog.bounds, rotations[index]))
    const majorSizes = renderedBounds.map((bounds) => (horizontal ? bounds.width : bounds.height))
    const gap = 4
    const totalMajor = majorSizes.reduce((sum, size) => sum + size, 0) + gap * (kinds.length - 1)
    let cursor = -boardSpan / 2 + Math.max(gap, (boardSpan - totalMajor) / 2)

    kinds.forEach((kind, index) => {
      const catalog = catalogs[index]
      const rotation = rotations[index]
      const { width, height } = renderedBounds[index]
      const majorCenter = cursor + majorSizes[index] / 2
      cursor += majorSizes[index] + gap
      const edgeClearance = 1.1
      const x = edge === "left"
        ? -definition.board.width / 2 + width / 2 + edgeClearance
        : edge === "right"
          ? definition.board.width / 2 - width / 2 - edgeClearance
          : majorCenter
      const y = edge === "bottom"
        ? -definition.board.height / 2 + height / 2 + edgeClearance
        : edge === "top"
          ? definition.board.height / 2 - height / 2 - edgeClearance
          : majorCenter

      addComponent(
        components,
        {
          ref: `J${connectorIndex++}`,
          kind,
          componentType: catalog.componentType,
          footprint: catalog.footprint,
          x: round(x),
          y: round(y),
          rotation,
          bounds: { width, height },
          pinCount: catalog.pins,
          doubleRow: catalog.doubleRow,
          pitch: catalog.pitch,
          edge,
          allowOffBoard: catalog.allowOffBoard ?? true,
          supplierPartNumbers: catalog.jlcpcb?.length ? { jlcpcb: catalog.jlcpcb } : undefined,
        },
        -0.5,
      )
    })
  }
}

const withBoardSizedForConnectors = (definition) => {
  const nextDefinition = JSON.parse(JSON.stringify(definition))
  const edgeGroups = [
    ["leftEdge", false],
    ["rightEdge", false],
    ["topEdge", true],
    ["bottomEdge", true],
  ]

  for (const [edgeKey, horizontal] of edgeGroups) {
    const catalogs = nextDefinition[edgeKey].map(connectorFor)
    const rotation = horizontal ? 0 : 90
    const majorSizes = catalogs.map((catalog) => {
      const bounds = boundsForRotation(catalog.bounds, rotation)
      return horizontal ? bounds.width : bounds.height
    })
    const requiredSpan = majorSizes.reduce((sum, size) => sum + size, 0) + Math.max(0, majorSizes.length - 1) * 6 + 12
    if (horizontal) {
      nextDefinition.board.width = Math.max(nextDefinition.board.width, Math.ceil(requiredSpan))
    } else {
      nextDefinition.board.height = Math.max(nextDefinition.board.height, Math.ceil(requiredSpan))
    }
  }

  return nextDefinition
}

const placeMcus = (components, traces, definition, rng) => {
  const centersByCount = {
    1: [[0, 0]],
    2: [[-12, 0], [12, 0]],
    3: [[-16, 6], [16, 6], [0, -12]],
  }

  centersByCount[definition.mcuCount].forEach(([x, y], index) => {
    const mcu = mcuCatalog[(definition.seed + index) % mcuCatalog.length]
    const ref = `U${index + 1}`
    const passiveCount = 2 + Math.floor(rng() * 7)
    addComponent(components, {
      ref,
      kind: "mcu",
      componentType: "chip",
      footprint: mcu.footprint,
      x,
      y,
      rotation: index % 2 === 0 ? 0 : 90,
      bounds: { width: mcu.bounds[0], height: mcu.bounds[1] },
      pinCount: mcu.pins,
      designatedPassiveCount: passiveCount,
      supplierPartNumbers: { jlcpcb: ["C2040", "C15081"] },
    })

    let placedPassiveCount = 0
    for (let passiveIndex = 0; passiveIndex < passiveCount; passiveIndex++) {
      const isCapacitor = passiveIndex % 2 === 0
      const passive = pick(rng, passiveFootprints)
      const passiveRef = `${isCapacitor ? "C" : "R"}${index + 1}${passiveIndex + 1}`
      let placedPassive = false
      for (let attempt = 0; attempt < 24 && !placedPassive; attempt++) {
        const ring = Math.floor(attempt / 8)
        const slot = (passiveIndex + attempt * 3) % Math.max(8, passiveCount * 2)
        const angle = (Math.PI * 2 * slot) / Math.max(8, passiveCount * 2)
        const rotation = [0, 90, 180, 270][passiveIndex % 4]
        const renderedBounds = boundsForRotation(passive.bounds, rotation)
        const radius =
          Math.max(mcu.bounds[0], mcu.bounds[1]) / 2 +
          Math.max(renderedBounds.width, renderedBounds.height) / 2 +
          2.15 +
          ring * 1.75
        const passiveComponent = {
          ref: passiveRef,
          kind: "mcu_passive",
          componentType: isCapacitor ? "capacitor" : "resistor",
          footprint: passive.footprint,
          x: round(x + Math.cos(angle) * radius),
          y: round(y + Math.sin(angle) * radius),
          rotation,
          bounds: renderedBounds,
          passiveKind: isCapacitor ? "capacitor" : "resistor",
          passiveValue: isCapacitor ? "100nF" : "10k",
        }
        if (!overlapsAny(passiveComponent, components, 0.85)) {
          components.push(passiveComponent)
          placedPassive = true
          placedPassiveCount++
        }
      }
      if (placedPassive) {
        traces.push({ from: `.${ref} > .pin${passiveIndex + 1}`, to: `.${passiveRef} > .pin1` })
        traces.push({ from: `.${passiveRef} > .pin2`, to: isCapacitor ? "net.GND" : "net.VCC" })
      }
    }
    const mcuComponent = components.find((component) => component.ref === ref)
    mcuComponent.passiveCount = placedPassiveCount
  })
}

const makePackingPad = (id, bounds, networkId = "cluster") => ({
  padId: id,
  networkId,
  type: "rect",
  offset: { x: 0, y: 0 },
  size: { x: bounds[0], y: bounds[1] },
})

const buildSubcircuitCluster = ({ x, y, catalog, subIndex, rng }) => {
  const subRef = catalog.componentType === "mosfet" ? `Q${subIndex}` : `U_AUX${subIndex}`
  const passiveCount = 1 + Math.floor(rng() * 4)
  const packedInput = {
    components: [
      {
        componentId: subRef,
        isStatic: true,
        center: { x: 0, y: 0 },
        ccwRotationOffset: [0, 90, 180, 270][subIndex % 4],
        availableRotationDegrees: [[0, 90, 180, 270][subIndex % 4]],
        pads: [makePackingPad(`${subRef}_body`, catalog.bounds, `${subRef}_cluster`)],
      },
    ],
    bounds: {
      minX: -8,
      minY: -8,
      maxX: 8,
      maxY: 8,
    },
    minGap: 0.6,
    packOrderStrategy: "largest_to_smallest",
    packPlacementStrategy: "minimum_sum_distance_to_network",
    disconnectedPackDirection: "nearest_to_center",
  }

  const passiveSpecs = []
  for (let passiveIndex = 0; passiveIndex < passiveCount; passiveIndex++) {
    const passive = pick(rng, passiveFootprints)
    const isCapacitor = (subIndex + passiveIndex) % 2 === 0
    const passiveRef = `${isCapacitor ? "C" : "R"}A${subIndex}_${passiveIndex + 1}`
    passiveSpecs.push({ passive, isCapacitor, passiveRef, passiveIndex })
    packedInput.components.push({
      componentId: passiveRef,
      availableRotationDegrees: [0, 90, 180, 270],
      pads: [makePackingPad(`${passiveRef}_body`, passive.bounds, `${subRef}_cluster`)],
    })
  }

  const packed = pack(packedInput)
  const packedById = new Map(packed.components.map((component) => [component.componentId, component]))
  const packedSub = packedById.get(subRef)
  const subRotation = packedSub.ccwRotationDegrees ?? packedSub.ccwRotationOffset ?? 0
  const subBounds = boundsForRotation(catalog.bounds, subRotation)
  const clusterComponents = [
    {
      ref: subRef,
      kind: catalog.kind,
      componentType: catalog.componentType,
      footprint: catalog.footprint,
      x: round(x),
      y: round(y),
      rotation: subRotation,
      bounds: subBounds,
      pinCount: catalog.pins,
      passiveCount,
      supplierPartNumbers: catalog.componentType === "mosfet" ? { jlcpcb: ["C8545"] } : undefined,
    },
  ]
  const clusterTraces = []

  for (const spec of passiveSpecs) {
    const packedPassive = packedById.get(spec.passiveRef)
    const rotation = packedPassive.ccwRotationDegrees ?? packedPassive.ccwRotationOffset ?? 0
    const passiveBounds = boundsForRotation(spec.passive.bounds, rotation)
    clusterComponents.push({
      ref: spec.passiveRef,
      kind: "subcircuit_passive",
      componentType: spec.isCapacitor ? "capacitor" : "resistor",
      footprint: spec.passive.footprint,
      x: round(x + packedPassive.center.x),
      y: round(y + packedPassive.center.y),
      rotation,
      bounds: passiveBounds,
      passiveKind: spec.isCapacitor ? "capacitor" : "resistor",
      passiveValue: spec.isCapacitor ? "1uF" : "4.7k",
    })
    clusterTraces.push({ from: `.${subRef} > .pin${spec.passiveIndex + 1}`, to: `.${spec.passiveRef} > .pin1` })
  }

  return { components: clusterComponents, traces: clusterTraces }
}

const canPlaceCluster = (cluster, components, board, existingClearance = 0.6, selfClearance = 0.15) =>
  cluster.components.every((component, index) => {
    if (!isInsideBoard(component, board, 0.55)) return false
    if (overlapsAny(component, components, existingClearance)) return false
    return !cluster.components.slice(0, index).some((other) =>
      intersects(rectFor(component, selfClearance), rectFor(other, selfClearance)),
    )
  })

const addCluster = (components, traces, cluster) => {
  components.push(...cluster.components)
  traces.push(...cluster.traces)
}

const makeFillCandidates = (definition, rng, passIndex) => {
  const step = passIndex < 2 ? 8 : 5
  const candidates = []
  for (let y = -definition.board.height / 2 + step / 2; y <= definition.board.height / 2 - step / 2; y += step) {
    for (let x = -definition.board.width / 2 + step / 2; x <= definition.board.width / 2 - step / 2; x += step) {
      candidates.push({
        x: round(x + (rng() - 0.5) * 0.8),
        y: round(y + (rng() - 0.5) * 0.8),
        score: Math.hypot(x, y) + rng() * 4,
      })
    }
  }
  return candidates.sort((a, b) => a.score - b.score)
}

const placeSubcircuits = (components, traces, definition, rng) => {
  let subIndex = 1
  for (let passIndex = 0; passIndex < 8 && getUtilization(components, definition.board) < targetUtilization; passIndex++) {
    let placedThisPass = 0
    for (const { x, y } of makeFillCandidates(definition, rng, passIndex)) {
      if (getUtilization(components, definition.board) >= targetUtilization) break
      const catalog = pick(rng, subcircuitCatalog)
      const cluster = buildSubcircuitCluster({ x, y, catalog, subIndex, rng })
      if (!canPlaceCluster(cluster, components, definition.board, passIndex < 2 ? 0.8 : 0.3)) continue
      addCluster(components, traces, cluster)
      placedThisPass++
      subIndex++
    }
  }
}

const generatePlacement = (definition) => {
  definition = withBoardSizedForConnectors(definition)
  const rng = makeRng(definition.seed)
  const components = []
  const traces = []

  placeEdge(components, definition)
  placeMcus(components, traces, definition, rng)
  placeSubcircuits(components, traces, definition, rng)

  return {
    id: definition.id,
    sourceDefinition: `dataset/definitions/${definition.id}.json`,
    board: definition.board,
    components,
    traces,
  }
}

mkdirSync(placementsDir, { recursive: true })
mkdirSync(circuitsDir, { recursive: true })

for (const file of readdirSync(definitionsDir).filter((name) => name.endsWith(".json")).sort()) {
  const definition = JSON.parse(readFileSync(join(definitionsDir, file), "utf8"))
  const placement = generatePlacement(definition)
  const placementPath = join(placementsDir, `${definition.id}.placement.json`)
  writeFileSync(placementPath, `${JSON.stringify(placement, null, 2)}\n`)
  writeFileSync(
    join(circuitsDir, `${definition.id}.circuit.tsx`),
    `import placement from "../${placementPath}"\nimport { renderDatasetCircuit } from "../src/renderDatasetCircuit"\nimport type { DatasetPlacement } from "../src/dataset-types"\n\nexport default () => renderDatasetCircuit(placement as DatasetPlacement)\n`,
  )
}
