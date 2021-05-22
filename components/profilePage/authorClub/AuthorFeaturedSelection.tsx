import { BookAbout } from 'components/bookComponents/BookAbout';
import { BookHeader } from 'components/bookComponents/BookHeader';
import { AdditionalSelection } from 'components/Clubs/AdditionalSelection';
import { BCContainer } from 'components/containers/BCContainer';
import { ClubFeed } from 'components/feedCards/ClubFeed';
import Loading from 'components/Loading';
import { PurchaseButtonWithModal } from 'components/PurchaseButtonWithModal';
import { AuthorClubTabSubNavigator } from 'components/TabsSubNavigation';
import { useGetUserProfile } from 'hooks/useGetUser';
import { ROUTE } from 'lib/constants';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import cosmos, { palette } from 'shared/src/cosmos';
import { IClubDetail } from 'shared/src/services/club-service';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { ProfilePageAuthorHeader } from '../ProfilePageAuthorHeader';


export const AuthorFeaturedSelection = ({club, currentUserDataFull, currentUserDataFullInfo} : {club?: IClubDetail, currentUserDataFull: IAPI_User_Full | undefined, currentUserDataFullInfo: any}) => {
  const {data: authorData, ...AuthorDataFetchInfo} = useGetUserProfile({userId: club?.moderator?.userRef._id});
  const book = club?.featuredSelections.books[0].bookRef;

  const ShowErrorView = ({}) => {
    // TODO: Hovo: Implement some type of an error view?
    return <View style={{width: '100%', height: '100%', backgroundColor: palette.grayscale.white}}/>
  }

  if (AuthorDataFetchInfo.isLoading || currentUserDataFullInfo.isLoading) {
    return <Loading/>;
  } else if (AuthorDataFetchInfo.isError || currentUserDataFullInfo.isError) {
    return <ShowErrorView/>;
  } else {
    return (
      <BCContainer style={{flex: 1}} pageTitle={club?.moderator?.name} showBackButton={true} userImage={currentUserDataFull?.images} userFullName={currentUserDataFull?.name}>
        <ScrollView style={{backgroundColor: palette.grayscale.black}} contentContainerStyle={{paddingBottom: 100}}>

          <AuthorClubTabSubNavigator routeName={ROUTE.AUTHOR_FEATURED_SELECTION}/>

          <ProfilePageAuthorHeader
            name={authorData!.name}
            profilePic={club?.moderator?.userRef.images}
            isFollowing={authorData!.isFollowing}
            userId={authorData!._id}
          />

          <View style={{paddingHorizontal: cosmos.unit * 2}}>
            <BookHeader
              book={book}
              userDataFull={currentUserDataFull!}
              style={{marginTop: cosmos.unit * 3}}
            />

            <BookAbout longSummary={book?.longSummary} style={{marginTop: cosmos.unit * 2}}/>

            <PurchaseButtonWithModal book={book} style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 12}}/>
          </View>

          <AdditionalSelection books={club?.featuredSelections.books.slice(1)} fullUser={currentUserDataFull} style={{marginTop: 42, marginBottom: 42}}/>

          { club?._id &&
            <ClubFeed currentUserData={currentUserDataFull} clubModeratorId={club.moderator?.userRef._id} clubId={club._id}/>
          }
          
        </ScrollView>
      </BCContainer>
    );
  }
  
}
