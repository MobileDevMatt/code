import React, { useEffect, useState } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';


interface ContainerProps {
  children: React.ReactElement | React.ReactElement[];
  style?: StyleProp<ViewStyle>
}

const FadeInView = ({ style, children }: ContainerProps) => {
  const [fadeAnimation, setFadeAnimation] = useState(new Animated.Value(0));


  useEffect(() => {
    Animated.timing(
      fadeAnimation,
      {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      },
    ).start();
  }, []);


  return (
    <Animated.View
      style={[style, { opacity: fadeAnimation }]}
    >
      {children}
    </Animated.View>
  );

};


export { FadeInView };
