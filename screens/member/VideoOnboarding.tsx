import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { palette } from 'shared/src/cosmos';
import { SectionTitleTextCenter, ParagraphDarkTextCenter, ParagraphDark, UnderlinedText } from '../../theme/Typography';
import { Button } from '../../theme/Button';
import { ROUTE } from '../../lib/constants';
import { IPrompt } from 'shared/src/services/book-service';
import { BCContainer } from 'components/containers/BCContainer';

const VideoOnboarding = (): JSX.Element => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();

  const { prompt } = route.params as { prompt: IPrompt };
  const recordingTodos = [
    'Check your surroundings and setting.',
    'Position yourself where you’re comfortable and the phone is stable.',
    'Record with natural light and a neutral background.',
    'Check your sound and look straight into the camera.',
  ];

  const pickVideo = async () => {
    navigation.navigate(ROUTE.UPLOAD_VIDEO, { prompt });
  };

  return (
    <BCContainer style={{flex: 1}} showBackButton={true} hideProfileImage={true}>
      <Container>
        <Sheet>
          <TitleContainer>
            <SectionTitleTextCenter>Lights, camera, action</SectionTitleTextCenter>
          </TitleContainer>
          <ParagraphDarkTextCenter>Please add a 1-3 minute video response.</ParagraphDarkTextCenter>
          <SecondaryTitleContainer>
            <SecondaryTitle>
              Already recorded a video?
              <TouchableOpacity onPress={pickVideo}>
                <UnderlinedText>
                  <BlueText>Upload</BlueText>
                </UnderlinedText>
              </TouchableOpacity>
            </SecondaryTitle>
          </SecondaryTitleContainer>
          {recordingTodos.map((todo, index) => (
            <ParagraphContainer key={index}>
              <ParagraphDark style={{ width: '100%' }}>{`\u2022 ${todo}`}</ParagraphDark>
            </ParagraphContainer>
          ))}
          <FaqsText>Check out our <UnderlinedText>content creation FAQs</UnderlinedText> for help.</FaqsText>
        </Sheet>
      </Container>
      <Button
        title="Record now"
        style={{ width: '100%', position: 'absolute', bottom: Math.max(insets.bottom, 16) }}
        onPress={() => {
          navigation.navigate(ROUTE.RECORD_VIDEO, { prompt });
        }}
      />
    </BCContainer>
  );
};

export default VideoOnboarding;

const Sheet = styled.View`
  align-items: center;
  width: 100%;
  padding-horizontal:16px;
  padding-vertical: 32px;
  margin-top: 24px;
  border-radius: 2px;
  background-color: ${palette.grayscale.white};
`;

const Container = styled.View`
  padding-horizontal:18px;
  flex:1;
  width:100%;
  background-color: ${palette.grayscale.black}
`;

const ParagraphContainer = styled.View`
  margin-bottom: 8px;
  width: 100%;
`;

const TitleContainer = styled.View`
  margin-bottom: 16px;
`;

const BlueText = styled.Text`
  color: ${palette.primary.bcBlue}
`;

const SecondaryTitleContainer = styled.View`
  margin-top: 8px;
  margin-bottom: 24px;
`;

const SecondaryTitle = styled.Text`
  font-family: larsseitbold;
  font-size: 15px;
  margin-top: 5px;
  color: ${palette.grayscale.black};
  margin-bottom: 5px;
`;

const FaqsText = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  width: 100%;
  text-align: center;
  margin-top: 16px;
  color: ${palette.grayscale.granite};
`;
