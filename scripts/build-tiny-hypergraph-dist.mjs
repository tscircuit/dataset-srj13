import { readdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { AutoroutingPipelineSolver4 } from "@tscircuit/capacity-autorouter"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "..")
const datasetDistDir = path.join(repoRoot, "dataset-dist")
const maxPipelineSteps = Number(process.env.TINY_HYPERGRAPH_MAX_STEPS ?? 200_000)
const solveBeforeWriting = process.env.TINY_HYPERGRAPH_SOLVE === "1"

const autorouterPkg = JSON.parse(
  await readFile(
    path.join(
      repoRoot,
      "node_modules/@tscircuit/capacity-autorouter/package.json",
    ),
    "utf8",
  ),
)

const jsonClone = (value) => JSON.parse(JSON.stringify(value))

const safeIdentifier = (name) =>
  name.replace(/[^A-Za-z0-9_$]/g, "_").replace(/^[^A-Za-z_$]/, "_$&")

const tinyTerminalRegionSize = 1e-6

function mapLayerNameToZ(layerName, layerCount) {
  if (layerName === "top") return 0
  if (layerName === "bottom") return Math.max(layerCount - 1, 0)
  const innerMatch = /^inner(\d+)$/.exec(layerName ?? "")
  if (innerMatch) return Number(innerMatch[1])
  return 0
}

function getConnectionPointLayers(point) {
  if (!point) return []
  if (Array.isArray(point.layers)) return point.layers
  if (typeof point.layer === "string") return [point.layer]
  return []
}

function getRoutePoint(connection, endpointIndex) {
  return connection.simpleRouteConnection?.pointsToConnect?.[endpointIndex]
}

function getConnectionNetId(connection) {
  return connection.mutuallyConnectedNetworkId ?? connection.connectionId
}

function getConnectionNetIndexMap(connections) {
  const netIndexById = new Map()

  for (const connection of connections) {
    const netId = getConnectionNetId(connection)
    if (!netIndexById.has(netId)) {
      netIndexById.set(netId, netIndexById.size)
    }
  }

  return netIndexById
}

function getSharedConnectionZ({
  connection,
  endpointIndex,
  fallbackZ,
  regionAvailableZ,
  layerCount,
}) {
  const point = getRoutePoint(connection, endpointIndex)
  const pointZLayers = getConnectionPointLayers(point).map((layerName) =>
    mapLayerNameToZ(layerName, layerCount),
  )

  return regionAvailableZ.find((z) => pointZLayers.includes(z)) ?? fallbackZ
}

