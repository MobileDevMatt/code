import React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { palette } from "shared/src/cosmos";

export const BookIcon =  ({ height, width, color }: SvgProps) => (
  <Svg
    height={height}
    width={width}
    viewBox="0 0 18 18"
    fill={color ? color : palette.primary.navy}
  >
    <Path fillRule="evenodd"  clipRule="evenodd" d="M4.08 2.58c.21-.211.497-.33.795-.33h9.375V12H4.875c-.393 0-.777.088-1.125.253V3.375c0-.298.119-.585.33-.796zm-.33 12.045a1.125 1.125 0 001.125 1.125h9.375V13.5H4.875a1.125 1.125 0 00-1.125 1.125zm12-1.875V1.5A.75.75 0 0015 .75H4.875A2.625 2.625 0 002.25 3.375v11.25a2.625 2.625 0 002.625 2.625H15a.75.75 0 00.75-.75v-3.75z" />
  </Svg>
);
