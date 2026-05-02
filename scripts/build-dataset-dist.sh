#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ "${SKIP_TSCIRCUIT_BUILD:-0}" != "1" ]]; then
  bun run build
fi

bun --eval '
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { join } from "node:path"
import { getSimpleRouteJsonFromCircuitJson } from "@tscircuit/core"

const circuitJsonDir = "dist/circuits"
const datasetDistDir = "dataset-dist"

const round = (value) => Math.round(value * 1_000_000) / 1_000_000
const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value)
const safeIdentifier = (name) => name.replace(/[^A-Za-z0-9_$]/g, "_").replace(/^[^A-Za-z_$]/, "_$&")

const getCircuitJsonFiles = () => {
  if (!existsSync(circuitJsonDir)) {
    throw new Error(`Missing ${circuitJsonDir}; run bun run build first`)
  }

  return readdirSync(circuitJsonDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      id: entry.name,
      path: join(circuitJsonDir, entry.name, "circuit.json"),
    }))
    .filter((entry) => existsSync(entry.path))
    .sort((a, b) => a.id.localeCompare(b.id))
}

const findBoard = (elements) => elements.find((element) => element.type === "pcb_board")

const getBounds = (board, components, ports) => {
  if (board?.center && isFiniteNumber(board.width) && isFiniteNumber(board.height)) {
    return {
      minX: round(board.center.x - board.width / 2),
      maxX: round(board.center.x + board.width / 2),
      minY: round(board.center.y - board.height / 2),
      maxY: round(board.center.y + board.height / 2),
    }
  }

  const xs = []
  const ys = []
  for (const component of components) {
    if (!component.center) continue
    const width = Number(component.width) || 0
    const height = Number(component.height) || 0
    xs.push(component.center.x - width / 2, component.center.x + width / 2)
    ys.push(component.center.y - height / 2, component.center.y + height / 2)
  }
  for (const port of ports) {
    if (isFiniteNumber(port.x) && isFiniteNumber(port.y)) {
      xs.push(port.x)
      ys.push(port.y)
    }
  }

  if (xs.length === 0 || ys.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  }

  return {
    minX: round(Math.min(...xs)),
    maxX: round(Math.max(...xs)),
    minY: round(Math.min(...ys)),
    maxY: round(Math.max(...ys)),
  }
}

const getOutline = (bounds) => [
  { x: bounds.minX, y: bounds.minY },
  { x: bounds.maxX, y: bounds.minY },
  { x: bounds.maxX, y: bounds.maxY },
  { x: bounds.minX, y: bounds.maxY },
]

const EVERY_LAYER = ["top", "inner1", "inner2", "bottom"]

const getObstacleLayers = (element) => {
  if (Array.isArray(element.layers) && element.layers.length > 0) {
    return [...new Set(element.layers)]
  }
  if (typeof element.layer === "string") return [element.layer]
  return EVERY_LAYER
}

const getConnectedToWithNet = (connMap, ids) => [
  ...ids,
  ...ids.map((id) => connMap?.getNetConnectedToId(id)).filter(Boolean),
]

const getPolygonBounds = (points) => {
  if (!Array.isArray(points) || points.length === 0) return null
  const xs = points.map((point) => point.x).filter(isFiniteNumber)
  const ys = points.map((point) => point.y).filter(isFiniteNumber)
  if (xs.length === 0 || ys.length === 0) return null
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}

const roundObstacleGeometry = (obstacle) => ({
  ...obstacle,
  center: {
    x: round(obstacle.center.x),
    y: round(obstacle.center.y),
  },
  width: round(obstacle.width),
  height: round(obstacle.height),
  ...(isFiniteNumber(obstacle.ccwRotationDegrees)
    ? { ccwRotationDegrees: round(obstacle.ccwRotationDegrees) }
    : {}),
})

