import React from 'react';
import styled from 'styled-components/native';
import { View, StyleProp, ViewStyle } from 'react-native';
import cosmos from 'shared/src/cosmos';
import { IBook } from 'shared/src/services/book-service';
import { getLargestImage } from 'shared/src/utils';
import { fallbackBookCover } from 'shared/src/lib/constants';
import { Title } from 'theme/Typography';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { BookManagerButton } from 'components/BookManagerButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ROUTE } from 'lib/constants';
import { useNavigation } from '@react-navigation/native';

export const BookHeader = ({book, userDataFull, style} : {book?: IBook, userDataFull: IAPI_User_Full, style?: StyleProp<ViewStyle>}) => {
  const navigation = useNavigation();

  return (
    <View style={style}>
      <TouchableOpacity onPress={() => {navigation.navigate(ROUTE.BOOK, { bookId: book?._id })}}>
        <BookCoverImage source={{uri: getLargestImage(book?.coverImage) || fallbackBookCover}} />
      </TouchableOpacity>

      <Title style={{ marginBottom: cosmos.unit / 2, textAlign: 'left'}}>{book?.title}</Title>

      <ButtonsWrapper>
        <BookManagerButton userDataFull={userDataFull} bookId={book?._id} bookCoverImage={book?.coverImage} bookChapterCount={book?.chapterCount}/>
      </ButtonsWrapper>
    </View>
  );
}

const BookCoverImage = styled.Image`
  width: 224px;
  height: 326px;
  margin: ${cosmos.unit}px 0px ${cosmos.unit * 4}px 0px;
  align-self: center;
`;

const ButtonsWrapper = styled.View`
  align-items: center;
  margin-top: ${cosmos.unit * 2}px;
  flex-direction: row;
  width: 100%;
`;
