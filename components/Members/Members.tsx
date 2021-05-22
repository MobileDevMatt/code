import React from 'react';
import { View, FlatList, ActivityIndicator } from "react-native";

import { MemberListHeader } from 'components/Members/MemberListHeader';
import { UserListItem } from 'components/Members/UserListItem';
import {useGetClubMembers} from 'hooks/useClubs';

import { IClubDetail } from 'shared/src/services/club-service';
import { cacheKey } from 'hooks/cacheStateKey';
import { palette } from 'shared/src/cosmos';
import { moveUserToFront } from 'shared/src/utils';
import { useGetClubReaderboardMembers } from 'hooks/useReaderboard';
import { IBook } from 'shared/src/services/book-service';
import { IMemberData, IMembersData } from 'shared/src/types/Types';
import { InfiniteQueryObserverResult } from 'react-query';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { BCContainer } from 'components/containers/BCContainer';
import { BookSubNavigator, ClubTabSubNavigator } from 'components/TabsSubNavigation';
import { ROUTE } from 'lib/constants';


export enum MembersType {
  CLUB_MEMBERS,
  READERBOARD,
}

const Members = ({ club, book, type, currentUserData, pageTitle }: { club?: IClubDetail, book?: IBook, type: MembersType, currentUserData?: IAPI_User_Full, pageTitle: string }) => {
  const memberCount = club?.members?.length;


  let membersData: InfiniteQueryObserverResult<IMembersData, unknown>;

  if (type === MembersType.CLUB_MEMBERS) {
    if (!club) {
      throw "Error: Members used with CLUB_MEMBERS should have a club param";
    }
    membersData = useGetClubMembers(club._id);
  } else if (type === MembersType.READERBOARD) {
    if (!book) {
      throw "Error: Members used with READERBOARD should have a book param";
    }

    if (!book._id) {
      throw "Error: Members used with READER should have a book._id present in book";
    }

    membersData = useGetClubReaderboardMembers({bookId: book._id, clubID: club?._id, pageSize: 20});
  } else {
    throw "Error: Members should have one of the types described in MembersType";
  }
  
  const fetchMoreMembers = () => {
    if (!membersData.isFetchingNextPage && membersData.hasNextPage) {
      membersData.fetchNextPage();
    }
  }

  const getProgressAndChapter = (user: IMemberData) => {
    if (type === MembersType.CLUB_MEMBERS) {
      return undefined;
    }

    return {
      currentChapter: user.progress ?? 0,
      numChapters: book?.chapterCount!,
    }
  }

  // TODO: Hovo: Fix the numberOfMembers below when we implement elastic search.
  return(
    <BCContainer style={{width: '100%', flex: 1, backgroundColor:palette.grayscale.white}} pageTitle={pageTitle} showBackButton={true} userImage={currentUserData?.images} userFullName={currentUserData?.name}>

      { type === MembersType.CLUB_MEMBERS &&
        <ClubTabSubNavigator routeName={ROUTE.BOOK_CLUB_MEMBERS}/>
      }

      { type === MembersType.READERBOARD && currentUserData && book &&
        <BookSubNavigator routeName={ROUTE.READERBOARD} currentUserDataFull={currentUserData} book={book}/>
      }

      {/* <SearchBox containerStyle={{paddingHorizontal: cosmos.unit * 2, paddingVertical: 12}} placeholder={'Search members'}/>*/}
      {/* TODO: we will need this to be the total list count */}
      <MemberListHeader numberOfMembers={memberCount || 0}/>

      <FlatList
        data={ moveUserToFront(membersData.data?.pages.flatMap(item => item.users) ?? [], currentUserData?._id ?? '')}
        onEndReachedThreshold={0.5}
        onEndReached={fetchMoreMembers}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100}}
        ItemSeparatorComponent = {() => <View style={{height: 1, backgroundColor: 'transparent'}}/>}
        ListFooterComponent={() => {
          if (!membersData.isFetching) { return null;}
          return <ActivityIndicator size = 'large' color={palette.primary.bcBlue}/>;
        }}

        renderItem={({item}) =>
          <UserListItem
            isSelf={item._id === currentUserData?._id}
            id={item._id}
            name={item.name}
            isFollowing={item.isFollowing}
            image={item.images}
            bookProgress={getProgressAndChapter(item)}
            invalidateKey={cacheKey.selectedClubMembers}
            currentUserData={currentUserData}
          />
        }
      />

    </BCContainer>
  );
}

export { Members };
