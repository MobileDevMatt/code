import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions, FlatList } from 'react-native';
import cosmos, { palette } from 'shared/src/cosmos';
import { useNavigation } from '@react-navigation/native';
import { AudioConversationCard } from 'components/audio/AudioConversationCard';
import { CustomizableButton } from 'theme/Button';
import { IConversation, IListener, AUDIO_EVENT, PARTICIPANT_TYPE } from 'shared/src/services/conversation-service';
import { AudioSpeakerIcon } from 'components/icons/AudioSpeakerIcon';
import RtcEngine from 'react-native-agora';
import { ROUTE } from 'lib/constants';
import { useLiveAudio } from 'context/LiveAudioContext';
import { useGetUser } from 'hooks/useGetUser';
import { useJoinConversation } from 'hooks/useConversations';
import Loading from 'components/Loading';
import { ModalSheet } from 'components/ModalSheet';
import { AudioConversationSteps } from 'components/audio/AudioConversationSteps';
import { BCContainer } from 'components/containers/BCContainer';

const screenWidth = Math.round(Dimensions.get('window').width);

export const Conversations = () => {
  const navigation = useNavigation();

  const { agoraClient, setLiveConversation,liveConversations } = useLiveAudio();
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
            book: conversation.bookRef,
            agoraChannelName: data.agoraChannelName,
          },
        });
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <BCContainer
      style={{ flex: 1, backgroundColor: palette.primary.linen }}
      userImage={user?.images}
      userFullName={user?.name}>
      {!!isJoiningConversation ? <Loading/> : null}

      <PageTitleContainer>
        <PageTitle numberOfLines={2}>Happening now</PageTitle>
      </PageTitleContainer>
      <ButtonContainer>
        <CustomizableButton
          style={{ alignSelf: 'flex-start' }}
          textStyle={{ marginHorizontal: cosmos.unit }}
          title={'New conversation'}
          icon={<AudioSpeakerIcon width={22} height={22} color={palette.grayscale.white}/>}
          onPress={() => setIsStartingConversation(true)}
        />
      </ButtonContainer>

      <FlatList
        style={{ width: screenWidth }}
        contentContainerStyle={{ paddingBottom: 100 }}
        data={liveConversations}
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
            setIsStartingConversation={setIsStartingConversation}/>
        }/>
    </BCContainer>
  );
};


const ButtonContainer = styled.View`
  margin-left: ${cosmos.unit * 2}px;
  margin-vertical: ${cosmos.unit * 3}px;
`;

const PageTitleContainer = styled.View`
  height: ${cosmos.unit * 4}px;
  padding-left: ${cosmos.unit * 2}px;
  background-color: ${palette.grayscale.black};
`;

const PageTitle = styled.Text`
  font-family: larsseitbold;
  font-size: ${cosmos.unit * 2}px;
  line-height: ${cosmos.unit * 2}px;
  color: ${palette.grayscale.white};
  text-align: left;
`;
