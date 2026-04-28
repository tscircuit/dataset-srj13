import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["G"],
  pin2: ["D"],
  pin3: ["S"]
} as const

export const IRF540NPBF = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2566"
  ]
}}
      manufacturerPartNumber="IRF540NPBF"
      footprint={<footprint>
        <platedhole  portHints={["pin2"]} pcbX="0.6248717mm" pcbY="0mm" holeWidth="1.1999976mm" holeHeight="1.999996mm" outerWidth="1.7999964mm" outerHeight="2.5999948mm" shape="pill" />
<platedhole  portHints={["pin3"]} pcbX="3.1651257mm" pcbY="-0.009906mm" holeWidth="1.1999976mm" holeHeight="1.999996mm" outerWidth="1.7999964mm" outerHeight="2.5999948mm" shape="pill" />
<platedhole  portHints={["pin1"]} pcbX="-1.9151283mm" pcbY="0mm" outerDiameter="2.5999948mm" holeDiameter="1.1999976mm" shape="circle" />
<silkscreenpath route={[{"x":-4.676133700000037,"y":3.089071800000056},{"x":5.92587709999998,"y":3.089071800000056},{"x":5.92587709999998,"y":-1.7090135999999347},{"x":-4.676133700000037,"y":-1.7090135999999347},{"x":-4.676133700000037,"y":3.0839918000000353},{"x":-4.676133700000037,"y":3.089071800000056}]} />
<silkscreenpath route={[{"x":5.924835700000017,"y":2.4899111999999377},{"x":-4.67509229999996,"y":2.4899111999999377}]} />
<silkscreenpath route={[{"x":-2.1450999000001048,"y":-2.334996599999954},{"x":-2.3342749142161665,"y":-2.196079150805872},{"x":-2.2611811288967374,"y":-1.97304878910154},{"x":-2.026478671103405,"y":-1.97304878910154},{"x":-1.9533848857839757,"y":-2.196079150805872},{"x":-2.142559899999924,"y":-2.334996599999954}]} />
<silkscreentext text="{NAME}" pcbX="0.6121717mm" pcbY="4.0988mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.933728299999984,"y":3.348799999999983},{"x":6.158071699999937,"y":3.348799999999983},{"x":6.158071699999937,"y":-2.967800000000125},{"x":-4.933728299999984,"y":-2.967800000000125},{"x":-4.933728299999984,"y":3.348799999999983}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2566.obj?uuid=7002bf753f604153b635846fadbc52d9",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2566.step?uuid=7002bf753f604153b635846fadbc52d9",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: -0.6494859999999344, z: 0.2549899999999994 },
      }}
      {...props}
    />
  )
}