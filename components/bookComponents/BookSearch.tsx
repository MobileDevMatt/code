import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, FlatList, View } from 'react-native';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';

import { SHELF_TYPE } from 'shared/src/services/user-service';
import cosmos, { palette } from 'shared/src/cosmos';
import { useBookSearch } from 'hooks/useGetBook';
import { useAddBookToShelf } from 'hooks/useManageBook';
import { CustomizableButton } from 'theme/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { INormalizedBookResult } from 'shared/src/services/book-service';
import { TouchableOpacity } from 'react-native-gesture-handler';
import StatusBar from 'components/StatusBar';
import { getShelfNameFromType } from 'shared/src/utils';


const placeholderBookImage = require('../../assets/images/icon.png');

interface IBookCardSearchPageInterface {
  reviewBucket: INormalizedBookResult[],
  book: INormalizedBookResult,
  setReviewBucket: React.Dispatch<React.SetStateAction<INormalizedBookResult[]>>,
}

const BookCardSearchPage = ({reviewBucket, setReviewBucket, book} : IBookCardSearchPageInterface) => {
  const isInReviewBucket = find(reviewBucket, book) !== undefined;

  return (
    <BookCardContainer
      style={{backgroundColor: 'transparent'}}
      onPress={() => {
        if (isInReviewBucket) {
          setReviewBucket(oldValues => oldValues.filter(obj => !isEqual(obj, book)));
        } else {
          setReviewBucket(oldValues => [...oldValues, book]);
        }
      }}
    >
      <SearchBookImageBackground source={placeholderBookImage}>
        <SearchBookImage source={book.displayBook.coverImage ? {uri: book.displayBook.coverImage} : placeholderBookImage}/>
      </SearchBookImageBackground>

      <SearchBookTitleContainer>
        <SearchBookTitle numberOfLines={1}>{book.displayBook.title}</SearchBookTitle>
        {book.displayBook.authors !== undefined && <SearchBookAuthor>{book.displayBook.authors[0]}</SearchBookAuthor>}
        <SearchBookReleaseDate>{book.displayBook.publishedDate}</SearchBookReleaseDate>
      </SearchBookTitleContainer>

      <AntDesign
        name={isInReviewBucket ? 'checkcircle' : 'pluscircleo'}
        size={24}
        color={isInReviewBucket ? palette.primary.bcBlue : palette.primary.navy}
        style={{alignSelf: 'center'}}
      />
    </BookCardContainer>
  );
}


interface IBookCardReviewPageInterface {
  book: INormalizedBookResult,
  setReviewBucket: React.Dispatch<React.SetStateAction<INormalizedBookResult[]>>
}

const BookCardReviewPage = ({setReviewBucket, book} : IBookCardReviewPageInterface) => {
  return (
    <BookCardContainer style={{borderWidth: 1, backgroundColor: palette.grayscale.white}}>
      <SearchBookImageBackground source={placeholderBookImage}>
        <SearchBookImage source={book.displayBook.coverImage ? {uri: book.displayBook.coverImage} : placeholderBookImage}/>
      </SearchBookImageBackground>

      <SearchBookTitleContainer>
        <SearchBookTitle numberOfLines={1}>{book.displayBook.title}</SearchBookTitle>
        {book.displayBook.authors !== undefined && <SearchBookAuthor>{book.displayBook.authors[0]}</SearchBookAuthor>}
        <SearchBookReleaseDate>{book.displayBook.publishedDate}</SearchBookReleaseDate>
      </SearchBookTitleContainer>

      <TouchableOpacity
          onPress={() => {
            // Removes the book from bookCart
            setReviewBucket(oldValues => oldValues.filter(obj => !isEqual(obj, book)));
          }}
        >
          <AntDesign
            name='close'
            size={24}
            color={palette.primary.navy}
          />
        </TouchableOpacity>
    </BookCardContainer>
  );
}


interface ISearchPageInterface {
  setIsAddingBooksState: React.Dispatch<React.SetStateAction<boolean>>,
  reviewBucket: INormalizedBookResult[],
  setReviewBucket: React.Dispatch<React.SetStateAction<INormalizedBookResult[]>>
}

