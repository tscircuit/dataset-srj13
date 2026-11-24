import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

const repoRoot = process.cwd()

const makeFixture = (shape) => {
  const fixtureRoot = mkdtempSync(join(repoRoot, ".tmp-srj-convert-"))
  mkdirSync(join(fixtureRoot, "scripts"), { recursive: true })
  mkdirSync(join(fixtureRoot, "dist/circuits/rotated-case"), { recursive: true })
  cpSync(
    join(repoRoot, "scripts/build-dataset-dist.sh"),
    join(fixtureRoot, "scripts/build-dataset-dist.sh"),
  )

  const circuitJson = [
    {
      type: "pcb_board",
      pcb_board_id: "pcb_board_0",
      center: { x: 0, y: 0 },
      width: 20,
      height: 20,
    },
    {
      type: "pcb_component",
      pcb_component_id: "pcb_component_0",
      source_component_id: "source_component_0",
      center: { x: 0, y: 0 },
      width: 4,
      height: 4,
    },
    {
      type: "pcb_port",
      pcb_port_id: "pcb_port_0",
      source_port_id: "source_port_0",
      pcb_component_id: "pcb_component_0",
      x: 0,
      y: 0,
      layers: ["top"],
    },
    {
      type: "pcb_smtpad",
      pcb_smtpad_id: "pcb_smtpad_0",
      pcb_component_id: "pcb_component_0",
      pcb_port_id: "pcb_port_0",
      layer: "top",
      shape,
      width: 3,
      height: 1,
      x: 0,
      y: 0,
      ccw_rotation: 45,
    },
  ]
  writeFileSync(
    join(fixtureRoot, "dist/circuits/rotated-case/circuit.json"),
    JSON.stringify(circuitJson),
  )
  return fixtureRoot
}

test("SRJ conversion preserves rotated rectangular SMT pads", () => {
  const fixtureRoot = makeFixture("rotated_rect")
  try {
    execFileSync("bash", ["scripts/build-dataset-dist.sh"], {
      cwd: fixtureRoot,
      encoding: "utf8",
      env: { ...process.env, SKIP_TSCIRCUIT_BUILD: "1" },
      stdio: "pipe",
    })
    const outputPath = join(fixtureRoot, "dataset-dist/rotated-case.json")
    assert.equal(existsSync(outputPath), true)
    const srj = JSON.parse(readFileSync(outputPath, "utf8"))
    const padObstacle = srj.obstacles.find(
      (obstacle) => obstacle.connectedTo?.includes("pcb_smtpad_0"),
    )
    assert.ok(padObstacle, "rotated_rect smtpad was dropped from obstacles")
    assert.equal(padObstacle.width, 3)
    assert.equal(padObstacle.height, 1)
    assert.equal(padObstacle.ccwRotationDegrees, 45)
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true })
  }
})
