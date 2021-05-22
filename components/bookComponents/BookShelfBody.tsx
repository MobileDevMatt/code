import React, { useState } from 'react';
import styled from 'styled-components/native';
import { View, StyleProp, ViewStyle, FlatList, TouchableOpacity } from "react-native";
import cosmos, { palette } from "shared/src/cosmos";
import { IUserBook, IUserShelf, SHELF_TYPE } from 'shared/src/services/user-service';
import BookManager from 'components/bookManager/BookManager';
import { ProgressBar } from 'react-native-paper';
import { OverlineDark, ParagraphDark } from 'theme/Typography';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ROUTE } from 'lib/constants';

const defaultBookImage = require('../../assets/images/icon.png');

interface IBookProps {
  book: IUserBook;
  shelf: SHELF_TYPE;
  style?: StyleProp<ViewStyle>;
  isPublicViewer: boolean;
}

const ClickableBook = ({book, shelf, style, isPublicViewer}: IBookProps) => {
  const [manageBooksModalIsVisible, setManageBooksModalIsVisible] = useState(false);

  const currentProgress = book.progress;
  const totalChapters = book.bookRef.chapterCount;
  const progress = (currentProgress !== undefined && totalChapters !== undefined && totalChapters > 0) ? currentProgress / totalChapters : 0;

  return(
    <Book>

      {manageBooksModalIsVisible &&
        <BookManager
          isVisible={manageBooksModalIsVisible}
          setIsVisible={setManageBooksModalIsVisible}
          bookShelfType={shelf}
          bookId={book.bookRef._id}
          coverImage={book.bookRef.coverImage}
          bookProgress={book.progress}
          bookChapterCount={book.bookRef.chapterCount}
        />
      }

      { !isPublicViewer &&
        <ProgressBar
          progress={progress}
          color={palette.primary.navy}
          style={{height: 4, marginBottom: 14, borderRadius: 4, backgroundColor: palette.grayscale.granite + '40'}}
        />
      }
      
      <TouchableOpacity  style={style} onPress={() => {if (!isPublicViewer) setManageBooksModalIsVisible(true)}}>
        <BookCoverImage source={ (book.bookRef?.coverImage?.medium) ? {uri: book.bookRef.coverImage.medium} : defaultBookImage}/>
      </TouchableOpacity>
    </Book>
  );
}




interface IBookShelfBodyProps {
  shelf: IUserShelf;
  customName?: JSX.Element;
  bookShelfType: SHELF_TYPE;
  bookStyle?: StyleProp<ViewStyle>;
  isPublicViewer?: boolean;
  showAddBooksButton: boolean;
}

