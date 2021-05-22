import React from 'react';
import Loading from 'components/Loading';
import { BookNavigator } from '../../navigation/BookNavigator';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useGetBookDetail } from 'hooks/useGetBook';
import { useGetUserFull } from 'hooks/useGetUser';

export const Book = (): JSX.Element => {
  const route = useRoute();

  const { bookId } = route.params as { bookId: string };
  const { clubId } = route.params as { clubId: string };
  const { navigateTo } = route.params as { navigateTo?: string };

  const { data: bookPageDetails, isLoading} = useGetBookDetail(bookId, clubId);
  const { data: fullUser, isLoading: isLoadingUserData } = useGetUserFull();

  return (
    <>
      {(isLoading || isLoadingUserData) ? <Loading/> :
        <View style={{ flex: 1 }}>
          <BookNavigator
            club={bookPageDetails}
            userDataFull={fullUser!}
            navigateTo={navigateTo}
            />
      </View> }
    </>
  );
};