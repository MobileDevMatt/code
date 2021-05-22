import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { palette } from 'shared/src/cosmos';

import Home from 'screens/Home';
import jamesbooks from 'screens/member/jamesbooks';
import {Conversations} from 'screens/member/Conversations';

import { TabBarIcon } from 'components/TabBarIcon';
import { ROUTE } from 'lib/constants';

import { View, Text } from 'react-native';
import {jamesbook} from 'screens/member/jamesbook';
import {Book} from 'screens/member/Book';
import { PublicProfilePage } from 'components/profilePage/PublicProfilePage';
import { useGetUser } from 'hooks/useGetUser';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { BCContainer } from 'components/containers/BCContainer';
import ProfilePageNavigator from './ProfilePageNavigator';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTE.PROFILE_PAGE} component={ProfilePageNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name={ROUTE.BOOK} component={Book} options={{ headerShown: false }}/>
      <Stack.Screen name={ROUTE.PUBLIC_PROFILE_PAGE} component={PublicProfilePage} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerShown: false,
        animationEnabled: true,
      }}>
      <Stack.Screen name={ROUTE.HOME} component={Home} />
      <Stack.Screen name={ROUTE.BOOK}>
        {() => <Book/>}
      </Stack.Screen>
      <Stack.Screen name={ROUTE.jamesbook}>
        {() => <jamesbook/>}
      </Stack.Screen>
      <Stack.Screen name={ROUTE.ACCOUNT} component={AccountStack}/>
      <Stack.Screen name={ROUTE.PUBLIC_PROFILE_PAGE} component={PublicProfilePage} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

const DiscoverStack = ({userData} : {userData?: IAPI_User_Full}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerShown: false,
        animationEnabled: true,
      }}>
      <Stack.Screen name={ROUTE.FEATUREDjamesbookS}>{() => <jamesbooks userData={userData}/>}</Stack.Screen>
      <Stack.Screen name={ROUTE.jamesbook}>
        {() => <jamesbook/>}
      </Stack.Screen>
      <Stack.Screen name={ROUTE.BOOK}>
        {() => <Book/>}
      </Stack.Screen>
      <Stack.Screen name={ROUTE.ACCOUNT} component={AccountStack}/>
      <Stack.Screen name={ROUTE.PUBLIC_PROFILE_PAGE} component={PublicProfilePage} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

function NotificationsStack({userData} : {userData?: IAPI_User_Full}) {
  const TempNotificationsScreen = () => {
    return (
      <BCContainer userImage={userData?.images} userFullName={userData?.name}>
        <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Text>Notifications page</Text>
        </View>
      </BCContainer>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerShown: false,
        animationEnabled: true,
      }}>
      <Stack.Screen name={ROUTE.NOTIFICATIONS_SCREEN}>{() => <TempNotificationsScreen/>}</Stack.Screen>
      <Stack.Screen name={ROUTE.ACCOUNT} component={AccountStack}/>
      <Stack.Screen name={ROUTE.PUBLIC_PROFILE_PAGE} component={PublicProfilePage} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const {data: userData} = useGetUser();

  const tabBarListeners = ({ navigation, route }) => ({
    tabPress: () => navigation.navigate(route.name),
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return <TabBarIcon name={route.name} focused={focused}/>;
        },
        headerShown: false,
      })}
      tabBarOptions={{
        activeBackgroundColor: palette.primary.bcBlue + '1A',
        inactiveBackgroundColor: 'transparent',
        activeTintColor: palette.auxillary.cobalt.main,
        inactiveTintColor: palette.grayscale.granite,
      }}
    >
      <Tab.Screen name={ROUTE.HOME} component={HomeStack} listeners={tabBarListeners}/>
      <Tab.Screen name={ROUTE.DISCOVER} listeners={tabBarListeners}>{() => <DiscoverStack userData={userData}/>}</Tab.Screen>
      <Tab.Screen name={ROUTE.CONVERSATIONS} listeners={tabBarListeners}>
        {() => <Conversations/>}
      </Tab.Screen>
      <Tab.Screen name={ROUTE.NOTIFICATIONS} listeners={tabBarListeners}>{() => <NotificationsStack userData={userData}/>}</Tab.Screen>
    </Tab.Navigator>
  );
}


export default TabNavigator;

