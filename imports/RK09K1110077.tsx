import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"],
  pin5: ["pin5"]
} as const

export const RK09K1110077 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C3020620"
  ]
}}
      manufacturerPartNumber="RK09K1110077"
      footprint={<footprint>
        <platedhole  portHints={["pin1"]} pcbX="1.2749848mm" pcbY="-2.499868mm" outerDiameter="1.5999968mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin2"]} pcbX="1.2749848mm" pcbY="-0mm" outerDiameter="1.5999968mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin3"]} pcbX="1.2749848mm" pcbY="2.500122mm" outerDiameter="1.5999968mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin4"]} pcbX="-2.0249832mm" pcbY="4.99999mm" holeWidth="1.7999964mm" holeHeight="2.2999954mm" outerWidth="2.499995mm" outerHeight="2.999994mm" shape="pill" />
<platedhole  portHints={["pin5"]} pcbX="-2.0249832mm" pcbY="-4.99999mm" holeWidth="1.7999964mm" holeHeight="2.2999954mm" outerWidth="2.499995mm" outerHeight="2.999994mm" shape="pill" />
<silkscreenpath route={[{"x":8.575020999999992,"y":-1.5198344000000361},{"x":15.574981599999887,"y":-1.5198344000000361}]} />
<silkscreenpath route={[{"x":8.575020999999992,"y":1.5789655999999468},{"x":15.574981599999887,"y":1.5789655999999468}]} />
<silkscreenpath route={[{"x":8.575020999999992,"y":-0.0024384000000736705},{"x":15.574981599999887,"y":-0.0024384000000736705}]} />
<silkscreenpath route={[{"x":8.641848399999958,"y":-2.9998669999999947},{"x":3.8750049999999874,"y":-2.9998669999999947}]} />
<silkscreenpath route={[{"x":8.575020999999992,"y":3.000120999999922},{"x":3.8750049999999874,"y":3.000120999999922}]} />
<silkscreenpath route={[{"x":3.8750049999999874,"y":4.900421999999935},{"x":3.8750049999999874,"y":-4.899863200000141}]} />
<silkscreenpath route={[{"x":-0.29727520000005825,"y":4.900421999999935},{"x":2.4687847999998667,"y":4.900421999999935},{"x":3.8750049999999874,"y":4.900421999999935}]} />
<silkscreenpath route={[{"x":-4.4249784000001,"y":4.900117200000068},{"x":-3.752742000000012,"y":4.900117200000068}]} />
<silkscreenpath route={[{"x":-0.29727520000005825,"y":-4.899863200000141},{"x":3.8750049999999874,"y":-4.899863200000141}]} />
<silkscreenpath route={[{"x":-4.4249784000001,"y":-4.899863200000141},{"x":-3.7527674000001525,"y":-4.899863200000141}]} />
<silkscreenpath route={[{"x":8.575020999999992,"y":3.000120999999922},{"x":8.575020999999992,"y":-2.9998669999999947}]} />
<silkscreenpath route={[{"x":15.574981599999887,"y":-2.9998669999999947},{"x":8.574995599999966,"y":-2.9998669999999947}]} />
<silkscreenpath route={[{"x":15.574981599999887,"y":3.000120999999922},{"x":8.575020999999992,"y":3.000120999999922}]} />
<silkscreenpath route={[{"x":-4.4249784000001,"y":4.900117200000068},{"x":-4.4249784000001,"y":-4.899863200000141}]} />
<silkscreenpath route={[{"x":15.574981599999887,"y":3.000120999999922},{"x":15.574981599999887,"y":-2.9998669999999947}]} />
<silkscreentext text="{NAME}" pcbX="5.6056848mm" pcbY="6.243322mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.664615200000185,"y":5.493322000000035},{"x":15.875984800000083,"y":5.493322000000035},{"x":15.875984800000083,"y":-5.547678000000019},{"x":-4.664615200000185,"y":-5.547678000000019},{"x":-4.664615200000185,"y":5.493322000000035}]} />
      </footprint>}
      
      {...props}
    />
  )
}