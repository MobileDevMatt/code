// THIS CODE IS NOT SHOWING IN THE APP

import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

import { TitleDark, SectionTitleDark } from '../../theme/Typography';
import AuthPageContainer from '../../components/containers/AuthPageContainer';
import { ROUTE } from '../../lib/constants';


const AuthorSignUpVerifyEmail = () => {
  const navigation = useNavigation();

  return (
    <Container>
      <AuthPageContainer>
        <CloseContainer onPress={() => {
          navigation.navigate(ROUTE.REGISTRATION);
        }}>
          <MaterialCommunityIcons name="window-close" size={24} color="black"/>
        </CloseContainer>

        <TitleContainer>
          <TitleDark>Check your email to verify your account.</TitleDark>
          <SectionTitleContainer>
            <SectionTitleDark>You'll need to sign in once you return</SectionTitleDark>
          </SectionTitleContainer>
        </TitleContainer>
      </AuthPageContainer>
    </Container>
  );
};

export default AuthorSignUpVerifyEmail;

const Container = styled.View`
  position: relative;
  height: 100%;
  background-color: transparent;
  justify-content: flex-end;
  flex:1;
`;

const SectionTitleContainer = styled.View`
  margin-top: 20px;

`;

const CloseContainer = styled.TouchableOpacity`
  align-items: flex-end;
  width: 100%;
  padding-right: 23px;
  padding-top: 23px;
`;

const TitleContainer = styled.View`
  margin-top: 23px;
  padding-horizontal:20px;
  align-items: center;
`;
