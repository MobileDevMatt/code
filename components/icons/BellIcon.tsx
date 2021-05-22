import React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { palette } from "shared/src/cosmos";

export const BellIcon =  ({ width, height, color }: SvgProps) => (
  <Svg
    width={width ?? 20}
    height={height ?? 20}
    viewBox="0 0 20 20"
    fill={color ?? palette.primary.bcBlue}
  >
    <Path fillRule="evenodd"  clipRule="evenodd" d="M10 0a6.363 6.363 0 00-6.364 6.364c0 3.047-.651 4.94-1.252 6.041a5.398 5.398 0 01-.8 1.132 2.751 2.751 0 01-.278.257l-.002.002a.909.909 0 00.514 1.658h16.364a.91.91 0 00.515-1.658l-.003-.002a2.754 2.754 0 01-.278-.258 5.398 5.398 0 01-.8-1.13c-.6-1.102-1.253-2.995-1.253-6.042A6.363 6.363 0 0010 0zm6.02 13.276c.07.127.139.247.208.36H3.772c.07-.113.139-.233.208-.36.763-1.399 1.475-3.597 1.475-6.912a4.545 4.545 0 019.09 0c0 3.315.712 5.513 1.475 6.912zm-6.806 4.45a.909.909 0 10-1.573.912 2.727 2.727 0 004.718 0 .91.91 0 00-1.573-.913.91.91 0 01-1.572 0z" />
  </Svg>
);
