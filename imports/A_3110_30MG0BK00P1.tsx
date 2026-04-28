import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"],
  pin5: ["pin5"],
  pin6: ["pin6"],
  pin7: ["pin7"],
  pin8: ["pin8"],
  pin9: ["pin9"],
  pin10: ["pin10"],
  pin11: ["pin11"],
  pin12: ["pin12"],
  pin13: ["pin13"],
  pin14: ["pin14"],
  pin15: ["pin15"],
  pin16: ["pin16"],
  pin17: ["pin17"],
  pin18: ["pin18"],
  pin19: ["pin19"],
  pin20: ["pin20"],
  pin21: ["pin21"],
  pin22: ["pin22"],
  pin23: ["pin23"],
  pin24: ["pin24"],
  pin25: ["pin25"],
  pin26: ["pin26"],
  pin27: ["pin27"],
  pin28: ["pin28"],
  pin29: ["pin29"],
  pin30: ["pin30"]
} as const

export const A_3110_30MG0BK00P1 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C720743"
  ]
}}
      manufacturerPartNumber="A_3110_30MG0BK00P1"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-17.78mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-17.78mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-15.24mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-15.24mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-12.7mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-12.7mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-10.16mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-10.16mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="-7.62mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="-7.62mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="-5.08mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="-5.08mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="-2.54mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="-2.54mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="0mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="0mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="2.54mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="2.54mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin19"]} pcbX="5.08mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin20"]} pcbX="5.08mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin21"]} pcbX="7.62mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin22"]} pcbX="7.62mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin23"]} pcbX="10.16mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin24"]} pcbX="10.16mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin25"]} pcbX="12.7mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin26"]} pcbX="12.7mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin27"]} pcbX="15.24mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin28"]} pcbX="15.24mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin29"]} pcbX="17.78mm" pcbY="-2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<smtpad portHints={["pin30"]} pcbX="17.78mm" pcbY="2.999994mm" width="1.0199878mm" height="4.499991mm" shape="rect" />
<silkscreenpath route={[{"x":18.52117199999998,"y":-4.354956999999786},{"x":22.8599999999999,"y":-4.354956999999786}]} />
<silkscreenpath route={[{"x":18.52117199999998,"y":4.445000000000164},{"x":22.8599999999999,"y":4.445000000000164}]} />
<silkscreenpath route={[{"x":22.8599999999999,"y":4.445000000000164},{"x":22.8599999999999,"y":-4.354956999999786}]} />
<silkscreenpath route={[{"x":15.981146599999875,"y":-4.3999657999999044},{"x":17.038853400000107,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":13.441146599999911,"y":-4.3999657999999044},{"x":14.49885340000003,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":10.901146599999947,"y":-4.3999657999999044},{"x":11.958853399999953,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":8.361146599999984,"y":-4.3999657999999044},{"x":9.418853399999989,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":5.821146599999906,"y":-4.3999657999999044},{"x":6.878853400000025,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":3.2811466000000564,"y":-4.3999657999999044},{"x":4.338853399999948,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":-4.338853399999948,"y":-4.3999657999999044},{"x":-3.2811466000000564,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":-6.878853400000025,"y":-4.3999657999999044},{"x":-5.82114660000002,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":-9.418853400000103,"y":-4.3999657999999044},{"x":-8.361146599999984,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":-11.958853399999953,"y":-4.3999657999999044},{"x":-10.901146600000061,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":-14.49885340000003,"y":-4.3999657999999044},{"x":-13.441146599999911,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":-17.038853400000107,"y":-4.3999657999999044},{"x":-15.981146599999988,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":-22.8599999999999,"y":-4.3999657999999044},{"x":-18.521146600000066,"y":-4.3999657999999044}]} />
<silkscreenpath route={[{"x":15.981146599999875,"y":4.400016599999958},{"x":17.038853400000107,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":13.441146599999911,"y":4.400016599999958},{"x":14.49885340000003,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":10.901146599999947,"y":4.400016599999958},{"x":11.958853399999953,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":8.361146599999984,"y":4.400016599999958},{"x":9.418853399999989,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":5.821146599999906,"y":4.400016599999958},{"x":6.878853400000025,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":3.2811466000000564,"y":4.400016599999958},{"x":4.338853399999948,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":0.7411465999999791,"y":4.400016599999958},{"x":1.7988534000000982,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":-1.7988534000000982,"y":4.400016599999958},{"x":-0.7411465999999791,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":-4.338853399999948,"y":4.400016599999958},{"x":-3.2811466000000564,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":-6.878853400000025,"y":4.400016599999958},{"x":-5.82114660000002,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":-9.418853400000103,"y":4.400016599999958},{"x":-8.361146599999984,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":-11.958853399999953,"y":4.400016599999958},{"x":-10.901146600000061,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":-14.49885340000003,"y":4.400016599999958},{"x":-13.441146599999911,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":-17.038853400000107,"y":4.400016599999958},{"x":-15.981146599999988,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":-22.8599999999999,"y":4.400016599999958},{"x":-18.521146600000066,"y":4.400016599999958}]} />
<silkscreenpath route={[{"x":-22.8599999999999,"y":4.400016599999958},{"x":-22.8599999999999,"y":-4.3999657999999044}]} />
<silkscreentext text="{NAME}" pcbX="-0mm" pcbY="6.255006mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-23.23700000000008,"y":5.505006000000094},{"x":23.23700000000008,"y":5.505006000000094},{"x":23.23700000000008,"y":-5.485193999999865},{"x":-23.23700000000008,"y":-5.485193999999865},{"x":-23.23700000000008,"y":5.505006000000094}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C720743.obj?uuid=3a919d64057a4057a90a09945a3f523a",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C720743.step?uuid=3a919d64057a4057a90a09945a3f523a",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: -1.44 },
      }}
      {...props}
    />
  )
}