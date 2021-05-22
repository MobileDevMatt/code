import React, { useEffect, useState, useCallback } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { useNavigation, useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import cosmos, { palette } from 'shared/src/cosmos';

import { H1, H1Dark } from 'theme/Typography';
import { ParticipantPanelListeners } from 'components/audio/ParticipantPanelListeners';
import { ParticipantPanelSpeakers } from 'components/audio/ParticipantPanelSpeakers';
import { IBook } from 'shared/src/services/book-service';
import { getLargestImage } from 'shared/src/utils';
import { FadeInView } from 'components/AnimatedContainers/FadeInView';
import { RecordingIndicator } from 'components/audio/RecordingIndicator';
import { useGenerateToken, useLeaveConversation, useRequestToSpeak } from 'hooks/useConversations';
import { useChangeParticipantType } from 'hooks/useConversations';
import { LIVE_AUDIO_ENDPOINTS, useSSE } from '../../sse';
import {
  PARTICIPANT_TYPE,
  IListener,
  ISpeaker,
  AUDIO_EVENT,
  INewParticipantRoleResponse, ConversationService,
} from 'shared/src/services/conversation-service';
import Loading from 'components/Loading';
import { AGORA_EVENT_CHANNEL, AgoraService } from 'services/agora-service';
import { useLiveAudio } from 'context/LiveAudioContext';
import { useGetUser } from 'hooks/useGetUser';
import useAsyncEffect from 'use-async-effect';
import { BCContainer } from 'components/containers/BCContainer';
import { UserService } from 'shared/src/services/user-service';

interface IRouteParams {
  book: IBook;
  isRecording?: boolean;
  agoraChannelName: string;
}

const LiveAudio = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { agoraClient, liveConversation, setLiveConversation } = useLiveAudio();
  const [openMicrophone, setOpenMicrophone] = useState<boolean>(false);
  const { mutate: changeParticipantType } = useChangeParticipantType();
  const { book, isRecording = false, agoraChannelName } = route.params as IRouteParams;
  const { mutate: requestToSpeak, isLoading: isRequestingToSpeak } = useRequestToSpeak();

  const listeners = liveConversation?.listeners;
  const speakers = liveConversation?.speakers;

  const { data: user } = useGetUser();
  const isConversationCreator = Boolean(liveConversation?.speakers?.find((speaker) => speaker.isModerator && speaker.userRef === user?._id));


  const { mutateAsync: leaveConversation, isLoading: isLeavingConversation } = useLeaveConversation();
  const { mutate: generateToken } = useGenerateToken();

  const isConversationSpeaker = Boolean(speakers?.find((speaker) => {
    return speaker.userRef === user?._id;
  }));

  const isListener = Boolean(listeners?.find((listener) => {
    return listener.userRef === user?._id;
  }));

  const insets = useSafeAreaInsets();

  //================================ PROMOTE/DEMOTE SETUP on mobile ====================================//

  const addSpeaker = (user, isModerator = false) => {
    const isSpeakerInConversationAlready = Boolean(liveConversation?.speakers?.find((speaker) => {
      return speaker.userRef === user._id;
    }));
    if (isSpeakerInConversationAlready) return;

    const speaker = {
      _id: user._id,
      userRef: user._id,
      name: user.name,
      images: user?.images || null,
      isModerator: isModerator,
      prevLeave: [],
      nextJoin: [new Date()],
      ...user,
    } as ISpeaker;

    liveConversation?.speakers?.push(speaker);
    setLiveConversation({ ...liveConversation });
  };

  const makeSpeakerModerator = (user) => {
    let updatedConversation = liveConversation;
    updatedConversation.speakers = liveConversation?.speakers?.map((speaker) => {
      if (speaker.userRef === user._id) {
        return { ...speaker, isModerator: true };
      }
      return { ...speaker };
    });
    setLiveConversation({ ...updatedConversation });
  };

  const removeSpeaker = (userId) => {
    let updatedConversation = liveConversation;
    updatedConversation.speakers = liveConversation.speakers.filter((speaker) => speaker.userRef !== userId);
    setLiveConversation({ ...updatedConversation });
  };

  const addListener = (user, pushToTop = false) => {
    const isListenerInConversationAlready = Boolean(liveConversation?.listeners?.find((listener) => {
      return listener.userRef === user._id;
    }));
    if (isListenerInConversationAlready) return;

    const listener = {
      _id: user._id,
      userRef: user._id,
      prevLeave: [],
      nextJoin: [new Date()],
      ...user,
    } as IListener;

    if (pushToTop) {
      liveConversation?.listeners?.unshift(listener);
    } else {
      liveConversation?.listeners?.push(listener);
    }
    setLiveConversation({ ...liveConversation });
  };

  const removeListener = (userId) => {
    let updatedConversation = liveConversation;
    updatedConversation.listeners = liveConversation?.listeners?.filter((listener) => listener.userRef !== userId);
    setLiveConversation({ ...updatedConversation });
  };

  const handleParticipantRoleChange = (prevRole: PARTICIPANT_TYPE, newRole: PARTICIPANT_TYPE) => {
    if (prevRole === PARTICIPANT_TYPE.LISTENER) {
      addSpeaker(user);
      removeListener(user?._id);
    }
    if (newRole === PARTICIPANT_TYPE.MODERATOR) {
      makeSpeakerModerator(user);
    }
    if (newRole === PARTICIPANT_TYPE.LISTENER) {
      addListener(user);
      removeSpeaker(user?._id);
    }
  };

  const handlePromoteToModerator = (eventId: string, participantRoleUpdate: INewParticipantRoleResponse) => {
    const participantIsAlreadyModerator = Boolean(liveConversation.speakers.find((speaker) => {
      return (speaker.isModerator && speaker.userRef === user?._id);
    }));
    if (participantIsAlreadyModerator) return;

    changeParticipantType({
      currentConversationId: liveConversation?._id,
      agoraToken: participantRoleUpdate.token,
      userId: participantRoleUpdate.agoraUserId,
      channelName: liveConversation?._id,
      agoraClient: agoraClient,
      eventId: eventId,
      newParticipantType: PARTICIPANT_TYPE.MODERATOR,
    }, {
      onSuccess: (data) => {
        handleParticipantRoleChange(data.prevRole, data.newRole);
      },
    });
  };

  const handlePromoteToSpeaker = (eventId: string, participantRoleUpdate: INewParticipantRoleResponse) => {
    const participantIsAlreadySpeaker = Boolean(liveConversation.speakers.find((speaker) => {
      return speaker.userRef === user?._id;
    }));
    if (participantIsAlreadySpeaker) return;

    changeParticipantType({
      currentConversationId: liveConversation?._id,
      agoraToken: participantRoleUpdate.token,
      userId: participantRoleUpdate.agoraUserId,
      agoraClient: agoraClient,
      channelName: liveConversation?._id,
      eventId: eventId,
      newParticipantType: PARTICIPANT_TYPE.SPEAKER,
    }, {
      onSuccess: (data) => {
        console.log('succeess');
        handleParticipantRoleChange(data.prevRole, data.newRole);
      },
    });
  };

  const handleDemoteToListener = (eventId: string, participantRoleUpdate: INewParticipantRoleResponse) => {
    const participantIsAlreadyListener = Boolean(liveConversation.listeners.find((listener) => {
      return listener.userRef === user?._id;
    }));
    if (participantIsAlreadyListener) return;

    changeParticipantType({
      currentConversationId: liveConversation._id,
      agoraToken: participantRoleUpdate.token,
      userId: participantRoleUpdate.agoraUserId,
      channelName: liveConversation._id,
      agoraClient: agoraClient,
      eventId: eventId,
      newParticipantType: PARTICIPANT_TYPE.LISTENER,
    }, {
      onSuccess: (data) => {
        handleParticipantRoleChange(data.prevRole, data.newRole);
      },
      onError: (error) => {
      },
    });
  };

  const handleNewParticipantRoleData = async (event: MessageEvent) => {
    const participantRoleUpdate = JSON.parse(event.data);

    const isRoleChangeForMyUser = user?._id === participantRoleUpdate.participantUserRef;
    if (isRoleChangeForMyUser === false) return;

    const isEventForCurrentConversation = participantRoleUpdate.conversationId === liveConversation?._id;
    if (!isEventForCurrentConversation) return;

    switch (event.type) {
      case AUDIO_EVENT.USER_PROMOTED_TO_MODERATOR:
        handlePromoteToModerator(event.lastEventId, participantRoleUpdate);
        break;
      case AUDIO_EVENT.USER_PROMOTED_TO_SPEAKER:
        handlePromoteToSpeaker(event.lastEventId, participantRoleUpdate);
        break;
      case AUDIO_EVENT.USER_DEMOTED_TO_LISTENER:
        handleDemoteToListener(event.lastEventId, participantRoleUpdate);
        break;
    }
  };

  const handleUserRequestToSpeak = async (event: MessageEvent) => {
    const requestToSpeakData = JSON.parse(event.data);
    const isEventForCurrentConversation = requestToSpeakData.conversationId === liveConversation?._id;
    if (!isEventForCurrentConversation) return;

    //show emoji hand wave, and clear this event after 30 seconds;
    const requesterId = requestToSpeakData?.requesterUserId?._id;
    const jamesbookUser = await UserService.getUserProfile(requesterId);

    const listenerHandRaised = {
      ...jamesbookUser,
      isAskingToSpeak: true,
    };
    removeListener(requesterId);
    addListener(listenerHandRaised, true);
    setTimeout(() => {
      removeListener(requesterId);
      addListener(jamesbookUser);
      // We guessed on 30 seconds being enough time to dismiss the request to speak (Hand wave)
      ConversationService.clearInConvoEvent(LIVE_AUDIO_ENDPOINTS.CLEAR_IN_CONVO_EVENT, event.lastEventId);
    }, 30000);
  };

  useSSE(AUDIO_EVENT.USER_PROMOTED_TO_SPEAKER, handleNewParticipantRoleData);
  useSSE(AUDIO_EVENT.USER_PROMOTED_TO_MODERATOR, handleNewParticipantRoleData);
  useSSE(AUDIO_EVENT.USER_DEMOTED_TO_LISTENER, handleNewParticipantRoleData);
  useSSE(AUDIO_EVENT.USER_REQUESTED_TO_SPEAK, handleUserRequestToSpeak);

  //================================ PROMOTE/DEMOTE SETUP on mobile ====================================//


  const handleUserJoined = async ({ uid }) => {
    const userData = await agoraClient.getUserInfoByUid(uid);
    const [remoteAgoraUserUserRef, userType] = AgoraService.getAgoraUserRefAndParticipantType(userData.userAccount);
    const jamesbookUser = await UserService.getUserProfile(remoteAgoraUserUserRef);

    switch (userType) {
      case PARTICIPANT_TYPE.LISTENER:
        addListener(jamesbookUser);
        break;
      case PARTICIPANT_TYPE.SPEAKER:
        addSpeaker(jamesbookUser);
        break;
      case PARTICIPANT_TYPE.MODERATOR:
        addSpeaker(jamesbookUser, true);
        break;
    }
  };

  const handleUserLeft = async ({ uid }) => {
    const userData = await agoraClient.getUserInfoByUid(uid);
    const [userId, participantType] = AgoraService.getAgoraUserRefAndParticipantType(userData.userAccount);

    let isLastModerator = false;
    const moderatorCount = liveConversation?.speakers?.filter((s: ISpeaker) => s.isModerator)?.length;
    if (moderatorCount <= 1) {
      isLastModerator = true;
    }

    switch (participantType) {
      case PARTICIPANT_TYPE.MODERATOR:
        if (isLastModerator) {
          await AgoraService.leaveConversation(agoraClient);
          setLiveConversation(null);
          navigation.goBack();
        } else {
          removeSpeaker(userId);
        }
        break;
      case PARTICIPANT_TYPE.LISTENER:
        removeListener(userId);
        break;
      case (PARTICIPANT_TYPE.SPEAKER):
        removeSpeaker(userId);
        break;
    }
  };

  const handleRemoteAudioStateChange = async ({ uid, state }) => {
    const userData = await agoraClient.getUserInfoByUid(uid);
    const [userRef, userType] = AgoraService.getAgoraUserRefAndParticipantType(userData.userAccount);

    const uniqueUsers = Array.from(new Set(liveConversation?.speakers?.map(a => a.userRef)))
      .map(id => {
        return liveConversation?.speakers?.find(a => a.userRef === id);
      });
    let updatedSpeakers = uniqueUsers.map(speaker => {
      return { ...speaker, isMuted: speaker?.userRef === userRef && state === 0 };
    });
    setLiveConversation({ ...liveConversation, speakers: updatedSpeakers });
  };

  const initializeListeners = async () => {
    EventRegister.addEventListener(AGORA_EVENT_CHANNEL.TOKEN_WILL_EXPIRE, handleTokenWillExpire);
    EventRegister.addEventListener(AGORA_EVENT_CHANNEL.TOKEN_DID_EXPIRE, handleTokenDidExpire);
    EventRegister.addEventListener(AGORA_EVENT_CHANNEL.REMOTE_AUDIO_STATE_CHANGE, handleRemoteAudioStateChange);
    EventRegister.addEventListener(AGORA_EVENT_CHANNEL.USER_JOINED_CONVERSATION, handleUserJoined);
    EventRegister.addEventListener(AGORA_EVENT_CHANNEL.USER_LEFT_CONVERSATION, handleUserLeft);
  };

  const updateLocalAudioState = () => {
    liveConversation.speakers = liveConversation?.speakers.map(speaker => {
      if (speaker?.userRef === user?._id) {
        return { ...speaker, isMuted: !openMicrophone };
      } else {
        return speaker;
      }
    });
    setLiveConversation({ ...liveConversation });
  };

  useEffect(() => {
    updateLocalAudioState();
  }, [openMicrophone, agoraClient]);

  useAsyncEffect(initializeListeners, () => {
    EventRegister.removeAllListeners();
    agoraClient.removeAllListeners();
  }, []);


  const handleTokenWillExpire = (event: any) => {
    generateToken({
      isHost: isConversationCreator,
      agoraClient: agoraClient!,
      channelName: agoraChannelName as string,
    }, {
      onSuccess: (data: any) => {
        alert('succesfully renewed token');
      },
      onError: (error) => {
        alert(error);
      },
    });
  };

  const handleTokenDidExpire = (event: any) => {
    alert('token expired');
  };

  const leaveCurrentConversation = async () => {
    let participantType = PARTICIPANT_TYPE.LISTENER;
    if (isConversationSpeaker) {
      participantType = PARTICIPANT_TYPE.SPEAKER;
      if (isConversationCreator) {
        participantType = PARTICIPANT_TYPE.MODERATOR;
      }
    }

    let isLastModerator = false;
    const moderatorCount = speakers?.filter((s: ISpeaker) => !s.isModerator)?.length;
    if (moderatorCount <= 1) {
      isLastModerator = true;
    }

    leaveConversation({
        conversationId: liveConversation._id,
        participantType: participantType,
        isLastModerator: isLastModerator,
        agoraClient: agoraClient!,
      },
      {
        onSuccess: () => {
          setLiveConversation(null);
          navigation.goBack();
        },
        onError: (error) => {
          setLiveConversation(null);
          navigation.goBack();
        },
      });

  };

  const MicIsOff = () => {
    return (
      <SpeakButton onPress={() => {
        AgoraService.speak(agoraClient!);
        setOpenMicrophone(true);
      }}>
        <Feather name='mic-off' size={cosmos.unit * 3} color={palette.grayscale.black}/>
        <H1Dark style={{ marginLeft: cosmos.unit }}>Mic is off</H1Dark>
      </SpeakButton>
    );
  };

  const MicIsOn = () => {
    return (
      <SpeakButton onPress={() => {
        AgoraService.mute(agoraClient!);
        setOpenMicrophone(false);
      }}>
        <Feather name='mic' size={cosmos.unit * 3} color={palette.grayscale.black}/>
        <H1Dark style={{ marginLeft: cosmos.unit }}>Speaking</H1Dark>
      </SpeakButton>
    );
  };

  const AskToSpeak = () => {
    return (
      <SpeakButton onPress={() => {
        requestToSpeak(liveConversation?._id!);
      }}>
        <H1Dark style={{ marginLeft: cosmos.unit }}>Ask to speak</H1Dark>
      </SpeakButton>
    );
  };

  return (
    <BCContainer
      style={{ flex: 1 }}
      pageTitle={'Live Conversation'}
      showBackButton={false}
      userImage={user?.images}
      userFullName={user?.name}>
      {(isLeavingConversation || isRequestingToSpeak) ? (<Loading/>) : (
        <Container>
          <LiveAudioWrapper contentStyle={{
            backgroundColor: palette.primary.linen,
          }}>
            <ConversationTitleContainer>
              <View style={{ flex: 1 }}>
                <Title numberOfLines={1}>{liveConversation?.title || book?.title}</Title>
                {!!isRecording ? (<RecordingIndicator/>) : null}
              </View>
              {book?.coverImage ? (<ConversationImage source={{ uri: getLargestImage(book?.coverImage) }}/>) : null}
            </ConversationTitleContainer>

            <ParticipantContainer>
              <ParticipantPanelSpeakers participants={speakers}/>
              <ParticipantPanelListeners participants={listeners || []}/>
            </ParticipantContainer>


          </LiveAudioWrapper>
          <Footer style={{ paddingBottom: Math.max(insets.bottom, 16), paddingTop: cosmos.unit * 2 }}>
            <LeaveButton
              onPress={() => {
                leaveCurrentConversation();
              }}
            >
              <Ionicons name={`exit-outline`} size={cosmos.unit * 3} color={palette.grayscale.white}/>
              <H1 style={{ marginLeft: cosmos.unit }}>Leave</H1>
            </LeaveButton>

            {!!isListener ? <AskToSpeak/> : (
              <>
                {openMicrophone ? <MicIsOn/> : <MicIsOff/>}
              </>
            )}
          </Footer>
        </Container>
      )}
    </BCContainer>

  );
};

