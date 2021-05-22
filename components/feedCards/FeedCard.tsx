import React from 'react';
import { FEED_CARD_SUB_TYPES, FEED_CARD_TYPES, IAPI_User_Full, IFeedCard } from 'shared/src/services/user-service'
import { BookCard } from './BookCard';
import { RecommendedAuthorsCard } from './RecommendedAuthorsCard';
import { TextCard } from './TextCard';

interface IFeedCardInterface {
  feedCard: IFeedCard,
  currentUserDataFull: IAPI_User_Full | undefined,
  isModerator?: boolean,
}


export const FeedCard = ({feedCard, currentUserDataFull, isModerator} : IFeedCardInterface) => {
  if (feedCard.type === FEED_CARD_TYPES.BOOK) {
    return (
      <BookCard 
        feedCard={feedCard} 
        currentUserDataFull={currentUserDataFull}
      />
    )
  } else if (feedCard.type === FEED_CARD_TYPES.VIDEO) {
    return null;
  } else if (feedCard.type === FEED_CARD_TYPES.LIST && feedCard.subType === FEED_CARD_SUB_TYPES.RECOMMENDED_AUTHORS) {
    return <RecommendedAuthorsCard feedCard={feedCard}/>
  } else if (feedCard.type === FEED_CARD_TYPES.POST && feedCard.subType === FEED_CARD_SUB_TYPES.HOST_POST) {
    return (
      <TextCard 
        feedCard={feedCard} 
        currentUserData={currentUserDataFull} 
        isModerator={isModerator ?? false} 
      />
    )
  }

  console.error(`Error: Encountered card type ${feedCard.type} with subType ${feedCard.subType} which was not handled by FeedCard`);
  return (null)
};