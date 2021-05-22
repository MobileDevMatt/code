import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';


const TopGradientLine = () => {
  return (
    <LinearGradient
      start={[0, 1]} end={[1, 0]}
      colors={['#DE7DAF', '#28C1EA', '#EBDB04']}
    >
      <GradientFill/>
    </LinearGradient>
  );
};

export default TopGradientLine;

const GradientFill = styled.View`
  width: 100%;
  height: 4px;
`;
