import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { pack } from "calculate-packing"
import { fp } from "@tscircuit/footprinter"

const definitionsDir = "dataset/definitions"
const placementsDir = "dataset/placements"
const circuitsDir = "circuits"

const connectorCatalog = {
  rj45: {
    footprint: "pinrow8_rows1_p2.56mm",
    pins: 8,
    pitch: 2.56,
    jlcpcb: ["C386757", "C163507"],
  },
  usbc: {
    footprint: "imported:TYPE_C_16PIN_2MD_073_",
    pins: 16,
    portPins: Array.from({ length: 16 }, (_, index) => index + 13),
    bounds: [10.4, 8.5],
    jlcpcb: ["C2765186", "C393939"],
  },
  usbb: {
    footprint: "pinrow4_rows2_p2mm",
    pins: 4,
    jlcpcb: ["C46392"],
  },
  microusb: {
    footprint: "imported:A_920_E52A2021S10100",
    pins: 9,
    bounds: [8.9, 6.9],
    jlcpcb: ["C10418"],
  },
  rs232: {
    footprint: "imported:SP3232EEN_L_TR",
    pins: 16,
    bounds: [10.9, 7.6],
    jlcpcb: ["C9378"],
  },
  hdmi: {
    footprint: "imported:HDMI_001_19PCBTP",
    pins: 23,
    bounds: [16.6, 12.7],
    jlcpcb: ["C138388"],
  },
  potentiometer_rk09: {
    footprint: "imported:RK09K1110077",
    pins: 5,
    bounds: [20.6, 11.1],
    jlcpcb: ["C3020620"],
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
  { family: "bga", footprint: "bga64_p0.8mm", pins: 64, bounds: [7.1, 7.1] },
  { family: "qfn", footprint: "qfn48_w8_h8_p0.5mm", pins: 48, bounds: [8.43, 8.43] },
  { family: "qfp", footprint: "qfp48_w7_h7_p0.5mm", pins: 48, bounds: [9.3, 9.3] },
  { family: "qfp", footprint: "qfp128_w14_h14_p0.4mm", pins: 128, bounds: [16.1, 16.1] },
  { family: "lqfp", footprint: "lqfp64_w10_h10_p0.5mm", pins: 64, bounds: [12.8, 12.8] },
  { family: "tssop", footprint: "tssop38_w4_p0.5mm", pins: 38, bounds: [6.8, 10.5] },
]

const subcircuitCatalog = [
  { kind: "soic_subcircuit", componentType: "chip", footprint: "soic8_w3.9mm_p1.27mm", pins: 8, bounds: [6.4, 6.5] },
  { kind: "soic14_subcircuit", componentType: "chip", footprint: "soic14_w3.9mm_p1.27mm", pins: 14, bounds: [6.4, 10.3] },
  { kind: "soic16_subcircuit", componentType: "chip", footprint: "soic16_w3.9mm_p1.27mm", pins: 16, bounds: [6.4, 11.6] },
  { kind: "tssop_subcircuit", componentType: "chip", footprint: "tssop16_w4_p0.65mm", pins: 16, bounds: [6.95, 6.05] },
  { kind: "tssop20_subcircuit", componentType: "chip", footprint: "tssop20_w4_p0.65mm", pins: 20, bounds: [6.95, 7.35] },
  { kind: "qfn_subcircuit", componentType: "chip", footprint: "qfn20_w4_h4_p0.5mm_pl0.6mm", pins: 20, bounds: [4.42, 4.42] },
  { kind: "qfn_thermalpad_subcircuit", componentType: "chip", footprint: "qfn20_w5_h5_p0.65mm_pl0.6mm_thermalpad2x2", pins: 21, bounds: [5.43, 5.43] },
  { kind: "button_4pin_subcircuit", componentType: "chip", footprint: "pushbutton_4pin", pins: 4, bounds: [8.5, 10.5] },
  { kind: "button_6x6_subcircuit", componentType: "chip", footprint: "pushbutton_6x6", pins: 4, bounds: [8.5, 10.5] },
  { kind: "large_capacitor_subcircuit", componentType: "capacitor", footprint: "radial_capacitor", pins: 2, bounds: [12, 12], passiveValue: "47uF", standalone: true },
  { kind: "mosfet_subcircuit", componentType: "mosfet", footprint: "sot23", pins: 3, bounds: [4.2, 4.2] },
  { kind: "dual_mosfet_subcircuit", componentType: "chip", footprint: "soic8_w3.9mm_p1.27mm", pins: 8, bounds: [6.4, 6.5] },
  { kind: "power_mosfet_subcircuit", componentType: "mosfet", footprint: "sot223", pins: 4, bounds: [11.5, 9.6] },
  { kind: "large_power_mosfet_subcircuit", componentType: "mosfet", footprint: "to220", pins: 3, bounds: [13.5, 8] },
  { kind: "irf540_mosfet_subcircuit", componentType: "mosfet", footprint: "imported:IRF540NPBF", pins: 3, bounds: [12.4, 7.3] },
  { kind: "flat_power_mosfet_subcircuit", componentType: "mosfet", footprint: "imported:IRF640NSTRLPBF", pins: 4, bounds: [17, 11.2], jlcpcb: ["C23708"] },
]

const powerMosfetSubcircuit = subcircuitCatalog.find((component) => component.kind === "power_mosfet_subcircuit")
const largePowerMosfetSubcircuit = subcircuitCatalog.find((component) => component.kind === "large_power_mosfet_subcircuit")
const irf540MosfetSubcircuit = subcircuitCatalog.find((component) => component.kind === "irf540_mosfet_subcircuit")
const flatPowerMosfetSubcircuit = subcircuitCatalog.find((component) => component.kind === "flat_power_mosfet_subcircuit")
const largeCapacitorSubcircuit = subcircuitCatalog.find((component) => component.kind === "large_capacitor_subcircuit")
const buttonSubcircuitCatalog = subcircuitCatalog.filter((component) => component.kind.startsWith("button_"))
const standardSubcircuitCatalog = subcircuitCatalog.filter((component) =>
  component.kind !== "power_mosfet_subcircuit" &&
  component.kind !== "large_power_mosfet_subcircuit" &&
  component.kind !== "irf540_mosfet_subcircuit" &&
  component.kind !== "flat_power_mosfet_subcircuit"
)

const passiveFootprints = [
  { footprint: "0201", bounds: [1.12, 0.4] },
  { footprint: "0402", bounds: [1.56, 0.64] },
  { footprint: "0603", bounds: [2.45, 0.95] },
]

const edgePassiveConnectorKinds = new Set(["hdmi", "usbc", "microusb", "usbb"])
const minimumPackingMargin = 0.3
const mcuPassiveCourtyardClearance = 1.05

const densityProfiles = [
  { targetUtilization: 0.36, earlyClearance: 1.1, lateClearance: 0.55, selfClearance: 0.35, lateStep: 4.5 },
  { targetUtilization: 0.37, earlyClearance: 1.0, lateClearance: 0.5, selfClearance: 0.32, lateStep: 4 },
  { targetUtilization: 0.38, earlyClearance: 0.9, lateClearance: 0.48, selfClearance: 0.3, lateStep: 3.75 },
  { targetUtilization: 0.39, earlyClearance: 0.85, lateClearance: 0.45, selfClearance: minimumPackingMargin, lateStep: 3.5 },
]

const round = (value) => Math.round(value * 1000) / 1000

const packQuietly = (input) => {
  const originalLog = console.log
  const originalWarn = console.warn
  const originalError = console.error
  const shouldSuppress = (args) =>
    String(args[0] ?? "").includes("MultiOffsetIrlsSolver ran out of iterations")

  console.log = (...args) => {
    if (!shouldSuppress(args)) originalLog(...args)
  }
  console.warn = (...args) => {
    if (!shouldSuppress(args)) originalWarn(...args)
  }
  console.error = (...args) => {
    if (!shouldSuppress(args)) originalError(...args)
  }

  try {
    return pack(input)
  } finally {
    console.log = originalLog
    console.warn = originalWarn
    console.error = originalError
  }
}

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

const edgeKeepoutFor = (component) =>
  component.componentType === "connector" || component.componentType === "pinheader"
    ? 2.2
    : component.kind === "mcu"
      ? 1.35
    : 0

const overlapsAnyForFillCluster = (candidate, components, clearance = 0) =>
  components.some((component) => {
    const pairClearance = Math.max(clearance, edgeKeepoutFor(component), edgeKeepoutFor(candidate))
    return intersects(rectFor(candidate, pairClearance), rectFor(component, pairClearance))
  })

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

const nearestLegalComponent = (component, components, board, clearance = 1) => {
  const candidates = [{ x: component.x, y: component.y, score: 0 }]
  for (let radius = 4; radius <= 28; radius += 4) {
    for (const dx of [-radius, 0, radius]) {
      for (const dy of [-radius, 0, radius]) {
        if (dx === 0 && dy === 0) continue
        candidates.push({
          x: round(component.x + dx),
          y: round(component.y + dy),
          score: Math.hypot(dx, dy),
        })
      }
    }
  }
  candidates.sort((a, b) => a.score - b.score)
  for (const candidate of candidates) {
    const placed = { ...component, x: candidate.x, y: candidate.y }
    if (!isInsideBoard(placed, board, 1)) continue
    if (overlapsAny(placed, components, clearance)) continue
    return placed
  }
  return null
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

const getDensityProfile = (definition) =>
  densityProfiles[Math.abs(definition.seed) % densityProfiles.length]

const portEdgeRotations = {
  left: 270,
  right: 90,
  top: 180,
  bottom: 0,
}

const outwardXAxisEdgeRotations = {
  left: 180,
  right: 0,
  top: 90,
  bottom: 270,
}

const getEdgeRotation = (edge, kind, definitionId) => {
  if (kind === "usbc" || kind === "microusb" || kind === "hdmi") {
    return portEdgeRotations[edge]
  }
  if (kind === "potentiometer_rk09") {
    return outwardXAxisEdgeRotations[edge]
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
    footprint: `pinrow${pinCount}_rows${rows}_p2.56mm`,
    pins: pinCount,
    doubleRow: rows === 2,
    pitch: 2.56,
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

const inwardTargetForEdge = (edge, bounds, passiveIndex) => {
  const alongOffset = passiveIndex % 2 === 0 ? -1.8 : 1.8
  const inset = 1
  if (edge === "left") return { x: bounds.width / 2 + inset, y: alongOffset }
  if (edge === "right") return { x: -bounds.width / 2 - inset, y: alongOffset }
  if (edge === "bottom") return { x: alongOffset, y: bounds.height / 2 + inset }
  return { x: alongOffset, y: -bounds.height / 2 - inset }
}

const buildEdgeConnectorPassiveCluster = ({ connector, rng }) => {
  if (!edgePassiveConnectorKinds.has(connector.kind)) return null
  const passiveCount = Math.floor(rng() * 3)
  if (passiveCount === 0) return null
  const packedInput = {
    components: [
      {
        componentId: connector.ref,
        isStatic: true,
        center: { x: 0, y: 0 },
        availableRotationDegrees: [0],
        pads: [
          makePackingPad(`${connector.ref}_body`, [connector.bounds.width, connector.bounds.height], `${connector.ref}_body`),
          ...Array.from({ length: passiveCount }, (_, passiveIndex) =>
            makePackingPad(
              `${connector.ref}_target_${passiveIndex + 1}`,
              [0.22, 0.22],
              `${connector.ref}_p${passiveIndex + 1}`,
              inwardTargetForEdge(connector.edge, connector.bounds, passiveIndex),
            )
          ),
        ],
      },
    ],
    bounds: {
      minX: -connector.bounds.width / 2 - 6,
      minY: -connector.bounds.height / 2 - 6,
      maxX: connector.bounds.width / 2 + 6,
      maxY: connector.bounds.height / 2 + 6,
    },
      minGap: Math.max(0.6, minimumPackingMargin),
    packOrderStrategy: "largest_to_smallest",
    packPlacementStrategy: "shortest_connection_along_outline",
    disconnectedPackDirection: "nearest_to_center",
    packFirst: [connector.ref],
  }

  const passiveSpecs = []
  for (let passiveIndex = 0; passiveIndex < passiveCount; passiveIndex++) {
    const passive = pick(rng, passiveFootprints)
    const isCapacitor = passiveIndex % 2 === 0
    const passiveRef = `${isCapacitor ? "C" : "R"}${connector.ref}_${passiveIndex + 1}`
    passiveSpecs.push({ passive, isCapacitor, passiveRef, passiveIndex })
    packedInput.components.push({
      componentId: passiveRef,
      availableRotationDegrees: [0, 90, 180, 270],
      pads: [
        makePackingPad(`${passiveRef}_body`, passive.bounds, `${passiveRef}_body`),
        makePackingPad(
          `${passiveRef}_pin1`,
          [0.2, 0.2],
          `${connector.ref}_p${passiveIndex + 1}`,
          passivePadOffset(passive.bounds, 0),
        ),
        makePackingPad(
          `${passiveRef}_pin2`,
          [0.2, 0.2],
          "GND",
          passivePadOffset(passive.bounds, 1),
        ),
      ],
    })
  }

  let packed
  try {
    packed = packQuietly(packedInput)
  } catch {
    return null
  }
  const packedById = new Map(packed.components.map((component) => [component.componentId, component]))
  const components = []
  const traces = []
  for (const spec of passiveSpecs) {
    const packedPassive = packedById.get(spec.passiveRef)
    if (!packedPassive) return null
    const rotation = packedPassive.ccwRotationDegrees ?? packedPassive.ccwRotationOffset ?? 0
    const bounds = boundsForRotation(spec.passive.bounds, rotation)
    components.push({
      ref: spec.passiveRef,
      kind: "edge_connector_passive",
      componentType: spec.isCapacitor ? "capacitor" : "resistor",
      footprint: spec.passive.footprint,
      x: round(connector.x + packedPassive.center.x),
      y: round(connector.y + packedPassive.center.y),
      rotation,
      bounds,
      passiveKind: spec.isCapacitor ? "capacitor" : "resistor",
      passiveValue: spec.isCapacitor ? "100nF" : "22R",
    })
    const connectorPin = connector.portPins?.[spec.passiveIndex] ?? Math.min(spec.passiveIndex + 1, connector.pinCount ?? 1)
    traces.push({ from: `.${connector.ref} > .pin${connectorPin}`, to: `.${spec.passiveRef} > .pin1` })
    traces.push({ from: `.${spec.passiveRef} > .pin2`, to: "net.GND" })
  }
  return { components, traces }
}

const placeEdge = (components, traces, definition, rng) => {
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
    const rotations = catalogs.map((catalog, index) => getEdgeRotation(edge, kinds[index] ?? catalog.kind, definition.id))
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
      const outwardOffset = kind === "potentiometer_rk09" ? 8.6 : 0
      const x = edge === "left"
        ? -definition.board.width / 2 + width / 2 + edgeClearance - outwardOffset
        : edge === "right"
          ? definition.board.width / 2 - width / 2 - edgeClearance + outwardOffset
          : majorCenter
      const y = edge === "bottom"
        ? -definition.board.height / 2 + height / 2 + edgeClearance - outwardOffset
        : edge === "top"
          ? definition.board.height / 2 - height / 2 - edgeClearance + outwardOffset
          : majorCenter

      const connector = {
        ref: `J${connectorIndex++}`,
        kind,
        componentType: catalog.componentType,
        footprint: catalog.footprint,
        x: round(x),
        y: round(y),
        rotation,
        bounds: { width, height },
        pinCount: catalog.pins,
        portPins: catalog.portPins,
        doubleRow: catalog.doubleRow,
        pitch: catalog.pitch,
        edge,
        allowOffBoard: catalog.allowOffBoard ?? true,
        supplierPartNumbers: catalog.jlcpcb?.length ? { jlcpcb: catalog.jlcpcb } : undefined,
      }

      addComponent(
        components,
        connector,
        -0.5,
      )
      const passiveCluster = buildEdgeConnectorPassiveCluster({ connector, rng })
      if (passiveCluster?.components.every((component) =>
        isInsideBoard(component, definition.board, 0.35) &&
        !overlapsAny(component, components, 0.16) &&
        !passiveCluster.components.some((other) => other !== component && intersects(rectFor(component, 0.12), rectFor(other, 0.12)))
      )) {
        components.push(...passiveCluster.components)
        traces.push(...passiveCluster.traces)
      }
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
    const passiveCount = 8 + Math.floor(rng() * 13)
    const mcuRotation = index % 2 === 0 ? 0 : 90
    const mcuComponent = nearestLegalComponent({
      ref,
      kind: "mcu",
      componentType: "chip",
      footprint: mcu.footprint,
      x,
      y,
      rotation: mcuRotation,
      bounds: { width: mcu.bounds[0], height: mcu.bounds[1] },
      pinCount: mcu.pins,
      designatedPassiveCount: passiveCount,
      supplierPartNumbers: { jlcpcb: ["C2040", "C15081"] },
    }, components, definition.board, 1)
    if (!mcuComponent) {
      throw new Error(`Could not place MCU ${ref} without collision`)
    }
    components.push(mcuComponent)
    x = mcuComponent.x
    y = mcuComponent.y

    const sideOrder = ["left", "top", "right", "bottom"]
    const slotOffsets = [-2, -1, 0, 1, 2]
    const passiveSpecs = []
    const packedInput = {
      components: [
        {
          componentId: ref,
          isStatic: true,
          center: { x: 0, y: 0 },
          ccwRotationOffset: mcuRotation,
          availableRotationDegrees: [mcuRotation],
          pads: [
            makePackingPad(`${ref}_body`, mcu.bounds, `${ref}_body`),
            ...Array.from({ length: passiveCount }, (_, passiveIndex) =>
              makePackingPad(
                `${ref}_target_${passiveIndex + 1}`,
                [0.25, 0.25],
                `${ref}_p${passiveIndex + 1}`,
                pinTargetForSide(
                  sideOrder[(index + passiveIndex) % sideOrder.length],
                  mcu.bounds,
                  slotOffsets[Math.floor(passiveIndex / sideOrder.length) % slotOffsets.length],
                  2.15,
                ),
              )
            ),
          ],
        },
      ],
      bounds: {
        minX: -Math.max(18, mcu.bounds[0] / 2 + 12),
        minY: -Math.max(18, mcu.bounds[1] / 2 + 12),
        maxX: Math.max(18, mcu.bounds[0] / 2 + 12),
        maxY: Math.max(18, mcu.bounds[1] / 2 + 12),
      },
      minGap: Math.max(0.55, minimumPackingMargin),
      packOrderStrategy: "largest_to_smallest",
      packPlacementStrategy: "shortest_connection_along_outline",
      disconnectedPackDirection: "nearest_to_center",
      packFirst: [ref],
    }

    for (let passiveIndex = 0; passiveIndex < passiveCount; passiveIndex++) {
      const isCapacitor = passiveIndex % 2 === 0
      const passive = pick(rng, passiveFootprints)
      const passiveRef = `${isCapacitor ? "C" : "R"}${index + 1}${passiveIndex + 1}`
      passiveSpecs.push({ passive, isCapacitor, passiveRef, passiveIndex })
      packedInput.components.push({
        componentId: passiveRef,
        availableRotationDegrees: [[0, 90, 180, 270][passiveIndex % 4]],
        pads: [
          makePackingPad(`${passiveRef}_body`, passive.bounds, `${passiveRef}_body`),
          makePackingPad(
            `${passiveRef}_pin1`,
            [0.22, 0.22],
            `${ref}_p${passiveIndex + 1}`,
            passivePadOffset(passive.bounds, 0),
          ),
          makePackingPad(
            `${passiveRef}_pin2`,
            [0.22, 0.22],
            "GND",
            passivePadOffset(passive.bounds, 1),
          ),
        ],
      })
    }

    let packedComponents = []
    try {
      packedComponents = packQuietly(packedInput).components
    } catch {
      packedComponents = []
    }
    const packedById = new Map(packedComponents.map((component) => [component.componentId, component]))
    const passiveComponents = []
    const passiveTraces = []
    for (const spec of passiveSpecs) {
      const packedPassive = packedById.get(spec.passiveRef)
      if (!packedPassive) continue
      const rotation = packedPassive.ccwRotationDegrees ?? packedPassive.ccwRotationOffset ?? 0
      const renderedBounds = boundsForRotation(spec.passive.bounds, rotation)
      const passiveComponent = {
        ref: spec.passiveRef,
        kind: "mcu_passive",
        componentType: spec.isCapacitor ? "capacitor" : "resistor",
        footprint: spec.passive.footprint,
        x: round(x + packedPassive.center.x),
        y: round(y + packedPassive.center.y),
        rotation,
        bounds: renderedBounds,
        passiveKind: spec.isCapacitor ? "capacitor" : "resistor",
        passiveValue: spec.isCapacitor ? "100nF" : "10k",
      }
      if (!isInsideBoard(passiveComponent, definition.board, 0.55)) continue
      if (overlapsAnyForFillCluster(passiveComponent, components, mcuPassiveCourtyardClearance)) continue
      if (passiveComponents.some((other) => intersects(rectFor(passiveComponent, 0.15), rectFor(other, 0.15)))) continue
      passiveComponents.push(passiveComponent)
      passiveTraces.push({ from: `.${ref} > .pin${spec.passiveIndex + 1}`, to: `.${spec.passiveRef} > .pin1` })
      passiveTraces.push({ from: `.${spec.passiveRef} > .pin2`, to: "net.GND" })
    }

    components.push(...passiveComponents)
    traces.push(...passiveTraces)
    const placedMcu = components.find((component) => component.ref === ref)
    placedMcu.passiveCount = passiveComponents.length
  })
}

const correctionCandidateOffsets = (mcu, passiveBounds, passiveIndex) => {
  const sides = ["left", "right", "top", "bottom"]
  const offsets = [-3, -2, -1, 0, 1, 2, 3]
  const candidates = []
  for (let ring = 0; ring < 5; ring++) {
    const sideInset = 2.15 + ring * 0.55
    for (const side of sides) {
      for (const offset of offsets) {
        const spread = offset * 1.15
        if (side === "left") candidates.push({ x: mcu.x - mcu.bounds.width / 2 - passiveBounds.width / 2 - sideInset, y: mcu.y + spread })
        if (side === "right") candidates.push({ x: mcu.x + mcu.bounds.width / 2 + passiveBounds.width / 2 + sideInset, y: mcu.y + spread })
        if (side === "top") candidates.push({ x: mcu.x + spread, y: mcu.y + mcu.bounds.height / 2 + passiveBounds.height / 2 + sideInset })
        if (side === "bottom") candidates.push({ x: mcu.x + spread, y: mcu.y - mcu.bounds.height / 2 - passiveBounds.height / 2 - sideInset })
      }
    }
  }
  return candidates.sort((a, b) => {
    const da = Math.hypot(a.x - mcu.x, a.y - mcu.y)
    const db = Math.hypot(b.x - mcu.x, b.y - mcu.y)
    return da - db || ((passiveIndex + Math.round(a.x * 10) + Math.round(a.y * 10)) % 7) - ((passiveIndex + Math.round(b.x * 10) + Math.round(b.y * 10)) % 7)
  })
}

const correctMcuPassivePlacement = (components, traces, definition) => {
  for (const mcu of components.filter((component) => component.kind === "mcu")) {
    const mcuIndex = Number(mcu.ref.replace(/^U/, ""))
    const existing = () => components.filter((component) =>
      component.kind === "mcu_passive" && new RegExp(`^[CR]${mcuIndex}\\d+$`).test(component.ref)
    )
    const targetCount = Math.min(mcu.designatedPassiveCount, 8)
    for (let passiveIndex = 0; existing().length < targetCount && passiveIndex < mcu.designatedPassiveCount; passiveIndex++) {
      const isCapacitor = passiveIndex % 2 === 0
      const passiveRef = `${isCapacitor ? "C" : "R"}${mcuIndex}${passiveIndex + 1}`
      if (components.some((component) => component.ref === passiveRef)) continue
      const passive = passiveFootprints[(passiveIndex + mcuIndex) % passiveFootprints.length]
      for (const rotation of [0, 90, 180, 270]) {
        const bounds = boundsForRotation(passive.bounds, rotation)
        for (const candidate of correctionCandidateOffsets(mcu, bounds, passiveIndex)) {
          const passiveComponent = {
            ref: passiveRef,
            kind: "mcu_passive",
            componentType: isCapacitor ? "capacitor" : "resistor",
            footprint: passive.footprint,
            x: round(candidate.x),
            y: round(candidate.y),
            rotation,
            bounds,
            passiveKind: isCapacitor ? "capacitor" : "resistor",
            passiveValue: isCapacitor ? "100nF" : "10k",
          }
          if (!isInsideBoard(passiveComponent, definition.board, 0.55)) continue
          if (overlapsAnyForFillCluster(passiveComponent, components, mcuPassiveCourtyardClearance)) continue
          components.push(passiveComponent)
          traces.push({ from: `.${mcu.ref} > .pin${passiveIndex + 1}`, to: `.${passiveRef} > .pin1` })
          traces.push({ from: `.${passiveRef} > .pin2`, to: "net.GND" })
          break
        }
        if (components.some((component) => component.ref === passiveRef)) break
      }
    }
    mcu.passiveCount = existing().length
  }
}

const correctMcuPassiveRotations = (components, definition) => {
  for (const mcu of components.filter((component) => component.kind === "mcu")) {
    const mcuIndex = Number(mcu.ref.replace(/^U/, ""))
    const passives = components.filter((component) =>
      component.kind === "mcu_passive" && new RegExp(`^[CR]${mcuIndex}\\d+$`).test(component.ref)
    )
    if (passives.length < 2 || new Set(passives.map((component) => component.rotation)).size >= 2) continue
    for (const passive of passives) {
      const baseBounds = passiveFootprints.find((entry) => entry.footprint === passive.footprint)?.bounds
      if (!baseBounds) continue
      for (const rotation of [90, 180, 270, 0]) {
        if (rotation === passive.rotation) continue
        const candidate = {
          ...passive,
          rotation,
          bounds: boundsForRotation(baseBounds, rotation),
        }
        const others = components.filter((component) => component !== passive)
        if (!isInsideBoard(candidate, definition.board, 0.55)) continue
        if (overlapsAnyForFillCluster(candidate, others, 0.15)) continue
        passive.rotation = candidate.rotation
        passive.bounds = candidate.bounds
        break
      }
      if (new Set(passives.map((component) => component.rotation)).size >= 2) break
    }
  }
}

const makePackingPad = (id, bounds, networkId = "cluster", offset = { x: 0, y: 0 }) => ({
  padId: id,
  networkId,
  type: "rect",
  offset,
  size: { x: bounds[0], y: bounds[1] },
})

const pinTargetForSide = (side, catalogBounds, slotOffset = 0, inset = 2) => {
  const [width, height] = catalogBounds
  const spreadX = Math.min(width * 0.45, 4.5)
  const spreadY = Math.min(height * 0.45, 4.5)
  if (side === "left") return { x: -width / 2 - inset, y: slotOffset * spreadY }
  if (side === "right") return { x: width / 2 + inset, y: slotOffset * spreadY }
  if (side === "top") return { x: slotOffset * spreadX, y: height / 2 + inset }
  return { x: slotOffset * spreadX, y: -height / 2 - inset }
}

const passivePadOffset = (passiveBounds, index) => ({
  x: (index === 0 ? -1 : 1) * passiveBounds[0] * 0.32,
  y: 0,
})

const mirroredPackedComponents = (packed, axis) =>
  packed.components.map((component) => ({
    ...component,
    center: {
      x: axis === "x" ? -component.center.x : component.center.x,
      y: axis === "y" ? -component.center.y : component.center.y,
    },
  }))

const buildSubcircuitCluster = ({ x, y, catalog, subIndex, rng }) => {
  if (catalog.standalone) {
    const ref = catalog.componentType === "capacitor" ? `C_BULK${subIndex}` : `U_AUX${subIndex}`
    return {
      components: [
        {
          ref,
          kind: catalog.kind,
          componentType: catalog.componentType,
          footprint: catalog.footprint,
          x: round(x),
          y: round(y),
          rotation: [0, 90, 180, 270][subIndex % 4],
          bounds: boundsForRotation(catalog.bounds, [0, 90, 180, 270][subIndex % 4]),
          pinCount: catalog.pins,
          passiveValue: catalog.passiveValue,
          passiveCount: 0,
        },
      ],
      traces: [],
    }
  }

  const subRef = catalog.componentType === "mosfet" ? `Q${subIndex}` : `U_AUX${subIndex}`
  const passiveCount = 1 + Math.floor(rng() * 4)
  const sideOrder = ["left", "right", "top", "bottom"]
  const sideOffset = subIndex % sideOrder.length
  const targetSides = Array.from(
    { length: passiveCount },
    (_, passiveIndex) => sideOrder[(sideOffset + passiveIndex * 2 + Math.floor(passiveIndex / 2)) % sideOrder.length],
  )
  const subRotationSeed = [0, 90, 180, 270][subIndex % 4]
  const subPadSize = 0.28
  const packedInput = {
    components: [
      {
        componentId: subRef,
        isStatic: true,
        center: { x: 0, y: 0 },
        ccwRotationOffset: subRotationSeed,
        availableRotationDegrees: [subRotationSeed],
        pads: [
          makePackingPad(`${subRef}_body`, catalog.bounds, `${subRef}_body`),
          ...targetSides.map((side, passiveIndex) =>
            makePackingPad(
              `${subRef}_target_${passiveIndex + 1}`,
              [subPadSize, subPadSize],
              `${subRef}_p${(passiveIndex % catalog.pins) + 1}`,
              pinTargetForSide(side, catalog.bounds, passiveIndex % 2 === 0 ? -1 : 1),
            )
          ),
        ],
      },
    ],
    bounds: {
      minX: -8,
      minY: -8,
      maxX: 8,
      maxY: 8,
    },
    minGap: Math.max(0.55, minimumPackingMargin),
    packOrderStrategy: "largest_to_smallest",
    packPlacementStrategy: "shortest_connection_along_outline",
    disconnectedPackDirection: "nearest_to_center",
    packFirst: [subRef],
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
      pads: [
        makePackingPad(`${passiveRef}_body`, passive.bounds, `${passiveRef}_body`),
        makePackingPad(
          `${passiveRef}_pin1`,
          [0.22, 0.22],
          `${subRef}_p${(passiveIndex % catalog.pins) + 1}`,
          passivePadOffset(passive.bounds, 0),
        ),
        makePackingPad(
          `${passiveRef}_pin2`,
          [0.22, 0.22],
          "GND",
          passivePadOffset(passive.bounds, 1),
        ),
      ],
    })
  }

  let packed
  try {
    packed = packQuietly(packedInput)
  } catch {
    return null
  }
  const packedComponents = subIndex % 3 === 1
    ? mirroredPackedComponents(packed, "x")
    : subIndex % 3 === 2
      ? mirroredPackedComponents(packed, "y")
      : packed.components
  const packedById = new Map(packedComponents.map((component) => [component.componentId, component]))
  const packedSub = packedById.get(subRef)
  if (!packedSub) return null
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
      supplierPartNumbers: catalog.jlcpcb
        ? { jlcpcb: catalog.jlcpcb }
        : catalog.componentType === "mosfet"
          ? { jlcpcb: [catalog.kind === "power_mosfet_subcircuit" ? "C129018" : "C8545"] }
          : undefined,
    },
  ]
  const clusterTraces = []

  for (const spec of passiveSpecs) {
    const packedPassive = packedById.get(spec.passiveRef)
    if (!packedPassive) return null
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
    clusterTraces.push({ from: `.${subRef} > .pin${(spec.passiveIndex % catalog.pins) + 1}`, to: `.${spec.passiveRef} > .pin1` })
    clusterTraces.push({ from: `.${spec.passiveRef} > .pin2`, to: "net.GND" })
  }

  if (passiveSpecs.length >= 3) {
    const sideBuckets = new Set(clusterComponents.slice(1).map((component) => {
      const dx = component.x - x
      const dy = component.y - y
      if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? "left" : "right"
      return dy < 0 ? "bottom" : "top"
    }))
    if (sideBuckets.size < 2) return null
  }

  return { components: clusterComponents, traces: clusterTraces }
}

