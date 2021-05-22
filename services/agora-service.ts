import RtcEngine, { ChannelProfile, ClientRole, UserInfo } from 'react-native-agora';
import { EventRegister } from 'react-native-event-listeners';
import { PARTICIPANT_TYPE } from 'shared/src/services/conversation-service';

/**
 * @description
 * Service used for creating live audio connections for conversations among jamesbook users.
 * Worth noting is that this service uses an event-based API, so its unlike our other
 * traditional web services that make more straight forward CRUD operations.
 */
export class AgoraService {
  /**
   * @description
   * A randomly generated unique string provided by Agora for our app via our web portal account.
   */
  static appId: string = '16e6488f1e714836a74db13918c47327';

  /**
   * @description
   * Initializes a new Agora client for making voice chats.
   * When the agora client is created, internally, the client Agora
   * client maintains mains a `_clientId` property with a unique ID.
   * Thus, we have to be careful that we aren't recreating new clients
   * by having Agora.init() be called due to a component re-rendering.
   */
  static async init(): Promise<RtcEngine> {
    const client = await RtcEngine.create(this.appId);
    // Enable the audio module.
    await client.enableAudio();

    // Set the channel profile as live streaming.
    await client.setChannelProfile(ChannelProfile.Communication);
    return client;
  }

  /**
   * @description
   * Listen for the TokenPrivilegeWillExpire callback.
   * Expires in 30 seconds
   */
  private static _setTokenExpirationEventListeners(client: RtcEngine) {
    client.addListener('TokenPrivilegeWillExpire', ((token: string) => {
      EventRegister.emit(AGORA_EVENT_CHANNEL.TOKEN_WILL_EXPIRE);
    }));
    client.addListener('RequestToken', (() => {
      EventRegister.emit(AGORA_EVENT_CHANNEL.TOKEN_DID_EXPIRE);
    }));
  }

  /**
   * @description
   * Set agora audio player listeners
   */
  static _setAudioPlayerEventListeners(client: RtcEngine) {
    client.addListener('RemoteAudioStateChanged', ((uid, state, reason, elapsed) => {
      EventRegister.emit(AGORA_EVENT_CHANNEL.REMOTE_AUDIO_STATE_CHANGE, { uid, state, reason, elapsed });
    }));
    client.addListener('UserJoined', ((uid: number, elapsed: number) => {
      EventRegister.emit(AGORA_EVENT_CHANNEL.USER_JOINED_CONVERSATION, { uid, elapsed });
    }));
    client.addListener('UserOffline', ((uid: number, elapsed: number) => {
      EventRegister.emit(AGORA_EVENT_CHANNEL.USER_LEFT_CONVERSATION, { uid, elapsed });
    }));
  }

  static async renewToken(client: RtcEngine, token: string) {
    await client.renewToken(token);
  }

  /**
   * @description
   * Go live with the channel on agora and create token expiration listeners
   */
  static async goLive(client: RtcEngine, userId: string, channelName: string, token: string) {
    await client.setAudioProfile(0, 0);
    client.adjustRecordingSignalVolume(100);
    await client.setEnableSpeakerphone(true);
    await client.enableLocalAudio(true);
    await client?.muteLocalAudioStream(true);
    await client?.joinChannelWithUserAccount(token, channelName, userId);
    client.addListener('JoinChannelSuccess', ((channel: string, uid: number, elapsed: number) => {
    }));
    this._setTokenExpirationEventListeners(client);
    this._setAudioPlayerEventListeners(client);
  }

  /**
   * @description
   * Leave Agora channel on current client
   */
  static async stopGoingLive(client: RtcEngine) {
    await client.leaveChannel();
    await client.removeAllListeners();
    return {
      contentUrl: '',
      duration: 0,
    };
  }

  /**
   * @description
   * Enable local audio to speak
   */
  static async speak(client: RtcEngine) {
    await client?.setClientRole(ClientRole.Broadcaster);
    client?.adjustRecordingSignalVolume(100);
    await client?.muteLocalAudioStream(false);
  }

  /**
   * @description
   * Mute Audio
   */
  static async mute(client: RtcEngine) {
    await client?.setClientRole(ClientRole.Audience);
    client?.adjustRecordingSignalVolume(0);
    await client?.muteLocalAudioStream(true);
  }

  /**
   * @description
   * get remote agora user ref and participant type
   */
  static getAgoraUserRefAndParticipantType(agoraUserAccount: string) {
    const remoteAgoraUserUserRef = agoraUserAccount.split('-')[0];
    const userType = agoraUserAccount.split('-')[1];

    return [remoteAgoraUserUserRef, userType];
  }

  /**
   * @description
   * Go live into the channel on agora (as a listener) and set token expiration listeners
   */
  static async joinConversation(client: RtcEngine, userId: string, channelName: string, token: string) {
    await client.setAudioProfile(0, 0);
    await client.setEnableSpeakerphone(true);
    await client.enableLocalAudio(true);
    await client?.muteLocalAudioStream(true);
    await client?.joinChannelWithUserAccount(token, channelName, userId);
    this._setTokenExpirationEventListeners(client);
    this._setAudioPlayerEventListeners(client);
  }

  /**
   * @description
   * Leave conversation as listener
   */
  static async leaveConversation(client: RtcEngine) {
    await client.leaveChannel();
    await client.removeAllListeners();
  }

  /**
   * @description
   * Leave Agora channel on current client
   */
  static async changeParticipantType(client: RtcEngine, token: string, channelName: string, userId: string) {
    await client.leaveChannel();
    await client.setEnableSpeakerphone(true);
    await client.enableLocalAudio(true);
    await client?.muteLocalAudioStream(true);
    await client?.joinChannelWithUserAccount(token, channelName, userId);
  }


  static getCurrentParticipantType(agoraUserId:string) {
    return agoraUserId.split('-')[1] as PARTICIPANT_TYPE || null;
  }

}

export enum AGORA_EVENT_CHANNEL {
  HOST_WENT_LIVE = 'host-went-live', //backend SSE
  HOST_STOPPED_GOING_LIVE = 'host-stopped-going-live', //backend SSE
  USER_JOINED_CONVERSATION = 'user-joined-conversation', //backend SSE
  USER_LEFT_CONVERSATION = 'user-left-conversation', //backend SSE
  TOKEN_WILL_EXPIRE = 'token-will-expire', //agora triggered Custom Event
  REMOTE_AUDIO_STATE_CHANGE = 'remote-audio-state-change', //agora triggered Custom Event
  TOKEN_DID_EXPIRE = 'token-did-expire', //agora triggered Custom Event
}