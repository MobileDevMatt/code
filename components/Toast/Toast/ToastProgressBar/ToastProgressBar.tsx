import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
} from 'react-native';

import Sc from './StyledComps';

const intervalCheck = 1000;

interface IProps {
  interval: number, // miliseconds
}

const ToastProgressBar: React.FC<IProps> = ({
  interval,
}) => {
  let animation = useRef(new Animated.Value(1));
  const timeLeft = useRef(interval);
  const [progress, setProgress] = useState(1);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function startProgress() {
      if (timeLeft.current <= 0) {
        clearInterval(intervalId);
        return;
      }

      timeLeft.current = timeLeft.current - intervalCheck;
      const progressCalc = timeLeft.current / interval;

      setProgress(progressCalc);
    }

    startProgress();

    const intervalId = setInterval(() => {
      startProgress();
    }, intervalCheck);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  React.useEffect(() => {
    if (!width) {
      return;
    }

    Animated.timing(animation.current, {
      toValue: progress,
      duration: intervalCheck,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [progress, width]);

  return (
    <Sc.Container
      onLayout={(e: LayoutChangeEvent) => {
        const { layout } = e.nativeEvent;
        setWidth(layout.width);
      }}
    >
      {width ? (
        <Sc.Progress
          style={{
            transform: [
              {
                translateX: animation.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, width],
                })
              }
            ]
          }}
        />
       ) : null}
    </Sc.Container>
  );
};

export default ToastProgressBar;
