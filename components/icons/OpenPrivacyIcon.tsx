import React from "react"
import Svg, { SvgProps, Path, Circle } from "react-native-svg"
import { palette } from "shared/src/cosmos";

export const OpenPrivacyIcon =  ({ height, width }: SvgProps) => (
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
      d="M23.443 5.5l-.378 2.327-2.465-.12 1.677 1.72-1.635 1.839 2.49-.194.374 2.428 1.421-2.06 2.16 1.143-.732-2.277 2.245-.908-2.288-.874.668-2.318-2.118 1.213-1.42-1.919z"
      fill="#D67867"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.443 19.5l-.378 2.327-2.465-.12 1.677 1.72-1.635 1.839 2.49-.194.374 2.428 1.421-2.06 2.16 1.143-.732-2.277 2.245-.909-2.288-.872.668-2.319-2.118 1.213-1.42-1.919z"
      fill="#FFD29C"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M36.443 15.5l-.377 2.327-2.466-.12 1.678 1.72-1.636 1.839 2.49-.194.375 2.428 1.42-2.06 2.16 1.143-.732-2.277 2.245-.909-2.288-.872.668-2.319-2.118 1.213-1.42-1.919z"
      fill="#9FA162"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.443 15.5l-.378 2.327-2.465-.12 1.677 1.72-1.635 1.839 2.49-.194.375 2.428 1.42-2.06 2.16 1.143-.732-2.277 2.245-.909-2.288-.872.668-2.319-2.118 1.213-1.42-1.919z"
      fill="#ECB8C5"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.443 32.5l-.377 2.327-2.466-.12 1.678 1.72-1.636 1.839 2.49-.194.375 2.428 1.42-2.06 2.16 1.143-.732-2.277 2.245-.908-2.288-.873.668-2.319-2.118 1.213-1.42-1.919z"
      fill="#C7E0CE"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M31.443 32.5l-.378 2.327-2.465-.12 1.677 1.72-1.635 1.839 2.49-.194.374 2.428 1.421-2.06 2.16 1.143-.732-2.277 2.245-.908-2.288-.873.668-2.319-2.118 1.213-1.42-1.919z"
      fill="#135EC1"
    />
  </Svg>
);
