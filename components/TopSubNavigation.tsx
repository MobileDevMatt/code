import React, { useState } from 'react';
import styled from 'styled-components/native';
import palette from 'shared/src/cosmos/palette';
import { Animated, Dimensions, View } from 'react-native';
import cosmos from 'shared/src/cosmos';

const screenWidth = Math.round(Dimensions.get('window').width);

export const TopSubNavigation = ({leftTabTitle, rightTabTitle, onLeftTabPressed, onRightTabPressed, biRef}
  : {leftTabTitle: string, rightTabTitle: string, onLeftTabPressed: () => void, onRightTabPressed: () => void, biRef?: { springAnimateTabIndicator?: (arg0: boolean) => void } }) => {

    const tabUnderLineXTranslationAndSize = useState(new Animated.ValueXY({x: 0, y: 0}))[0];
    const [leftTabOffset, setLeftTabOffset] = useState(0);
    const [rightTabOffset, setRightTabOffset] = useState(0);
    const [leftTabWidth, setLeftTabWidth] = useState(0);
    const [rightTabWidth, setRightTabWidth] = useState(0);
    
    const springAnimateTabIndicator = (animateToLeft: boolean) => {
      const value = {
        x: animateToLeft ? leftTabOffset : rightTabOffset,
        y: animateToLeft ? leftTabWidth : rightTabWidth,
      }
      Animated.spring(tabUnderLineXTranslationAndSize, {
        useNativeDriver: true,
        toValue: value,
      }).start();
    }

    if (biRef) {
      biRef.springAnimateTabIndicator = springAnimateTabIndicator;
    }
    
    const onFollowersPressed = () => {
      springAnimateTabIndicator(true);
      onLeftTabPressed();
    }

    const onFollowingPressed = () => {
      springAnimateTabIndicator(false);
      onRightTabPressed();
    }


    const onTabLayout = (isLeftTab: boolean, event: any) => {
      const target = event.target;
      // Note: Needed the timeout here because without it, the measurement was being done incorrectly somehow.
      setTimeout(() => {
        target.measure( (...layout: any) => {
          const width = layout[2];

          if (isLeftTab) {
            setLeftTabWidth(width + 20);
          } else {
            setRightTabWidth(width + 20);
          }

          const offset = isLeftTab ? (screenWidth / 4.0) : screenWidth - (screenWidth / 4.0);

          if (isLeftTab) {
            Animated.timing(
              tabUnderLineXTranslationAndSize, 
              {
                toValue: {x: offset, y: width + 20},
                duration: 0,
                useNativeDriver: true,
              }
            ).start();
            setLeftTabOffset(offset);
          } else {
            setRightTabOffset(offset);
          }
        })
      }, 10)
    }


    return (
      <Container>
          <TabTitlesContainer>
            <TopBarSubContainer onPress={onFollowersPressed}>
              <TabTitles numberOfLines={2} onLayout={ (event: any) => onTabLayout(true, event) } >{leftTabTitle}</TabTitles>
            </TopBarSubContainer>

            <TopBarSubContainer onPress={onFollowingPressed}>
              <TabTitles onLayout={(event: any) => onTabLayout(false, event) } >{rightTabTitle}</TabTitles>
            </TopBarSubContainer>
          </TabTitlesContainer>

          <View style={{ height: 3}} >
            { leftTabOffset !== 0 && 
              <Underline style={{ transform: [{translateX: tabUnderLineXTranslationAndSize.x, scaleX: tabUnderLineXTranslationAndSize.y}]}}/>
            }
          </View>
        </Container>
    );
}


const Underline = styled(Animated.View)`
  width: 1px;
  height: 3px;
  background-color: ${palette.grayscale.white};
`;

const TabTitlesContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const TabTitles = styled.Text`
  font-family: larsseitbold;
  font-size: 15px;
  line-height: 15px;
  color: ${palette.grayscale.white};
  max-width: 70%;
  text-align: center;
`;

const Container = styled.View`
  justify-content: flex-end;
  background-color: ${palette.grayscale.black};
`;

const TopBarSubContainer = styled.TouchableOpacity`
  align-items: center;
  align-self: stretch;
  justify-content: flex-end;
  padding-bottom: 4px;
  flex: 1;
  padding-top: ${cosmos.unit * 2}px;
`;
