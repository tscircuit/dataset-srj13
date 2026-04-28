import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["C1_POS"],
  pin2: ["V_POS"],
  pin3: ["C1_NEG"],
  pin4: ["C2_POS"],
  pin5: ["C2_NEG"],
  pin6: ["V_NEG"],
  pin7: ["T2OUT"],
  pin8: ["R2IN"],
  pin9: ["R2OUT"],
  pin10: ["T2IN"],
  pin11: ["T1IN"],
  pin12: ["R1OUT"],
  pin13: ["R1IN"],
  pin14: ["T1OUT"],
  pin15: ["GND"],
  pin16: ["VCC"]
} as const

export const SP3232EEN_L_TR = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C9378"
  ]
}}
      manufacturerPartNumber="SP3232EEN_L_TR"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-4.445mm" pcbY="-2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-3.175mm" pcbY="-2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-1.905mm" pcbY="-2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-0.635mm" pcbY="-2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="0.635mm" pcbY="-2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="1.905mm" pcbY="-2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="3.175mm" pcbY="-2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="4.445mm" pcbY="-2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="-4.445mm" pcbY="2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="-3.175mm" pcbY="2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="-1.905mm" pcbY="2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="-0.635mm" pcbY="2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="0.635mm" pcbY="2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="1.905mm" pcbY="2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="3.175mm" pcbY="2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="4.445mm" pcbY="2.73558mm" width="0.6020054mm" height="1.9709892mm" shape="rect" />
<silkscreenpath route={[{"x":-5.026202800000078,"y":-1.5214091999999937},{"x":-5.026202800000078,"y":1.5214092000001074},{"x":5.0262027999999646,"y":1.5214092000001074},{"x":5.0262027999999646,"y":-1.5214091999999937},{"x":-5.026202800000078,"y":-1.5214091999999937}]} />
<silkscreentext text="{NAME}" pcbX="-0.1651mm" pcbY="4.429mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-5.609400000000051,"y":3.6789999999999736},{"x":5.279199999999946,"y":3.6789999999999736},{"x":5.279199999999946,"y":-3.8822000000000116},{"x":-5.609400000000051,"y":-3.8822000000000116},{"x":-5.609400000000051,"y":3.6789999999999736}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C9378.obj?uuid=9adfdf34b7774b23880141fd3e8b4dbb",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C9378.step?uuid=9adfdf34b7774b23880141fd3e8b4dbb",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: 0.000575 },
      }}
      {...props}
    />
  )
}