export interface SimpleRouteConnectionPointBase {
  x: number
  y: number
  pointId?: string
  pcb_port_id?: string
}

export type SimpleRouteConnectionPoint =
  | (SimpleRouteConnectionPointBase & { layer: string })
  | (SimpleRouteConnectionPointBase & { layers: string[] })

export interface SimpleRouteConnection {
  name: string
  source_trace_id?: string
  rootConnectionName?: string
  mergedConnectionNames?: string[]
  isOffBoard?: boolean
  netConnectionName?: string
  nominalTraceWidth?: number
  width?: number
  pointsToConnect: SimpleRouteConnectionPoint[]
  externallyConnectedPointIds?: string[][]
}

export interface SimpleRouteObstacle {
  obstacleId?: string
  type: "rect"
  layers: string[]
  zLayers?: number[]
  center: { x: number; y: number }
  width: number
  height: number
  ccwRotationDegrees?: number
  connectedTo: string[]
  isCopperPour?: boolean
  netIsAssignable?: boolean
  offBoardConnectsTo?: string[]
}

export interface SimpleRouteJson {
  id?: string
  sourceCircuitJson?: string
  layerCount: number
  minTraceWidth: number
  nominalTraceWidth?: number
  minViaDiameter?: number
  minViaHoleDiameter?: number
  minViaPadDiameter?: number
  min_via_hole_diameter?: number
  min_via_pad_diameter?: number
  defaultObstacleMargin?: number
  obstacles: SimpleRouteObstacle[]
  connections: SimpleRouteConnection[]
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
  outline?: Array<{ x: number; y: number }>
  traces?: unknown[]
  jumpers?: unknown[]
}

export const example_01: SimpleRouteJson
export const example_02: SimpleRouteJson
export const example_03: SimpleRouteJson
export const example_04: SimpleRouteJson
export const example_05: SimpleRouteJson
export const example_06: SimpleRouteJson
export const example_07: SimpleRouteJson
export const example_08: SimpleRouteJson
export const example_09: SimpleRouteJson
export const example_10: SimpleRouteJson
export const example_11: SimpleRouteJson
export const example_12: SimpleRouteJson
export const example_13: SimpleRouteJson
export const example_14: SimpleRouteJson
export const example_15: SimpleRouteJson
export const example_16: SimpleRouteJson
export const example_17: SimpleRouteJson
export const example_18: SimpleRouteJson
export const example_19: SimpleRouteJson
export const example_20: SimpleRouteJson
export const example_21: SimpleRouteJson
export const example_22: SimpleRouteJson
export const example_23: SimpleRouteJson
export const example_24: SimpleRouteJson
export const example_25: SimpleRouteJson
export const example_26: SimpleRouteJson
export const example_27: SimpleRouteJson
export const example_28: SimpleRouteJson
export const example_29: SimpleRouteJson
export const example_30: SimpleRouteJson
export const example_31: SimpleRouteJson
export const example_32: SimpleRouteJson
export const example_33: SimpleRouteJson
export const example_34: SimpleRouteJson
export const example_35: SimpleRouteJson
export const example_36: SimpleRouteJson
export const example_37: SimpleRouteJson
export const example_38: SimpleRouteJson
export const example_39: SimpleRouteJson
export const example_40: SimpleRouteJson
export const example_41: SimpleRouteJson
export const example_42: SimpleRouteJson
export const example_43: SimpleRouteJson
export const example_44: SimpleRouteJson
export const example_45: SimpleRouteJson
export const example_46: SimpleRouteJson
export const example_47: SimpleRouteJson
export const example_48: SimpleRouteJson
export const example_49: SimpleRouteJson
export const example_50: SimpleRouteJson

export const dataset: Record<string, SimpleRouteJson>
declare const defaultDataset: Record<string, SimpleRouteJson>
export default defaultDataset

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

export const example_01TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_02TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_03TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_04TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_05TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_06TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_07TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_08TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_09TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_10TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_11TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_12TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_13TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_14TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_15TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_16TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_17TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_18TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_19TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_20TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_21TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_22TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_23TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_24TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_25TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_26TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_27TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_28TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_29TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_30TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_31TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_32TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_33TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_34TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_35TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_36TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_37TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_38TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_39TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_40TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_41TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_42TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_43TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_44TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_45TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_46TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_47TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_48TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_49TinyHypergraph: TinyHypergraphBenchmarkCase
export const example_50TinyHypergraph: TinyHypergraphBenchmarkCase

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
