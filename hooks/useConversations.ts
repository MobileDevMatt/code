import { useMutation, useQuery } from 'react-query';
import {
  ConversationService,
  AUDIENCE,
  IConversation,
  IAudio,
  PARTICIPANT_TYPE,
} from 'shared/src/services/conversation-service';
import { AgoraService } from '../services/agora-service';
import RtcEngine from 'react-native-agora';
import { cacheKey } from './cacheStateKey';
import { useLiveAudio } from 'context/LiveAudioContext';
import { LIVE_AUDIO_ENDPOINTS } from '../sse';


//todo - context:
//Discover: no params
//Club conversations tab: clubId
//Club page: clubId
//Book Details?: bookId
//Book Details in Club context: clubId, bookId

/**
 * @description
 * call the conversation service to get a new token, the pass that token to Agora to refresh the session
 */
export function useGenerateToken() {
  const result = useMutation(
    async ({ isHost, channelName, agoraClient }: { isHost: boolean, agoraClient: RtcEngine, channelName: string }) => {
      let token = null;
      if (channelName) {
        token = await ConversationService.generateToken(channelName, isHost);
      }

      if (token) {
        await AgoraService.renewToken(agoraClient, token as string);
      }
      return true;
    },
  );
  return result;
}

/**
 * @description
 * Fetch all live conversations
 */
export function useGetLiveConversations() {
  const result = useQuery({
    queryKey: [cacheKey.liveConversations],
    queryFn: () => ConversationService.getLiveConversations()
  });
  return result;
}

export function useGetConversation( conversationId: string) {
  const result = useQuery({
    queryKey: [cacheKey.liveConversation, conversationId],
    queryFn: () => ConversationService.getConversation(conversationId)
  });
  return result;
}

/**
 * @description
 * First call the conversation go-live endpoint with the selected options to create a conversation,
 * Then pass the channel name and token from the response to the Agora service to start the live audio on the UI.
 */
export function useGoLive() {
  const { setAgoraClient, setAgoraUserId } = useLiveAudio();

  const result = useMutation(
    async ({ data, agoraClient }: { data: IGoLiveConversation, agoraClient: RtcEngine }) => {
      const response = await ConversationService.goLive(data.topic, data.record, data.audience, data.description, data.clubId, data.bookId);
      await AgoraService.goLive(agoraClient, response.agoraUserId, response?.agoraChannelName, response.token);
      setAgoraClient(agoraClient);
      setAgoraUserId(response.agoraUserId);
      return response;
    },
  );
  return result;
}


/**
 * @description
 * Disconnect from the Agora channel and then call the conversation service to delete
 * the conversation from the list of live conversations in DB.
 */
export function useStopGoingLive() {
  const result = useMutation(
    async ({ conversationId, agoraClient }: { conversationId: string, agoraClient: RtcEngine }) => {
      await AgoraService.stopGoingLive(agoraClient);
      await ConversationService.stopGoingLive(conversationId);
    },
  );
  return result;
}

/**
 * @description
 * Join  the Agora channel and then call the conversation service to add user as listener
 */
export function useJoinConversation() {
  const { setAgoraUserId } = useLiveAudio();

  const result = useMutation(
    async ({ data, agoraClient, participantType }: { data: IJoinConversation, agoraClient: RtcEngine, participantType: PARTICIPANT_TYPE }) => {
      const response = await ConversationService.joinConversation(data?.conversation._id!, participantType);
      await AgoraService.joinConversation(agoraClient, response.agoraUserId, response?.agoraChannelName, response.token);
      setAgoraUserId(response.agoraUserId);
      return response;

    },
  );
  return result;
}

export function useLeaveConversation() {
  const { setAgoraUserId } = useLiveAudio();

  const result = useMutation(
    async ({ conversationId, agoraClient, participantType, isLastModerator }: { conversationId: string, agoraClient: RtcEngine, participantType: PARTICIPANT_TYPE, isLastModerator: boolean }) => {
      if (isLastModerator) {
        await AgoraService.stopGoingLive(agoraClient);
      } else {
        await AgoraService.leaveConversation(agoraClient);
      }
      const response = await ConversationService.leaveConversation(conversationId, participantType);
      setAgoraUserId(null);
      return true;
    },
  );
  return result;
}

export function useInviteToConversation() {
  const result = useMutation(
    async (obj: IInviteObj) => {
      const response = await ConversationService.inviteToConversation(
        obj.conversationId,
        obj.inviteeIds,
        obj.participantType);
      return response;
    }
  );
  return result;
}

interface IGoLiveConversation {
  userId: string;
  topic: string;
  record: boolean;
  audience: AUDIENCE;
  description?: string;
  clubId?: string;
  bookId?: string;
}

export function usePromoteToModerator() {
  const result = useMutation(
    async (data: IAudioData) => {
      const response = await ConversationService.promoteToModerator(data.conversationId, data.userId);
      return response;
    },
    {
      onError: (error) => {
        console.log(`Error leaving conversation: ${error}`)
      }
    }
  );
  return result;
}

export function usePromoteToSpeaker() {
  const result = useMutation(
    async (data: IAudioData) => {
      const response = await ConversationService.promoteToSpeaker(data.conversationId, data.userId);
      return response;
    },
    {
      onError: (error) => {
        console.log(`Error leaving conversation: ${error}`)
      }
    }
  );
  return result;
}

export function useDemoteToListener() {
  const result = useMutation(
    async (data: IAudioData) => {
      const response = await ConversationService.demoteToListener(data.conversationId, data.userId);
      return response;
    },
    {
      onError: (error) => {
        console.log(`Error leaving conversation: ${error}`)
      }
    }
  );
  return result;
}

export function useRequestToSpeak() {
  const result = useMutation(
    async (conversationId: string) => {
      const response = await ConversationService.requestToSpeak(
        conversationId
      );
      return response;
    }
  );
  return result;
}

export function useChangeParticipantType() {
  const { agoraUserId } = useLiveAudio();
  const result = useMutation(
    async (obj: IChangePartipantTypeObj) => {
      await ConversationService.clearInConvoEvent(LIVE_AUDIO_ENDPOINTS.CLEAR_IN_CONVO_EVENT, obj.eventId);
      const newRole = obj.newParticipantType;
      const prevRole = await AgoraService.getCurrentParticipantType(agoraUserId!);
      await AgoraService.changeParticipantType(obj.agoraClient, obj.agoraToken, obj.channelName, obj.userId);
      await ConversationService.leaveConversation(obj.currentConversationId, prevRole);
      await ConversationService.joinConversation(obj.currentConversationId, obj.newParticipantType);
      return {prevRole, newRole};
    },
  );
  return result;
}

interface IChangePartipantTypeObj {
  userId: string;
  channelName: string;
  agoraToken: string;
  eventId: string;
  currentConversationId: string;
  newParticipantType: PARTICIPANT_TYPE;
  agoraClient:RtcEngine
}

type IJoinConversation = {
  userId: string;
  conversation: IConversation;
};

type IInviteObj = {
  conversationId: string;
  inviteeIds: string[];
  participantType: PARTICIPANT_TYPE;
};

type IAudioData = {
  conversationId:string;
  userId:string;
}