function buildSerializedTinyGraph(params) {
  const netIndexById = getConnectionNetIndexMap(params.connections)
  const regions = params.graph.regions.map((region) => ({
    regionId: region.regionId,
    pointIds: region.ports.map((port) => port.d.portId),
    d: jsonClone(region.d),
  }))
  const ports = params.graph.ports.map((port) => {
    const { regions: _regions, ...portData } = port.d

    return {
      portId: port.d.portId,
      region1Id: port.region1.regionId,
      region2Id: port.region2.regionId,
      d: jsonClone(portData),
    }
  })
  const connections = params.connections.map((connection) => ({
    connectionId: connection.connectionId,
    mutuallyConnectedNetworkId:
      connection.mutuallyConnectedNetworkId ?? connection.connectionId,
    startRegionId: connection.startRegion.regionId,
    endRegionId: connection.endRegion.regionId,
    simpleRouteConnection: jsonClone(connection.simpleRouteConnection),
  }))
  const solvedRoutes = []

  for (const connection of params.connections) {
    const startPoint = getRoutePoint(connection, 0)
    const endPoint = getRoutePoint(connection, 1)
    const fallbackStartZ = connection.startRegion.d.availableZ[0] ?? 0
    const fallbackEndZ = connection.endRegion.d.availableZ[0] ?? 0
    const startZ = getSharedConnectionZ({
      connection,
      endpointIndex: 0,
      fallbackZ: fallbackStartZ,
      regionAvailableZ: connection.startRegion.d.availableZ,
      layerCount: params.layerCount,
    })
    const endZ = getSharedConnectionZ({
      connection,
      endpointIndex: 1,
      fallbackZ: fallbackEndZ,
      regionAvailableZ: connection.endRegion.d.availableZ,
      layerCount: params.layerCount,
    })
    const startTerminalRegionId = `tiny-terminal:start-region:${connection.connectionId}`
    const endTerminalRegionId = `tiny-terminal:end-region:${connection.connectionId}`
    const startTerminalPortId = `tiny-terminal:start-port:${connection.connectionId}`
    const endTerminalPortId = `tiny-terminal:end-port:${connection.connectionId}`
    const terminalNetId = netIndexById.get(getConnectionNetId(connection)) ?? -1

    regions.push({
      regionId: startTerminalRegionId,
      pointIds: [startTerminalPortId],
      d: {
        capacityMeshNodeId: startTerminalRegionId,
        center: {
          x: startPoint?.x ?? connection.startRegion.d.center.x,
          y: startPoint?.y ?? connection.startRegion.d.center.y,
        },
        width: tinyTerminalRegionSize,
        height: tinyTerminalRegionSize,
        availableZ: [startZ],
        netId: terminalNetId,
        _containsTarget: true,
        _tinyTerminal: true,
        _tinyTerminalNetId:
          connection.mutuallyConnectedNetworkId ?? connection.connectionId,
      },
    })
    regions.push({
      regionId: endTerminalRegionId,
      pointIds: [endTerminalPortId],
      d: {
        capacityMeshNodeId: endTerminalRegionId,
        center: {
          x: endPoint?.x ?? connection.endRegion.d.center.x,
          y: endPoint?.y ?? connection.endRegion.d.center.y,
        },
        width: tinyTerminalRegionSize,
        height: tinyTerminalRegionSize,
        availableZ: [endZ],
        netId: terminalNetId,
        _containsTarget: true,
        _tinyTerminal: true,
        _tinyTerminalNetId:
          connection.mutuallyConnectedNetworkId ?? connection.connectionId,
      },
    })
    ports.push({
      portId: startTerminalPortId,
      region1Id: connection.startRegion.regionId,
      region2Id: startTerminalRegionId,
      d: {
        portId: startTerminalPortId,
        x: startPoint?.x ?? connection.startRegion.d.center.x,
        y: startPoint?.y ?? connection.startRegion.d.center.y,
        z: startZ,
        distToCentermostPortOnZ: 0,
        _tinyTerminal: true,
      },
    })
    ports.push({
      portId: endTerminalPortId,
      region1Id: connection.endRegion.regionId,
      region2Id: endTerminalRegionId,
      d: {
        portId: endTerminalPortId,
        x: endPoint?.x ?? connection.endRegion.d.center.x,
        y: endPoint?.y ?? connection.endRegion.d.center.y,
        z: endZ,
        distToCentermostPortOnZ: 0,
        _tinyTerminal: true,
      },
    })

    const startRegion = regions.find(
      (region) => region.regionId === connection.startRegion.regionId,
    )
    const endRegion = regions.find(
      (region) => region.regionId === connection.endRegion.regionId,
    )
    startRegion?.pointIds.push(startTerminalPortId)
    endRegion?.pointIds.push(endTerminalPortId)

    solvedRoutes.push({
      connection: {
        connectionId: connection.connectionId,
      },
      path: [{ portId: startTerminalPortId }, { portId: endTerminalPortId }],
    })
  }

  return {
    format: "serialized-hg-port-point-pathing-solver-params",
    graph: {
      regions,
      ports,
    },
    connections,
    solvedRoutes,
    effort: jsonClone(params.effort),
    flags: jsonClone(params.flags),
    layerCount: jsonClone(params.layerCount),
    weights: jsonClone(params.weights),
    minViaPadDiameter: jsonClone(params.minViaPadDiameter),
  }
}

function getResultSummary(solver, portPointPathingSolver) {
  const input = portPointPathingSolver.getConstructorParams()[0]
  let output = null

  try {
    output = portPointPathingSolver.getOutput()
  } catch {
    output = null
  }

  return {
    solved: portPointPathingSolver.solved,
    failed: portPointPathingSolver.failed,
    error: portPointPathingSolver.error,
    iterations: portPointPathingSolver.iterations,
    timeToSolve: portPointPathingSolver.timeToSolve ?? null,
    pipelineIterations: solver.iterations,
    nextPipelinePhase: solver.getCurrentPhase(),
    regionCount: input.graph.regions.length,
    portCount: input.graph.ports.length,
    connectionCount: input.connections.length,
    outputNodeCount: output?.nodesWithPortPoints.length ?? null,
    inputNodeCount:
      output?.inputNodeWithPortPoints.length ?? input.graph.regions.length,
    capturedBeforeSolve: !portPointPathingSolver.solved,
  }
}

