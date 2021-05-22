import React from 'react';
import { useNavigation } from '@react-navigation/native';
import cosmos, { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';
import { Entypo } from '@expo/vector-icons';
import { H1 } from 'theme/Typography';
import { StyleProp, View, ViewStyle } from 'react-native';
import { IImage } from 'shared/src/services';
import { Avatar } from './Avatar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ROUTE } from 'lib/constants';

interface IProps {
  title?: string;
  backButtonText?: string;
  showBackButton?: boolean;
  welcomeText?: string;
  image?: IImage;
  name?: string;
  style?: StyleProp<ViewStyle>;
  hideProfileImage?: boolean;
  backButtonAction?: () => void;
  disableDefaultBackButtonAction?: boolean;
}

export const AppBar = ({ title, backButtonText, showBackButton, welcomeText, image, name, style, hideProfileImage = false, backButtonAction, disableDefaultBackButtonAction}: IProps) => {
  const navigation = useNavigation();

  const backButtonPressed = () => {
    if (backButtonAction) {
      backButtonAction();
    }

    if (!disableDefaultBackButtonAction) {
      navigation.goBack();
    }
  }

  return (
    <Container style={style}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: (welcomeText !== undefined || showBackButton) ? 'space-between' : 'flex-end'}}>
        { (showBackButton && welcomeText === undefined) &&
          <BackButtonWrapper onPress={backButtonPressed}>
            <Entypo 
              name={'chevron-left'}
              size={20}
              color={palette.grayscale.white}
            />
            <BackButtonText>{backButtonText ?? 'Back'}</BackButtonText>
          </BackButtonWrapper>
        }

        { welcomeText !== undefined &&
          <WelcomeText>{welcomeText}</WelcomeText>
        }

        { (title !== undefined && welcomeText === undefined) &&
          <View style={{position: 'absolute', top: 0, left: 64, right: 64, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
            <H1 numberOfLines={1} style={{textAlign: 'center'}}>{title}</H1>
          </View>
        }
       
       { !hideProfileImage &&
        <TouchableOpacity onPress={() => { navigation.navigate(ROUTE.ACCOUNT);}}>
          <Avatar 
            images={image}
            name={name}
            size={32}
          />
        </TouchableOpacity>
       }
        
      </View>
    </Container>
  );
};


const Container = styled.View`
  width: 100%;
  min-height: 56px;
  background-color: ${palette.grayscale.black};
  padding: 12px ${cosmos.unit * 2}px;
`;

const BackButtonWrapper = styled.TouchableOpacity`
  flex-direction: row;
  height: 32px;
  align-items: center;
  padding-right: ${cosmos.unit}px;
`;

const BackButtonText = styled.Text`
  font-family: larsseitbold;
  font-size: 16px;
  line-height: 22px;
  color: ${palette.grayscale.white};
`;

const WelcomeText = styled.Text`
  font-family: ivarheadline;
  font-size: 24px;
  line-height: 30px;
  color: ${palette.grayscale.white};
`;
