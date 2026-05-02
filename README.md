# dataset-srj13

Synthetic tscircuit dataset for connector-heavy MCU boards.

The source dataset is split into three phases:

1. `dataset/definitions/*.json` describes board size, edge connector kinds, MCU count, and seed.
2. `dataset/placements/*.placement.json` is generated from definitions and contains concrete component footprints, positions, bounding boxes, and trace intents.
3. `circuits/*.circuit.tsx` imports one placement JSON file and renders a tscircuit board with `routingDisabled` and `schematicDisabled`.

Run the pipeline:

```bash
bun run generate:dataset
bun run validate:placements
bun run check:examples
```

Build the distributable SRJ dataset:

```bash
bun run build:dataset-dist
```

This runs `tsci build`, converts `dist/circuits/*/circuit.json` into `dataset-dist/*.json`, generates srj12-style `dataset-dist/*.tiny-hypergraph.json` benchmark cases plus `dataset-dist/manifest.json`, and writes `dataset-dist/index.js` plus `dataset-dist/index.d.ts`. The tiny-hypergraph generator captures the `portPointPathingSolver` constructor input by default; set `TINY_HYPERGRAPH_SOLVE=1` to require each case to solve before writing. The package `main` field points at `dataset-dist/index.js`, so consumers import the generated SRJ files and tiny-hypergraph benchmark files through the package entry point.

Install from GitHub:

```bash
bun add @tsci/seveibar.dataset-srj13@github:tscircuit/dataset-srj13
```

Use it from JavaScript or TypeScript:

```ts
import { dataset, example_01 } from "@tsci/seveibar.dataset-srj13"

console.log(dataset["example-01"])
console.log(example_01)
```

Use the tiny-hypergraph benchmark cases:

```ts
import {
  example_01TinyHypergraph,
  hydrateTinyHypergraphSolverInput,
  tinyHypergraphBenchmarkByName,
} from "@tsci/seveibar.dataset-srj13"

const benchmark = tinyHypergraphBenchmarkByName["example-01"]
const solverInput = hydrateTinyHypergraphSolverInput(benchmark.solverInput)

console.log(example_01TinyHypergraph.resultSummary)
console.log(solverInput.connections.length)
```

You can pin a specific commit or branch with the GitHub dependency syntax:

```json
{
  "dependencies": {
    "@tsci/seveibar.dataset-srj13": "github:tscircuit/dataset-srj13#main"
  }
}
```

Connector footprint mappings live in `scripts/generate-dataset.mjs`. HDMI, USB-C, and RS232 edge connectors are backed by `tsci import`-generated JLCPCB components in `imports/`; the other connector families use footprinter-compatible footprints plus supplier metadata.

The generator keeps MCU passives capped at each MCU's designated 2-8 count, rotates packed passives around each MCU, emits BGA/QFN/QFP/LQFP/TSSOP MCU footprints across the examples, and validates placement overlap/off-board rules before rendering.