export const BookShelfBody = (
  {
    shelf,
    customName,
    bookShelfType,
    isPublicViewer,
    showAddBooksButton,
  } : IBookShelfBodyProps) => {
    const navigation = useNavigation();

    const RenderShelf = () => {
      // Render empty shelf

      const EmptyShelf = (shelfType: SHELF_TYPE) => {
      
        const getTitle = () => {
          switch(shelfType) {
            case SHELF_TYPE.CURRENTLY_READING:
              return 'Start reading a book';
            case SHELF_TYPE.TO_READ:
              return 'Not ready to read a book?';
            case SHELF_TYPE.COMPLETED:
              return 'What books have you completed?';
            default:
              return '';
          }
        }
      
        const getSubtitle = () => {
          switch(shelfType) {
            case SHELF_TYPE.CURRENTLY_READING:
              return 'Add books to a queue on this shelf. Don’t worry. We will watch over them as you finish your other books.';
            case SHELF_TYPE.TO_READ:
              return 'All the books you have completed will stay on this shelf. Just in case you want to read them again.';
            case SHELF_TYPE.COMPLETED:
              return 'Ready to read some books? Let’s add the books you are reading on this shelf.';
            default:
              return '';
          }
        }
      
        if (shelfType === SHELF_TYPE.PAUSED) {
          return (
            <View style={{height: 162, alignItems: 'stretch', justifyContent: 'center', marginHorizontal: 27}}>
              <EmptyShelfTitle style={{textAlign: 'center', color: palette.grayscale.granite}}>This shelf will update once you pause any book you are reading</EmptyShelfTitle>
            </View>
          );
        }
      
        return (
          <EmptyShelfContainer>
            <EmptyBookTouchable onPress={() => navigation.navigate(ROUTE.BOOK_SEARCH, {shelfType: shelfType})}>
              <View>
                <AntDesign
                  name='pluscircleo'
                  size={18}
                  color={palette.primary.navy}
                  style={{alignSelf: 'center'}}
                />
                <ParagraphDark style={{textAlign: 'center'}}>Add book</ParagraphDark>
              </View>
            </EmptyBookTouchable>
      
            <EmptyShelfTextContainer>
              <EmptyShelfTitle>{getTitle()}</EmptyShelfTitle>
              <ParagraphDark style={{marginTop: cosmos.unit}}>{getSubtitle()}</ParagraphDark>
            </EmptyShelfTextContainer>
      
          </EmptyShelfContainer>
        );
      }


      if (shelf.books.length === 0) {
        return EmptyShelf(bookShelfType);
      }

      // Render the shelves
      return (
        <View>
          <FlatList
            style={{marginTop: cosmos.unit * 2}}
            data={shelf.books}
            horizontal={true}
            renderItem={({item}: {item: IUserBook}) => (
              <ClickableBook
                book={item}
                shelf={bookShelfType}
                isPublicViewer={isPublicViewer ?? false}/>
            )}
            keyExtractor={item => item._id}
          />
          <Shelf />
        </View>
      );
    }
    
    return (
      <View>
        <TitleContainer>
          {customName ? customName : <OverlineDark>{shelf.name}</OverlineDark>}

          { showAddBooksButton && shelf.books.length > 0 &&
          <TouchableOpacity onPress={() => navigation.navigate(ROUTE.BOOK_SEARCH, {shelfType: bookShelfType})}>
            <AntDesign
              name='pluscircleo'
              size={30}
              color={palette.primary.navy}
            />
          </TouchableOpacity>
          }
        </TitleContainer>

        {RenderShelf()}
      </View>
    );
}

// TODO this will need to change back to 79 width & 120 height
const BookCoverImage = styled.Image`
  width: 121px;
  height: 182px;
`;

const TitleContainer = styled.View`
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: ${cosmos.unit}px ${cosmos.unit * 2}px;
`;

const Shelf = styled.View`
  background-color: ${palette.grayscale.cloud};
  height: 12px;
  margin-left: ${cosmos.unit * 2}px;
  margin-bottom: ${cosmos.unit * 2}px;
  /* TODO: This shadow style is not quite right */
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.23);
  elevation: 5;
`;

const Book = styled.View`
  margin-horizontal: ${cosmos.unit * 2}px;
`;

const EmptyShelfContainer = styled.View`
  padding: ${cosmos.unit * 3}px ${cosmos.unit * 2}px 0px ${cosmos.unit * 4}px;
  flex-direction: row;
`;

const EmptyBookTouchable = styled.TouchableOpacity`
  width: 107px;
  height: 162px;
  align-items: stretch;
  justify-content: center;
  border-width: 1.5px;
  border-color: ${palette.grayscale.granite};
  border-style: dashed;
  border-radius: 1px;
  background-color: ${palette.grayscale.cloud};
`;

const EmptyShelfTextContainer = styled.View`
  align-items: stretch;
  justify-content: center;
  flex: 1;
  margin-left: ${cosmos.unit * 2}px;
`;

const EmptyShelfTitle = styled.Text`
  font-family: ivarheadline;
  font-size: 18px;
  line-height: 24px;
  color: ${palette.primary.navy};
  text-align: left;
`;
