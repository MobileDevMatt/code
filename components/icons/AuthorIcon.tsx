import React from 'react';
import Svg, { SvgProps, Path, Rect } from 'react-native-svg';

export const AuthorIcon = ({ height, width, color }: SvgProps) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 13 12" fill="none">
    <Rect x="0.314941" width="12" height="12" rx="6" fill={color}/>
    <Path
      fillRule="evenodd" clipRule="evenodd"
      d="M5.15743 2L4.78031 4.32729L2.31494 4.20781L3.9923 5.9261L2.35647 7.76576L4.84704 7.57211L5.22139 10L6.64208 7.93999L8.8026 9.083L8.06997 6.80615L10.3149 5.89751L8.0265 5.02448L8.69462 2.70636L6.57674 3.91895L5.15743 2Z"
      fill="white"/>
  </Svg>
);
