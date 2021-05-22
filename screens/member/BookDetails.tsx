
import React, { useState } from 'react';
import styled from 'styled-components/native';

import cosmos, { palette } from 'shared/src/cosmos';
import { H1, Paragraph } from 'theme/Typography';
import { CustomizableButton } from 'theme/Button';
import { ScrollView, View, Image } from 'react-native';
import { addHttpsToLink, getLargestImage } from 'shared/src/utils';
import { useRequestBook } from 'hooks/useManageBook';
import { IClubDetail, CLUB_TYPES } from 'shared/src/services/club-service';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { ReadMore } from 'components/ReadMore';
import { BookHeader } from 'components/bookComponents/BookHeader';
import { PurchaseButtonWithModal } from 'components/PurchaseButtonWithModal';
import { BCContainer } from 'components/containers/BCContainer';
import { BookSubNavigator } from 'components/TabsSubNavigation';
import { ROUTE } from 'lib/constants';

const lockedBookHeaderBackground = require('../../assets/images/blockedBookBackground.png');
const placeholderProfilePic = require('../../assets/images/icon.png');

interface IProps {
  club?: IClubDetail;
  userDataFull: IAPI_User_Full
}

export const BookDetails = ({ club, userDataFull }: IProps): JSX.Element => {

  const [isStartingConversation, setIsStartingConversation] = useState(false);

  const book = club?.bookDetails?.bookRef;

  const { mutate: requestBook, ...requestBookInfo } = useRequestBook(book?._id);
  const isLocked = book?.authors?.find(author => author?.authorRef) === undefined;

  let userRequestedThisBook = false;
  if (isLocked && book?.firstRequesters && book.firstRequesters[0] && book.firstRequesters[0]._id === userDataFull._id) {
    userRequestedThisBook = true;
  }

  const getRequestorNames = (firstRequesters: IAPI_User_Full[], requestersCount: number) => {
    let count = requestersCount;
    let names = '';
    if (firstRequesters[0]._id !== userDataFull._id) {
      // Since the current user is not the first requester, then the current user did not request the book
      names = firstRequesters[0].name;
      count -= 1;
    } else {
      names = 'You';
      count -= 1;

      if (firstRequesters.length > 1) {
        // The current user and some other people requested the book;
        names += `, ${firstRequesters[1].name}`
        count -= 1;
      }
    }

    return (
      <LockedBookExplanationText>
        <LockedBookExplanationText style={{fontFamily: 'larsseitbold'}}>
          {names + ' '}
        </LockedBookExplanationText>
        and {count + '\n'}others requested this book
      </LockedBookExplanationText>
    )
  }

  return(
    <BCContainer style={{flex: 1}} pageTitle={club?.bookDetails?.bookRef.title} showBackButton={true} userImage={userDataFull?.images} userFullName={userDataFull?.name}>
      <ScrollView contentContainerStyle={{ paddingBottom: cosmos.unit * 12 }} alwaysBounceVertical={false} style={{flex: 1, backgroundColor: palette.grayscale.black }}>

        {book !== undefined && <BookSubNavigator routeName={ROUTE.BOOK_DETAIL} currentUserDataFull={userDataFull} book={book}/>}
        
        { isLocked &&
          <LockedBookHeader source={lockedBookHeaderBackground}>
            <LockedBookExplanationTitle>{(book?.authorNames && book.authorNames.length > 0 ? book?.authorNames[0] : 'This author')} isn’t on{'\n'}jamesbook (yet!)</LockedBookExplanationTitle>
            <LockedBookExplanationText>Sign up for updates and we’ll notify you when they open this book for conversation. </LockedBookExplanationText>

            <CustomizableButton
              style={{alignSelf: 'flex-start', marginTop: 30, opacity: (userRequestedThisBook ? 0.7 : 1)}}
              textStyle={{marginHorizontal: cosmos.unit}}
              title={userRequestedThisBook ? 'You’ve requested this author' : 'I want to discuss this book'}
              onPress={() => requestBook({bookId: book!._id!})}
              loading={ requestBookInfo.isLoading }
              disabled={ requestBookInfo.isLoading || userRequestedThisBook }
            />

            {/* TODO: Hovo: Add back when adding the tweeter button
              <CustomizableButton
                style={{alignSelf: 'flex-start', marginTop: cosmos.unit, backgroundColor: palette.grayscale.white}}
                textStyle={{color: palette.auxillary.malibu.main}}
                title={'Tweet the author'}
                onPress={() => {}}
                icon={TweeterIcon({ width: 25, height: 18.5,  color: palette.auxillary.malibu.main})}
                loading={ requestBookInfo.isLoading }
                disabled={ requestBookInfo.isLoading }
              />
            */}


            { book && book.firstRequesters && book.firstRequesters.length > 0 && book.requesterCount &&
              <View>
                <View style={{height: 32, marginTop: 20}}>
                  {
                    book.firstRequesters.map((requester, index) =>
                      <Image
                        key={requester._id}
                        source={requester.images?.small ? {uri: addHttpsToLink(requester.images.small)} : placeholderProfilePic}
                        style={{width: 32, height: 32, borderRadius: 300, position: 'absolute', left: 24 * index}}
                      />
                    )
                  }
                </View>

                {getRequestorNames(book.firstRequesters, book.requesterCount)}
              </View>
            }

          {/* TODO: Hovo: Add back when adding the author claim button
            <CustomizableButton
              title={'Are you the author? Claim your book!'}
              onPress={() => {}}
              loading={ requestBookInfo.isLoading }
              disabled={ requestBookInfo.isLoading }
              style={{alignSelf: 'flex-start', backgroundColor: 'transparent', marginTop: 12, marginBottom: 36}}
              textStyle={{fontFamily: 'larsseit', fontSize: 16, lineHeight: 22, color: palette.primary.navy, textDecorationLine: 'underline'}}
            />
           */ }

            {/* TODO: Hovo: Remove this when adding the above button for claiming */}
            <View style={{height: 36, width: '100%', backgroundColor: 'transparent'}}/>
          </LockedBookHeader>
        }


        <Wrapper>
          <BookHeader
            book={book}
            userDataFull={userDataFull}
          />

          {/* Host section */}
          { !isLocked && club?.moderator?.name && club?.clubType !== CLUB_TYPES.AUTHOR &&
            <HostContainer>
              <H1>Moderated by</H1>
              <Host>
                <HostImage source={{uri: getLargestImage(club?.moderator?.images)}} />
                <Paragraph>{club?.moderator?.name}</Paragraph>
              </Host>
            </HostContainer>
          }

          { isLocked && book?.authorNames && book.authorNames.length > 0 &&
            <HostContainer>
              <Host>
                <HostImage source={placeholderProfilePic} />
                <Paragraph>By <Paragraph style={{fontFamily: 'larsseitbold'}}>{book.authorNames[0]}</Paragraph></Paragraph>
              </Host>
            </HostContainer>
          }

          <AboutWrapper>

            { !isLocked &&
              <HostContainer>
                <H1>With the author</H1>
                {book?.authors?.map((a) => (
                  <Host key={a.name}>
                    <HostImage source={{uri: getLargestImage(a?.authorRef?.images)}} />
                    <Paragraph>{a.name}</Paragraph>
                  </Host>
                ))}
              </HostContainer>
            }
          </AboutWrapper>

          { book?.longSummary ?
            <AboutWrapper>
              <H1 style={{ marginBottom: cosmos.unit }}>About the book</H1>
              <ReadMore
                text={book?.longSummary}
                TextWrapper={Paragraph}
              />
            </AboutWrapper>
          : null }

          <PurchaseButtonWithModal book={book} style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 12}}/>
        </Wrapper>
      </ScrollView>
    </BCContainer>
  );
};

