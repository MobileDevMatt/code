import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE } from 'lib/constants';
import { BookExplore } from 'screens/member/BookExplore';
import { BookDetails } from 'screens/member/BookDetails';
import { IClubDetail } from 'shared/src/services/club-service';
import { Members, MembersType } from 'components/Members/Members';
import { BookConversations } from 'components/bookComponents/BookConversations';
import { IAPI_User_Full } from 'shared/src/services/user-service';

const Stack = createStackNavigator();

interface IProps {
  club?: IClubDetail;
  userDataFull: IAPI_User_Full,
  navigateTo?: string,
}

export const BookNavigator = ({ club, userDataFull, navigateTo }: IProps) => {
  const navigation = useNavigation();
  const guideId = club?.bookDetails?.discussionGuideRef || '';
  const book = club?.bookDetails?.bookRef;
  const playlist = club?.playlist ? club?.playlist : [];



  useEffect(() => {
    if (navigateTo) {
      navigation.navigate(navigateTo);
    }
  }, [navigateTo]);

  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardOverlayEnabled: true,
          cardStyleInterpolator: forFade,
          cardStyle: { backgroundColor: 'transparent' },
        }}
        mode="modal"
        headerMode="none">
        <Stack.Screen name={ROUTE.BOOK_DETAIL}>
          {(props) =>
            <BookDetails {...props}
              club={club}
              userDataFull={userDataFull}
            />}
        </Stack.Screen>
        <Stack.Screen name={ROUTE.READERBOARD}>
          {(props) => <Members {...props} club={club} book={book} type={MembersType.READERBOARD} pageTitle={club?.bookDetails?.bookRef.title} currentUserData={userDataFull}/>}
        </Stack.Screen>
          <Stack.Screen name={ROUTE.BOOK_EXPLORE}>
            {(props) =>
              <BookExplore {...props}
                userDataFull={userDataFull}
                book={book}
                guideId={guideId}
                playlist={playlist}/>}
          </Stack.Screen>
        <Stack.Screen name={ROUTE.BOOK_CONVERSATIONS}>
          {(props) =>
            <BookConversations {...props} book={book} userDataFull={userDataFull}
            />}
        </Stack.Screen>
      </Stack.Navigator>
    </View>
  );
}