async function getSrjFiles() {
  const entries = await readdir(datasetDistDir, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter(
      (fileName) =>
        fileName.endsWith(".json") &&
        !fileName.endsWith(".tiny-hypergraph.json") &&
        fileName !== "manifest.json",
    )
    .sort()
    .map((fileName) => {
      const sampleName = fileName.replace(/\.json$/, "")

      return {
        sampleName,
        srjPath: path.join(datasetDistDir, fileName),
        sourceFile: `dataset-dist/${fileName}`,
        outputFile: `${sampleName}.tiny-hypergraph.json`,
      }
    })
}

async function clearExistingTinyHypergraphOutputs() {
  const entries = await readdir(datasetDistDir, { withFileTypes: true })

  await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter(
        (fileName) =>
          fileName.endsWith(".tiny-hypergraph.json") ||
          fileName === "manifest.json",
      )
      .map((fileName) =>
        rm(path.join(datasetDistDir, fileName), { force: true }),
      ),
  )
}

async function buildCase({ sampleName, srjPath, sourceFile, outputFile }) {
  const srj = JSON.parse(await readFile(srjPath, "utf8"))
  const solver = new AutoroutingPipelineSolver4(srj)

  while (!solver.portPointPathingSolver) {
    solver.step()

    if (solver.iterations > maxPipelineSteps) {
      throw new Error(
        `${sampleName} exceeded ${maxPipelineSteps} pipeline steps before portPointPathingSolver was created`,
      )
    }
  }

  const portPointPathingSolver = solver.portPointPathingSolver
  const constructorParams = portPointPathingSolver.getConstructorParams()[0]

  if (solveBeforeWriting) {
    while (!(portPointPathingSolver.solved || portPointPathingSolver.failed)) {
      solver.step()

      if (solver.iterations > maxPipelineSteps) {
        throw new Error(
          `${sampleName} exceeded ${maxPipelineSteps} pipeline steps before portPointPathingSolver completed`,
        )
      }
    }
  }

  if (solveBeforeWriting && !portPointPathingSolver?.solved) {
    throw new Error(
      `${sampleName} portPointPathingSolver did not solve: ${
        portPointPathingSolver?.error ?? "solver was not created"
      }`,
    )
  }

  const benchmarkCase = {
    sampleName,
    sourceFile,
    outputFile: `dataset-dist/${outputFile}`,
    generatedBy: {
      pipeline: "AutoroutingPipelineSolver4_TinyHypergraph",
      phase: "portPointPathingSolver",
      autorouterPackage: "@tscircuit/capacity-autorouter",
      autorouterVersion: autorouterPkg.version,
    },
    solverInput: buildSerializedTinyGraph(constructorParams),
    stats: jsonClone(portPointPathingSolver.stats ?? {}),
    resultSummary: getResultSummary(solver, portPointPathingSolver),
  }

  await writeFile(
    path.join(datasetDistDir, outputFile),
    `${JSON.stringify(benchmarkCase, null, 2)}\n`,
  )

  return {
    sampleName,
    sourceFile,
    outputFile: `dataset-dist/${outputFile}`,
    stats: benchmarkCase.stats,
    resultSummary: benchmarkCase.resultSummary,
  }
}