const canPlaceCluster = (cluster, components, board, existingClearance = 0.6, selfClearance = 0.15) =>
  cluster.components.every((component, index) => {
    if (!isInsideBoard(component, board, 0.55)) return false
    if (overlapsAnyForFillCluster(component, components, existingClearance)) return false
    return !cluster.components.slice(0, index).some((other) =>
      intersects(rectFor(component, selfClearance), rectFor(other, selfClearance)),
    )
  })

const addCluster = (components, traces, cluster) => {
  components.push(...cluster.components)
  traces.push(...cluster.traces)
}

const componentPins = (component) => {
  if (Array.isArray(component.portPins) && component.portPins.length > 0) {
    return component.portPins
  }
  const pinCount = component.pinCount ?? (component.componentType === "resistor" || component.componentType === "capacitor" ? 2 : 0)
  return Array.from({ length: pinCount }, (_, index) => index + 1)
}

const pinEndpoint = (ref, pin) => `.${ref} > .pin${pin}`

const pinEndpointPattern = /^\.([A-Za-z0-9_]+)\s*>\s*\.pin(\d+)$/

const buildConnectivityState = (components, traces) => {
  const byRef = new Map(components.map((component) => [component.ref, component]))
  const usedPins = new Map()
  const traceKeys = new Set()
  const touchPin = (ref, pin) => {
    if (!usedPins.has(ref)) usedPins.set(ref, new Set())
    usedPins.get(ref).add(Number(pin))
  }

  for (const trace of traces) {
    traceKeys.add(`${trace.from}|${trace.to}`)
    for (const endpoint of [trace.from, trace.to]) {
      const match = endpoint.match(pinEndpointPattern)
      if (!match || !byRef.has(match[1])) continue
      touchPin(match[1], match[2])
    }
  }

  const addTrace = (from, to) => {
    const forwardKey = `${from}|${to}`
    const reverseKey = `${to}|${from}`
    if (traceKeys.has(forwardKey) || traceKeys.has(reverseKey)) return
    traceKeys.add(forwardKey)
    traces.push({ from, to })
    for (const endpoint of [from, to]) {
      const match = endpoint.match(pinEndpointPattern)
      if (match && byRef.has(match[1])) touchPin(match[1], match[2])
    }
  }

  const isUsed = (component, pin) => usedPins.get(component.ref)?.has(Number(pin)) ?? false
  const pinHasConnectionToAny = (component, pin, targets) => {
    const endpoint = pinEndpoint(component.ref, pin)
    const targetRefs = new Set(targets.map((target) => target.ref))
    return traces.some((trace) => {
      if (trace.from === endpoint) {
        const match = trace.to.match(pinEndpointPattern)
        return Boolean(match && targetRefs.has(match[1]))
      }
      if (trace.to === endpoint) {
        const match = trace.from.match(pinEndpointPattern)
        return Boolean(match && targetRefs.has(match[1]))
      }
      return false
    })
  }

  return { addTrace, isUsed, usedPins, pinHasConnectionToAny }
}

