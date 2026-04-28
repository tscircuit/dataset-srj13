import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const placementsDir = "dataset/placements"

const rectFor = (component, clearance = 0) => ({
  left: component.x - component.bounds.width / 2 - clearance,
  right: component.x + component.bounds.width / 2 + clearance,
  bottom: component.y - component.bounds.height / 2 - clearance,
  top: component.y + component.bounds.height / 2 + clearance,
})

const intersects = (a, b) =>
  a.left < b.right && a.right > b.left && a.bottom < b.top && a.top > b.bottom

let failures = 0
let reportedFailures = 0
const reportFailure = (message) => {
  failures++
  if (reportedFailures < 80) {
    console.error(message)
    reportedFailures++
  }
}

for (const file of readdirSync(placementsDir).filter((name) => name.endsWith(".json")).sort()) {
  const placement = JSON.parse(readFileSync(join(placementsDir, file), "utf8"))
  const components = placement.components

  if (components.some((component) => component.kind === "dense_passive")) {
    reportFailure(`${file}: contains dense_passive filler despite MCU passive-count cap`)
  }

  for (const component of components) {
    const rect = rectFor(component)
    const insideBoard =
      rect.left >= -placement.board.width / 2 &&
      rect.right <= placement.board.width / 2 &&
      rect.bottom >= -placement.board.height / 2 &&
      rect.top <= placement.board.height / 2
    if (!insideBoard && !component.allowOffBoard) {
      reportFailure(`${file}: ${component.ref} is off-board without allowOffBoard`)
    }
  }

  for (let i = 0; i < components.length; i++) {
    for (let j = i + 1; j < components.length; j++) {
      if (intersects(rectFor(components[i], 0.15), rectFor(components[j], 0.15))) {
        reportFailure(`${file}: ${components[i].ref} overlaps ${components[j].ref}`)
      }
    }
  }

  for (const mcu of components.filter((component) => component.kind === "mcu")) {
    const mcuIndex = mcu.ref.replace(/^U/, "")
    const mcuPassives = components.filter((component) => {
      return component.kind === "mcu_passive" && new RegExp(`^[CR]${mcuIndex}\\d+$`).test(component.ref)
    })
    const designated = mcu.designatedPassiveCount
    if (designated < 2 || designated > 8) {
      reportFailure(`${file}: ${mcu.ref} designated passive count ${designated} is outside 2-8`)
    }
    if (mcuPassives.length > designated) {
      reportFailure(`${file}: ${mcu.ref} has ${mcuPassives.length} passives, above designated ${designated}`)
    }
    if (mcuPassives.length !== mcu.passiveCount) {
      reportFailure(`${file}: ${mcu.ref} passiveCount metadata ${mcu.passiveCount} does not match ${mcuPassives.length}`)
    }
    if (mcuPassives.length > 1 && new Set(mcuPassives.map((component) => component.rotation)).size < 2) {
      reportFailure(`${file}: ${mcu.ref} passives do not vary rotation`)
    }
  }
}

if (failures > 0) {
  if (failures > reportedFailures) {
    console.error(`...and ${failures - reportedFailures} more issue(s).`)
  }
  console.error(`Placement validation failed with ${failures} issue(s).`)
  process.exit(1)
}

console.log("Placement validation passed.")