const SearchPage = ({setIsAddingBooksState, reviewBucket, setReviewBucket} : ISearchPageInterface) => {
  const [searchText, setSearchText] = useState("");
  const [isEditingSearch, setIsEditingSearch] = useState(false);
  const {mutate: search, data: books, isLoading: isSearchBookRequestInProgress} = useBookSearch();

  const navigation = useNavigation();

  return (
    <Container>
      <StatusBar/>
      <View style={{padding: cosmos.unit * 2, paddingBottom: 0, flex: 1}}>
        <PageTitle>{'Find Your Book'}</PageTitle>

        <PageSubtitle>Search by the title of the book to add it automatically.</PageSubtitle>

        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType={'search'}
          onFocus={() => setIsEditingSearch(true)}
          onEndEditing={() => setIsEditingSearch(false)}
          onSubmitEditing={() => search(searchText)}
          placeholder={'Enter your search text...'}
        />
        

        { !isEditingSearch &&
          <FlatList
            data={books}
            keyExtractor={item => item.book.id ?? Math.random().toString()}
            style={{marginTop: cosmos.unit * 3}}
            ItemSeparatorComponent={() => <View style={{width: '100%', height: 8, backgroundColor: 'transparent'}}/>}
            keyboardShouldPersistTaps={'handled'}
            renderItem={({item}) => BookCardSearchPage({reviewBucket: reviewBucket, setReviewBucket: setReviewBucket, book: item})}
            ListFooterComponent={() => {
              if (!isSearchBookRequestInProgress) { return null;}
              return <ActivityIndicator size = 'large' color={palette.primary.bcBlue}/>;
            }}
          />
        }
      </View>

      <View style={{width: '100%'}}>
        <LinearGradient
          start={[0, 1]} end={[1, 0]}
          colors={palette.gradiant.horizontalArray}
          style={{width: '100%', height: 8}}
        />

        <ButtonContainer>
          <CustomizableButton
            title={'Cancel'}
            onPress={() => navigation.goBack()}
            style={{backgroundColor: 'transparent', borderRadius: 2, borderWidth: 1, borderColor: palette.grayscale.granite, flex: 1, marginEnd: cosmos.unit * 2 }}
            textStyle={{color: palette.primary.navy}}
            icon={
              <Entypo
                name='chevron-left'
                size={20}
                color={palette.primary.navy}
              />
            }
          />
          <CustomizableButton
            title={'Review'}
            onPress={() => setIsAddingBooksState(false)}
            style={{flex: 1, backgroundColor: reviewBucket.length === 0 ? palette.primary.bcBlue + 'A1' : palette.primary.bcBlue}}
            disabled={ reviewBucket.length === 0 }
            rightIcon={
              <Entypo
                name='chevron-right'
                size={20}
                color={palette.grayscale.white}
              />
            }
          />
        </ButtonContainer>
      </View>
    </Container>
  );
}

interface IReviewPageInterface {
  shelfType: SHELF_TYPE,
  reviewBucket: INormalizedBookResult[],
  setIsAddingBooksState: React.Dispatch<React.SetStateAction<boolean>>,
  setReviewBucket: React.Dispatch<React.SetStateAction<INormalizedBookResult[]>>
}

const ReviewPage = ({shelfType, reviewBucket, setIsAddingBooksState, setReviewBucket}: IReviewPageInterface) => {
  let [indexOfAddToShelf, setIndexOfAddToShelf] = useState(-1);

  const { mutate: addBookToShelf, ...addBookToShelfInfo } = useAddBookToShelf();

  const navigation = useNavigation();
  
  useEffect(() => {
    if (indexOfAddToShelf !== -1) {
      if(indexOfAddToShelf < reviewBucket.length) {
        addBookToShelf({book: reviewBucket[indexOfAddToShelf].book, shelfType: shelfType },
          {
            onSettled: () => {
              setIndexOfAddToShelf(oldVal => oldVal + 1);
            }
          })
      } else {
        setIndexOfAddToShelf(-1);
        navigation.goBack();
        return;
      }
    }
    
  }, [indexOfAddToShelf]);

  return (
    <Container>
      <StatusBar/>
      <View style={{padding: cosmos.unit * 2, paddingBottom: 0, flex: 1}}>
        <PageTitle>{'Review your books'}</PageTitle>

        <PageSubtitle>These are the books you will add to your <PageSubtitle style={{fontFamily: 'larsseitbold'}}>{getShelfNameFromType(shelfType)}</PageSubtitle>. Go back if you want to add more.'</PageSubtitle>

        <FlatList
          data={reviewBucket}
          keyExtractor={item => item.book.id ?? Math.random().toString()}
          style={{marginTop: cosmos.unit * 3}}
          ItemSeparatorComponent={() => <View style={{width: '100%', height: 8, backgroundColor: 'transparent'}}/>}
          keyboardShouldPersistTaps={'handled'}
          renderItem={({item}) => BookCardReviewPage({setReviewBucket: setReviewBucket, book: item})}
        />
      </View>

      <View style={{width: '100%'}}>
        <LinearGradient
          start={[0, 1]} end={[1, 0]}
          colors={palette.gradiant.horizontalArray}
          style={{width: '100%', height: 8}}
        />

        <ButtonContainer>
          <CustomizableButton
            title={'Back'}
            onPress={() => {setIsAddingBooksState(true)}}
            style={{backgroundColor: 'transparent', borderRadius: 2, borderWidth: 1, borderColor: palette.grayscale.granite, flex: 1, marginEnd: cosmos.unit * 2 }}
            textStyle={{color: palette.primary.navy}}
            disabled={indexOfAddToShelf !== -1}
            icon={
              <Entypo
                name='chevron-left'
                size={20}
                color={palette.primary.navy}
              />
            }
          />
          <CustomizableButton
            title={'Add'}
            onPress={() => setIndexOfAddToShelf(0)}
            style={{flex: 1, backgroundColor: reviewBucket.length === 0 ? palette.primary.bcBlue + 'A1' : palette.primary.bcBlue}}
            disabled={ indexOfAddToShelf !== -1 }
            loading={ indexOfAddToShelf !== -1 }
            rightIcon={
              <Entypo
                name='chevron-right'
                size={20}
                color={palette.grayscale.white}
              />
            }
          />
        </ButtonContainer>
      </View>
    </Container>

  );
}


