import React from 'react';
import { useNavigation } from '@react-navigation/native';
import cosmos, { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OverlineLight, Paragraph, SectionTitle } from 'theme/Typography';
import { SecondaryButton } from 'theme/Button';
import PlayVideoModal from '../video/PlayVideoModal';
import { fallbackBookCover, months } from 'shared/src/lib/constants';
import { ROUTE } from 'lib/constants';
import { IClubBook, IClubDetail } from 'shared/src/services/club-service';
import { getLargestImage } from 'shared/src/utils';
import { ReadMore } from 'components/ReadMore';

interface IProps {
  club: IClubDetail;
  selection?: IClubBook;
}

const CurrentBookSelection = ({ club, selection }: IProps) => {
  const navigation = useNavigation();
  const [showSelectionVideo, setShowSelectionVideo] = React.useState(false);
  const [bookVideoUrl, setBookVideoUrl] = React.useState('');

  const bookAuthors = selection?.bookRef?.authors || [];
  const bookId = selection?.bookRef?._id;
  const bookTitle = selection?.bookRef?.title;
  const bookImage = selection?.bookRef?.coverImage;
  const summary = selection?.bookRef?.longSummary;

  const activeDate = selection?.activeRange?.start ? new Date(selection?.activeRange?.start as Date) : null;
  const activeMonth = activeDate?.getMonth();
  const activeYear = activeDate?.getFullYear();

  return (
    <SelectionWrapper onPress={() => navigation.navigate(ROUTE.BOOK, { bookId, clubId: club?._id })}>
      {activeDate ? <SelectionTitle>{months[activeMonth]} {activeYear} selection</SelectionTitle> : null}
      <BookDetailsWrapper>

        <BookCoverImage
          source={{ uri: getLargestImage(bookImage) || fallbackBookCover }}
        />
        <View style={{flex:1}}>
          <SectionTitle>{bookTitle}</SectionTitle>
          <Paragraph style={{ marginTop: cosmos.unit }}>by <AuthorName>{bookAuthors[0]?.name}</AuthorName></Paragraph>
          <BookMetaData>
            <MetaDataWrapper style={{ marginRight: cosmos.unit * 2 }}>
              {/*<Feather style={{ marginRight: 5 }} name="bookmark" size={cosmos.unit * 2} color={palette.grayscale.granite}/>*/}
              {/*<MetaData>994 saved</MetaData>*/}
            </MetaDataWrapper>

            {/*TODO: Add back Metadata as soon as backend returns it */}
            <MetaDataWrapper>
              {/*<Feather style={{ marginRight: 5 }} name="book-open" size={cosmos.unit * 2} color={palette.grayscale.granite}/>*/}
              {/*<MetaData>2,102 active</MetaData>*/}
            </MetaDataWrapper>
          </BookMetaData>
        </View>
      </BookDetailsWrapper>

      <ReadMore
        text={summary}
        TextWrapper={BookSummary}
      />

      <ButtonsWrapper>
        <PlayTrailerButton
          title="Play trailer"
          icon={
            <Ionicons name={`play-circle-outline`} size={cosmos.unit * 3} color="white"/>
          }
          onPress={() => {
            setShowSelectionVideo(true);
            setBookVideoUrl(selection?.trailer?.contentUrl)
          }}
        />
        <PlayBookSampleButton
          title="Book sample"
          icon={
            <Ionicons name={`play-circle-outline`} size={cosmos.unit * 3} color="white"/>
          }
          onPress={() => {
            setShowSelectionVideo(true);
            setBookVideoUrl(club?.sample?.contentUrl)
          }}
        />

      </ButtonsWrapper>
      <PlayVideoModal isVideoVisible={showSelectionVideo} hideVideo={() => {
        setShowSelectionVideo(false);
      }} videoUrl={bookVideoUrl}/>
    </SelectionWrapper>
  );
};

export default CurrentBookSelection;

const BookDetailsWrapper = styled.View`
  flex-direction: row;
  padding-top: ${cosmos.unit * 1.5}px;
  padding-bottom: ${cosmos.unit * 2}px;
`;

const BookMetaData = styled.View`
  flex-direction: row;
  padding-top: ${cosmos.unit * 1.5}px;
`;

const BookCoverImage = styled.Image`
  width: 100px;
  height: 152px;
  background-color: ${palette.grayscale.white};
  margin-right: ${cosmos.unit * 1.5}px;
  resize-mode: cover;
  align-self: center;
`;

const SelectionWrapper = styled.TouchableOpacity`
  width: 100%;
  padding-top: ${cosmos.unit * 4}px;
  padding-horizontal:${cosmos.unit * 2}px;
  padding-bottom: ${cosmos.unit * 3}px;
`;

const AuthorName = styled.Text`
  font-family: larsseitbold;
`;

const SelectionTitle = styled(OverlineLight)`
  font-size: 20px;
`;

const MetaData = styled.Text`
  font-family: larsseit;
  font-size:  ${cosmos.unit * 1.5}px;
  text-align: left;
  color: ${palette.grayscale.granite};
`;

const MetaDataWrapper = styled.View`
  flex-direction: row;
`;

const BookSummary = styled(Paragraph)`
  margin-bottom: ${cosmos.unit * 2}px;
`;

const ButtonsWrapper = styled.View`
  align-items: center;
  margin-top: ${cosmos.unit * 2}px;
  flex-direction: row;
  width: 100%;
`;

const PurchaseButton = styled(SecondaryButton)`
  width: 114px;
  background-color: transparent;
  margin-left: ${cosmos.unit}px;
`;

const MarkAsReadButton = styled(TouchableOpacity)`
  width: 162px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  height: 42px;
  background-color: ${palette.grayscale.white};
  justify-content: center;
  align-items: center;
`;

const ShowMoreButton = styled(TouchableOpacity)`
  width: 42px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-left-color: ${palette.grayscale.black};
  border-left-width: 1px;
  height: 42px;
  background-color: ${palette.grayscale.white};
  justify-content: center;
  align-items: center;
`;

const PlayTrailerButton = styled(SecondaryButton)`
  width: ${cosmos.unit * 20}px;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: transparent;
  margin-right: ${cosmos.unit}px;
`;

const PlayBookSampleButton = styled(SecondaryButton)`
  width: ${cosmos.unit * 22}px;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: transparent;
`;
