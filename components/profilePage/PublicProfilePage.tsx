import React from 'react';
import { View } from 'react-native';

import { ProfilePage } from 'components/profilePage/ProfilePage';
import { useGetUserProfile } from 'hooks/useGetUser';
import Loading from 'components/Loading';
import { palette } from 'shared/src/cosmos';
import { cacheKey } from 'hooks/cacheStateKey';
import { IImage } from 'shared/src/services';

export const PublicProfilePage = (props: { route: { params: { userId: any; currentUserProfilePic?: IImage, currentUserFullName?: string, username: any; additionalInvalidateKeys?: string[] | [string, string][];}; }; }) => {
  const {userId, username, additionalInvalidateKeys, currentUserProfilePic, currentUserFullName} = props.route.params;

  const {data: userData, ...userDataFetchInfo} = useGetUserProfile({userId, username});
  
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
      <View style={{flex: 1}}>
        <ProfilePage
          name={userData!.name}
          bio={userData!.bio}
          username={userData!.username}
          profilePic={userData!.images}
          currentShelf={userData!.currentShelf}
          toReadShelf={userData!.toReadShelf}
          pausedShelf={userData!.pausedShelf}
          completedShelf={userData!.completedShelf}
          numFollowing={undefined}
          numFollowers={undefined}
          isSelf={false}
          isAuthor={false}
          userId={userData!._id}
          isPrivate={userData?.isPrivate}
          isFollowing={userData!.isFollowing}
          invalidateKey={[cacheKey.userProfile, userData!._id]}
          additionalInvalidateKeys={additionalInvalidateKeys}
          pageTitle={userData?.name ? userData?.name.split(' ')[0] + '`s Profile' : ''}
          currentUserFullName={currentUserFullName}
          currentUserProfilePic={currentUserProfilePic}
        />
      </View>
    );
  }
}