export const BookSearch = (props: { route: { params: { shelfType: any; }; }; }) => {
  const {shelfType} = props.route.params;
  
  const [isAddingBooksState, setIsAddingBooksState] = useState(true);
  const [reviewBucket, setReviewBucket] = useState<INormalizedBookResult[]>([]);

  // Takes you back to search page if you remove all the books from review stage
  useEffect(() => {
    if(reviewBucket.length === 0 && !isAddingBooksState) {
      setIsAddingBooksState(true);
    }
  }, [reviewBucket])

  return isAddingBooksState ? 
    <SearchPage setIsAddingBooksState={setIsAddingBooksState} setReviewBucket={setReviewBucket} reviewBucket={reviewBucket}/> :
    <ReviewPage shelfType={shelfType} reviewBucket={reviewBucket} setReviewBucket={setReviewBucket} setIsAddingBooksState={setIsAddingBooksState}/>;
}

const Container  = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${palette.grayscale.cloud};
  justify-content: space-between;
`;

const PageTitle = styled.Text`
  font-family: ivarheadline;
  font-size: 22px;
  line-height: 26px;
  text-align: center;
  color: ${palette.primary.navy};
`;

const PageSubtitle = styled.Text`
  font-family: larsseit;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${palette.primary.navy};
  margin-top: ${cosmos.unit * 3}px;
`;

const SearchInput = styled.TextInput`
  background-color: transparent;
  border-width: 1px;
  border-radius: 2px;
  border-color: ${palette.grayscale.stone};
  color: ${palette.primary.navy};
  margin-top: 40px;
  padding: ${cosmos.unit * 2}px 12px;
`;

const ButtonContainer = styled.View`
  background-color: ${palette.primary.linen};
  padding: ${cosmos.unit}px ${cosmos.unit * 4}px 26px ${cosmos.unit * 4}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const BookCardContainer = styled.TouchableOpacity`
  padding: 12px ${cosmos.unit * 2}px  12px ${cosmos.unit * 2}px;
  border-width: 1px;
  border-radius: 4px; 
  border-color: ${palette.grayscale.stone};
  flex-direction: row;
  align-items: flex-start;
`;

const SearchBookImage = styled.Image`
  width: 60px;
  height: 90px;
`;

const SearchBookImageBackground = styled.ImageBackground`
  width: 60px;
  height: 90px;
`;

const SearchBookTitle = styled.Text`
  font-family: larsseitbold;
  font-size: 16px;
  line-height: 24px;
  color: ${palette.primary.navy};
  text-align: left;
`;

const SearchBookAuthor = styled.Text`
  font-family: larsseit;
  font-size: 16px;
  line-height: 24px;
  color: ${palette.primary.navy};
  text-align: left;
  margin-top: 1px;
`;

const SearchBookReleaseDate = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  line-height: 24px;
  color: ${palette.grayscale.granite};
  text-align: left;
  margin-top: 2px;
`;

const SearchBookTitleContainer = styled.View`
  align-self: stretch;
  align-items: stretch;
  justify-content: flex-start;
  margin: 0px ${cosmos.unit}px;
  flex: 1;
`;       
