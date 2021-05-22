import React, { useState } from 'react';
import cosmos, { palette } from 'shared/src/cosmos';
import styled, { css } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { H1Dark, ParagraphDark } from 'theme/Typography';
import { StartAudioIcon } from '../icons/StartAudioIcon';
import { AudioParticipantsIcon } from '../icons/AudioParticipantsIcon';
import { useJoinConversation } from 'hooks/useConversations';
import { IConversation, IListener, AUDIO_EVENT, PARTICIPANT_TYPE } from 'shared/src/services/conversation-service';
import { useLiveAudio } from 'context/LiveAudioContext';
import RtcEngine from 'react-native-agora';
import { useGetUser } from 'hooks/useGetUser';
import { ROUTE } from 'lib/constants';
import { getLargestImage } from 'shared/src/utils';
import { Avatar } from 'components/Avatar';
import { useSSE } from '../../sse';

const CHIP_SIZE = 64;

const ConversationPanel = ({ setIsStartingConversation }: { setIsStartingConversation: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const navigation = useNavigation();
  const [currentConversation, setCurrentConversation] = useState<IConversation | null>(null);
  const { mutate: joinConversation } = useJoinConversation();
  const { data: user } = useGetUser();
  const { agoraClient, liveConversations, setLiveConversation } = useLiveAudio();

  const handleJoinConversation = (conversation: IConversation) => {
    setCurrentConversation(conversation);
    joinConversation({
      data: { conversation, userId: user?._id as string },
      agoraClient: agoraClient as RtcEngine,
      participantType: PARTICIPANT_TYPE.LISTENER,
    }, {
      onSuccess: (data: any) => {
        setCurrentConversation(null);
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

  const StartAudioChip = () => (
    <ConversationChip onPress={() => setIsStartingConversation(true)}>
      <StartAudioIcon width={CHIP_SIZE} height={CHIP_SIZE}/>
      <NewTag numberOfLines={1}>New</NewTag>
    </ConversationChip>
  );

  return (
    <Conversations horizontal contentContainerStyle={{ alignItems: 'center' }}>

      <StartAudioChip/>

      {liveConversations?.filter(conversation => conversation?.conversationType === 'live').map((conversation, index) => (conversation._id !== currentConversation?._id) ? (
        <AudioChip conversation={conversation} key={index} onPress={() => handleJoinConversation(conversation)}/>
      ) : (
        <ActivityIndicatorContainer>
          <ActivityIndicator size="small" color={palette.grayscale.black} key={index}/>
        </ActivityIndicatorContainer>
      ))}
    </Conversations>
  );
};

const AudioChip = ({ conversation, onPress }: { conversation?: IConversation, onPress: () => void }) => {
  const host = conversation?.speakers?.find(host => host.isModerator);

  //TODO: Logic for identifying author led conversations

  return (
    <ConversationChip onPress={onPress}>
      {getLargestImage(host?.images) ? (
        <UserImg source={{ uri: getLargestImage(host?.images) }}/>
      ) : (
        <Avatar
          name={host?.name}
          size={CHIP_SIZE}
          fontSize={cosmos.unit * 2.5}/>
      )}

      <AudienceWrapper>
        <AudioParticipantsIcon width={18} height={18}/>
        <Audience>{conversation?.listeners?.length || 0}</Audience>
      </AudienceWrapper>
      {/*{!!authorLed ? (<View style={{ position: 'absolute', top: 2, right: 0, zIndex: 9999 }}>*/}
      {/*<AuthorIcon height={cosmos.unit * 2.5} width={cosmos.unit * 2.5} color={palette.primary.bcBlue}/>*/}
      {/*</View>) : null}*/}
    </ConversationChip>
  );
};
export { ConversationPanel };

const Conversations = styled.ScrollView`
  background-color: ${palette.grayscale.white};
  width: 100%;
  height: ${cosmos.unit * 15}px;
  margin-top: ${cosmos.unit * 6}px;
  padding-left: ${cosmos.unit * 2}px;
`;

const AudienceWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${cosmos.unit / 2 }px;
`;

const chip = css`
  width: ${CHIP_SIZE}px;
  height: ${CHIP_SIZE}px;
  border-radius:  ${cosmos.unit * 4}px;
  background-color: ${palette.grayscale.granite};
  resize-mode: cover;
`;

const UserImg = styled.Image`
  ${chip};
  background-color: ${palette.grayscale.granite};
  resize-mode: cover;
`;

const NewTag = styled(H1Dark)`
  font-size: 12px;
  margin-top: 2px;
`;

const Audience = styled(ParagraphDark)`
  color: ${cosmos.palette.auxillary.charcoal.alt};
  font-size: 12px;
  margin-left: 2px;
`;

const ConversationChip = styled.TouchableOpacity`
  margin-right: ${cosmos.unit * 2}px;
  align-items: center;
`;

const ActivityIndicatorContainer = styled.View`
  margin-right: ${cosmos.unit * 2}px;
  justify-content: center;
  align-items: center;
  width: ${(cosmos.unit * 8)}px;
  height: ${(cosmos.unit * 8)}px;
`;

