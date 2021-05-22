import React from 'react';
import styled from 'styled-components/native';

import { Dimensions } from 'react-native';
import { palette } from 'shared/src/cosmos';
import LottieView from 'lottie-react-native';
import constellation from 'shared/src/animations/constellation.json'


const Loading = () => {
  return (
    <Container>
      <LottieView
        source={constellation}
        autoPlay
        loop
        style={{
          width: 70 ,
          height: 70 ,
        }}/>
    </Container>
  );
};

export default Loading;

const Container = styled.View`
  position: absolute;
  width:100%;
  top: 0;
  flex: 1;
  left: 0;
  bottom: 0;
  z-index: 10;
  right: 0;
  z-index: 10;
  justify-content: center;
  align-items: center;
  background-color: ${palette.grayscale.cloud};
  height:${Dimensions.get('window').height}px
`;
