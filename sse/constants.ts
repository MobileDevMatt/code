import Config from 'react-native-config';

const BASE_URL = `${Config.REACT_APP_SSE_HOST}/` 

export const LIVE_AUDIO_ENDPOINTS = {
    IN_CONVERSATION: BASE_URL + 'in-conversation-events',
    CLEAR_IN_CONVO_EVENT: BASE_URL + 'clear-in-convo-event'
}