const createPrimitiveObstacles = (elements, connMap) => {
  const obstacles = []
  const pushObstacle = (obstacle) => {
    obstacles.push(roundObstacleGeometry(obstacle))
  }

  for (const element of elements) {
    if (element.type === "pcb_smtpad") {
      const connectedTo = getConnectedToWithNet(connMap, [element.pcb_smtpad_id])
      if (element.shape === "rect") {
        pushObstacle({
          type: "rect",
          layers: getObstacleLayers(element),
          center: { x: element.x, y: element.y },
          width: element.width,
          height: element.height,
          connectedTo,
        })
      } else if (element.shape === "polygon") {
        const bounds = getPolygonBounds(element.points)
        if (!bounds) continue
        pushObstacle({
          type: "rect",
          layers: getObstacleLayers(element),
          center: {
            x: (bounds.minX + bounds.maxX) / 2,
            y: (bounds.minY + bounds.maxY) / 2,
          },
          width: bounds.maxX - bounds.minX,
          height: bounds.maxY - bounds.minY,
          connectedTo,
        })
      }
      continue
    }

    if (element.type === "pcb_plated_hole") {
      const connectedTo = getConnectedToWithNet(connMap, [element.pcb_plated_hole_id])
      if (element.shape === "circle") {
        pushObstacle({
          type: "rect",
          layers: getObstacleLayers(element),
          center: { x: element.x, y: element.y },
          width: element.outer_diameter,
          height: element.outer_diameter,
          connectedTo,
        })
      } else if (element.shape === "pill") {
        pushObstacle({
          type: "rect",
          layers: getObstacleLayers(element),
          center: { x: element.x, y: element.y },
          width: element.outer_width,
          height: element.outer_height,
          ccwRotationDegrees: element.ccw_rotation,
          connectedTo,
        })
      } else if (element.shape === "circular_hole_with_rect_pad") {
        pushObstacle({
          type: "rect",
          layers: getObstacleLayers(element),
          center: { x: element.x, y: element.y },
          width: element.rect_pad_width,
          height: element.rect_pad_height,
          ccwRotationDegrees: element.rect_ccw_rotation,
          connectedTo,
        })
      }
      continue
    }

    if (element.type === "pcb_hole" && element.hole_shape === "circle") {
      pushObstacle({
        type: "rect",
        layers: getObstacleLayers(element),
        center: { x: element.x, y: element.y },
        width: element.hole_diameter,
        height: element.hole_diameter,
        connectedTo: [],
      })
    }
  }

  for (const obstacle of obstacles) {
    const additionalIds = obstacle.connectedTo.flatMap((id) => connMap?.getIdsConnectedToNet(id) ?? [])
    obstacle.connectedTo.push(...additionalIds)
  }

  const sourcePortIdToInternalConnectionId = new Map()
  for (const internalConnection of elements.filter(
    (element) => element.type === "source_component_internal_connection",
  )) {
    for (const sourcePortId of internalConnection.source_port_ids ?? []) {
      sourcePortIdToInternalConnectionId.set(
        sourcePortId,
        internalConnection.source_component_internal_connection_id,
      )
    }
  }

  const portsById = new Map(
    elements
      .filter((element) => element.type === "pcb_port")
      .map((port) => [port.pcb_port_id, port]),
  )

  const primitiveIdToSourcePortId = new Map()
  for (const element of elements) {
    const primitiveId = element.pcb_smtpad_id ?? element.pcb_plated_hole_id
    if (!primitiveId || !element.pcb_port_id) continue
    const port = portsById.get(element.pcb_port_id)
    if (port?.source_port_id) {
      primitiveIdToSourcePortId.set(primitiveId, port.source_port_id)
    }
  }

  for (const obstacle of obstacles) {
    for (const connectedId of obstacle.connectedTo) {
      const sourcePortId = primitiveIdToSourcePortId.get(connectedId)
      if (!sourcePortId) continue
      const internalConnectionId = sourcePortIdToInternalConnectionId.get(sourcePortId)
      if (!internalConnectionId) continue
      obstacle.offBoardConnectsTo = [internalConnectionId]
      obstacle.netIsAssignable = true
      break
    }
  }

  return obstacles
}

const convertCircuitJsonToSrj = (id, elements) => {
  const board = findBoard(elements)
  const components = elements.filter((element) => element.type === "pcb_component")
  const ports = elements.filter((element) => element.type === "pcb_port")
  // Use the core SRJ conversion for connections and metadata.
  const { simpleRouteJson, connMap } = getSimpleRouteJsonFromCircuitJson({
    circuitJson: elements,
    minTraceWidth: board?.min_trace_width ?? 0.1,
  })
  const obstacles = createPrimitiveObstacles(elements, connMap)

  const bounds = getBounds(board, components, ports)

  return {
    ...simpleRouteJson,
    id,
    sourceCircuitJson: `dist/circuits/${id}/circuit.json`,
    layerCount: board?.num_layers ?? 2,
    minTraceWidth: board?.min_trace_width ?? 0.1,
    minViaHoleDiameter: board?.min_via_hole_diameter ?? 0.2,
    minViaPadDiameter: board?.min_via_pad_diameter ?? 0.3,
    min_via_hole_diameter: board?.min_via_hole_diameter ?? 0.2,
    min_via_pad_diameter: board?.min_via_pad_diameter ?? 0.3,
    defaultObstacleMargin: board?.min_trace_to_pad_edge_clearance ?? 0.1,
    bounds,
    outline: getOutline(bounds),
    obstacles,
  }
}