async function appendIndexJs(srjFiles) {
  const indexPath = path.join(datasetDistDir, "index.js")
  const tinyExportLines = srjFiles.map(({ sampleName, outputFile }) => {
    const exportName = `${safeIdentifier(sampleName)}TinyHypergraph`
    return `exports.${exportName} = require("./${outputFile}")`
  })
  const mapLines = srjFiles.map(({ sampleName }) => {
    const exportName = `${safeIdentifier(sampleName)}TinyHypergraph`
    return `  ${JSON.stringify(sampleName)}: exports.${exportName},`
  })
  const sampleLines = srjFiles.map(({ sampleName }) => {
    const srjExportName = safeIdentifier(sampleName)
    const tinyExportName = `${srjExportName}TinyHypergraph`
    return `  { sampleName: ${JSON.stringify(sampleName)}, srj: exports.${srjExportName}, tinyHypergraphBenchmark: exports.${tinyExportName} },`
  })

  await writeFile(
    indexPath,
    `${await readFile(indexPath, "utf8")}
exports.datasetDistManifest = require("./manifest.json")
${tinyExportLines.join("\n")}

exports.tinyHypergraphBenchmarkByName = {
${mapLines.join("\n")}
}

exports.samples = [
${sampleLines.join("\n")}
]

function hydrateTinyHypergraphSolverInput(solverInput) {
  const regionsById = new Map(
    solverInput.graph.regions.map((region) => [
      region.regionId,
      {
        regionId: region.regionId,
        d: region.d,
        ports: [],
      },
    ]),
  )

  const ports = solverInput.graph.ports.map((port) => {
    const region1 = regionsById.get(port.region1Id)
    const region2 = regionsById.get(port.region2Id)
    const regionIds = port.regionIds ?? [port.region1Id, port.region2Id]

    if (!region1 || !region2) {
      throw new Error(\`Could not hydrate port \${port.portId}\`)
    }

    const hydratedPort = {
      portId: port.portId,
      d: {
        ...port.d,
        regions: regionIds.map((regionId) => regionsById.get(regionId)),
      },
      region1,
      region2,
    }

    region1.ports.push(hydratedPort)
    region2.ports.push(hydratedPort)

    return hydratedPort
  })

  const graph = {
    regions: Array.from(regionsById.values()),
    ports,
  }

  return {
    ...solverInput,
    graph,
    connections: solverInput.connections.map((connection) => {
      const startRegion = regionsById.get(connection.startRegionId)
      const endRegion = regionsById.get(connection.endRegionId)

      if (!startRegion || !endRegion) {
        throw new Error(\`Could not hydrate connection \${connection.connectionId}\`)
      }

      return {
        connectionId: connection.connectionId,
        mutuallyConnectedNetworkId: connection.mutuallyConnectedNetworkId,
        startRegion,
        endRegion,
        simpleRouteConnection: connection.simpleRouteConnection,
      }
    }),
  }
}

exports.hydrateTinyHypergraphSolverInput = hydrateTinyHypergraphSolverInput
`,
  )
}

async function appendIndexDts(srjFiles) {
  const indexPath = path.join(datasetDistDir, "index.d.ts")
  const tinyDeclarations = srjFiles.map(({ sampleName }) => {
    const exportName = `${safeIdentifier(sampleName)}TinyHypergraph`
    return `export const ${exportName}: TinyHypergraphBenchmarkCase`
  })

  await writeFile(
    indexPath,
    `${await readFile(indexPath, "utf8")}
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export interface TinyHypergraphBenchmarkCase {
  sampleName: string
  sourceFile: string
  outputFile: string
  generatedBy: {
    pipeline: "AutoroutingPipelineSolver4_TinyHypergraph"
    phase: "portPointPathingSolver"
    autorouterPackage: "@tscircuit/capacity-autorouter"
    autorouterVersion: string
  }
  solverInput: JsonValue
  stats: Record<string, JsonValue>
  resultSummary: Record<string, JsonValue>
}

${tinyDeclarations.join("\n")}

export const datasetDistManifest: JsonValue
export const tinyHypergraphBenchmarkByName: Record<
  string,
  TinyHypergraphBenchmarkCase
>
export const samples: Array<{
  sampleName: string
  srj: SimpleRouteJson
  tinyHypergraphBenchmark: TinyHypergraphBenchmarkCase
}>

export function hydrateTinyHypergraphSolverInput(solverInput: JsonValue): any
`,
  )
}

const srjFiles = await getSrjFiles()
if (srjFiles.length === 0) {
  throw new Error(`No SRJ files found in ${datasetDistDir}`)
}

await clearExistingTinyHypergraphOutputs()

const manifest = []
for (const srjFile of srjFiles) {
  console.log(`Building tiny hypergraph ${srjFile.sampleName}`)
  manifest.push(await buildCase(srjFile))
}

await writeFile(
  path.join(datasetDistDir, "manifest.json"),
  `${JSON.stringify(
    {
      generatedBy: {
        pipeline: "AutoroutingPipelineSolver4_TinyHypergraph",
        phase: "portPointPathingSolver",
        autorouterPackage: "@tscircuit/capacity-autorouter",
        autorouterVersion: autorouterPkg.version,
      },
      cases: manifest,
    },
    null,
    2,
  )}\n`,
)

await appendIndexJs(srjFiles)
await appendIndexDts(srjFiles)

console.log(`Wrote ${srjFiles.length} tiny hypergraph files to ${datasetDistDir}`)
