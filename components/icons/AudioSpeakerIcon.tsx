import React from 'react';
import Svg, { SvgProps, Path} from 'react-native-svg';

const AudioSpeakerIcon = ({ height, width, color }: SvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 .75c-.537 0-.989.48-.989 1.05v14.4c0 .57.452 1.05.989 1.05.537 0 .989-.48.989-1.05V1.8c0-.57-.452-1.05-.989-1.05zm3.616 1.5c-.536 0-.988.48-.988 1.05v11.4c0 .57.452 1.05.988 1.05.537 0 .99-.48.99-1.05V3.3c0-.57-.425-1.05-.99-1.05zM4.395 5.4c0-.57.452-1.05.989-1.05.536 0 .988.48.988 1.05v7.2c0 .57-.452 1.05-.988 1.05-.537 0-.99-.48-.99-1.05V5.4zm-2.656.45c-.537 0-.989.48-.989 1.05v4.2c0 .57.452 1.05.989 1.05.537 0 .989-.48.989-1.05V6.9c0-.57-.424-1.05-.99-1.05zM15.272 6.9c0-.57.452-1.05.99-1.05.536 0 .988.48.988 1.05v4.2c0 .57-.452 1.05-.989 1.05-.537 0-.989-.48-.989-1.05V6.9z"
        fill={color as string}
      />
    </Svg>
  );
};

export {AudioSpeakerIcon};

