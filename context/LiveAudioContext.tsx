import React, { createContext, useState,useRef } from 'react';
import { AgoraService } from '../services/agora-service';
import RtcEngine from 'react-native-agora';
import { useAsyncEffect } from 'use-async-effect';
import { useGetLiveConversations } from '../hooks/useConversations';
import { IConversation  } from 'shared/src/services/conversation-service';

type LiveAudioContextProps = {
  agoraClient: RtcEngine;
  setAgoraClient: React.Dispatch<React.SetStateAction<RtcEngine | undefined>>;
  agoraUserId: string | null;
  setAgoraUserId: React.Dispatch<React.SetStateAction<string | null>>;
  liveConversations: IConversation[] | undefined;
  liveConversation: IConversation | null;
  setLiveConversation: React.Dispatch<React.SetStateAction<IConversation | null>>;
  liveConversationEventMap:  React.MutableRefObject<Map<string, any>>;
}

const LiveAudioContext = createContext<LiveAudioContextProps>({} as LiveAudioContextProps);
LiveAudioContext.displayName = `LiveAudioContext`;

export const LiveAudioProvider = (props) => {
  const [agoraClient, setAgoraClient] = useState<RtcEngine>();
  const [liveConversation, setLiveConversation] = useState<IConversation | null>(null);
  const [agoraUserId, setAgoraUserId] = useState<string | null>(null);
  const liveConversationEventMap = useRef<Map<string, any>>(new Map());

  //Streams
  const { data: liveConversations } = useGetLiveConversations();

  const initializeAgora = async () => {
    const agoraClient = await AgoraService.init();
    setAgoraClient(agoraClient);
  };

  useAsyncEffect(initializeAgora, () => {
  }, []);

  const providerValues: LiveAudioContextProps = {
    agoraClient: agoraClient as RtcEngine,
    setAgoraClient,
    liveConversations,
    liveConversation,
    setLiveConversation,
    liveConversationEventMap,
    agoraUserId,
    setAgoraUserId
  };

  return (
    <LiveAudioContext.Provider value={providerValues} {...props} />
  );
}

export function useLiveAudio() {
  const context = React.useContext(LiveAudioContext);
  if (context === undefined || Object.keys(context).length === 0) {
    console.log(`${useLiveAudio.name} must be used within a ${LiveAudioProvider.name}`);
  }
  return context;
}