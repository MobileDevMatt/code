import React from 'react';
import { useNavigation } from '@react-navigation/native';
import styled, { css } from 'styled-components/native';

import { SectionTitle, Title } from 'theme/Typography';
import { Button, SecondaryButton } from 'theme/Button';
import DarkAuroraBackground from 'components/containers/DarkAuroraBackground';

import cosmos, { palette } from 'shared/src/cosmos';
import { ROUTE } from 'lib/constants';
import { useSignOut } from 'hooks/useAuth';
import { useQueryClient } from 'react-query';
import { cacheKey } from 'hooks/cacheStateKey';

const stepLabels = [
  'Select a book',
  'Choose a discussion prompt',
  'Record and upload a video',
  'Edit and review prompts',
  'Publish discussion guides',
];

const Welcome = () => {
  const { mutate: signOut } = useSignOut();
  const navigation = useNavigation();
  const queryClient = useQueryClient();


  return (
    <DarkAuroraBackground source={'two'}>
      <>
        <InnerContainer>
          <Logo source={require('../../assets/images/logo-white.png')}/>
          <Title>Welcome back</Title>
          <TitleContainer>
            <SectionTitle style={{ fontSize: 24 }}>Upload discussion responses</SectionTitle>
          </TitleContainer>

          {stepLabels.map((step, index) => {
            return (
              <Step key={index}>
                <Number>
                  <StepNumber>{index + 1}</StepNumber>
                </Number>
                <StepTitle>{step}</StepTitle>
              </Step>
            );
          })}
        </InnerContainer>
        <ButtonContainer>
          <LogoutButton
            title="Logout"
            onPress={() => signOut(undefined, {
              onSuccess: async () => {
                queryClient.invalidateQueries(cacheKey.currentCognitoUser);
                queryClient.invalidateQueries(cacheKey.currentUserRole);
              },
            })}
          />
          <Button
            title="See my books"
            onPress={() => navigation.navigate(ROUTE.AUTHOR_BOOKS)}
          />
        </ButtonContainer>
      </>
    </DarkAuroraBackground>

  );
};

export default Welcome;

const InnerContainer = styled.ScrollView`
  position: relative;
  height: 100%;
  padding-top: 16px;
  padding-horizontal: 24px;
`;

const TitleContainer = styled.View`
  margin-top: 45px;
  margin-bottom: 36px;
`;

const ButtonContainer = styled.View`
  align-items: center;
  margin-top: 23px;
  flex-direction: row;
  margin-bottom: ${cosmos.unit * 4}px;
  padding-horizontal: ${cosmos.unit * 3}px;
  justify-content: space-between;
`;

const LogoutButton = styled(SecondaryButton)`
  width: 165px;
  background-color: transparent;
`;

const Logo = styled.Image`
  width: 40.5px;
  height: 36px;
  resize-mode: cover;
  align-self: center;
  margin-bottom: 36px;
`;

const Step = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
  align-items: center;
`;

const Number = styled.View`
  border:2px solid ${palette.grayscale.white};
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const baseStepTextStyles = css`
  font-family: larsseitbold;
  color: ${palette.grayscale.white};
`;

const StepTitle = styled.Text`
  ${baseStepTextStyles}
  font-size: 16px;
`;

const StepNumber = styled.Text`
  ${baseStepTextStyles}
  font-size: 18px;
`;
