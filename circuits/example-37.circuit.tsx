import placement from "../dataset/placements/example-37.placement.json"
import { renderDatasetCircuit } from "../src/renderDatasetCircuit"
import type { DatasetPlacement } from "../src/dataset-types"

export default () => renderDatasetCircuit(placement as DatasetPlacement)
