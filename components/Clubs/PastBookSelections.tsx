import React from 'react';
import { useNavigation } from '@react-navigation/native';
import cosmos, { palette } from 'shared/src/cosmos/index';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { OverlineLight, Paragraph } from 'theme/Typography';
import { fallbackBookCover } from 'shared/src/lib/constants';
import { IClubBook,IClubDetail } from 'shared/src/services/club-service';
import ClubCard from '../ClubCard';
import { ROUTE } from 'lib/constants';
import { getLargestImage } from 'shared/src/utils';


interface IProps {
  club: IClubDetail;
  selections?: IClubBook[];
}

const PastBookSelections = ({ selections = [],club }: IProps) => {
  const navigation = useNavigation();

  return (
    <SelectionsWrapper>
      <Title>More Selections</Title>
      <Selections horizontal>
        {selections.map((selection, index) => {
          const book = selection?.bookRef;
          const bookId = book?._id;
          return (
            <ClubCard
              onPress={() => navigation.navigate(ROUTE.BOOK, { bookId, clubId: club?._id })}
              key={index}
              title={book?.title}
              subtitle={book.subtitle}
              clubTrailerImage={getLargestImage(selection?.image) || fallbackBookCover}
              bookCoverImage={getLargestImage(book?.coverImage) || fallbackBookCover }
            />
          );
        })}
      </Selections>
    </SelectionsWrapper>
  );
};

export default PastBookSelections;


const Selections = styled.ScrollView`
  padding-top: ${cosmos.unit * 3}px;
  padding-bottom: ${cosmos.unit * 4}px ;
`;

const BookTitle = styled(Paragraph)`
  font-family: larsseitbold;
  margin-top: 12px;
`;

const BookSubTitle = styled(Paragraph)`
  color: ${palette.grayscale.granite};
`;

const Title = styled(OverlineLight)`
  text-transform: uppercase;
`;

const SelectionsWrapper = styled(View)`
  padding-horizontal: ${cosmos.unit * 2}px;
  padding-top: ${cosmos.unit * 3}px;
  width: 100%;
`;

const BookCoverImage = styled.Image`
  width: 53px;
  height: 80px;
  background-color: ${palette.grayscale.white};
  resize-mode: cover;
  margin-left: ${cosmos.unit}px;
  align-self: center;
  margin-top: -${cosmos.unit * 4}px;
  margin-right: ${cosmos.unit}px;
`;

const BookTrailerImage = styled.Image`
  width:284px;
  height:${cosmos.unit * 20}px ;
`;

const Selection = styled.View`
  max-width:284px;
  margin-right: ${cosmos.unit * 2}px;
`;

const SelectionDetailsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;
