import React, { useEffect, useState } from 'react';
import cosmos, { palette } from 'shared/src/cosmos';
import styled, { css } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Dimensions, TouchableOpacity, View } from 'react-native';
import { H1Dark, ParagraphDark } from 'theme/Typography';
import { Button } from 'theme/Button';
import { getLargestImage } from 'shared/src/utils';
import { IClubDetail } from 'shared/src/services/club-service';
import { useGetUser, useGetUserProfile } from 'hooks/useGetUser';
import { AUDIENCE } from 'shared/src/services/conversation-service';
import { IBook } from 'shared/src/services/book-service';
import { useGetClubMutation } from 'hooks/useClubs';
import { IUser_Club } from 'shared/src/services/user-service';


interface IProps {
  selectedClub: (IClubDetail & IUser_Club) | undefined
  selectedClubBook?: IBook | null;
  selectedPrivacyOption?: { name: string, description: string, value: AUDIENCE } | undefined;
  setSelectedClubBook: React.Dispatch<React.SetStateAction<IBook | undefined>>;
  goToNextStep: () => void;
}


const WINDOW_WIDTH = Dimensions.get('window').width;
const ROW_WIDTH = WINDOW_WIDTH - (cosmos.unit * 3);

const BOOK_WIDTH = ROW_WIDTH / 2;


export const ClubBookSelectionStep = ({ selectedClub, goToNextStep, setSelectedClubBook, selectedClubBook, selectedPrivacyOption }: IProps) => {
  const insets = useSafeAreaInsets();
  const [books, setBooks] = useState<IBook[]>([]);
  const { data: user } = useGetUser();
  const { data: userData, ...userDataFetchInfo } = useGetUserProfile({ userId: user?._id });
  const isOpenPrivacy = selectedPrivacyOption?.name === 'Open';

  const { mutate: getClub, isLoading } = useGetClubMutation();

  useEffect(() => {
    if (selectedClub?.pastSelections?.books) {
      const club = selectedClub;
      const hasBooks = (club?.pastSelections?.books && club?.featuredSelections?.books) && (club?.pastSelections?.books?.length > 0 || club?.featuredSelections?.books?.length > 0);
      if (hasBooks) {
        const books = [...(club?.pastSelections?.books || []), ...(club?.featuredSelections?.books || [])].map((book) => book.bookRef);
        setBooks(books);
      }
    } else if (selectedClub?.clubRef) {
      getClub(selectedClub?.clubRef, {
        onSuccess: (club) => {
          const hasBooks = (club?.pastSelections?.books && club?.featuredSelections?.books) && (club?.pastSelections?.books?.length > 0 || club?.featuredSelections?.books?.length > 0);
          if (hasBooks) {
            const books = [...(club?.pastSelections?.books || []), ...(club?.featuredSelections?.books || [])].map((book) => book.bookRef);
            setBooks(books);
          }
        },
      });
    }

    if (isOpenPrivacy) {
      const bookRefs = [...(userData?.currentShelf?.books || []), ...(userData?.completedShelf?.books || [])];
      const books = bookRefs.map(book => book?.bookRef);
      setBooks(books);
    }

  }, [selectedClub, isOpenPrivacy, userData]);


  const handleFormSubmit = () => {
    goToNextStep();
  };

  return (
    <>
      <Wrapper contentContainerStyle={{ paddingBottom: cosmos.unit * 6 }}>
        <OptionsWrapper>
          <TitleContainer>
            <ModalHeader>
              <H1Dark>{isOpenPrivacy ? 'Choose a book' : 'Choose a club selection'}</H1Dark>
              <TouchableOpacity onPress={goToNextStep}>
                <ParagraphDark>Skip</ParagraphDark>
              </TouchableOpacity>
            </ModalHeader>
          </TitleContainer>
          <View style={{ marginTop: cosmos.unit }}>
            {(userDataFetchInfo.isLoading) ? (<ActivityIndicator size='large' color={palette.grayscale.black}/>) : (
              <ClubBookSelections>
                {books.map((selection, index) => {
                  return (
                    <BookOptionWrapper key={index}>
                      <BookOption
                        selected={selection?._id === selectedClubBook?._id}
                        onPress={() => setSelectedClubBook(selection)}
                        key={index}>
                        <BookCoverImage source={{ uri: getLargestImage(selection?.coverImage) }}/>
                      </BookOption>
                    </BookOptionWrapper>

                  );
                })}
              </ClubBookSelections>
            )}
          </View>
        </OptionsWrapper>


      </Wrapper>
      <ButtonContainer style={{ marginBottom: Math.max(insets.bottom, 16) }}>
        <Button
          title={'Next'}
          style={{ width: '100%', opacity: selectedClubBook === null ? 0.5 : 1 }}
          disabled={selectedClubBook === null}
          onPress={handleFormSubmit}
        />
      </ButtonContainer>
    </>
  );
};

const OptionsWrapper = styled.View`
  padding-top: ${cosmos.unit * 3}px;
`;

const BookCoverImage = styled.Image`
  width: 92px;
  height: 140px;
  resize-mode: cover;
  align-self: center;
`;

const BookOptionWrapper = styled.View`
  height: 180px;
  width: ${BOOK_WIDTH}px;
  padding-horizontal:4px;
`;

const ClubBookSelections = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-horizontal:${cosmos.unit * 1.5}px;
`;

const BookOption = styled.TouchableOpacity`
  flex:1;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${cosmos.unit}px;
  background-color: ${palette.primary.linen};
  ${(props: any) => {
  if (props?.selected) {
    return css`
            border: 2px solid ${palette.primary.bcBlue};
        `;
  }
}}
`;

const TitleContainer = styled.View`
  padding-horizontal:${cosmos.unit * 2}px;
  margin-bottom:  ${cosmos.unit}px;
`;

const Wrapper = styled.ScrollView`
  width: 100%;
  padding-bottom: ${cosmos.unit * 8}px;
`;

const ButtonContainer = styled.View`
  margin-top: ${cosmos.unit * 3}px;
  padding-horizontal:${cosmos.unit * 2}px;
`;

const ModalHeader = styled.View`
  margin-bottom: ${cosmos.unit}px;
  flex-direction: row;
  justify-content: space-between;
`;

