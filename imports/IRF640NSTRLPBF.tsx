import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["G"],
  pin2: ["D"],
  pin3: ["S"],
  pin4: ["D"]
} as const

export const IRF640NSTRLPBF = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C23708"
  ]
}}
      manufacturerPartNumber="IRF640NSTRLPBF"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-6.1858652mm" pcbY="2.54mm" width="3.999992mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-6.1858652mm" pcbY="-2.54mm" width="3.999992mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin2","pin4"]} pcbX="3.9858696mm" pcbY="0mm" width="8.3999832mm" height="10.5664mm" shape="rect" />
<silkscreenpath route={[{"x":-0.44526199999995697,"y":5.085080000000062},{"x":-2.296998199999962,"y":5.085080000000062},{"x":-2.296998199999962,"y":-5.079999999999927},{"x":-0.3919981999999891,"y":-5.079999999999927}]} />
<silkscreentext text="{NAME}" pcbX="0.0008128mm" pcbY="6.2832mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-8.44068720000007,"y":5.533200000000079},{"x":8.442312799999968,"y":5.533200000000079},{"x":8.442312799999968,"y":-5.533199999999965},{"x":-8.44068720000007,"y":-5.533199999999965},{"x":-8.44068720000007,"y":5.533200000000079}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C23708.obj?uuid=9dba8afb613e44c98c26e32263214dcf",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C23708.step?uuid=9dba8afb613e44c98c26e32263214dcf",
        pcbRotationOffset: 270,
        modelOriginPosition: { x: 0, y: 6.3034174000001, z: 0 },
      }}
      {...props}
    />
  )
}
