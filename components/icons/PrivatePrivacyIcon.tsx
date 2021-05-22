import React from "react"
import Svg, { SvgProps, Path, Circle } from "react-native-svg"
import { palette } from "shared/src/cosmos";

export const PrivatePrivacyIcon =  ({ height, width }: SvgProps) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 48 48"
    fill="none"
  >
    <Circle cx={24} cy={24} r={24} fill={palette.primary.navy}  />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.185 16.5l-.754 4.655-4.931-.24 3.355 3.437-3.272 3.68 4.981-.388.749 4.856 2.841-4.12 4.321 2.286-1.465-4.554 4.49-1.817-4.577-1.746 1.336-4.636-4.235 2.425-2.839-3.838z"
      fill="#C3D9B5"
    />
  </Svg>
);
