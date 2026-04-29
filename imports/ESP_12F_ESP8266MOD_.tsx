import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["RST"],
  pin2: ["ADC"],
  pin3: ["EN"],
  pin4: ["GPIO16"],
  pin5: ["GPIO14"],
  pin6: ["GPIO12"],
  pin7: ["GPIO13"],
  pin8: ["VCC"],
  pin9: ["GND"],
  pin10: ["GPIO15"],
  pin11: ["GPIO2"],
  pin12: ["GPIO0"],
  pin13: ["GPIO4"],
  pin14: ["GPIO5"],
  pin15: ["RXD0"],
  pin16: ["TXD0"],
  pin17: ["CS0"],
  pin18: ["MISO"],
  pin19: ["GPIO9"],
  pin20: ["GPIO10"],
  pin21: ["MOSI"],
  pin22: ["SCLK"]
} as const

export const ESP_12F_ESP8266MOD_ = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C82891"
  ]
}}
      manufacturerPartNumber="ESP_12F_ESP8266MOD_"
      footprint={<footprint>
        <smtpad portHints={["pin16"]} pcbX="-7.72560685mm" pcbY="7.550658mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="-5.72561085mm" pcbY="7.550404mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="-3.72561485mm" pcbY="7.550658mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="-1.72561885mm" pcbY="7.549896mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="0.27437715mm" pcbY="7.550658mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="2.27437315mm" pcbY="7.55142mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="4.27436915mm" pcbY="7.55015mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="6.27436515mm" pcbY="7.548626mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin22"]} pcbX="7.57535315mm" pcbY="4.996688mm" width="1.6999966mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin21"]} pcbX="7.57459115mm" pcbY="2.996692mm" width="1.6999966mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin20"]} pcbX="7.57459115mm" pcbY="0.997458mm" width="1.6999966mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin19"]} pcbX="7.57459115mm" pcbY="-1.0033mm" width="1.6999966mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="7.57408315mm" pcbY="-3.002026mm" width="1.6999966mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="7.57560715mm" pcbY="-4.99999mm" width="1.6999966mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="6.27436515mm" pcbY="-7.550658mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="4.27436915mm" pcbY="-7.55142mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="2.27437315mm" pcbY="-7.55142mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="0.27437715mm" pcbY="-7.55142mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-1.72561885mm" pcbY="-7.55142mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-3.72561485mm" pcbY="-7.55142mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-5.72561085mm" pcbY="-7.55142mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-7.72560685mm" pcbY="-7.55142mm" width="1.3999972mm" height="2.499995mm" shape="rect" />
<silkscreenpath route={[{"x":-6.656749450000007,"y":-8.00100000000009},{"x":-6.794468249999909,"y":-8.00100000000009}]} />
<silkscreenpath route={[{"x":-4.6567534499999965,"y":-8.00100000000009},{"x":-4.794472249999899,"y":-8.00100000000009}]} />
<silkscreenpath route={[{"x":-2.6567574499999864,"y":-8.00100000000009},{"x":-2.7944762499998888,"y":-8.00100000000009}]} />
<silkscreenpath route={[{"x":-0.6567614499998626,"y":-8.00100000000009},{"x":-0.7944802499998787,"y":-8.00100000000009}]} />
<silkscreenpath route={[{"x":1.3432345500000338,"y":-8.00100000000009},{"x":1.2055157500000178,"y":-8.00100000000009}]} />
<silkscreenpath route={[{"x":3.343230550000044,"y":-8.00100000000009},{"x":3.205511750000028,"y":-8.00100000000009}]} />
<silkscreenpath route={[{"x":5.343226550000054,"y":-8.00100000000009},{"x":5.205507750000152,"y":-8.00100000000009}]} />
<silkscreenpath route={[{"x":7.771949149999955,"y":-5.9311285999999654},{"x":7.771949149999955,"y":-8.00100000000009},{"x":7.205503749999934,"y":-8.00100000000009}]} />
<silkscreenpath route={[{"x":7.771949149999955,"y":-3.933164599999941},{"x":7.771949149999955,"y":-4.068851399999971}]} />
<silkscreenpath route={[{"x":7.771949149999955,"y":-1.9344385999999076},{"x":7.771949149999955,"y":-2.0708874000000606}]} />
<silkscreenpath route={[{"x":7.771949149999955,"y":0.06631939999999759},{"x":7.771949149999955,"y":-0.07216140000002724}]} />
<silkscreenpath route={[{"x":7.771949149999955,"y":2.0655534000001126},{"x":7.771949149999955,"y":1.928596599999878}]} />
<silkscreenpath route={[{"x":7.771949149999955,"y":4.065549400000009},{"x":7.771949149999955,"y":3.927830599999993}]} />
<silkscreenpath route={[{"x":7.205503749999934,"y":7.998460000000023},{"x":7.771949149999955,"y":7.998460000000023},{"x":7.771949149999955,"y":5.927826600000003}]} />
<silkscreenpath route={[{"x":5.205507750000152,"y":7.998460000000023},{"x":5.343226550000054,"y":7.998460000000023}]} />
<silkscreenpath route={[{"x":3.205511750000028,"y":7.998460000000023},{"x":3.343230550000044,"y":7.998460000000023}]} />
<silkscreenpath route={[{"x":1.2055157500000178,"y":7.998460000000023},{"x":1.3432345500000338,"y":7.998460000000023}]} />
<silkscreenpath route={[{"x":-0.7944802499998787,"y":7.998460000000023},{"x":-0.6567614499998626,"y":7.998460000000023}]} />
<silkscreenpath route={[{"x":-2.7944762499998888,"y":7.998460000000023},{"x":-2.6567574499999864,"y":7.998460000000023}]} />
<silkscreenpath route={[{"x":-4.794472249999899,"y":7.998460000000023},{"x":-4.6567534499999965,"y":7.998460000000023}]} />
<silkscreenpath route={[{"x":-6.794468249999909,"y":7.998460000000023},{"x":-6.656749450000007,"y":7.998460000000023}]} />
<silkscreenpath route={[{"x":-8.656745450000017,"y":-8.00100000000009},{"x":-16.225818449999906,"y":-8.00100000000009}]} />
<silkscreenpath route={[{"x":-16.225818449999906,"y":7.998460000000023},{"x":-8.656745450000017,"y":7.998460000000023}]} />
<silkscreenpath route={[{"x":-10.225830449999876,"y":4.998465999999894},{"x":-10.225830449999876,"y":-5.001513999999929},{"x":-15.225820450000015,"y":-5.001513999999929},{"x":-15.225820450000015,"y":-4.001516000000038},{"x":-12.225826449999886,"y":-4.001516000000038},{"x":-12.225826449999886,"y":-3.001517999999919},{"x":-15.225820450000015,"y":-3.001517999999919},{"x":-15.225820450000015,"y":-2.001519999999914},{"x":-12.225826449999886,"y":-2.001519999999914},{"x":-12.225826449999886,"y":-1.0015220000000227},{"x":-15.225820450000015,"y":-1.0015220000000227},{"x":-15.225820450000015,"y":-0.0015239999999039355},{"x":-12.225826449999886,"y":-0.0015239999999039355},{"x":-12.225826449999886,"y":0.9984739999999874},{"x":-15.225820450000015,"y":0.9984739999999874},{"x":-15.225820450000015,"y":6.998462000000131}]} />
<silkscreenpath route={[{"x":-7.225836449999861,"y":-6.001512000000048},{"x":5.774137549999978,"y":-6.001512000000048},{"x":5.774137549999978,"y":5.998464000000013},{"x":-7.225836449999861,"y":5.998464000000013},{"x":-7.225836449999861,"y":-6.001512000000048}]} />
<silkscreenpath route={[{"x":-9.22583244999987,"y":-7.001509999999939},{"x":-9.22583244999987,"y":6.998462000000131}]} />
<silkscreenpath route={[{"x":-16.225818449999906,"y":-8.001507999999944},{"x":-16.225818449999906,"y":7.998460000000023}]} />
<silkscreentext text="{NAME}" pcbX="-3.92348085mm" pcbY="9.79602mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-16.517880849999983,"y":9.046019999999999},{"x":8.670919150000145,"y":9.046019999999999},{"x":8.670919150000145,"y":-9.183180000000107},{"x":-16.517880849999983,"y":-9.183180000000107},{"x":-16.517880849999983,"y":9.046019999999999}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C82891.obj?uuid=61ec718de98e4554bc672da5773a804d",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C82891.step?uuid=61ec718de98e4554bc672da5773a804d",
        pcbRotationOffset: 90,
        modelOriginPosition: { x: 2.0806070000000005, y: -4.877255199999983, z: 22.455 },
      }}
      {...props}
    />
  )
}