const firstUnusedPin = (state, component, fallback = 1) =>
  componentPins(component).find((pin) => !state.isUsed(component, pin)) ?? fallback

const allocateMcuPins = (state, mcu, count) => {
  if (!mcu || count <= 0) return []
  const pins = componentPins(mcu)
  const windows = []
  for (let start = 0; start <= pins.length - count; start++) {
    const range = pins.slice(start, start + count)
    const usedCount = range.filter((pin) => state.isUsed(mcu, pin)).length
    windows.push({ range, usedCount, firstPin: range[0] })
  }
  windows.sort((a, b) => a.usedCount - b.usedCount || a.firstPin - b.firstPin)
  const selected = windows[0]?.range ?? pins.slice(0, count)
  return selected.slice(0, count)
}

const stableHash = (value) =>
  Array.from(String(value)).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0)

const nextMcuPin = (state, mcus, preferredMcu, seed = "") => {
  if (mcus.length === 0) return null
  const orderedMcus = preferredMcu
    ? [preferredMcu, ...mcus.filter((mcu) => mcu !== preferredMcu)]
    : mcus
  for (const mcu of orderedMcus) {
    const pin = componentPins(mcu).find((candidatePin) => !state.isUsed(mcu, candidatePin))
    if (pin) return { mcu, pin }
  }
  const fallbackMcu = orderedMcus[stableHash(seed) % orderedMcus.length]
  const fallbackPins = componentPins(fallbackMcu)
  return { mcu: fallbackMcu, pin: fallbackPins[stableHash(`${seed}:pin`) % fallbackPins.length] }
}

