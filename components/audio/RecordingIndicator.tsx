import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { palette } from 'shared/src/cosmos';



const RecordingIndicator = () => {
  const anim = useRef(new Animated.Value(1));

  useEffect(() => {
    // makes the sequence loop
    Animated.loop(
      // runs given animations in a sequence
      Animated.sequence([
        // increase size
        Animated.timing(anim.current, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        // decrease size
        Animated.timing(anim.current, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <RecordingContainer>
      <Animated.View style={{ transform: [{ scale: anim.current }] }}>
        <RecordingIcon/>
      </Animated.View>
      <RecordingText>Recording</RecordingText>
    </RecordingContainer>
  );
};

export {RecordingIndicator}

const RecordingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const RecordingIcon = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${palette.auxillary.danger.main};
`;

const RecordingText = styled.Text`
  font-family: larsseit;
  font-size: 12px;
  line-height: 14px;
  margin-left: 4px;
  color: ${palette.auxillary.danger.main};
`;