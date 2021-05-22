import React from 'react';
import Svg, { SvgProps, Path, Circle, G, Defs, LinearGradient, Stop, ClipPath } from 'react-native-svg';

const StartAudioIcon = ({ height, width, color }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
    >
      <G clipPath="url(#prefix__clip0)">
        <Circle
          cx={32.5}
          cy={32}
          r={30}
          fill="#fff"
          stroke="url(#prefix__paint0_linear)"
          strokeWidth={4}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M32.5 17.334c-.954 0-1.758.853-1.758 1.866v25.6c0 1.014.804 1.867 1.758 1.867s1.758-.853 1.758-1.867V19.2c0-1.013-.804-1.866-1.758-1.866zM38.93 20c-.955 0-1.759.853-1.759 1.867v20.266c0 1.014.804 1.867 1.758 1.867s1.758-.853 1.758-1.867V21.867c0-1.013-.753-1.867-1.758-1.867zm-14.617 5.6c0-1.013.803-1.867 1.758-1.867.954 0 1.758.854 1.758 1.867v12.8c0 1.013-.804 1.867-1.758 1.867-.955 0-1.758-.854-1.758-1.867V25.6zm-4.722.8c-.954 0-1.758.854-1.758 1.867v7.467c0 1.013.804 1.866 1.758 1.866s1.758-.853 1.758-1.866v-7.467c0-1.013-.753-1.867-1.758-1.867zm24.06 1.867c0-1.013.803-1.867 1.758-1.867.954 0 1.758.854 1.758 1.867v7.467c0 1.013-.804 1.866-1.758 1.866-.955 0-1.758-.853-1.758-1.866v-7.467z"
          fill="#135EC1"
        />
      </G>
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={64.5}
          y1={0}
          x2={0.5}
          y2={64}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#EBDB04"/>
          <Stop offset={0.5} stopColor="#28C1EA"/>
          <Stop offset={1} stopColor="#DE7DAF"/>
        </LinearGradient>
        <ClipPath id="prefix__clip0">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h64v64H0z"/>
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export {StartAudioIcon};

