import React from 'react';
import { View, Image } from 'react-native';
import cosmos, { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';
import { CustomizableButton } from 'theme/Button';
import { getLargestImage, getSmallestImage } from 'shared/src/utils';
import { useNavigation } from '@react-navigation/native';
import { ROUTE } from 'lib/constants';
import { FeedCardHeader } from './FeedCardHeader';
import { IAPI_User_Full, IFeedCard } from 'shared/src/services/user-service';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LockIcon } from 'components/icons/LockIcon';
import { BookManagerButton } from 'components/BookManagerButton';


const placeholderBookImage = require('../../assets/images/icon.png');

export const BookCard = ({feedCard, currentUserDataFull} : {feedCard: IFeedCard, currentUserDataFull: IAPI_User_Full | undefined}) => {
  const navigation = useNavigation();

  let bookDescription = feedCard.data.bookRef?.longSummary ? feedCard.data.bookRef?.longSummary : feedCard.data.bookRef?.shortSummary;
  if (bookDescription !== undefined) {
    const shouldAddThreeDots = bookDescription.length > 350;
    bookDescription = bookDescription.substring(0,350) + (shouldAddThreeDots ? '...' : '');
  }

  const isLocked = feedCard.data.bookRef?.authors?.find(author => author?.authorRef) === undefined;

  const onAuthorClicked = () => {
    if (feedCard.data.bookRef?.authors && feedCard.data.bookRef?.authors[0]) {
      navigation.navigate(ROUTE.jamesbook, { username: feedCard.data.bookRef?.authors[0].authorRef?.usernameInfo?.username });
    }
  }

  const navigateToBookPage = () => {
    navigation.navigate(ROUTE.BOOK, { bookId: feedCard.data.bookRef?._id, clubId: feedCard.data.clubRef?._id });
  }

  let authorImage = undefined;
  let authorName = undefined;
  if (feedCard.data.bookRef?.authors && feedCard.data.bookRef?.authors[0]) {
    authorImage = getSmallestImage(feedCard.data.bookRef?.authors[0].authorRef?.images) ? {uri: getLargestImage(feedCard.data.bookRef?.authors[0].authorRef?.images)} : placeholderBookImage
    authorName = feedCard.data.bookRef?.authors[0].name;
  }
  if (authorImage === undefined) {
    authorImage = placeholderBookImage;
  }
  
  return (
    <Container>
      <FeedCardHeader feedCard={feedCard} currentUserDataFull={currentUserDataFull}/>

      <BodyContainer>
        <View style={{flex: 1}}>
          <Title>{feedCard.data.bookRef?.title}</Title>

          <TouchableOpacity style={{flexDirection: 'row', marginTop: 4}} onPress={onAuthorClicked}>
            <Image style={{width: 22, height: 22, borderRadius: 300}} source={authorImage}/>
            <AuthorName>by <AuthorName style={{fontFamily: 'larsseitbold'}}>{authorName}</AuthorName></AuthorName>
          </TouchableOpacity>

          
          <BookDescription>{bookDescription}</BookDescription>
        </View>
        
        <BookImage
          source={getLargestImage(feedCard.data.bookRef?.coverImage) ? {uri: getLargestImage(feedCard.data.bookRef?.coverImage)} : placeholderBookImage}
        >
          <BookCoverTouchable onPress={navigateToBookPage} style={{backgroundColor: isLocked ? palette.grayscale.black + '99' : 'transparent'}}>
            { isLocked && 
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <LockIcon />
                <CustomizableButton
                  title='Unlock'
                  onPress={() => navigateToBookPage()}
                  style={{backgroundColor: palette.grayscale.white, borderRadius: 100, marginTop: 12}}
                  textStyle={{color: palette.grayscale.black}}
                />
              </View>
            }
            
          </BookCoverTouchable>
        </BookImage>
      </BodyContainer>

      <ButtonsContainer>
        <BookManagerButton userDataFull={currentUserDataFull} bookId={feedCard.data.bookRef?._id } bookCoverImage={feedCard.data.bookRef?.coverImage} bookChapterCount={feedCard.data.bookRef?.chapterCount}/>
        
        <CustomizableButton
          title={'Book details'}
          onPress={() => navigateToBookPage()}
          style={{marginStart: 12, backgroundColor: 'transparent', borderColor: palette.grayscale.granite, borderWidth: 1}}
          textStyle={{color: palette.primary.navy}}
        />
      </ButtonsContainer>
    </Container>
  );
};

const Container = styled.View`
  padding: ${cosmos.unit * 2}px;
  background-color: ${palette.grayscale.white};
  flex: 1;
`;

const BookCoverTouchable = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const CardExplanationText = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  line-height: 15px;
  color: ${palette.auxillary.charcoal.alt};
  flex: 1;
`;

const BodyContainer = styled.View`
  margin-top: 16px;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-family: ivarheadline;
  font-size: 24px;
  line-height: 30px;
  color: ${palette.primary.navy};
`;

const BookImage = styled.ImageBackground`
  margin-left: ${cosmos.unit * 2}px;
  max-width: 118px;
  aspect-ratio: ${118 / 180};
  flex: 0.56;
`;

const AuthorName = styled.Text`
  ${CardExplanationText};
  margin-left: 4px;
  color: ${palette.primary.navy};
  flex: 1;
`;

const BookDescription = styled.Text`
  font-family: larsseit;
  font-size: 16px;
  line-height: 22px;
  color: ${palette.primary.navy};
  margin-top: 12px;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  margin: ${cosmos.unit * 2}px 0px ${cosmos.unit * 2}px 0px;
`;
