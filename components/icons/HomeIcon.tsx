import React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { palette } from "shared/src/cosmos";

export const HomeIcon =  ({ width, height, color }: SvgProps) => (
  <Svg
    width={width ?? 20}
    height={height ?? 20}
    viewBox="0 0 20 20"
    fill={color ?? palette.primary.bcBlue}
  >
    <Path fillRule="evenodd"  clipRule="evenodd" d="M10.558.191a.91.91 0 00-1.116 0L1.26 6.555a.91.91 0 00-.35.718v10A2.727 2.727 0 003.635 20h3.637a.91.91 0 00.91-.91l-.001-8.18h3.636v8.18c0 .503.407.91.91.91h3.636a2.727 2.727 0 002.727-2.727v-10c0-.28-.13-.546-.351-.718L10.558.191zm3.079 17.99h2.727a.91.91 0 00.909-.908V7.717L10 2.061 2.727 7.717v9.556a.91.91 0 00.91.909h2.727V10a.91.91 0 01.909-.91h5.454a.91.91 0 01.91.91v8.182z" />
  </Svg>
);