export { LiveAudio } ;

const Container = styled.View`
  position: relative;
  height: 100%;
  background-color: transparent;
  justify-content: flex-end;
  padding-bottom: ${cosmos.unit * 9}px;
  flex:1;
`;

const LiveAudioWrapper = styled.ScrollView`
  background-color: ${palette.primary.linen};
`;

const LeaveButton = styled.TouchableOpacity`
  width: 100px;
  background-color: rgba(255, 255, 255, 0.1);
  height: 34px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 17px;
`;

const SpeakButton = styled.TouchableOpacity`
  width: 124px;
  background-color: ${palette.grayscale.white};
  height: 34px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 17px;
`;

const CardTopSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${cosmos.unit * 2}px;
`;

const SpeakerTitle = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Footer = styled.View`
  width: 100%;
  flex-direction: row;
  padding-horizontal: ${cosmos.unit * 2}px;
  justify-content: space-between;
  align-items: center;
  background-color: ${palette.grayscale.black};
  position: absolute;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const AddButton = styled(H1Dark)`
  color: ${palette.primary.bcBlue}
`;

const ConversationImage = styled.Image`
  width: ${cosmos.unit * 5}px;
  height: ${cosmos.unit * 8}px;
  border-radius: 2px;
  background-color: ${palette.grayscale.granite};
`;

const ParticipantCard = styled(FadeInView)`
  width: 100%;
  padding: ${cosmos.unit * 2}px;
  border-radius: ${cosmos.unit}px;
  margin-bottom: ${cosmos.unit * 2}px;
  background-color: ${palette.grayscale.white};
`;

const ConversationTitleContainer = styled.View`
  height: 98px;
  width: 100%;
  padding-horizontal:${cosmos.unit * 2}px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  background-color: ${palette.grayscale.white};
`;

const RecordingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const RecordingIcon = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${palette.auxillary.danger.main};
`;
const Title = styled(H1Dark)`
  font-size: 18px;
`;
const ParticipantContainer = styled.View`
  padding-horizontal: ${cosmos.unit * 2}px;
  margin-top: ${cosmos.unit * 3}px;
  width: 100%;
`;
const RecordingText = styled.Text`
  font-family: larsseit;
  font-size: 12px;
  line-height: 14px;
  margin-left: 4px;
  color: ${palette.auxillary.danger.main};
`;

const Participants = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`;
