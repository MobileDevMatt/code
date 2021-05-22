import React from "react"
import Svg, { SvgProps, Path, Circle } from "react-native-svg"
import { palette } from "shared/src/cosmos";

export const ClubPrivacyIcon =  ({ height, width }: SvgProps) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 48 48"
    fill="none"
  >
    <Circle cx={24} cy={24} r={24} fill={palette.primary.navy} />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.764 9l-.566 3.49-3.698-.178 2.516 2.577-2.454 2.76 3.736-.29L22.86 21l2.13-3.09 3.242 1.715-1.1-3.416 3.368-1.363-3.433-1.31 1.003-3.476-3.177 1.818L22.763 9z"
      fill="#FFD29C"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32.764 25l-.566 3.49-3.698-.178 2.516 2.577-2.454 2.76 3.736-.29L32.86 37l2.13-3.09 3.241 1.715-1.099-3.416 3.368-1.363-3.433-1.31 1.002-3.477-3.176 1.82L32.763 25z"
      fill="#898AB1"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.764 25l-.566 3.49-3.698-.178 2.516 2.577-2.454 2.76 3.736-.29L11.86 37l2.13-3.09 3.242 1.715-1.1-3.416 3.368-1.363-3.433-1.31 1.003-3.477-3.177 1.82L11.763 25z"
      fill="#D67867"
    />
    <Path stroke="#135EC1" d="M29.4 19.7l3 4" />
    <Path stroke="#C7E0CE" d="M27 32.5h-7" />
    <Path stroke="#BBD5F8" d="M14.646 23.182l3.536-3.535" />
  </Svg>
);
