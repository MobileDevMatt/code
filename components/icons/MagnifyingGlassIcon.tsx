import React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { palette } from "shared/src/cosmos";

export const MagnifyingGlassIcon =  ({ width, height, color }: SvgProps) => (
  <Svg
    width={width ?? 20}
    height={height ?? 20}
    viewBox="0 0 20 20"
    fill={color ?? palette.primary.bcBlue}
  >
    <Path fillRule="evenodd"  clipRule="evenodd" d="M2 9a7 7 0 1112.041 4.856.998.998 0 00-.185.185A7 7 0 012 9zm12.618 7.032a9 9 0 111.414-1.414l3.675 3.675a1 1 0 01-1.414 1.414l-3.675-3.675z" />
  </Svg>
);
