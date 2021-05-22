import React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

export const AudioParticipantsIcon =  ({ height, width, color }: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.379 11.079A3 3 0 014.5 10.2h4.8a3 3 0 013 3v1.2a.6.6 0 11-1.2 0v-1.2a1.8 1.8 0 00-1.8-1.8H4.5a1.8 1.8 0 00-1.8 1.8v1.2a.6.6 0 11-1.2 0v-1.2a3 3 0 01.879-2.121zM6.9 4.2a1.8 1.8 0 100 3.6 1.8 1.8 0 000-3.6zM3.9 6a3 3 0 116 0 3 3 0 01-6 0zM12.919 10.728a.6.6 0 01.731-.431 3 3 0 012.25 2.902V14.4a.6.6 0 01-1.2 0v-1.2a1.8 1.8 0 00-1.35-1.741.6.6 0 01-.431-.731zM10.519 3.529a.6.6 0 01.73-.432 3 3 0 010 5.812.6.6 0 11-.298-1.162 1.8 1.8 0 000-3.488.6.6 0 01-.432-.73z"
      fill="#7C7572"
    />
  </Svg>
);
