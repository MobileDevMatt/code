import React from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import {
  Paragraph,
  SectionTitle,
} from '../../theme/Typography';
import PrimaryLogo from '../../components/logos/PrimaryLogo';
import DarkAuroraBackground from '../../components/containers/DarkAuroraBackground';
import {
  SecondaryButton
} from 'theme/Button';
import { Feather } from '@expo/vector-icons';

import { palette } from 'shared/src/cosmos';
import { ROUTE } from '../../lib/constants';

function Registration(): JSX.Element {
  const navigation = useNavigation();

  return (
    <DarkAuroraBackground source={'one'}>
      <ScrollContainer contentContainerStyle={{ alignItems: 'center', flex: 1 }} alwaysBounceVertical={false}>
        <PrimaryLogo width="240" height="35" color={`${palette.grayscale.white}`}/>
        <TitleContainer>
          <SectionTitle>Life changing conversations</SectionTitle>
        </TitleContainer>

        <ButtonsContainer>
          <SecondaryButton
            title="Log in with email"
            icon={<Feather
              name={'mail'}
              size={24}
              color={palette.grayscale.white}
            />}
            onPress={() => navigation.navigate(ROUTE.LOGIN)}
            style={{ marginBottom: 12 }}
          />
          {/* <SecondaryButton
            title="Log in with code"
            icon={<Feather
              name={'hash'}
              size={24}
              color={palette.grayscale.white}
            />}
            onPress={() => {
            }} //TODO: create login with code page
          /> */}
          {/* <TextButton
            icon={<Feather
              name={'chevron-right'}
              size={20}
              color={palette.grayscale.white}
            />}
            textColor={palette.grayscale.white}
            title="Create an account"
            style={{ marginTop: 40 }}
            onPress={() => navigation.navigate(ROUTE.SIGNUP)}
          /> */}
        </ButtonsContainer>
        {/* <FooterContainer>
          <SmallFooterText>By signing into jamesbook, you are agreeing to our <UnderlinedText>Privacy Policy</UnderlinedText> and <UnderlinedText>Community Guidelines</UnderlinedText>.</SmallFooterText>
          <SmallFooterText>We will never post without your permission.</SmallFooterText>
        </FooterContainer> */}
      </ScrollContainer>
    </DarkAuroraBackground>
  );
}


export default Registration;

const ButtonsContainer = styled.View`
  align-items: center;
  margin-top: 20px;
`;
const ScrollContainer = styled.ScrollView`
  padding-top: 80px;
`;

const TitleContainer = styled.View`
  margin-top: 20px;
  margin-bottom: 90px;
`;

// const FooterContainer = styled.View`
//   align-self: center;
//   justify-content: flex-end;
//   flex:1;
//   height: 50px;
//   padding-bottom: 20px;
//   width: 303px;
//   text-align: center;
// `;