const nearestMcu = (component, mcus) =>
  mcus
    .map((mcu) => ({ mcu, distance: Math.hypot(component.x - mcu.x, component.y - mcu.y) }))
    .sort((a, b) => a.distance - b.distance)[0]?.mcu

const splitIntoBuses = (pins, busCount) => {
  if (busCount <= 1 || pins.length < 4) return [pins]
  const split = Math.ceil(pins.length / 2)
  return [pins.slice(0, split), pins.slice(split)].filter((bus) => bus.length > 0)
}

const connectorPowerPins = (connector, pins) => {
  if (connector.kind === "rs232") return { v5: [16], gnd: [15] }
  if (connector.kind === "hdmi") return { v5: [18], gnd: [17, 20, 21, 22, 23] }
  if (connector.kind === "microusb") return { v5: [1], gnd: [5, 6, 7, 8, 9] }
  if (connector.kind === "usbc") return { v5: [18, 27], gnd: [13, 14, 15, 16, 17, 28] }
  if (connector.kind === "barrel_jack") return { v5: [1], gnd: [2, 3] }
  if (connector.kind === "potentiometer_rk09") return { v5: [1], gnd: [3, 4, 5] }
  return { v5: [pins[0]], gnd: [pins[pins.length - 1]] }
}

const addConnectorConnectivity = (components, state) => {
  const mcus = components.filter((component) => component.kind === "mcu")
  const connectors = components.filter((component) =>
    component.componentType === "connector" || component.componentType === "pinheader"
  )

  for (const connector of connectors) {
    const pins = componentPins(connector)
    const power = connectorPowerPins(connector, pins)
    for (const pin of power.v5.filter((pin) => pins.includes(pin))) {
      state.addTrace(pinEndpoint(connector.ref, pin), "net.V5")
    }
    for (const pin of power.gnd.filter((pin) => pins.includes(pin))) {
      state.addTrace(pinEndpoint(connector.ref, pin), "net.GND")
    }

    const signalPins = pins.filter((pin) => !power.v5.includes(pin) && !power.gnd.includes(pin))
    const busCount = connector.componentType === "pinheader" && mcus.length > 1 && signalPins.length >= 6 && connector.ref.charCodeAt(connector.ref.length - 1) % 2 === 0
      ? 2
      : 1
    const buses = splitIntoBuses(signalPins, busCount)
    const primaryMcu = nearestMcu(connector, mcus)
    for (const [busIndex, busPins] of buses.entries()) {
      const targetMcu = connector.componentType === "pinheader" && busIndex > 0
        ? mcus[(mcus.indexOf(primaryMcu) + busIndex) % mcus.length]
        : primaryMcu
      const mcuPins = allocateMcuPins(state, targetMcu, busPins.length)
      for (let index = 0; index < busPins.length; index++) {
        if (!targetMcu || !mcuPins[index]) {
          state.addTrace(pinEndpoint(connector.ref, busPins[index]), `net.${connector.ref}_BUS${busIndex + 1}_${index + 1}`)
        } else {
          state.addTrace(pinEndpoint(connector.ref, busPins[index]), pinEndpoint(targetMcu.ref, mcuPins[index]))
        }
      }
    }
  }
}

