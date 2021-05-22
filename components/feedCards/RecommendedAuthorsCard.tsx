import React from 'react';
import { View, Dimensions } from 'react-native';
import cosmos, { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';
import { CustomizableButton } from 'theme/Button';

import { getLargestImage } from 'shared/src/utils';
import { useFollow, useUnfollow } from 'hooks/useFollow';
import { cacheKey } from 'hooks/cacheStateKey';
import { IFeedCard } from 'shared/src/services/user-service';
import Carousel from 'react-native-snap-carousel';
import { IAuthor_Full } from 'shared/src/services/author-service';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { ROUTE } from 'lib/constants';

const placeholderAuthorImage = require('../../assets/images/icon.png');

export const RecommendedAuthorsCard = ({feedCard} : {feedCard: IFeedCard}) => {
  const { mutate: followUser, ...followInfo } = useFollow({invalidateKey: cacheKey.readerHomeFeed});
  const { mutate: unfollowUser, ...unfollowInfo } = useUnfollow({invalidateKey: cacheKey.readerHomeFeed});
  const sliderWidth = Dimensions.get('window').width;
  const navigation = useNavigation();

  const followButtonPressed = (follow: boolean, id: string | undefined) => {
    if (id === undefined) {
      console.error('ERROR: ID in followButtonPressed was undefined. feedCard', feedCard);
      return;
    }

    if (follow) {
      followUser({userID: id});
    } else {
      unfollowUser({userID: id});
    }
  }

  const onAuthorImagePressed = (authorData: IAuthor_Full) => {
    navigation.navigate(ROUTE.jamesbook, { username: authorData.usernameInfo?.username });
  }

  const CarouselItems = ({ item } : {item: IAuthor_Full}) => {
    return (
      <View style={{alignItems: 'center', width: sliderWidth/3, padding: cosmos.unit}}>
        <TouchableOpacity onPress={() => {onAuthorImagePressed(item)}} style={{width: (sliderWidth/3) - cosmos.unit * 2}}>
          <AuthorImage  source={getLargestImage(item.images) ? {uri: getLargestImage(item.images)} : placeholderAuthorImage}/>
        </TouchableOpacity>
        <AuthorName numberOfLines={1}>{item.name}</AuthorName>
        <CustomizableButton
          title={item.isFollowing ? 'Following' : 'Follow'}
          style={{backgroundColor: 'transparent', borderWidth: 1, borderRadius: 2, borderColor: palette.grayscale.granite, marginTop: cosmos.unit, height: 40}}
          textStyle={{color: palette.primary.navy}}
          activityIndicatorColor={palette.primary.navy}
          loading={ followInfo.isLoading || unfollowInfo.isLoading }
          disabled={ followInfo.isLoading || unfollowInfo.isLoading }
          onPress={() => followButtonPressed(!item.isFollowing, item.userRef)}
        />
      </View>
    );
  }

  return (
    <Container>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: cosmos.unit}}>
        <CardExplanationText><CardExplanationText style={{fontFamily: 'larsseitbold'}}>Recommended authors</CardExplanationText> to follow </CardExplanationText>
        
        <CustomizableButton
          title={'...'}
          onPress={() => {}}
          style={{height: 38, width: 32, backgroundColor: 'transparent', marginStart: 12, paddingHorizontal: 0, paddingVertical: 0}}
          textStyle={{fontSize: 28, color: palette.auxillary.charcoal.alt, lineHeight: 14}}
        />
      </View>

      <Carousel
        data={feedCard.data.authors ?? []}
        renderItem={CarouselItems}
        layout={'default'}
        activeSlideAlignment={'start'}
        firstItem={0}
        inactiveSlideScale={1}
        removeClippedSubviews={false}
        inactiveSlideOpacity={1}
        sliderWidth={sliderWidth}
        itemWidth={sliderWidth / 3}
        contentContainerCustomStyle={{ alignItems: 'center' }}
        ItemSeparatorComponent={() => <View style={{width: 4, backgroundColor: 'transparent'}}/>}
      />
    </Container>
  );
};

const Container = styled.View`
  padding: ${cosmos.unit * 2}px;
  background-color: ${palette.grayscale.white};
  flex: 1;
`;

const CardExplanationText = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  line-height: 15px;
  color: ${palette.auxillary.charcoal.alt};
  flex: 1;
`;

const AuthorName = styled.Text`
  font-family: larsseitbold;
  font-size: 16px;
  line-height: 22px;
  color: ${palette.primary.navy};
  flex: 1;
  margin-top: ${cosmos.unit}px;
  text-align: center;
`;

const AuthorImage = styled.Image`
  flex: 1;
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  border-radius: 300px;
`;
