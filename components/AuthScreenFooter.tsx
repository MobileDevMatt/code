import React from 'react';
import styled from 'styled-components/native';
import { TouchableWithoutFeedback } from 'react-native';
import { SmallFooterText } from '../theme/Typography';
import * as WebBrowser from 'expo-web-browser';


const AuthScreenFooter = () => {

  const _handlePressPrivacyPolicyButtonAsync = async () => {
    await WebBrowser.openBrowserAsync('https://www.jamesbook.com/privacy-policy');
  };

  const _handleTermsButtonAsync = async () => {
    await WebBrowser.openBrowserAsync('https://www.jamesbook.com/terms-of-service');
  };
  return (
    <FooterContainer>
      <SmallFooterText>By signing into jamesbook, you are agreeing to our <TouchableWithoutFeedback onPress={_handlePressPrivacyPolicyButtonAsync}><ButtonText>Privacy Policy</ButtonText></TouchableWithoutFeedback> and <TouchableWithoutFeedback onPress={_handleTermsButtonAsync}><ButtonText>Terms of Service</ButtonText></TouchableWithoutFeedback>.</SmallFooterText>
    </FooterContainer>
  );
};

export default AuthScreenFooter;

const FooterContainer = styled.View`
  align-self: center;
  justify-content: flex-end;
  flex:1;
  padding-bottom: 20px;
  width: 303px;
  text-align: center;
`;

const ButtonText = styled(SmallFooterText)`
    text-decoration-line: underline;
    margin-bottom: 0;
`;