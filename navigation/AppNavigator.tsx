import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-native-paper';

import NavigationService from './NavigationService';
import MainTabNavigator from './MainTabNavigator';
import BookGuideNavigator from './BookGuideNavigator';
import AuthNavigator from './AuthNavigator';
import AuthenticatedHome from '../components/AuthenticatedHome';

import { ROUTE } from '../lib/constants';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { LiveAudioNavigator } from './LiveAudioNavigator';
import { BookSearch } from 'components/bookComponents/BookSearch';

const RootStack = createStackNavigator();
const AuthenticatedStack = createStackNavigator();

const AuthenticatedNavigator = (): JSX.Element => {
  return (
    <AuthenticatedStack.Navigator
      initialRouteName={ROUTE.AUTHENTICATEDHOME}
      screenOptions={{
        headerBackTitleVisible: false,
        headerShown: false,
        animationEnabled: true,
      }}>
      <AuthenticatedStack.Screen name={ROUTE.AUTHENTICATEDHOME} component={AuthenticatedHome}/>
      <AuthenticatedStack.Screen name={ROUTE.DISCUSSION} component={BookGuideNavigator}/>
      <AuthenticatedStack.Screen name={ROUTE.MAIN} component={MainTabNavigator}/>
      <AuthenticatedStack.Screen name={ROUTE.AUDIO} component={LiveAudioNavigator}/>
      <AuthenticatedStack.Screen name={ROUTE.BOOK_SEARCH} component={BookSearch}/>
    </AuthenticatedStack.Navigator>
  );
};

function AppNavigator() {
  const { data: user } = useGetCurrentUser();

  return (
    <Provider>
      <NavigationContainer
        ref={(c) => {
          if (c) {
            NavigationService.setTopLevelNavigator(c);
          }
        }}
      >
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            cardOverlayEnabled: true,
            cardStyle: { backgroundColor: 'transparent' },
          }}
          mode="modal"
          headerMode="none"
        >
          {
            user !== null ?
              <RootStack.Screen name={ROUTE.MEMBER} component={AuthenticatedNavigator}/> :
              <RootStack.Screen name={ROUTE.AUTH} component={AuthNavigator}/>
          }
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>

  );
}

export default AppNavigator;
