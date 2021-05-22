import React from 'react';
import { StatusBar, Platform } from 'react-native';
import styled from 'styled-components/native';
import { palette } from 'shared/src/cosmos';
import Constants from 'expo-constants';

interface IProps {
  backgroundColor?: string;
}


const StatusBarComponent = ({backgroundColor}: IProps) => {
  return (
    <Container>
      <StatusBar
        barStyle="light-content"
      />
    </Container>
  );
};

export default StatusBarComponent;

const Container = styled.View`
  height: ${Platform.OS === 'ios' ? Constants.statusBarHeight+'px' : 0};
  background-color: ${palette.grayscale.black}
`;
