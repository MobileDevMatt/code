import React, { useState } from 'react';
import styled from 'styled-components/native';
import { FlatList, StyleProp, View, ViewStyle, TouchableOpacity } from 'react-native';
import cosmos, { palette } from 'shared/src/cosmos';
import { getBookProgress, getLargestImage, getShelfTypeForBook } from 'shared/src/utils';
import { CustomizableButton } from 'theme/Button';
import { BookIcon } from 'components/icons/BookIcon';
import { IClubBook } from 'shared/src/services/club-service';
import { useNavigation } from '@react-navigation/native';
import { ROUTE } from 'lib/constants';
import { IBook } from 'shared/src/services/book-service';
import { IAPI_User_Full, SHELF_TYPE } from 'shared/src/services/user-service';
import BookManager from 'components/bookManager/BookManager';

const defaultBookImage = require('../../assets/images/icon.png');

export const AdditionalSelection = ({books, fullUser, style} : {books?: IClubBook[], fullUser?: IAPI_User_Full, style?: StyleProp<ViewStyle>}) => {
  if (!books || books?.length === 0) return null;
  
  const [manageBooksModalIsVisible, setManageBooksModalIsVisible] = useState(false);
  const [bookManagerData, setBookManagerData] = useState<{book: IBook | undefined, bookShelfType: SHELF_TYPE, progress: number | undefined} | undefined>(undefined);
  const navigation = useNavigation();

  const openBookManagerMenu = (book: IBook) => {
    const shelfType = getShelfTypeForBook(fullUser, book._id);
    setBookManagerData(() => {
      return {
        book: book,
        bookShelfType: shelfType,
        progress: getBookProgress(fullUser!, book._id)
      };
    });
    setManageBooksModalIsVisible(true);
  }

  return (
    <View style={style}>
        { bookManagerData?.book?._id !== undefined && fullUser &&
          <BookManager
            isVisible={manageBooksModalIsVisible}
            setIsVisible={setManageBooksModalIsVisible}
            bookShelfType={bookManagerData?.bookShelfType}
            bookId={bookManagerData?.book?._id}
            coverImage={bookManagerData?.book?.coverImage}
            bookProgress={bookManagerData?.progress}
            bookChapterCount={bookManagerData?.book?.chapterCount}
          />
        }
      <Title>ADDITIONAL SELECTIONS</Title>

      <FlatList
        style={{marginTop: 26}}
        data={books}
        keyExtractor={(item) => item.bookRef._id ?? item.bookRef.title}
        horizontal={true}
        renderItem={({item, index}) => {
          const authorName = (item.bookRef.authorNames && item.bookRef.authorNames.length > 0) ? item.bookRef.authorNames[0] : undefined;
          const bookProgress = fullUser ? getBookProgress(fullUser, item.bookRef._id, true) : undefined;

          return (
           <View style={{marginStart: index === 0 ? 32 : 21, marginEnd: index === books.length - 1 ? 32 : 0}}>
              <ThreeDotContainer onPress={() => {openBookManagerMenu(item.bookRef)}}>
                <ThreeDotText>...</ThreeDotText>
              </ThreeDotContainer>

              <BookImageContainer>
                <TouchableOpacity onPress={() => {navigation.navigate(ROUTE.BOOK, { bookId: item.bookRef._id })}}>
                  <BookImage source={getLargestImage(item.bookRef.coverImage) ? {uri: getLargestImage(item.bookRef.coverImage)} : defaultBookImage}/>
                </TouchableOpacity>
              </BookImageContainer>

              { item.discussionGuideRef && bookProgress !== undefined &&
                <CustomizableButton
                  title={'Guided discussion'}
                  onPress={() => {
                    navigation.navigate(ROUTE.BOOK, {navigateTo: ROUTE.BOOK_EXPLORE, bookId: item.bookRef._id})
                  }}
                  icon={<BookIcon color={palette.grayscale.white} width={18} height={18}/>}
                  style={{backgroundColor: 'transparent', borderWidth: 1, borderRadius: 2, borderColor: palette.grayscale.granite, width: 180, height: 36, marginTop: 24}}
                />
              }
              <BookAndAuthorTitle style={{marginTop: cosmos.unit * (item.discussionGuideRef ? 1 : 3)}}>{item.bookRef.title}</BookAndAuthorTitle>
              { authorName && <BookAndAuthorTitle style={{fontSize: 16}}>{authorName}</BookAndAuthorTitle> }
           </View>
          )
        }}
      />
    </View>
  );
}

const Title = styled.Text`
  font-family: granvillebold;
  font-size: 20px;
  line-height: 20px;
  color: ${palette.grayscale.white};
  margin-left: 32px;
`;

// Note: Need the zIndex otherwise the touch wont register
const ThreeDotContainer = styled.TouchableOpacity`
  position: absolute;
  align-self: flex-end;
  padding: 0px 10px 8px 10px;
  zIndex : 1; 
`;

const ThreeDotText = styled.Text`
  line-height: 30px;
  font-size: 40px;
  color: ${palette.grayscale.granite};
`;

const BookImage = styled.Image`
  width: 92px;
  height: 140px;
`;

const BookAndAuthorTitle = styled.Text`
  font-family: larsseit;
  font-size: 18px;
  line-height: 24px;
  color: ${palette.grayscale.white};
`;

const BookImageContainer = styled.View`
  width: 224px;
  height: 224px;
  align-items: center;
  justify-content: center;
  background-color: ${palette.grayscale.white + '1A'};
`;