const LockedBookHeader = styled.ImageBackground`
  background-color: ${palette.grayscale.whisper};
  padding: 0px ${cosmos.unit * 2}px 0px ${cosmos.unit * 2}px;
`;

const LockedBookExplanationTitle = styled.Text`
  margin-top: 40px;
  font-family: ivarheadline;
  font-size: 24px;
  line-height: 30px;
  color: ${palette.primary.navy};
`;

const LockedBookExplanationText = styled.Text`
  font-family: larsseit;
  font-size: 16px;
  line-height: 22px;
  color: ${palette.primary.navy};
  margin-top: ${24}px;
`;

const HostContainer = styled.View`
  width: 100%;
  margin-top: ${cosmos.unit * 2}px;
`;

const AboutWrapper = styled.View`
  margin-top: ${cosmos.unit * 2}px;
`;

const Host = styled.View`
  flex-direction: row;
  margin-top: ${cosmos.unit}px;
  align-items: center;
`;

const ConversationButton = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.1);
  height: 42px;
  width: 42px;
  margin-left: ${cosmos.unit}px;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
`;

const HostImage = styled.Image`
  width: ${cosmos.unit * 6}px;
  height: ${cosmos.unit * 6}px;
  border-radius: ${cosmos.unit * 3}px;
  background-color: ${palette.grayscale.white};
  margin-right: ${cosmos.unit}px;
`;

const Wrapper = styled.View`
  background-color: ${palette.grayscale.black};
  flex: 1;
  padding: ${cosmos.unit * 2}px;
  padding-bottom: ${cosmos.unit * 7}px;
`;
