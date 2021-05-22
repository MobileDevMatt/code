import React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { palette } from "shared/src/cosmos";

export const AudioWaveIcon =  ({ width, height, color }: SvgProps) => (
  <Svg
    width={width ?? 22}
    height={height ?? 22}
    viewBox="0 0 22 22"
    fill={color ?? palette.primary.bcBlue}
  >
    <Path fillRule="evenodd"  clipRule="evenodd" d="M11 0c-.716 0-1.319.64-1.319 1.4v19.2c0 .76.603 1.4 1.319 1.4s1.319-.64 1.319-1.4V1.4C12.319.64 11.716 0 11 0zm4.822 2c-.716 0-1.319.64-1.319 1.4v15.2c0 .76.603 1.4 1.319 1.4s1.318-.64 1.318-1.4V3.4c0-.76-.565-1.4-1.318-1.4zM4.86 6.2c0-.76.602-1.4 1.318-1.4.716 0 1.319.64 1.319 1.4v9.6c0 .76-.603 1.4-1.319 1.4s-1.318-.64-1.318-1.4V6.2zm-3.542.6C.603 6.8 0 7.44 0 8.2v5.6c0 .76.603 1.4 1.318 1.4.716 0 1.319-.64 1.319-1.4V8.2c0-.76-.565-1.4-1.319-1.4zm18.045 1.4c0-.76.603-1.4 1.319-1.4.715 0 1.318.64 1.318 1.4v5.6c0 .76-.603 1.4-1.319 1.4-.715 0-1.318-.64-1.318-1.4V8.2z" />
  </Svg>
);
