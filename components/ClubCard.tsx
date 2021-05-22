import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import cosmos, { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';
import { Paragraph } from 'theme/Typography';


interface IProps {
  clubTrailerImage?: string;
  bookCoverImage?: string;
  onPress?: () => void;
  title: string;
  subtitle?: string;
}

const ClubCard = (
  { clubTrailerImage,
    onPress,
    title,
    subtitle,
    bookCoverImage
  }: IProps) => (

  <CardWrapper onPress={onPress}>
    <ClubTrailerImage source={{ uri: clubTrailerImage }}/>
    <DetailsContainer>
      <View style={{ flex: 1 }}>
        <Title numberOfLines={1}>{title}</Title>
        <SubTitle style={{ marginTop: 2 }} numberOfLines={1}>{subtitle}</SubTitle>
      </View>
      { bookCoverImage ? <BookCoverImage source={{ uri: bookCoverImage }}/> : null }
    </DetailsContainer>
  </CardWrapper>
);

export default ClubCard;

const Title = styled(Paragraph)`
  font-family: larsseitbold;
`;

const SubTitle = styled(Paragraph)`
  color: ${palette.grayscale.granite};
`;

const DetailsContainer = styled.View`
  margin-top: ${cosmos.unit * 2}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
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

const ClubTrailerImage = styled.Image`
  width:284px;
  height:${cosmos.unit * 20}px ;
`;

const CardWrapper = styled.TouchableOpacity`
  max-width: 284px;
  margin-horizontal: ${cosmos.unit * 2}px;
`;
