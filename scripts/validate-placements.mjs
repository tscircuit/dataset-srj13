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

const getUtilization = (components, board) => {
  const occupiedArea = components.reduce(
    (sum, component) => sum + component.bounds.width * component.bounds.height,
    0,
  )
  return occupiedArea / (board.width * board.height)
}

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
  const utilization = getUtilization(components, placement.board)

  if (utilization < 0.3) {
    reportFailure(`${file}: only ${(utilization * 100).toFixed(2)}% covered, expected at least 30% JSON coverage`)
  }

  if (components.some((component) => component.kind === "dense_passive")) {
    reportFailure(`${file}: contains dense_passive filler despite MCU passive-count cap`)
  }

  if (!components.some((component) => component.kind === "power_mosfet_subcircuit")) {
    reportFailure(`${file}: missing power_mosfet_subcircuit variant`)
  }

  if (!components.some((component) => component.kind === "large_power_mosfet_subcircuit")) {
    reportFailure(`${file}: missing large_power_mosfet_subcircuit variant`)
  }

  if (!components.some((component) => component.kind === "irf540_mosfet_subcircuit")) {
    reportFailure(`${file}: missing C2566 IRF540NPBF mosfet variant`)
  }

  if (!components.some((component) => component.kind === "flat_power_mosfet_subcircuit")) {
    reportFailure(`${file}: missing flat D2PAK/TO-263 power mosfet variant`)
  }

  if (!components.some((component) => component.kind.startsWith("button_"))) {
    reportFailure(`${file}: missing button footprint subcircuit variant`)
  }

  if (components.filter((component) => component.kind === "hdmi").length < 1) {
    reportFailure(`${file}: expected at least one HDMI edge connector`)
  }

  if (components.filter((component) => component.kind === "usbc" || component.kind === "microusb" || component.kind === "usbb").length < 1) {
    reportFailure(`${file}: expected at least one USB edge connector`)
  }

  if (components.filter((component) => component.componentType === "pinheader").length < 2) {
    reportFailure(`${file}: expected at least two pin headers`)
  }

  if (!components.some((component) => component.kind === "potentiometer_rk09")) {
    reportFailure(`${file}: missing outward-facing RK09 potentiometer edge connector`)
  }

  for (const component of components) {
    if (component.componentType === "pinheader") {
      if (component.pitch !== 2.56 || !String(component.footprint).includes("_p2.56mm")) {
        reportFailure(`${file}: ${component.ref} pinheader pitch/footprint is not explicit 2.56mm`)
      }
      if (String(component.footprint).includes("_p1mm")) {
        reportFailure(`${file}: ${component.ref} pinheader footprint uses overlapping 1mm pitch`)
      }
      if (!component.doubleRow && !String(component.footprint).includes("_rows1_")) {
        reportFailure(`${file}: ${component.ref} single-row pinheader footprint is missing rows1`)
      }
    }
    if (component.kind === "usbc" || component.kind === "microusb" || component.kind === "hdmi" || component.kind === "potentiometer_rk09") {
      const expectedRotation = component.kind === "potentiometer_rk09"
        ? component.edge === "left"
          ? 180
          : component.edge === "right"
            ? 0
            : component.edge === "top"
              ? 90
              : 270
        : component.edge === "left"
          ? 270
          : component.edge === "right"
            ? 90
            : component.edge === "top"
              ? 180
              : 0
      if (component.rotation !== expectedRotation) {
        reportFailure(`${file}: ${component.ref} ${component.kind} rotation ${component.rotation} does not point off-board`)
      }
    }
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
    if (designated < 8 || designated > 20) {
      reportFailure(`${file}: ${mcu.ref} designated passive count ${designated} is outside 8-20`)
    }
    if (mcuPassives.length > designated) {
      reportFailure(`${file}: ${mcu.ref} has ${mcuPassives.length} passives, above designated ${designated}`)
    }
    if (mcuPassives.length < 8) {
      reportFailure(`${file}: ${mcu.ref} has only ${mcuPassives.length} packed passives, expected at least 8`)
    }
    if (mcuPassives.length !== mcu.passiveCount) {
      reportFailure(`${file}: ${mcu.ref} passiveCount metadata ${mcu.passiveCount} does not match ${mcuPassives.length}`)
    }
    if (mcuPassives.length > 1 && new Set(mcuPassives.map((component) => component.rotation)).size < 2) {
      reportFailure(`${file}: ${mcu.ref} passives do not vary rotation`)
    }
  }

  for (const subcircuit of components.filter((component) =>
    component.kind.endsWith("_subcircuit") ||
    component.kind === "mosfet_subcircuit" ||
    component.kind === "power_mosfet_subcircuit"
  )) {
    const passivePrefix = subcircuit.ref.startsWith("U_AUX")
      ? subcircuit.ref.replace("U_AUX", "")
      : subcircuit.ref.replace("Q", "")
    const passives = components.filter((component) =>
      component.kind === "subcircuit_passive" && new RegExp(`^[CR]A${passivePrefix}_`).test(component.ref)
    )
    if (passives.length < 1 || passives.length > 4) {
      reportFailure(`${file}: ${subcircuit.ref} has ${passives.length} surrounding passives, expected 1-4`)
    }
    if (passives.length >= 3) {
      const sideBuckets = new Set(passives.map((passive) => {
        const dx = passive.x - subcircuit.x
        const dy = passive.y - subcircuit.y
        if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? "left" : "right"
        return dy < 0 ? "bottom" : "top"
      }))
      if (sideBuckets.size < 2) {
        reportFailure(`${file}: ${subcircuit.ref} passives are packed on only one side`)
      }
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
