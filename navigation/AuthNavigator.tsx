import React from 'react';
import { View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import Registration from '../screens/guest/Registration';

import { ROUTE } from 'lib/constants';
import Login from '../screens/guest/Login';
import SignUp from '../screens/guest/SignUp';
import AuthorSignUpVerifyEmail from '../screens/guest/AuthorSignUpVerifyEmail';
import StatusBar from '../components/StatusBar';
import TopGradientLine from '../components/TopGradientLine';

const Stack = createStackNavigator();


function AuthNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <TopGradientLine/>
      <StatusBar/>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardOverlayEnabled: true,
          cardStyle: { backgroundColor: 'transparent' },
        }}
        mode="modal"
        headerMode="none">
        <Stack.Screen name={ROUTE.REGISTRATION} component={Registration}/>
        <Stack.Screen name={ROUTE.LOGIN} component={Login}/>
        <Stack.Screen name={ROUTE.SIGNUP} component={SignUp}/>
        <Stack.Screen name={ROUTE.AUTHOR_VERIFY_EMAIL} component={AuthorSignUpVerifyEmail}/>
      </Stack.Navigator>
    </View>
  );
}


export default AuthNavigator;
