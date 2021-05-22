import React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { palette } from "shared/src/cosmos";

const TweeterIcon =  ({ height, width, color }: SvgProps) => (
  <Svg
    height={height}
    width={width}
    viewBox="0 0 22 19"
    fill={color ? color : palette.primary.navy}
  >
    <Path fillRule="evenodd"  clipRule="evenodd" d="M21.083.875a9.817 9.817 0 01-2.878 1.466A4.083 4.083 0 0016.103.994a3.938 3.938 0 00-2.461.154 4.143 4.143 0 00-1.933 1.6A4.434 4.434 0 0011 5.215v.959a9.42 9.42 0 01-4.646-1.088A9.91 9.91 0 012.75 1.833s-3.667 8.625 4.583 12.459a10.334 10.334 0 01-6.416 1.916c8.25 4.792 18.333 0 18.333-11.02 0-.267-.025-.534-.073-.796A7.489 7.489 0 0021.083.875z" />
  </Svg>
);

export default TweeterIcon;
