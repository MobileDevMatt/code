import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE } from 'lib/constants';
import { IClubDetail } from 'shared/src/services/club-service';
import { AuthorFullProfile } from 'components/profilePage/authorClub/AuthorFullProfile';
import { AuthorFeaturedSelection } from 'components/profilePage/authorClub/AuthorFeaturedSelection';
import { useGetUserFull } from 'hooks/useGetUser';

const Stack = createStackNavigator();

export const AuthorClubNavigator = ({ club } : { club : IClubDetail }) => {
  const {data: currentUserData, ...currentUserDataFullInfo} = useGetUserFull();

  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardOverlayEnabled: true,
          cardStyleInterpolator: forFade,
          cardStyle: { backgroundColor: 'transparent' },
        }}
        mode="modal"
        headerMode="none">
        <Stack.Screen name={ROUTE.AUTHOR_FEATURED_SELECTION}>
          {() => <AuthorFeaturedSelection club={club} currentUserDataFull={currentUserData} currentUserDataFullInfo={currentUserDataFullInfo}/>}
        </Stack.Screen>
        <Stack.Screen name={ROUTE.AUTHOR_FULL_PROFILE}>
          {() => <AuthorFullProfile club={club} currentUserData={currentUserData} />}
        </Stack.Screen>
      </Stack.Navigator>
    </View>
  );
}
