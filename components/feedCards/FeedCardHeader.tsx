import React from 'react';

import { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import { FEED_CARD_SUB_TYPES, IAPI_User_Full, IFeedCard } from 'shared/src/services/user-service'
import { CustomizableButton } from 'theme/Button';
import { ROUTE } from 'lib/constants';
import { cacheKey } from 'hooks/cacheStateKey';
import { TouchableOpacity } from 'react-native';


interface IFeedCardHeaderInterface {
  feedCard: IFeedCard,
  currentUserDataFull: IAPI_User_Full | undefined,
  showOptionsButton?: boolean,
  optionsButtonAction?: () => void,
}

export const FeedCardHeader = ({feedCard, currentUserDataFull, showOptionsButton, optionsButtonAction} : IFeedCardHeaderInterface) => {
  const navigation = useNavigation();

  enum NavTypes {
    userProfilePage,
    authorClubPage,
    clubPage,
  }

  const handlenavigation = (navType: NavTypes) => {
    if (navType === NavTypes.userProfilePage) {
      navigation.navigate(ROUTE.PUBLIC_PROFILE_PAGE, {currentUserProfilePic: currentUserDataFull?.images, currentUserFullName: currentUserDataFull?.name,  userId: feedCard.data.userRef?._id, additionalInvalidateKeys: [cacheKey.myUser]});
    } else if (navType === NavTypes.authorClubPage) {
      navigation.navigate(ROUTE.jamesbook, { clubId: feedCard.data.clubRef?._id });
    } else if (navType === NavTypes.clubPage) {
      navigation.navigate(ROUTE.jamesbook, { clubId: feedCard.data.clubRef?._id });
    }
  }

  const onOptionPressed = () => {
    if (optionsButtonAction) {
      optionsButtonAction();
    }
  }

  const Wrapper = (props: { children: any; buttonAction: () => void; }) => {
    const {children, buttonAction} = props;
    return (
      <TouchableOpacity onPress={() => {buttonAction()}} style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        
        {children}

        { showOptionsButton &&
          <CustomizableButton
            title={'...'}
            onPress={() => {onOptionPressed()}}
            style={{height: 38, width: 32, marginStart: 12, paddingHorizontal: 0, paddingVertical: 0,alignItems: 'center', backgroundColor: 'transparent'}}
            textStyle={{fontSize: 28, color: palette.auxillary.charcoal.alt, lineHeight: 14}}
          />
        }
      </TouchableOpacity>
    );
  }


  let authorName = undefined;
  if (feedCard.data.bookRef?.authors) {
    authorName = feedCard.data.bookRef?.authors[0] && feedCard.data.bookRef?.authors[0].name ? feedCard.data.bookRef?.authors[0].name  : 'Author';
  }

  switch(feedCard.subType) {
    case FEED_CARD_SUB_TYPES.AUTHOR_UNLOCKED:
      return (
        <Wrapper buttonAction={() => {handlenavigation(NavTypes.authorClubPage)}}>
          <CardExplanationText>
            {authorName} unlocked their book <CardExplanationText style={{fontFamily: 'larsseitbold'}}>{feedCard.data.bookRef?.title}</CardExplanationText>!
          </CardExplanationText>
        </Wrapper>
      );
    case FEED_CARD_SUB_TYPES.CLUB_FEATURED_SELECTION:
      return (
        <Wrapper buttonAction={() => {handlenavigation(NavTypes.clubPage)}}>
          <CardExplanationText>
            New featured selection in your club <CardExplanationText style={{fontFamily: 'larsseitbold'}}>{feedCard.data.clubRef?.name}</CardExplanationText>!
          </CardExplanationText>
        </Wrapper>
      );
    case FEED_CARD_SUB_TYPES.USER_STARTED:
      return (
        <Wrapper buttonAction={() => {handlenavigation(NavTypes.userProfilePage)}}>
          <CardExplanationText>
            <CardExplanationText style={{fontFamily: 'larsseitbold'}}>{feedCard.data.userRef?.name}</CardExplanationText> started a new book
          </CardExplanationText>
        </Wrapper>
      );
    case FEED_CARD_SUB_TYPES.HOST_POST:
      return (
        <Wrapper buttonAction={() => {}}>
          <CardExplanationText>
              Updated in your club <CardExplanationText style={{fontFamily: 'larsseitbold'}}>{feedCard.data.clubRef?.name}</CardExplanationText>
          </CardExplanationText>
        </Wrapper>
      );
    default:
      console.error(`Error: Encountered card sub-type ${feedCard.subType} which was not handled by FeedCardHeader`);
      return null;
  }
};

const CardExplanationText = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  line-height: 22px;
  color: ${palette.auxillary.charcoal.alt};
  text-align: justify;
  flex: 1;
`;
