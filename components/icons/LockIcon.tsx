import React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { palette } from "shared/src/cosmos";

export const LockIcon =  ({ width, height, color }: SvgProps) => (
  <Svg
    width={width ?? 24}
    height={height ?? 24}
    viewBox="0 0 24 24"
    fill={color ?? palette.grayscale.white}
  >
    <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 12a1 1 0 00-1 1v7a1 1 0 001 1h14a1 1 0 001-1v-7a1 1 0 00-1-1H5zm-3 1a3 3 0 013-3h14a3 3 0 013 3v7a3 3 0 01-3 3H5a3 3 0 01-3-3v-7z"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3a4 4 0 00-4 4v4a1 1 0 11-2 0V7a6 6 0 1112 0v4a1 1 0 11-2 0V7a4 4 0 00-4-4z"
      />
  </Svg>
);
