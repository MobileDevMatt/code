import React, { useEffect, useCallback, useRef } from 'react';
import { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';
import { Dimensions, View, Animated } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { LinearGradient } from 'expo-linear-gradient';
import sum from 'lodash/sum';


interface IProps {
  leftTabText?: string;
  rightTabText?: string;
  index: number;
  setIndex: (index: number) => void
}

const PageToggle = ({ leftTabText, rightTabText, index, setIndex }: IProps) => {

  const config = {
    index,
    routes: [
      { key: 'first', title: leftTabText },
      { key: 'second', title: rightTabText },
    ],
  };

  const renderIndicator = useCallback(
    ({ getTabWidth }) => {
      const tabWidth = sum([...Array(index).keys()].map(i => getTabWidth(i)));

      return (
        <TabIndicator
          width={getTabWidth(index)}
          tabWidth={tabWidth}
          index={index}
        />
      );
    },
    [index],
  );

  const renderTabBar = props => (
    <TabBar
      {...props}
      renderIndicator={renderIndicator}
      getLabelText={({ route }) => {
        return route.title;
      }}
      onTabLongPress={(scene) => {
        const { route } = scene;
        props.jumpTo(route.key);
      }}
      style={{
        backgroundColor: palette.grayscale.black,
        height: 52,
        marginBottom: 0,
        justifyContent: 'center',
      }}
      renderLabel={({ route, focused }) => {
        return (
          <View>
            <Text style={{
              fontFamily: focused ? 'larsseitbold' : 'larsseit',
              color: focused ? palette.grayscale.white : palette.grayscale.granite,
            }}>
              {route.title}
            </Text>
            <View style={{ height: 1 }}>
              <Text
                style={{
                  color: 'transparent',
                }}>
                {route.title}
              </Text>
            </View>
          </View>
        );
      }}
    />
  );


  return (
    <View style={{ width: '100%', height: 52 }}>
      <TabView
        navigationState={config}
        renderTabBar={renderTabBar}
        renderScene={({ route, jumpTo }) => {
          return null;
        }}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    </View>

  );
};

export { PageToggle };

const Text = styled.Text`
  font-family: larsseitbold;
  font-size: 15px;
`;

const TabIndicator = ({ width, tabWidth, index }) => {
  const marginLeftRef = useRef(new Animated.Value(index ? tabWidth : 0))
    .current;
  useEffect(() => {
    Animated.timing(marginLeftRef, {
      toValue: tabWidth,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [tabWidth]);

  return (
    <Animated.View
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
        width: width,
        marginLeft: marginLeftRef,
      }}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#DE7DAF', '#28C1EA', '#EBDB04']}
        style={{ height: 4, width: '100%' }}
      />
    </Animated.View>
  );
};