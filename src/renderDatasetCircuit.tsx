import { Fragment } from "react"
import { HDMI_001_19PCBTP as HdmiConnector } from "../imports/HDMI_001_19PCBTP"
import { IRF640NSTRLPBF } from "../imports/IRF640NSTRLPBF"
import { IRF540NPBF } from "../imports/IRF540NPBF"
import { A_920_E52A2021S10100 as MicroUsbConnector } from "../imports/A_920_E52A2021S10100"
import { RK09K1110077 as PotentiometerConnector } from "../imports/RK09K1110077"
import { SP3232EEN_L_TR as Rs232Connector } from "../imports/SP3232EEN_L_TR"
import { TYPE_C_16PIN_2MD_073_ as UsbCConnector } from "../imports/TYPE_C_16PIN_2MD_073_"
import type {
  DatasetPlacement,
  PlacementComponent,
  SupplierPartNumbers,
} from "./dataset-types"

const makePinLabels = (pinCount = 8) =>
  Object.fromEntries(
    Array.from({ length: pinCount }, (_, index) => [
      `pin${index + 1}`,
      `P${index + 1}`,
    ]),
  )

const supplierPartNumbers = (component: PlacementComponent) =>
  component.supplierPartNumbers as SupplierPartNumbers | undefined

const disableBoardDrcChecks = () => {
  const rootCircuit = (
    globalThis as typeof globalThis & {
      __tscircuit_circuit?: {
        setPlatform?: (platform: Record<string, unknown>) => void
      }
    }
  ).__tscircuit_circuit

  rootCircuit?.setPlatform?.({
    drcChecksDisabled: true,
    placementDrcChecksDisabled: true,
    routingDrcChecksDisabled: true,
    netlistDrcChecksDisabled: true,
    pinSpecificationDrcChecksDisabled: true,
  })
}

const renderComponent = (component: PlacementComponent) => {
  const common = {
    name: component.ref,
    footprint: component.footprint,
    pcbX: component.x,
    pcbY: component.y,
    pcbRotation: component.rotation,
    allowOffBoard: component.allowOffBoard,
    supplierPartNumbers: supplierPartNumbers(component),
  }
  const importedCommon = {
    name: component.ref,
    pcbX: component.x,
    pcbY: component.y,
    pcbRotation: component.rotation,
    allowOffBoard: component.allowOffBoard,
  }

  if (component.componentType === "pinheader") {
    return (
      <chip
        key={component.ref}
        {...common}
        pinLabels={makePinLabels(component.pinCount)}
        footprint={component.footprint}
      />
    )
  }

  if (component.kind === "hdmi") {
    return <HdmiConnector key={component.ref} {...importedCommon} />
  }

  if (component.kind === "rs232") {
    return <Rs232Connector key={component.ref} {...importedCommon} />
  }

  if (component.kind === "usbc") {
    return <UsbCConnector key={component.ref} {...importedCommon} />
  }

  if (component.kind === "microusb") {
    return <MicroUsbConnector key={component.ref} {...importedCommon} />
  }

  if (component.kind === "potentiometer_rk09") {
    return <PotentiometerConnector key={component.ref} {...importedCommon} />
  }

  if (component.kind === "irf540_mosfet_subcircuit") {
    return <IRF540NPBF key={component.ref} {...importedCommon} />
  }

  if (component.kind === "flat_power_mosfet_subcircuit") {
    return <IRF640NSTRLPBF key={component.ref} {...importedCommon} />
  }

  if (component.componentType === "resistor") {
    return (
      <resistor
        key={component.ref}
        {...common}
        resistance={component.passiveValue ?? "10k"}
        footprint={component.footprint}
      />
    )
  }

  if (component.componentType === "capacitor") {
    return (
      <capacitor
        key={component.ref}
        {...common}
        capacitance={component.passiveValue ?? "100nF"}
        footprint={component.footprint}
      />
    )
  }

  if (component.componentType === "mosfet") {
    return (
      <mosfet
        key={component.ref}
        {...common}
        channelType="n"
        mosfetMode="enhancement"
        footprint={component.footprint}
      />
    )
  }

  return (
    <chip
      key={component.ref}
      {...common}
      pinLabels={makePinLabels(component.pinCount)}
      footprint={component.footprint}
    />
  )
}

export const renderDatasetCircuit = (placement: DatasetPlacement) => {
  disableBoardDrcChecks()

  return (
    <board
      width={`${placement.board.width}mm`}
      height={`${placement.board.height}mm`}
      routingDisabled
      schematicDisabled
    >
      {placement.components.map(renderComponent)}
      {placement.traces.map((trace, index) => (
        <Fragment key={`${trace.from}-${trace.to}-${index}`}>
          <trace from={trace.from} to={trace.to} />
        </Fragment>
      ))}
    </board>
  )
}
