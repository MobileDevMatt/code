import React from 'react';
import { View } from 'react-native';

import { ProfilePage } from 'components/profilePage/ProfilePage';
import { useGetUserProfile } from 'hooks/useGetUser';
import Loading from 'components/Loading';
import { IClubDetail } from 'shared/src/services/club-service';
import { palette } from 'shared/src/cosmos';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { ROUTE } from 'lib/constants';

export const AuthorFullProfile = ({club, currentUserData} : {club?: IClubDetail, currentUserData?: IAPI_User_Full}) => {
  const {data: userData, ...userDataFetchInfo} = useGetUserProfile({userId: club?.moderator?.userRef._id});

  const ShowErrorView = ({}) => {
    // TODO: Hovo: Implement some type of an error view?
    return <View style={{width: '100%', height: '100%', backgroundColor: palette.grayscale.white}}/>
  }

  if (userDataFetchInfo.isLoading) {
    return <Loading/>;
  } else if (userDataFetchInfo.isError) {
    return <ShowErrorView/>;
  } else {
    return (
      <ProfilePage
        name={userData!.name}
        bio={club?.moderator?.userRef.bio}
        username={userData!.username}
        profilePic={club?.moderator?.userRef.images}
        currentShelf={userData!.currentShelf}
        toReadShelf={userData!.toReadShelf}
        pausedShelf={userData!.pausedShelf}
        completedShelf={userData!.completedShelf}
        numFollowing={undefined}
        numFollowers={undefined}
        isSelf={false}
        isAuthor={true}
        userId={userData!._id}
        isFollowing={userData!.isFollowing}
        currentUserProfilePic={currentUserData?.images}
        currentUserFullName={currentUserData?.name}
        pageTitle={club?.moderator?.name ?? ''}
        subNavigatorName={ROUTE.AUTHOR_FULL_PROFILE}
        subNavigationType={'AuthorClubTabSubNavigator'}
      />
    );
  }
}