const addI2cConnectivity = (components, state) => {
  const i2cChips = components.filter((component) => component.kind.startsWith("soic")).slice(0, 4)
  const i2cMcus = components.filter((component) => component.kind === "mcu").slice(0, 2)
  for (const chip of i2cChips) {
    const sdaPin = firstUnusedPin(state, chip, 3)
    state.addTrace(pinEndpoint(chip.ref, sdaPin), "net.SDA")
    const sclPin = firstUnusedPin(state, chip, 4)
    state.addTrace(pinEndpoint(chip.ref, sclPin), "net.SCL")
  }
  for (const mcu of i2cMcus) {
    const [sdaPin, sclPin] = allocateMcuPins(state, mcu, 2)
    if (sdaPin) state.addTrace(pinEndpoint(mcu.ref, sdaPin), "net.SDA")
    if (sclPin) state.addTrace(pinEndpoint(mcu.ref, sclPin), "net.SCL")
  }
}

const addNonPassivePowerConnectivity = (components, state) => {
  for (const component of components) {
    if (component.kind === "mcu") continue
    if (component.componentType === "connector" || component.componentType === "pinheader") continue
    if (component.componentType === "resistor" || component.componentType === "capacitor") continue
    const pins = componentPins(component)
    if (pins.length === 0) continue
    const v5Pin = component.componentType === "mosfet" && pins.includes(2) ? 2 : pins[0]
    const gndPin = component.componentType === "mosfet" && pins.includes(3) ? 3 : pins[pins.length - 1]
    state.addTrace(pinEndpoint(component.ref, v5Pin), "net.V5")
    if (gndPin !== v5Pin) state.addTrace(pinEndpoint(component.ref, gndPin), "net.GND")
  }
}

