import React, { useRef } from 'react';
import styled from 'styled-components/native';
import { Dimensions, FlatList, ActivityIndicator } from "react-native";
import { palette } from 'shared/src/cosmos';
import { ScrollView } from 'react-native-gesture-handler';
import { UserListItem } from 'components/Members/UserListItem';
import { useGetFollowers, useGetFollowing } from 'hooks/useFollow';
import { cacheKey } from 'hooks/cacheStateKey';
import { useQueryClient } from 'react-query';
import { TopSubNavigation } from 'components/TopSubNavigation';
import { BCContainer } from 'components/containers/BCContainer';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { ProfilePageTabSubNavigator, TabSubNavigationTheme } from 'components/TabsSubNavigation';
import { ROUTE } from 'lib/constants';

const screenWidth = Math.round(Dimensions.get('window').width);

export const ProfilePageConnections = ({currentUserData} : {currentUserData: IAPI_User_Full | undefined}) => {
  const queryClient = useQueryClient();

  const getFollowers= useGetFollowers(20);
  const getFollowing = useGetFollowing(20);

  const scrollRef = useRef<ScrollView>(null);

  const onLeftTabPressed = () => {
    scrollRef.current?.scrollTo({
      x: 0,
    });

    queryClient.invalidateQueries(cacheKey.followers);
  };

  const onRightTabPressed = () => {
    scrollRef.current?.scrollTo({
      x: screenWidth,
    });

    queryClient.invalidateQueries(cacheKey.following);
  };

  const fetchMoreFollowers = () => {
    if (!getFollowers.isFetchingNextPage && getFollowers.hasNextPage) {
      getFollowers.fetchNextPage();
    }
  }

  const fetchMoreFollowing = () => {
    if (!getFollowing.isFetchingNextPage && getFollowing.hasNextPage) {
      getFollowing.fetchNextPage();
    }
  }

  var biRef: {
    springAnimateTabIndicator?: (arg0: boolean) => void
  } = {}

  return(
    <BCContainer pageTitle={'My Profile'} showBackButton={true} userImage={currentUserData?.images} userFullName={currentUserData?.name} style={{flex: 1, backgroundColor: palette.primary.linen}}>
      <ProfilePageTabSubNavigator routeName={ROUTE.PROFILE_CONNECTIONS} theme={TabSubNavigationTheme.LIGHT}/>

      <TopSubNavigation
        leftTabTitle={"Following"}
        rightTabTitle={"Followers"}
        onLeftTabPressed={onLeftTabPressed}
        onRightTabPressed={onRightTabPressed}
        biRef={biRef}
      />

      <ScrollView horizontal={true} pagingEnabled={true} ref={scrollRef} showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {if (biRef.springAnimateTabIndicator) biRef.springAnimateTabIndicator(e.nativeEvent.contentOffset.x === 0)}}
      >
        <FlatList
          style={{width: screenWidth}}
          contentContainerStyle={{ paddingBottom: 100}}
          data={getFollowing.data?.pages.flatMap(item => item.users)}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent = { () => {return <ItemSeparator />} }
          onEndReached={fetchMoreFollowing}
          keyExtractor={(item) => item.userRef}
          ListFooterComponent={() => {
            if (!getFollowing.isFetching) { return null;}
            return <ActivityIndicator size = 'large' color={palette.primary.bcBlue}/>;
          }}
          renderItem={({item}) =>
            <UserListItem
              id={item.userRef}
              name={item.name}
              isFollowing={true}
              image={item.images}
              invalidateKey={cacheKey.following}
              currentUserData={currentUserData}
            />
          }
        />

        <FlatList
          style={{width: screenWidth}}
          data={getFollowers.data?.pages.flatMap(item => item.users)}
          contentContainerStyle={{ paddingBottom: 100}}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent = { () => {return <ItemSeparator />} }
          onEndReached={fetchMoreFollowers}
          keyExtractor={(item) => item.userRef}
          ListFooterComponent={() => {
            if (!getFollowers.isFetching) { return null;}
            return <ActivityIndicator size = 'large' color={palette.primary.bcBlue}/>;
          }}
          renderItem={({item}) =>
            <UserListItem
              id={item.userRef}
              name={item.name}
              isFollowing={item.isFollowing}
              image={item.images}
              invalidateKey={cacheKey.followers}
              currentUserData={currentUserData}
            />
          }
        />
      </ScrollView>
    </BCContainer>
  );
}

const ItemSeparator = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${palette.primary.linen};
`;
