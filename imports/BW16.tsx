import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["PA13"],
  pin2: ["PB3"],
  pin3: ["CHIP_EN"],
  pin4: ["PA15"],
  pin5: ["PA8"],
  pin6: ["PA27"],
  pin7: ["PA26"],
  pin8: ["VDD_3V3"],
  pin9: ["GND"],
  pin10: ["PA25"],
  pin11: ["PA7"],
  pin12: ["PA14"],
  pin13: ["PA30"],
  pin14: ["PA12"],
  pin15: ["PB2"],
  pin16: ["PB1"],
  pin17: ["EP"]
} as const

export const BW16 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2764067"
  ]
}}
      manufacturerPartNumber="BW16"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-7.999984mm" pcbY="6.999986mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-7.999984mm" pcbY="4.99999mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-7.999984mm" pcbY="2.999994mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-7.999984mm" pcbY="0.999998mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-7.999984mm" pcbY="-0.999998mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-7.999984mm" pcbY="-2.999994mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-7.999984mm" pcbY="-4.99999mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-7.999984mm" pcbY="-6.999986mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="7.999984mm" pcbY="-6.999986mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="7.999984mm" pcbY="-4.99999mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="7.999984mm" pcbY="-2.999994mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="7.999984mm" pcbY="-0.999998mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="7.999984mm" pcbY="0.999998mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="7.999984mm" pcbY="2.999994mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="7.999984mm" pcbY="4.99999mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="7.999984mm" pcbY="6.999986mm" width="1.999996mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="-1.3500862mm" pcbY="1.2500102mm" width="4.7999904mm" height="4.7999904mm" shape="rect" />
<silkscreenpath route={[{"x":-8.000999999999976,"y":7.874076200000104},{"x":-7.99998400000004,"y":14.922931799999901}]} />
<silkscreenpath route={[{"x":8.00000939999984,"y":7.831200999999851},{"x":8.002015999999912,"y":15.001062199999865}]} />
<silkscreenpath route={[{"x":8.00000939999984,"y":-8.499957600000016},{"x":8.00000939999984,"y":-8.999931200000105}]} />
<silkscreenpath route={[{"x":-8.000009400000067,"y":-8.499957600000016},{"x":-8.000009400000067,"y":-8.999931200000105}]} />
<silkscreenpath route={[{"x":-8.000009400000067,"y":-8.999931200000105},{"x":8.00000939999984,"y":-8.999931200000105}]} />
<silkscreenpath route={[{"x":-8.000009400000067,"y":15.00007160000007},{"x":8.00000939999984,"y":15.00007160000007}]} />
<silkscreenpath route={[{"x":8.00000939999984,"y":-8.499957600000016},{"x":8.00000939999984,"y":-7.831099399999857}]} />
<silkscreenpath route={[{"x":8.00000939999984,"y":-6.168821800000046},{"x":8.00000939999984,"y":-5.8311034000000745}]} />
<silkscreenpath route={[{"x":8.00000939999984,"y":-4.168825799999922},{"x":8.00000939999984,"y":-3.8311581999998907}]} />
<silkscreenpath route={[{"x":8.00000939999984,"y":-2.168804399999999},{"x":8.00000939999984,"y":-1.8310860000000275}]} />
<silkscreenpath route={[{"x":8.00000939999984,"y":-0.16880839999998898},{"x":8.00000939999984,"y":0.16890999999998257}]} />
<silkscreenpath route={[{"x":8.00000939999984,"y":1.8311367999998538},{"x":8.00000939999984,"y":2.1689060000001064}]} />
<silkscreenpath route={[{"x":8.00000939999984,"y":3.8311835999999175},{"x":8.00000939999984,"y":4.168901999999889}]} />
<silkscreenpath route={[{"x":8.00000939999984,"y":5.831205000000068},{"x":8.00000939999984,"y":6.168897999999899}]} />
<silkscreenpath route={[{"x":-8.000009400000067,"y":-8.499957600000016},{"x":-8.000009400000067,"y":-7.831099399999857}]} />
<silkscreenpath route={[{"x":-8.000009400000067,"y":-6.168821800000046},{"x":-8.000009400000067,"y":-5.8311034000000745}]} />
<silkscreenpath route={[{"x":-8.000009400000067,"y":-4.168825799999922},{"x":-8.000009400000067,"y":-3.8311581999998907}]} />
<silkscreenpath route={[{"x":-8.000009400000067,"y":-2.168804399999999},{"x":-8.000009400000067,"y":-1.8310860000000275}]} />
<silkscreenpath route={[{"x":-8.000009400000067,"y":-0.16880839999998898},{"x":-8.000009400000067,"y":0.16890999999998257}]} />
<silkscreenpath route={[{"x":-8.000009400000067,"y":1.8311367999998538},{"x":-8.000009400000067,"y":2.1689060000001064}]} />
<silkscreenpath route={[{"x":-8.000009400000067,"y":3.8311835999999175},{"x":-8.000009400000067,"y":4.168901999999889}]} />
<silkscreenpath route={[{"x":-8.000009400000067,"y":5.831205000000068},{"x":-8.000009400000067,"y":6.168897999999899}]} />
<silkscreenpath route={[{"x":-6.499885400000039,"y":9.501047799999924},{"x":-6.499885400000039,"y":13.999387800000022},{"x":-2.999765400000115,"y":13.999387800000022},{"x":-2.999765400000115,"y":10.999622400000135},{"x":-0.5003800000000638,"y":10.999622400000135},{"x":-0.5003800000000638,"y":13.999387800000022},{"x":1.9990053999999873,"y":13.999387800000022},{"x":1.9990053999999873,"y":10.999622400000135},{"x":4.500879999999938,"y":10.999622400000135},{"x":4.500879999999938,"y":13.999387800000022}]} />
<silkscreenpath route={[{"x":4.500016399999936,"y":14.000048200000037},{"x":7.0000113999999485,"y":14.000048200000037},{"x":7.0000113999999485,"y":10.500055199999906}]} />
<silkscreenpath route={[{"x":-4.930368600000065,"y":13.999387800000022},{"x":-4.930368600000065,"y":9.000058200000012}]} />
<silkscreentext text="1" pcbX="-6.999986mm" pcbY="7.499858mm" anchorAlignment="bottom_left" fontSize="2.032mm" />
<silkscreentext text="16" pcbX="6.000242mm" pcbY="7.765542mm" anchorAlignment="bottom_left" fontSize="2.032mm" />
<silkscreentext text="{NAME}" pcbX="-0.0508mm" pcbY="16.0368mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-9.343200000000138,"y":15.286799999999971},{"x":9.241599999999835,"y":15.286799999999971},{"x":9.241599999999835,"y":-9.241599999999949},{"x":-9.343200000000138,"y":-9.241599999999949},{"x":-9.343200000000138,"y":15.286799999999971}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2764067.obj?uuid=3a03c6d247c848ba8181028e461cfd63",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2764067.step?uuid=3a03c6d247c848ba8181028e461cfd63",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: -0.01 },
      }}
      {...props}
    />
  )
}