const addSubcircuitMcuConnectivity = (components, state) => {
  const mcus = components.filter((component) => component.kind === "mcu")
  const subcircuits = components.filter((component) =>
    component.kind !== "mcu" &&
    component.componentType !== "connector" &&
    component.componentType !== "pinheader" &&
    component.componentType !== "resistor" &&
    component.componentType !== "capacitor"
  )

  for (const subcircuit of subcircuits) {
    const preferredMcu = nearestMcu(subcircuit, mcus)
    const pins = componentPins(subcircuit)
    for (const pin of pins) {
      const isPowerPin = pins.length > 1 && (pin === pins[0] || pin === pins[pins.length - 1])
      if (isPowerPin) continue
      if (state.pinHasConnectionToAny(subcircuit, pin, mcus)) continue
      const target = nextMcuPin(state, mcus, preferredMcu, `${subcircuit.ref}:${pin}`)
      if (!target) return
      state.addTrace(pinEndpoint(subcircuit.ref, pin), pinEndpoint(target.mcu.ref, target.pin))
    }
  }
}

const defaultPinNet = (component, pin, pins) => {
  if (component.componentType === "resistor" || component.componentType === "capacitor") {
    return pin === pins[pins.length - 1] ? "net.GND" : `net.${component.ref}_PASSIVE`
  }
  if (pin === pins[0]) return "net.V5"
  if (pin === pins[pins.length - 1]) return "net.GND"
  if (component.componentType === "mosfet") {
    if (pin === pins[1]) return "net.V5"
    if (pin === pins[2]) return "net.GND"
  }
  return `net.${component.ref}_SIG${pin}`
}

