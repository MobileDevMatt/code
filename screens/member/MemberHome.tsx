import React, { useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { useGetUserFull } from 'hooks/useGetUser';
import { BookShelf } from 'components/bookComponents/BookShelf';
import { IFeedCard, IUser_Club, SHELF_TYPE } from 'shared/src/services/user-service';
import Loading from 'components/Loading';
import {ConversationPanel} from 'components/audio/ConversationPanel';
import { useGetFeaturedjamesbooks } from 'hooks/useClubs';
import cosmos, { palette } from 'shared/src/cosmos';
import { OverlineLight, OverlineDark } from 'theme/Typography';
import ClubCard from 'components/ClubCard';
import { fallbackBookCover } from 'shared/src/lib/constants';
import { getLargestImage } from 'shared/src/utils';
import { ROUTE } from 'lib/constants';
import { IClub } from 'shared/src/services/club-service';
import Carousel from 'react-native-snap-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomizableButton } from 'theme/Button';
import { MarketingBlock } from 'components/MarketingBlock';
import { BCContainer } from 'components/containers/BCContainer';
import { useGetHomeFeed } from 'hooks/useFeed';
import { FeedCard } from 'components/feedCards/FeedCard';
import { ModalSheet } from 'components/ModalSheet';
import { AudioConversationSteps } from 'components/audio/AudioConversationSteps';

const HomeAuthed = (): JSX.Element => {
  const sliderWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  const {data: userData, isLoading} = useGetUserFull();
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const { data: featuredjamesbooks = [], ...featuredClubInfo } = useGetFeaturedjamesbooks();

  const hasCurrentlyReadingBooks = userData?.currentShelf?.books && userData.currentShelf.books.length > 0;
  const userClubs = userData?.clubs ? userData.clubs : [];
  const moderatedSeries = featuredjamesbooks.filter(club => (club?.moderator && club?.pastSelections));
  const { data: homeFeedData } = useGetHomeFeed();

  let showWhyjamesbook = true;
  if (userData?.currentShelf && userData.currentShelf.books.length > 0 || userData?.clubs && userData.clubs.length > 0) {
    showWhyjamesbook = false;
  }

  const ClubCards = ({ item, index }: { item: IClub | IUser_Club, index: number }) => {
    // TODO: from the backend we need the featured selection book
    // Author club should be named after featured book, not author club name
    return (
      <ClubCard
        key={index}
        title={item?.name}
        subtitle={item?.moderator?.name}
        clubTrailerImage={getLargestImage(item?.image) || fallbackBookCover}
        // bookCoverImage={item.clubType === CLUB_TYPES.AUTHOR ? getLargestImage(item?.featuredSelectionBookCover) || fallbackBookCover : ''}
        onPress={() => navigation.navigate(ROUTE.jamesbook, { clubId: item._id })}
      />
    )
  };

  const MemberHomeTopView = () => {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: cosmos.palette.grayscale.black }} keyboardShouldPersistTaps={'handled'}>
          <Header >
            <ClubList>
              <TextWrapper>
                <OverlineLight>{userClubs.length > 0 ? 'My Clubs' : 'Join a club'}</OverlineLight>
              </TextWrapper>

              <Carousel
                data={userClubs.length > 0 ? userClubs : moderatedSeries}
                renderItem={ClubCards}
                layout={'default'}
                activeSlideAlignment={'start'}
                firstItem={0}
                inactiveSlideScale={0.98}
                removeClippedSubviews={false}
                inactiveSlideOpacity={0.98}
                sliderWidth={sliderWidth}
                itemWidth={300}
              />
            </ClubList>

          </Header>
          <MainWrapper>
            { hasCurrentlyReadingBooks &&
              <BookShelf
                shelf={userData!.currentShelf!}
                customStyle={{ marginTop: 16}}
                customName={<OverlineDark>Currently reading</OverlineDark> }
                bookShelfType={SHELF_TYPE.CURRENTLY_READING}
                showAddBooksButton={true}
              />
            }

            { !hasCurrentlyReadingBooks &&
              <LinearGradient
                start={[0, 1]} end={[1, 0]}
                colors={['#DE7DAF', '#28C1EA', '#EBDB04']}
                style={{ borderRadius: cosmos.unit, marginTop: cosmos.unit * 2, marginHorizontal: cosmos.unit * 2 }}
              >
                <NoBooksView>
                  <NoBooksViewTitle>Pick up a new book</NoBooksViewTitle>
                  <NoBooksViewMessage>Find a book to start reading. On jamesbook, we have amazing video from the authors to enhance the books and you can always start or join a conversation with fellow readers.</NoBooksViewMessage>

                  <CustomizableButton
                    title={'Add a book'}
                    onPress={() => navigation.navigate(ROUTE.BOOK_SEARCH, {shelfType: SHELF_TYPE.CURRENTLY_READING})}
                    style={{alignSelf: 'center', marginTop: cosmos.unit * 3}}
                  />
                </NoBooksView>
              </LinearGradient>
            }
            <ConversationPanel setIsStartingConversation={setIsStartingConversation}/>
          </MainWrapper>
        </ScrollView>
    );
  }

  const HomeFeedCard = ({item} : {item: IFeedCard}) => {
    return <FeedCard feedCard={item} currentUserDataFull={userData}/>
  }

  return isLoading || featuredClubInfo.isLoading ? <Loading /> :(
    <BCContainer style={{flex: 1}} pageWelcomeText={'Welcome back'} userImage={userData?.images} userFullName={userData?.name}>
      <FlatList
          data={homeFeedData}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={{ paddingBottom: cosmos.unit * 2}}
          ListHeaderComponent={MemberHomeTopView}
          ListFooterComponent={showWhyjamesbook ? <MarketingBlock/> : null}
          ItemSeparatorComponent = {() => <View style={{height: cosmos.unit * 2, backgroundColor: palette.primary.linen}}/>}
          renderItem={HomeFeedCard}
        />
      <ModalSheet
        isVisible={isStartingConversation}
        setIsVisible={setIsStartingConversation}
        onClose={() => setIsStartingConversation(false)}
        onOpen={() => setIsStartingConversation(true)}
        content={
          <AudioConversationSteps setIsStartingConversation={setIsStartingConversation}/>
        }/>
    </BCContainer>
  );
}

export default HomeAuthed;

const Header = styled.View`
  background: ${palette.grayscale.black};
  padding-bottom: ${cosmos.unit * 4}px;
`;

const MainWrapper = styled.View`
  background: ${palette.primary.linen};
  padding-vertical: ${cosmos.unit * 3}px;
`;

const TextWrapper = styled.View`
  padding: ${cosmos.unit * 2}px;
`;

const ClubList = styled.View`
  margin-vertical: ${cosmos.unit * 2}px;
`;

const NoBooksView = styled.View`
  background-color: ${palette.primary.linen};
  border-radius: 6px;
  padding: ${cosmos.unit}px ${cosmos.unit}px ${cosmos.unit}px ${cosmos.unit}px;
  margin: 2px;
`;

const NoBooksViewTitle = styled.Text`
  font-family: ivarheadline;
  font-size: 24px;
  text-align: center;
  color: ${palette.grayscale.black};
`;

const NoBooksViewMessage = styled.Text`
  font-family: larsseit;
  font-size: 16px;
  text-align: center;
  color: ${palette.grayscale.black};
  margin: ${cosmos.unit * 2}px ${cosmos.unit}px 0px ${cosmos.unit}px;
`;
