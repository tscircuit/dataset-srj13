import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["GND"],
  pin2: ["IO1"],
  pin3: ["IO2"],
  pin4: ["TXD0"],
  pin5: ["RXD0"],
  pin6: ["IO42"],
  pin7: ["IO41"],
  pin8: ["IO40"],
  pin9: ["IO39"],
  pin10: ["IO38"],
  pin11: ["IO37"],
  pin12: ["IO36"],
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
  pin30: ["pin30"],
  pin31: ["pin31"],
  pin32: ["pin32"],
  pin33: ["pin33"],
  pin34: ["pin34"],
  pin35: ["pin35"],
  pin36: ["pin36"],
  pin37: ["pin37"],
  pin38: ["pin38"],
  pin39: ["pin39"],
  pin40: ["pin40"],
  pin41: ["pin41"],
  pin42: ["pin41_alt1"],
  pin43: ["pin41_alt1"],
  pin44: ["pin41_alt1"],
  pin45: ["pin41_alt1"],
  pin46: ["pin41_alt1"],
  pin47: ["pin41_alt1"],
  pin48: ["pin41_alt1"],
  pin49: ["pin41_alt1"]
} as const

export const ESP32_S3_WROOM_1U_N16R2 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C3013945"
  ]
}}
      manufacturerPartNumber="ESP32_S3_WROOM_1U_N16R2"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-8.750046mm" pcbY="9.0449527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-8.750046mm" pcbY="7.7749527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-8.750046mm" pcbY="6.5049527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-8.750046mm" pcbY="5.2349527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-8.750046mm" pcbY="3.9649527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-8.750046mm" pcbY="2.6949527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-8.750046mm" pcbY="1.4249527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-8.750046mm" pcbY="0.1549527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="-8.750046mm" pcbY="-1.1150473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="-8.750046mm" pcbY="-2.3850473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="-8.750046mm" pcbY="-3.6550473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="-8.750046mm" pcbY="-4.9250473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="-8.750046mm" pcbY="-6.1950473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="-8.750046mm" pcbY="-7.4650473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="-6.985mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="-5.715mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="-4.445mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="-3.175mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin19"]} pcbX="-1.905mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin20"]} pcbX="-0.635mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin21"]} pcbX="0.635mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin22"]} pcbX="1.905mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin23"]} pcbX="3.175mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin24"]} pcbX="4.445mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin25"]} pcbX="5.715mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin26"]} pcbX="6.985mm" pcbY="-8.7149813mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin27"]} pcbX="8.750046mm" pcbY="-7.4650473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin28"]} pcbX="8.750046mm" pcbY="-6.1950473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin29"]} pcbX="8.750046mm" pcbY="-4.9250473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin30"]} pcbX="8.750046mm" pcbY="-3.6550473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin31"]} pcbX="8.750046mm" pcbY="-2.3850473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin32"]} pcbX="8.750046mm" pcbY="-1.1150473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin33"]} pcbX="8.750046mm" pcbY="0.1549527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin34"]} pcbX="8.750046mm" pcbY="1.4249527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin35"]} pcbX="8.750046mm" pcbY="2.6949527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin36"]} pcbX="8.750046mm" pcbY="3.9649527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin37"]} pcbX="8.750046mm" pcbY="5.2349527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin38"]} pcbX="8.750046mm" pcbY="6.5049527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin39"]} pcbX="8.750046mm" pcbY="7.7749527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin40"]} pcbX="8.750046mm" pcbY="9.0449527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="-1.500124mm" pcbY="1.3248767mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin42"]} pcbX="-2.900172mm" pcbY="1.3248767mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin43"]} pcbX="-0.100076mm" pcbY="1.3248767mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin44"]} pcbX="-0.100076mm" pcbY="2.7249247mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin45"]} pcbX="-1.500124mm" pcbY="2.7249247mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin46"]} pcbX="-2.900172mm" pcbY="2.7249247mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin47"]} pcbX="-2.900172mm" pcbY="-0.0751713mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin48"]} pcbX="-1.500124mm" pcbY="-0.0751713mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin49"]} pcbX="-0.100076mm" pcbY="-0.0751713mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<silkscreenpath route={[{"x":9.016999999999939,"y":9.726104500000133},{"x":9.016999999999939,"y":10.504944700000124}]} />
<silkscreenpath route={[{"x":-9.000007400000186,"y":10.504944700000124},{"x":-9.000007400000186,"y":9.726104500000133}]} />
<silkscreenpath route={[{"x":-9.000007400000186,"y":10.505351100000212},{"x":9.016999999999939,"y":10.504944700000124}]} />
<silkscreenpath route={[{"x":7.666151799999966,"y":-8.994051099999865},{"x":9.016999999999939,"y":-8.994051099999865},{"x":9.016999999999939,"y":-8.14619909999999}]} />
<silkscreenpath route={[{"x":-9.000007400000186,"y":-8.14619909999999},{"x":-9.000007400000186,"y":-8.994051099999865},{"x":-7.66615180000008,"y":-8.994051099999865}]} />
<silkscreentext text="{NAME}" pcbX="-0mm" pcbY="10.5021527mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-9.7496000000001,"y":9.752152700000238},{"x":9.749599999999987,"y":9.752152700000238},{"x":9.749599999999987,"y":-9.74704729999985},{"x":-9.7496000000001,"y":-9.74704729999985},{"x":-9.7496000000001,"y":9.752152700000238}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C3013945.obj?uuid=46b6d65fd84542c2a5b86711f114a123",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C3013945.step?uuid=46b6d65fd84542c2a5b86711f114a123",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: -0.5049989999999869, z: 0 },
      }}
      {...props}
    />
  )
}