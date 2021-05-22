import React from 'react';
import { View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { ROUTE } from 'lib/constants';
import { LiveAudio } from 'screens/member/LiveAudio';
import { palette } from 'shared/src/cosmos';
import { SSEProvider, LIVE_AUDIO_ENDPOINTS } from '../sse';
import { PublicProfilePage } from 'components/profilePage/PublicProfilePage';

const Stack = createStackNavigator();

const LiveAudioWrapper = () => {
  return(
    <SSEProvider endpoint={LIVE_AUDIO_ENDPOINTS.IN_CONVERSATION}>
      <LiveAudio />
    </SSEProvider>
  )
}

export const LiveAudioNavigator = () => (
  <View style={{ flex: 1, backgroundColor:palette.grayscale.black }}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardOverlayEnabled: true,
        cardStyle: { backgroundColor: 'transparent' },
      }}
      mode="modal"
      headerMode="none">
      <Stack.Screen name={ROUTE.LIVE_AUDIO_CONVERSATION} component={LiveAudioWrapper}/>
      <Stack.Screen name={ROUTE.PUBLIC_PROFILE_PAGE} component={PublicProfilePage} options={{ headerShown: false }}/>
    </Stack.Navigator>
  </View>
);