const addRemainingPinConnectivity = (components, state) => {
  for (const component of components) {
    if (component.kind === "mcu") continue
    const pins = componentPins(component)
    for (const pin of pins) {
      if (state.isUsed(component, pin)) continue
      state.addTrace(pinEndpoint(component.ref, pin), defaultPinNet(component, pin, pins))
    }
  }
}

const addConnectivityTraces = (components, traces) => {
  const state = buildConnectivityState(components, traces)
  addConnectorConnectivity(components, state)
  addI2cConnectivity(components, state)
  addNonPassivePowerConnectivity(components, state)
  addSubcircuitMcuConnectivity(components, state)
  addRemainingPinConnectivity(components, state)
}

const makeFillCandidates = (definition, rng, passIndex, densityProfile) => {
  const step = passIndex < 2 ? 8 : densityProfile.lateStep
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
  const densityProfile = getDensityProfile(definition)
  let subIndex = 1
  for (let passIndex = 0; passIndex < 16 && getUtilization(components, definition.board) < densityProfile.targetUtilization; passIndex++) {
    let placedThisPass = 0
    for (const { x, y } of makeFillCandidates(definition, rng, passIndex, densityProfile)) {
      if (getUtilization(components, definition.board) >= densityProfile.targetUtilization) break
      const needsLargePowerMosfet = !components.some((component) => component.kind === "large_power_mosfet_subcircuit")
      const needsPowerMosfet = !components.some((component) => component.kind === "power_mosfet_subcircuit")
      const needsIrf540Mosfet = !components.some((component) => component.kind === "irf540_mosfet_subcircuit")
      const needsFlatPowerMosfet = !components.some((component) => component.kind === "flat_power_mosfet_subcircuit")
      const needsLargeCapacitor = !components.some((component) => component.kind === "large_capacitor_subcircuit")
      const needsButton = !components.some((component) => component.kind.startsWith("button_"))
      const catalog = needsLargePowerMosfet
        ? largePowerMosfetSubcircuit
        : needsPowerMosfet
        ? powerMosfetSubcircuit
        : needsIrf540Mosfet
        ? irf540MosfetSubcircuit
        : needsFlatPowerMosfet
        ? flatPowerMosfetSubcircuit
        : needsLargeCapacitor
        ? largeCapacitorSubcircuit
        : needsButton
        ? pick(rng, buttonSubcircuitCatalog)
        : rng() < 0.06
          ? largePowerMosfetSubcircuit
          : rng() < 0.1
          ? largeCapacitorSubcircuit
          : rng() < 0.1
          ? flatPowerMosfetSubcircuit
          : rng() < 0.12
          ? irf540MosfetSubcircuit
          : rng() < 0.2
          ? powerMosfetSubcircuit
          : pick(rng, standardSubcircuitCatalog)
      const cluster = buildSubcircuitCluster({ x, y, catalog, subIndex, rng })
      if (!cluster) continue
      if (!canPlaceCluster(
        cluster,
        components,
        definition.board,
        passIndex < 2 ? densityProfile.earlyClearance : densityProfile.lateClearance,
        densityProfile.selfClearance,
      )) continue
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

  placeEdge(components, traces, definition, rng)
  placeMcus(components, traces, definition, rng)
  correctMcuPassivePlacement(components, traces, definition)
  correctMcuPassiveRotations(components, definition)
  placeSubcircuits(components, traces, definition, rng)
  addConnectivityTraces(components, traces)

  return {
    id: definition.id,
    sourceDefinition: `dataset/definitions/${definition.id}.json`,
    densityProfile: getDensityProfile(definition),
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