const files = getCircuitJsonFiles()
if (files.length === 0) {
  throw new Error(`No circuit.json files found in ${circuitJsonDir}`)
}

rmSync(datasetDistDir, { recursive: true, force: true })
mkdirSync(datasetDistDir, { recursive: true })

const exportLines = []
const declarationLines = [
  "export interface SimpleRouteConnectionPointBase {",
  "  x: number",
  "  y: number",
  "  pointId?: string",
  "  pcb_port_id?: string",
  "}",
  "",
  "export type SimpleRouteConnectionPoint =",
  "  | (SimpleRouteConnectionPointBase & { layer: string })",
  "  | (SimpleRouteConnectionPointBase & { layers: string[] })",
  "",
  "export interface SimpleRouteConnection {",
  "  name: string",
  "  source_trace_id?: string",
  "  rootConnectionName?: string",
  "  mergedConnectionNames?: string[]",
  "  isOffBoard?: boolean",
  "  netConnectionName?: string",
  "  nominalTraceWidth?: number",
  "  width?: number",
  "  pointsToConnect: SimpleRouteConnectionPoint[]",
  "  externallyConnectedPointIds?: string[][]",
  "}",
  "",
  "export interface SimpleRouteObstacle {",
  "  obstacleId?: string",
  "  type: \"rect\"",
  "  layers: string[]",
  "  zLayers?: number[]",
  "  center: { x: number; y: number }",
  "  width: number",
  "  height: number",
  "  ccwRotationDegrees?: number",
  "  connectedTo: string[]",
  "  isCopperPour?: boolean",
  "  netIsAssignable?: boolean",
  "  offBoardConnectsTo?: string[]",
  "}",
  "",
  "export interface SimpleRouteJson {",
  "  id?: string",
  "  sourceCircuitJson?: string",
  "  layerCount: number",
  "  minTraceWidth: number",
  "  nominalTraceWidth?: number",
  "  minViaDiameter?: number",
  "  minViaHoleDiameter?: number",
  "  minViaPadDiameter?: number",
  "  min_via_hole_diameter?: number",
  "  min_via_pad_diameter?: number",
  "  defaultObstacleMargin?: number",
  "  obstacles: SimpleRouteObstacle[]",
  "  connections: SimpleRouteConnection[]",
  "  bounds: { minX: number; maxX: number; minY: number; maxY: number }",
  "  outline?: Array<{ x: number; y: number }>",
  "  traces?: unknown[]",
  "  jumpers?: unknown[]",
  "}",
  "",
]
const datasetEntries = []

for (const file of files) {
  const circuitJson = JSON.parse(readFileSync(file.path, "utf8"))
  const srj = convertCircuitJsonToSrj(file.id, circuitJson)
  const jsonFileName = `${file.id}.json`
  const exportName = safeIdentifier(file.id)
  writeFileSync(join(datasetDistDir, jsonFileName), `${JSON.stringify(srj, null, 2)}\n`)
  exportLines.push(`exports.${exportName} = require("./${jsonFileName}")`)
  declarationLines.push(`export const ${exportName}: SimpleRouteJson`)
  datasetEntries.push({ id: file.id, exportName })
}

writeFileSync(
  join(datasetDistDir, "index.js"),
  [
    "\"use strict\"",
    "",
    ...exportLines,
    "",
    "exports.dataset = {",
    ...datasetEntries.map(({ id, exportName }) => `  ${JSON.stringify(id)}: exports.${exportName},`),
    "}",
    "exports.default = exports.dataset",
    "",
  ].join("\n"),
)

writeFileSync(
  join(datasetDistDir, "index.d.ts"),
  [
    ...declarationLines,
    "",
    "export const dataset: Record<string, SimpleRouteJson>",
    "declare const defaultDataset: Record<string, SimpleRouteJson>",
    "export default defaultDataset",
    "",
  ].join("\n"),
)

console.log(`Wrote ${files.length} SRJ files to ${datasetDistDir}`)
'

bun scripts/build-tiny-hypergraph-dist.mjs
