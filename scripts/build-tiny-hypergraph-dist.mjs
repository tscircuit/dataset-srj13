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

function normalizeSolverInput(params) {
  const regions = params.graph.regions.map((region) => ({
    regionId: region.regionId,
    d: jsonClone(region.d),
    portIds: region.ports.map((port) => port.portId),
  }))

  const ports = params.graph.ports.map((port) => {
    const { regions: _regions, ...portData } = port.d
    const portRegions = port.d.regions ?? [port.region1, port.region2]

    return {
      portId: port.portId,
      d: jsonClone(portData),
      region1Id: port.region1.regionId,
      region2Id: port.region2.regionId,
      regionIds: portRegions.map((region) => region.regionId),
    }
  })

  const connections = params.connections.map((connection) => ({
    connectionId: connection.connectionId,
    mutuallyConnectedNetworkId: connection.mutuallyConnectedNetworkId,
    startRegionId: connection.startRegion.regionId,
    endRegionId: connection.endRegion.regionId,
    simpleRouteConnection: jsonClone(connection.simpleRouteConnection),
  }))

  const { graph: _graph, connections: _connections, ...rest } = params

  return {
    graph: {
      regions,
      ports,
    },
    connections,
    ...jsonClone(rest),
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
    solverInput: normalizeSolverInput(
      portPointPathingSolver.getConstructorParams()[0],
    ),
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

    if (!region1 || !region2) {
      throw new Error(\`Could not hydrate port \${port.portId}\`)
    }

    const hydratedPort = {
      portId: port.portId,
      d: {
        ...port.d,
        regions: port.regionIds.map((regionId) => regionsById.get(regionId)),
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
