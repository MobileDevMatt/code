import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import cosmos, { palette } from 'shared/src/cosmos';
import PlayVideoModal from 'components/video/PlayVideoModal';
import { OverlineLight, Paragraph, Title } from 'theme/Typography';
import { SecondaryButton } from 'theme/Button';
import { months } from 'shared/src/lib/constants';
import { IClubDetail } from 'shared/src/services/club-service';
import { ROUTE } from 'lib/constants';
import { getLargestImage } from 'shared/src/utils';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { BCContainer } from 'components/containers/BCContainer';
import { ClubTabSubNavigator } from 'components/TabsSubNavigation';

const jamesbook = ({ club, currentUserData }: { club: IClubDetail, currentUserData?: IAPI_User_Full }): JSX.Element => {
  const navigation = useNavigation();
  const sliderWidth = Dimensions.get('window').width;
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const currentBookSelection = club?.featuredSelections.books[0];
  const pastBookSelections = club?.pastSelections?.books || [];
  const selections = [ currentBookSelection, ...pastBookSelections ];
  const activeSelection = selections[activeIndex];

  const bookAuthors = activeSelection?.bookRef?.authors || [];
  const bookTrailerVideoUrl = activeSelection?.trailer?.contentUrl;

  const _renderSelection = ({ item, index }) => {
    return (
      <View key={index}>
        {item?.bookRef?.coverImage?.medium ? (
          <BookCoverImage source={{ uri: getLargestImage(item?.bookRef?.coverImage) }}/>
        ) : (
          <BookImagePlaceholder/>
        )}
      </View>
    );
  };

  const activeDate = activeSelection?.activeRange?.start ? new Date(activeSelection?.activeRange?.start as Date) : null;
  const activeMonth = activeDate?.getMonth();
  const activeYear = activeDate?.getFullYear();

  return (
    <BCContainer style={{flex: 1}} pageTitle={club?.name} showBackButton={true} userImage={currentUserData?.images} userFullName={currentUserData?.name}>
      <SelectionDetailWrapper
        contentContainerStyle={{ alignItems: 'center', paddingBottom: cosmos.unit * 6 }}
        alwaysBounceVertical={false}>

        <ClubTabSubNavigator routeName={ROUTE.BOOK_CLUB_SELECTIONS}/>

        <CurrentSelection>
          <jamesbookImage
            resizeMode={'cover'}
            source={{ uri: getLargestImage(activeSelection?.image) }}
          >
            <ThumbNailGradient colors={['transparent', palette.grayscale.black]}>
              {activeDate ? <SelectionDate>{months[activeMonth]} {activeYear}</SelectionDate> : null}
              <SelectionBookTitle>{activeSelection?.bookRef.title}</SelectionBookTitle>
              <Paragraph style={{ marginTop: cosmos.unit }}>with the
                author <AuthorName>{bookAuthors[0]?.name}</AuthorName></Paragraph>
            </ThumbNailGradient>
          </jamesbookImage>
          <ButtonArea>
            <WatchIntroButton
              title="Intro"
              textColor={palette.grayscale.black}
              icon={
                <MaterialCommunityIcons name={`play`} size={cosmos.unit * 3} color={palette.grayscale.black}/>
              }
              onPress={() => {
                setShowIntroVideo(true);
              }}
            />
            <DetailsButton
              title="Details"
              onPress={() => { navigation.navigate(ROUTE.BOOK, { bookId: activeSelection?.bookRef?._id,clubId: club?._id});}}
            />
          </ButtonArea>
        </CurrentSelection>


        <CarouselContainer style={styles.shadowStyles}>
          <View style={{
            width: '100%',
            height: 130,
            backgroundColor: palette.primary.linen,
            position: 'absolute',
            top: 100,
          }}/>
          <Carousel
            data={selections}
            renderItem={_renderSelection}
            layout={'default'}
            activeSlideAlignment={'center'}
            enableSnap
            firstItem={0}
            inactiveSlideScale={0.5}
            inactiveSlideShift={100}
            removeClippedSubviews={false}
            inactiveSlideOpacity={1}
            sliderWidth={sliderWidth}
            onSnapToItem={index => setActiveIndex(index)}
            itemWidth={160}
            containerCustomStyle={{
              backgroundColor: 'transparent',
              height: 242,
              flexGrow: 0,

            }}
          />
        </CarouselContainer>
        <PlayVideoModal isVideoVisible={showIntroVideo} hideVideo={() => {
          setShowIntroVideo(false);
        }} videoUrl={bookTrailerVideoUrl}/>
      </SelectionDetailWrapper>
    </BCContainer>


  );
};

export default jamesbook;


const styles = StyleSheet.create({
  shadowStyles: {
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 8,
      height: 12,
    },
    shadowRadius: 36,
    shadowOpacity: 1.0,
    elevation: 2,
  },
});

const SelectionDetailWrapper = styled.ScrollView`
  background-color: ${palette.primary.linen};
`;

const CarouselContainer = styled.View`
  height: 242px;
  border-bottom-width: ${cosmos.unit * 1.5}px;
  background-color: ${palette.grayscale.black};
  border-bottom-color: ${palette.grayscale.white};
  margin-bottom: ${cosmos.unit * 4}px;
`;

const BookCoverImage = styled.Image`
  width: 164px;
  height: 242px;
  border:4px solid white;
  resize-mode: cover;
  align-self: center;
`;

const BookImagePlaceholder = styled.View`
  width: 102px;
  height: 154px;
  background-color: ${palette.grayscale.granite};
  align-self: center;
`;

const AuthorName = styled.Text`
  font-family: larsseitbold;
`;

const SelectionDate = styled(OverlineLight)`
  margin-bottom: ${cosmos.unit}px;
  font-size: ${cosmos.unit * 2.5}px;
`;

const jamesbookImage = styled(ImageBackground)`
  width: 100%;
  height: 360px;
  background-color: ${palette.grayscale.black};
`;

const ButtonArea = styled.View`
  align-items: center;
  background-color: ${palette.grayscale.black};
  margin-top: ${cosmos.unit}px;
  flex-direction: row;
  margin-bottom: ${cosmos.unit * 3}px;
  padding-horizontal: ${cosmos.unit * 2}px;
  width: 100%;
`;

const CurrentSelection = styled.View`
  padding-bottom: ${cosmos.unit * 2}px;
  width: 100%;
  background-color: ${palette.grayscale.black};
`;

const WatchIntroButton = styled(SecondaryButton)`
  width: 128px;
  background-color: ${palette.grayscale.white};
  margin-right: ${cosmos.unit}px;
`;

const DetailsButton = styled(SecondaryButton)`
  width: 114px;
  background-color: transparent;
  margin-left: ${cosmos.unit}px;
`;

const SelectionBookTitle = styled(Title)`
  max-width: 340px;
  text-align: left;
  margin-bottom: 8px;
`;

const ThumbNailGradient = styled(LinearGradient)`
  width: 100%;
  height: 360px;
  justify-content: flex-end;
  padding-horizontal:${cosmos.unit * 2}px;
  padding-bottom: ${cosmos.unit * 2}px;
`;

