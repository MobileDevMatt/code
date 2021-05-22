import React from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import { palette } from 'shared/src/cosmos';
import { useGetCurrentAuthor } from 'hooks/useGetCurrentAuthor';
import Loading from 'components/Loading';
import { ROUTE } from 'lib/constants';
import { BCContainer } from 'components/containers/BCContainer';

const AuthorBooks = (): JSX.Element => {
  const { data: author, isLoading: isFetchingCurrentAuthor } = useGetCurrentAuthor();
  const navigation = useNavigation();

  const booksWithGuide = author?.publishedBookShelf.filter(book => book.discussionGuideRef) || [];

  return (
    <BCContainer style={{flex: 1}} pageTitle={'My books'} showBackButton={true} hideProfileImage={true}>
      {(!isFetchingCurrentAuthor) ?
        <>
          <ScrollContainer contentContainerStyle={{ alignItems: 'center' }} alwaysBounceVertical={false}>
            <Books>
              {booksWithGuide?.map((book, index) => {
                return (
                  <Book key={index} onPress={() => navigation.navigate(ROUTE.DISCUSSION_PROMPTS, { book })}>
                    <BookCover>
                      {book?.bookData?.coverImage?.medium ? (
                        <BookCoverImage source={{ uri: book?.bookData?.coverImage?.medium }}/>
                      ) : (
                        <BookImagePlaceholder/>
                      )}
                    </BookCover>
                    <TextContainer>
                      <BookTitle numberOfLines={1}>{book?.bookData?.title}</BookTitle>
                    </TextContainer>
                  </Book>
                );
              })}
            </Books>
          </ScrollContainer>
        </> : <Loading/>}

    </BCContainer>
  );
};

export default AuthorBooks;

const Books = styled.View`
  align-items: center;
  width: 100%;
  padding-horizontal:16px;
  padding-top: 40px;
  background-color: ${palette.grayscale.black};
`;

const ScrollContainer = styled.ScrollView`
  background-color: ${palette.grayscale.black}
`;

const BookCoverImage = styled.Image`
  width: 106px;
  height: 160px;
  resize-mode: cover;
  align-self: center;
`;

const BookImagePlaceholder = styled.View`
  width: 106px;
  height: 160px;
  background-color: ${palette.grayscale.granite};
  align-self: center;
`;

const TextContainer = styled.View`
  margin-bottom: 48px;
  width:100%
`;

const BookCover = styled.View`
  align-items: center;
  width: 100%;
  padding-vertical:36px;
  height: 233px;
  margin-bottom: 12px;
  background-color: ${palette.primary.linen};
`;

const Book = styled.TouchableOpacity`
  align-items: center;
  width: 100%;
`;

const BookTitle = styled.Text`
  font-family: larsseitbold;
  font-size: 20px;
  width: 100%;
  text-align: left;
  color: ${palette.grayscale.white};
`;
