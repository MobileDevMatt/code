import React, { useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import cosmos, { palette } from 'shared/src/cosmos';
import { useNavigation } from '@react-navigation/native';
import { AudioConversationCard } from 'components/audio/AudioConversationCard';
import { IConversation, IListener, AUDIO_EVENT, PARTICIPANT_TYPE } from 'shared/src/services/conversation-service';
import RtcEngine from 'react-native-agora';
import { ROUTE } from 'lib/constants';
import { useLiveAudio } from 'context/LiveAudioContext';
import { useGetUser } from 'hooks/useGetUser';
import { useJoinConversation } from 'hooks/useConversations';
import Loading from 'components/Loading';
import { BCContainer } from 'components/containers/BCContainer';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { ClubTabSubNavigator } from '../TabsSubNavigation';
import { IClubDetail } from 'shared/src/services/club-service';
import { ModalSheet } from '../ModalSheet';
import { AudioConversationSteps } from '../audio/AudioConversationSteps';
import { CustomizableButton } from 'theme/Button';
import { AudioSpeakerIcon } from '../icons/AudioSpeakerIcon';
import styled from 'styled-components/native';

const screenWidth = Math.round(Dimensions.get('window').width);

interface IProps {
  club?: IClubDetail;
  currentUserData?: IAPI_User_Full;
}

export const ClubConversations = ({ club, currentUserData }: IProps) => {
  const navigation = useNavigation();
  const { agoraClient, liveConversations, setLiveConversation } = useLiveAudio();
  const { data: user } = useGetUser();
  const { mutate: joinConversation, isLoading: isJoiningConversation } = useJoinConversation();
  const [isStartingConversation, setIsStartingConversation] = useState(false);

  const handleUserJoinConversation = (conversation: IConversation) => {
    joinConversation({
      data: { conversation, userId: user?._id as string },
      agoraClient: agoraClient as RtcEngine,
      participantType: PARTICIPANT_TYPE.LISTENER,
    }, {
      onSuccess: (data: any) => {
        let currentConversation = { ...conversation };
        let currentUser = { ...user, userRef: user?._id } as IListener;
        currentConversation.listeners = [currentUser];
        setLiveConversation(currentConversation);
        navigation.navigate(ROUTE.AUDIO, {
          screen: ROUTE.LIVE_AUDIO_CONVERSATION,
          params: {
            book: conversation.book,
            agoraChannelName: data.agoraChannelName,
          },
        });
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  const clubConversations = liveConversations?.filter(conversation => conversation?.club?.clubRef === club?._id);
  return (
    <BCContainer
      style={{ flex: 1, backgroundColor: palette.primary.linen }}
      pageTitle={club?.name} showBackButton={true} userImage={currentUserData?.images}
      userFullName={currentUserData?.name}>
      <ClubTabSubNavigator routeName={ROUTE.BOOK_CLUB_CONVERSATIONS}/>
      {!!isJoiningConversation ? <Loading/> : null}

      <NewConversationButtonContainer>
        <CustomizableButton
          style={{ alignSelf: 'flex-start' }}
          textStyle={{ marginHorizontal: cosmos.unit }}
          title={'New conversation'}
          icon={<AudioSpeakerIcon width={22} height={22} color={palette.grayscale.white}/>}
          onPress={() => setIsStartingConversation(true)}
        />
      </NewConversationButtonContainer>
      <FlatList
        style={{ width: screenWidth }}
        contentContainerStyle={{ paddingBottom: 100 }}
        data={clubConversations}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item?._id!}
        renderItem={({ item: conversation, index }) =>
          <AudioConversationCard
            key={index}
            conversation={conversation}
            onPress={() => handleUserJoinConversation(conversation)}/>
        }
      />
      <ModalSheet
        isVisible={isStartingConversation}
        setIsVisible={setIsStartingConversation}
        onClose={() => setIsStartingConversation(false)}
        onOpen={() => setIsStartingConversation(true)}
        content={
          <AudioConversationSteps
            setIsStartingConversation={setIsStartingConversation}
            club={club} />
        }/>
    </BCContainer>
  );
};

const NewConversationButtonContainer = styled.View`
  margin-left: ${cosmos.unit * 2}px;
  margin-vertical: ${cosmos.unit * 3}px;
`;
