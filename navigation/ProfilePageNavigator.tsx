import React from 'react';
import { View } from "react-native";
import { useGetUserFull } from 'hooks/useGetUser';
import { ProfilePage } from 'components/profilePage/ProfilePage';
import Loading from 'components/Loading';

import { ProfilePageConnections } from 'components/profilePage/ProfilePageConnections';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTE } from 'lib/constants';
import EditProfilePage from 'components/profilePage/EditProfilePage';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { palette } from 'shared/src/cosmos';
import { TabSubNavigationTheme } from 'components/TabsSubNavigation';

const ProfilePageNavigator = () => {
  const {data: userData, isLoading, isError} = useGetUserFull();
  const Stack = createStackNavigator();

  const ShowErrorView = ({}) => {
    // TODO: Hovo: Implement some type of an error view?
    return <View style={{width: '100%', height: '100%', backgroundColor: palette.grayscale.white}}/>
  }

  const getProfileBookShelvesComponent = (userData: IAPI_User_Full ) => {
    return <ProfilePage
              name={userData.name}
              bio={userData.bio}
              username={userData.username}
              profilePic={userData.images}
              currentShelf={userData.currentShelf}
              toReadShelf={userData.toReadShelf}
              pausedShelf={userData.pausedShelf}
              completedShelf={userData.completedShelf}
              numFollowing={undefined}
              numFollowers={undefined}
              isSelf={true}
              isAuthor={false}
              userId={userData._id}
              currentUserProfilePic={userData.images}
              currentUserFullName={userData.name}
              pageTitle={'My Profile'}
              subNavigatorName={ROUTE.PROFILE_BOOK_SHELVES}
              subNavigationType={'ProfilePageTabSubNavigator'}
              subNavTheme={TabSubNavigationTheme.LIGHT}
          />
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardOverlayEnabled: true,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name={ROUTE.PROFILE_BOOK_SHELVES}>{() => isLoading ? <Loading/> : isError ? <ShowErrorView/> : getProfileBookShelvesComponent(userData!)}</Stack.Screen>
        <Stack.Screen name={ROUTE.PROFILE_CONNECTIONS}>{() => isLoading ? <Loading/> : isError ? <ShowErrorView/> : <ProfilePageConnections currentUserData={userData}/>}</Stack.Screen>
        <Stack.Screen name={ROUTE.EDIT_PROFILE_PAGE}>{() => isLoading ? <Loading/> : isError ? <ShowErrorView/>: <EditProfilePage userData={userData!} />}</Stack.Screen>
      </Stack.Navigator>
    </View>
  );
};

export default ProfilePageNavigator;
