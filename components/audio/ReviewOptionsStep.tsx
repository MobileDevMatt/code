import React from 'react';
import cosmos, { palette } from 'shared/src/cosmos';
import { useQueryClient } from 'react-query';
import styled from 'styled-components/native';
import { Switch } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { H1Dark, ParagraphDark } from 'theme/Typography';
import { CustomizableButton } from 'theme/Button';
import { getLargestImage } from 'shared/src/utils';
import { cacheKey} from 'hooks/cacheStateKey';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { IClubDetail } from 'shared/src/services/club-service';
import { ActivityIndicator } from 'react-native';
import { AUDIENCE } from 'shared/src/services/conversation-service';
import { IBook } from 'shared/src/services/book-service';
import { ParticipantPanelSpeakers } from './ParticipantPanelSpeakers';

interface IProps {
  selectedPrivacyOption: { name: string, description: string,value: AUDIENCE } | undefined;
  selectedClubBook?: IBook | undefined;
  selectedClub?: IClubDetail | undefined;
  setSelectedClubBook: React.Dispatch<React.SetStateAction<IBook | undefined>>;
  setIsRecordSwitchOn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsScheduleSwitchOn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTopicModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  goToNextStep: () => void;
  goToFirststep: () => void;
  isRecordSwitchOn: boolean;
  isGoingLive: boolean;
  topic: string;
  isScheduleSwitchOn: boolean;
}

const ReviewOptionsStep = (
  { selectedPrivacyOption,
    goToNextStep,
    setSelectedClubBook,
    selectedClubBook,
    selectedClub,
    isRecordSwitchOn,
    setIsRecordSwitchOn,
    isScheduleSwitchOn,
    setIsScheduleSwitchOn,
    goToFirststep,
    setIsTopicModalVisible,
    isGoingLive,
    topic
  }: IProps) => {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(cacheKey.myUser) as IAPI_User_Full;

  const handleFormSubmit = () => {
    goToNextStep();
  };

  const onToggleRecordSwitch = () => {
    setIsRecordSwitchOn(!isRecordSwitchOn);
  };

  const onToggleScheduleSwitch = () => {
    setIsScheduleSwitchOn(!isScheduleSwitchOn);
  };

  return (
    <>
      <Wrapper contentContainerStyle={{ paddingBottom: cosmos.unit * 6 }} alwaysBounceVertical={false}  bounces={false}>
        <TitleContainer>
          <PageTitle>Conversation details</PageTitle>
          <BookCoverImage source={{ uri: getLargestImage(selectedClubBook?.coverImage) }}/>
        </TitleContainer>
        <CardsWrapper>

          <SettingsOptionCard onPress={goToFirststep}>
            <Feather name="eye" size={24} color={palette.grayscale.black} style={{ marginRight: 4 }}/>
            <H1Dark>Privacy</H1Dark>
            <OptionsDescription>{selectedPrivacyOption?.name === 'Club' ? selectedClub?.name : selectedPrivacyOption?.name}</OptionsDescription>
            <Feather name="chevron-right" size={24} color={palette.grayscale.black}/>
          </SettingsOptionCard>

          <SettingsOptionCard onPress={() => {setIsTopicModalVisible(true)}}>
            <Feather name="info" size={24} color={palette.grayscale.black} style={{ marginRight: 4 }}/>
            <H1Dark>Topic</H1Dark>
            <OptionsDescription numberOfLines={1} style={{color: palette.grayscale.black}}>{topic}</OptionsDescription>
            <Feather name="chevron-right" size={24} color={palette.grayscale.black}/>
          </SettingsOptionCard>

          <SettingsOptionCard>
            <MaterialCommunityIcons name="record-circle-outline" size={24} color="black" style={{ marginRight: 4 }}/>
            <AdminSettingsTitle>Record</AdminSettingsTitle>
            <Switch value={isRecordSwitchOn} onValueChange={onToggleRecordSwitch} color={palette.primary.bcBlue}/>
          </SettingsOptionCard>

          <SettingsOptionCard>
            <MaterialCommunityIcons name="calendar-blank-outline" size={24} color="black" style={{ marginRight: 4 }}/>
            <AdminSettingsTitle>Schedule</AdminSettingsTitle>
            <Switch value={isScheduleSwitchOn} onValueChange={onToggleScheduleSwitch} color={palette.primary.bcBlue}/>
          </SettingsOptionCard>

          <ParticipantPanelSpeakers participants={[user]}/>
        </CardsWrapper>


      </Wrapper>
      <ButtonContainer style={{ marginBottom: Math.max(insets.bottom, 16)}}>
        {!!isGoingLive? (<ActivityIndicator size='small' color={palette.grayscale.white}/>): (
          <CustomizableButton
            title={'Go LIVE'}
            textStyle={{color:palette.grayscale.white}}
            style={{ width: '100%', backgroundColor: palette.auxillary.crimson.alt, height: 42, borderRadius: 21 }}
            // disabled={selectedClubBook === null}
            onPress={handleFormSubmit}
          />
        )}

      </ButtonContainer>
    </>
  );
};

export { ReviewOptionsStep };

const CardsWrapper = styled.View`
  margin-top: ${cosmos.unit * 2}px;
  padding-horizontal: ${cosmos.unit * 2}px;
`;

const PageTitle = styled(H1Dark)`
  font-size: 18px;
`;

const AdminSettingsTitle = styled(H1Dark)`
  flex:1;
`;

const BookCoverImage = styled.Image`
  width: 44px;
  height: 66px;
  resize-mode: cover;
  align-self: center;
`;

const SettingsOptionCard = styled.TouchableOpacity`
  width: 100%;
  height: ${cosmos.unit * 7}px;
  border-radius: ${cosmos.unit}px;
  background-color: ${palette.grayscale.white};
  padding-horizontal: ${cosmos.unit * 2}px;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${cosmos.unit * 2}px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${palette.grayscale.white};
  justify-content: space-between;
  padding-horizontal:${cosmos.unit * 2}px;
  padding-bottom:  ${cosmos.unit * 2}px;
`;

const Wrapper = styled.ScrollView`
  width: 100%;
  background-color: ${palette.primary.linen};
  padding-bottom: ${cosmos.unit * 8}px;
`;

const ButtonContainer = styled.View`
  padding-vertical: ${cosmos.unit * 2}px;
  padding-bottom: ${cosmos.unit * 6}px;
  bottom: -35px;
  background-color: ${palette.grayscale.black};
  padding-horizontal:${cosmos.unit * 2}px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`;

const OptionsDescription = styled(ParagraphDark)`
  margin-left: ${cosmos.unit * 3}px;
  margin-right: ${cosmos.unit * 1.5}px;
  flex:1;
  text-align: right;
`;

