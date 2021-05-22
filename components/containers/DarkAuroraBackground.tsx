import React from 'react';
import styled from 'styled-components/native';
import { palette } from 'shared/src/cosmos';

interface IProps {
  source: string;
  children: JSX.Element
}

const imageSources = {
  'one': require('../../assets/images/aurora-background-type-one.png'),
  'two': require('../../assets/images/aurora-background-type-two.png'),
};

const DarkAuroraBackground = ({children, source}: IProps) => {

  return (
    <ImageBackground
      resizeMode={'cover'}
      source={imageSources[source]}
    >
      {children}
    </ImageBackground>
  );
};

export default DarkAuroraBackground;

const ImageBackground = styled.ImageBackground`
  position: relative;
  height: 100%;
  flex: 1;
  background-color: ${palette.grayscale.black};
`;
