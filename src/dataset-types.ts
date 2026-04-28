export type EdgeName = "left" | "right" | "top" | "bottom"

export interface BoardSize {
  width: number
  height: number
}

export interface DatasetDefinition {
  id: string
  seed: number
  board: BoardSize
  leftEdge: string[]
  rightEdge: string[]
  topEdge: string[]
  bottomEdge: string[]
  mcuCount: 1 | 2 | 3
}

export interface ComponentBounds {
  width: number
  height: number
}

export interface SupplierPartNumbers {
  jlcpcb?: string[]
}

export type PlacementComponentType =
  | "chip"
  | "connector"
  | "pinheader"
  | "resistor"
  | "capacitor"
  | "mosfet"

export interface PlacementComponent {
  ref: string
  kind: string
  componentType: PlacementComponentType
  footprint: string
  x: number
  y: number
  rotation: number
  bounds: ComponentBounds
  pinCount?: number
  portPins?: number[]
  passiveCount?: number
  designatedPassiveCount?: number
  doubleRow?: boolean
  pitch?: number | string
  passiveValue?: string
  passiveKind?: "resistor" | "capacitor"
  edge?: EdgeName
  allowOffBoard?: boolean
  supplierPartNumbers?: SupplierPartNumbers
}

export interface PlacementTrace {
  from: string
  to: string
}

export interface DatasetPlacement {
  id: string
  sourceDefinition: string
  board: BoardSize
  components: PlacementComponent[]
  traces: PlacementTrace[]
}
