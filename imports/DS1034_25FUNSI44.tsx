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
  pin25: ["pin25"]
} as const

export const DS1034_25FUNSI44 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C77833"
  ]
}}
      manufacturerPartNumber="DS1034_25FUNSI44"
      footprint={<footprint>
        <hole pcbX="-23.50008mm" pcbY="0mm" diameter="2.999994mm" />
<hole pcbX="23.50008mm" pcbY="0mm" diameter="2.999994mm" />
<platedhole  portHints={["pin13"]} pcbX="-16.61922mm" pcbY="1.41732mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin12"]} pcbX="-13.85062mm" pcbY="1.41986mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin11"]} pcbX="-11.07948mm" pcbY="1.41986mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin10"]} pcbX="-8.31088mm" pcbY="1.41986mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin9"]} pcbX="-5.53974mm" pcbY="1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin8"]} pcbX="-2.77114mm" pcbY="1.41986mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin7"]} pcbX="0mm" pcbY="1.41986mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin6"]} pcbX="2.7686mm" pcbY="1.41986mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin5"]} pcbX="5.53974mm" pcbY="1.41986mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin4"]} pcbX="8.31088mm" pcbY="1.41986mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin3"]} pcbX="11.07948mm" pcbY="1.41986mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin2"]} pcbX="13.85062mm" pcbY="1.41986mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin1"]} pcbX="16.61922mm" pcbY="1.41986mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin14"]} pcbX="15.23492mm" pcbY="-1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin15"]} pcbX="12.46505mm" pcbY="-1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin16"]} pcbX="9.694926mm" pcbY="-1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin17"]} pcbX="6.925056mm" pcbY="-1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin18"]} pcbX="4.154932mm" pcbY="-1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin19"]} pcbX="1.385062mm" pcbY="-1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin20"]} pcbX="-1.385062mm" pcbY="-1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin21"]} pcbX="-4.154932mm" pcbY="-1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin22"]} pcbX="-6.925056mm" pcbY="-1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin23"]} pcbX="-9.694926mm" pcbY="-1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin24"]} pcbX="-12.46505mm" pcbY="-1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<platedhole  portHints={["pin25"]} pcbX="-15.23492mm" pcbY="-1.420114mm" outerDiameter="1.7999964mm" holeDiameter="1.199896mm" shape="circle" />
<silkscreenpath route={[{"x":18.99996199999987,"y":4.5999400000000605},{"x":-18.999961999999982,"y":4.5999400000000605}]} />
<silkscreenpath route={[{"x":16.299941999999874,"y":-4.599939999999947},{"x":-16.499840000000063,"y":-4.599939999999947}]} />
<silkscreenpath route={[{"x":-18.999961999999982,"y":-3.199891999999977},{"x":-20.200620000000185,"y":2.9006799999999657}]} />
<silkscreenpath route={[{"x":18.848831999999902,"y":-3.199384000000009},{"x":20.049489999999878,"y":2.9011880000000474}]} />
<silkscreenpath route={[{"x":-18.10004000000015,"y":3.5991800000000467},{"x":18.40001399999983,"y":3.5999420000000555},{"x":19.10003800000004,"y":2.999994000000015},{"x":18.299937999999884,"y":-0.8001000000000431},{"x":17.500091999999995,"y":-3.700018},{"x":-17.80006600000013,"y":-3.700018},{"x":-18.400013999999942,"y":-0.999998000000005},{"x":-19.19986000000017,"y":2.9006799999999657},{"x":-18.498820000000023,"y":3.5991800000000467},{"x":-18.10004000000015,"y":3.5991800000000467}]} />
<silkscreenpath route={[{"x":26.50007400000004,"y":6.249924000000078},{"x":26.50007400000004,"y":-6.2499239999999645}]} />
<silkscreenpath route={[{"x":26.50007400000004,"y":6.249924000000078},{"x":-26.49982,"y":6.249924000000078}]} />
<silkscreenpath route={[{"x":-26.49982,"y":-6.2499239999999645},{"x":-26.49982,"y":6.249924000000078}]} />
<silkscreenpath route={[{"x":-26.49982,"y":-6.2499239999999645},{"x":26.50007400000004,"y":-6.2499239999999645}]} />
<silkscreenpath route={[{"x":-20.199858000000063,"y":2.8999180000000706},{"x":-20.265742160586342,"y":3.1268255739815913},{"x":-20.287492497568792,"y":3.3621013538388524},{"x":-20.264322873645483,"y":3.5972416061855483},{"x":-20.19707072437643,"y":3.8237474960982354},{"x":-20.088166790178207,"y":4.033432266318869},{"x":-19.941547260409948,"y":4.218717136820601},{"x":-19.762511504990584,"y":4.372905229836306},{"x":-19.55753053564831,"y":4.490423619690205},{"x":-19.334013119718293,"y":4.5670247588617485},{"x":-19.10003800000004,"y":4.5999400000000605}]} />
<silkscreenpath route={[{"x":-16.497808000000077,"y":-4.601463999999851},{"x":-16.73457721756438,"y":-4.630442990198048},{"x":-16.973081147200674,"y":-4.634357042700572},{"x":-17.21067375131156,"y":-4.613162733778495},{"x":-17.444719102831982,"y":-4.567095199759592},{"x":-17.67262062903262,"y":-4.496665528353105},{"x":-17.89184991871366,"y":-4.402655088481765},{"x":-18.099974773195186,"y":-4.286106861528424},{"x":-18.2946861898929,"y":-4.148313870173638},{"x":-18.473823979119516,"y":-3.990804833194943},{"x":-18.635400729908042,"y":-3.8153272053801857},{"x":-18.777623858975062,"y":-3.6238277907145857},{"x":-18.89891549820163,"y":-3.418431143924181},{"x":-18.99793000000011,"y":-3.201415999999881}]} />
<silkscreenpath route={[{"x":20.04867719999993,"y":2.9004767999999785},{"x":20.114561360586322,"y":3.127384373981613},{"x":20.13631169756877,"y":3.3626601538389878},{"x":20.11314207364535,"y":3.5978004061854563},{"x":20.045889924376297,"y":3.8243062960981433},{"x":19.936985990178073,"y":4.033991066318777},{"x":19.790366460409814,"y":4.219275936820509},{"x":19.61133070499045,"y":4.373464029836327},{"x":19.406349735648064,"y":4.490982419690113},{"x":19.182832319718045,"y":4.5675835588616565},{"x":18.94885720000002,"y":4.6004987999999685}]} />
<silkscreenpath route={[{"x":16.346627200000057,"y":-4.600905199999829},{"x":16.583396417564245,"y":-4.6298841901981405},{"x":16.821900347200426,"y":-4.633798242700664},{"x":17.059492951311313,"y":-4.612603933778587},{"x":17.293538302832076,"y":-4.5665363997595705},{"x":17.521439829032488,"y":-4.4961067283531975},{"x":17.740669118713413,"y":-4.402096288481857},{"x":17.948793973195052,"y":-4.285548061528516},{"x":18.14350538989288,"y":-4.14775507017373},{"x":18.322643179119268,"y":-3.9902460331949214},{"x":18.484219929908022,"y":-3.8147684053802777},{"x":18.626443058974928,"y":-3.6232689907144504},{"x":18.747734698201384,"y":-3.417872343924273},{"x":18.846749199999977,"y":-3.200857199999973}]} />
<silkscreentext text="13" pcbX="-18.599912mm" pcbY="2.453894mm" anchorAlignment="bottom_left" fontSize="1.50114mm" />
<silkscreentext text="1" pcbX="17.19834mm" pcbY="2.49428mm" anchorAlignment="bottom_left" fontSize="1.50114mm" />
<silkscreentext text="25" pcbX="-17.59458mm" pcbY="-2.74574mm" anchorAlignment="bottom_left" fontSize="1.50114mm" />
<silkscreentext text="14" pcbX="15.999968mm" pcbY="-2.646172mm" anchorAlignment="bottom_left" fontSize="1.50114mm" />
<silkscreentext text="{NAME}" pcbX="0.0127mm" pcbY="7.2484mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-26.742200000000025,"y":6.498400000000061},{"x":26.767599999999902,"y":6.498400000000061},{"x":26.767599999999902,"y":-6.498399999999947},{"x":-26.742200000000025,"y":-6.498399999999947},{"x":-26.742200000000025,"y":6.498400000000061}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C77833.obj?uuid=80efe91264bb433a8f28a186887f0732",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C77833.step?uuid=80efe91264bb433a8f28a186887f0732",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: -4.60001 },
      }}
      {...props}
    />
  )
}