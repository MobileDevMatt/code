import React from 'react';
import styled from 'styled-components/native';

import cosmos, { palette } from 'shared/src/cosmos';
import { Paragraph } from 'theme/Typography';
import { ScrollView, StyleProp, ViewStyle } from 'react-native';
import { ROUTE } from 'lib/constants';
import { useNavigation } from '@react-navigation/native';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { IBook } from 'shared/src/services/book-service';
import { getBookProgress } from 'shared/src/utils';

interface ITabProps {
  name?: string;
  onPress?: () => void;
  active?: boolean;
  theme?: TabSubNavigationTheme;
}

export enum TabSubNavigationTheme {
  DARK,
  LIGHT,
}


/**
 * @description
 * Sub navigation  that's primarily shown directly on top of the bottom tab navigation.
 */
export const TabsSubNavigation = (props: { children: JSX.Element[]; style: StyleProp<ViewStyle>; theme?: TabSubNavigationTheme }): JSX.Element => {
  const { children, style, theme } = props;

  return (
    <TabsMenu style={[style, {backgroundColor: theme === TabSubNavigationTheme.LIGHT ? palette.grayscale.white : palette.grayscale.black}]}>
      <ScrollView horizontal style={{ paddingBottom: cosmos.unit * 2 }}>
        {children}
      </ScrollView>
    </TabsMenu>
  ); 
};

const TabPill = ({ name, onPress, active, theme }: ITabProps) => {
  return (
    <>
      {active ? (
        <TabWrapper onPress={onPress}>
          <Tab style={{
              margin: 1,
              backgroundColor: theme === TabSubNavigationTheme.LIGHT ? palette.grayscale.white : palette.grayscale.black,
              borderColor: theme === TabSubNavigationTheme.LIGHT ? palette.primary.navy : palette.grayscale.white
            }}>
            <Paragraph style={{fontFamily: 'larsseitbold', color: theme === TabSubNavigationTheme.LIGHT ? palette.primary.navy : palette.grayscale.white}}>{name}</Paragraph>
          </Tab>
        </TabWrapper>
      ) : (
      <TabWrapper onPress={onPress}>
        <Tab 
          style={{
            opacity: 0.5,
            backgroundColor: theme === TabSubNavigationTheme.LIGHT ? palette.grayscale.granite + '40' : palette.grayscale.black,
            borderColor: theme === TabSubNavigationTheme.LIGHT ? palette.grayscale.granite + '40' : palette.grayscale.white
          }}
        >
          <Paragraph style={{fontFamily: 'larsseitbold', color: theme === TabSubNavigationTheme.LIGHT ? palette.grayscale.granite : palette.grayscale.white}}>{name}</Paragraph>
        </Tab>
      </TabWrapper>)}
    </>
  );
};

TabsSubNavigation.Tab = TabPill;

export const ClubTabSubNavigator = ({routeName, style, theme} : {routeName: string, style?: StyleProp<ViewStyle>, theme?: TabSubNavigationTheme}) => {
  const navigation = useNavigation();

  return (
    <TabsSubNavigation style={style} theme={theme}>
      <TabsSubNavigation.Tab
        name={'About'} onPress={() => navigation.navigate(ROUTE.BOOK_CLUB_ABOUT)}
        active={routeName === ROUTE.BOOK_CLUB_ABOUT}
        theme={theme}
      />

      <TabsSubNavigation.Tab
        name={'Club selections'}
        onPress={() => navigation.navigate(ROUTE.BOOK_CLUB_SELECTIONS)}
        active={routeName === ROUTE.BOOK_CLUB_SELECTIONS}
        theme={theme}
      />

      <TabsSubNavigation.Tab
        name={'Members'}
        onPress={() => navigation.navigate(ROUTE.BOOK_CLUB_MEMBERS)}
        active={routeName === ROUTE.BOOK_CLUB_MEMBERS}
        theme={theme}
      />

      <TabsSubNavigation.Tab
        name={'Conversations'}
        onPress={() => navigation.navigate(ROUTE.BOOK_CLUB_CONVERSATIONS)}
        active={routeName === ROUTE.BOOK_CLUB_CONVERSATIONS}
        theme={theme}
      />
    </TabsSubNavigation>
  );
}

export const AuthorClubTabSubNavigator = ({routeName, style, theme} : {routeName: string, style?: StyleProp<ViewStyle>, theme?: TabSubNavigationTheme}) => {
  const navigation = useNavigation();

  return (
    <TabsSubNavigation style={style} theme={theme}>
      <TabsSubNavigation.Tab
        name={'Featured Selection'} onPress={() => navigation.navigate(ROUTE.AUTHOR_FEATURED_SELECTION)}
        active={routeName === ROUTE.AUTHOR_FEATURED_SELECTION}
        theme={theme}
      />

      <TabsSubNavigation.Tab
        name={'Full profile'}
        onPress={() => navigation.navigate(ROUTE.AUTHOR_FULL_PROFILE)}
        active={routeName === ROUTE.AUTHOR_FULL_PROFILE}
        theme={theme}
      />
    </TabsSubNavigation>
  );
}

export const ProfilePageTabSubNavigator = ({routeName, style, theme} : {routeName: string, style?: StyleProp<ViewStyle>, theme?: TabSubNavigationTheme}) => {
  const navigation = useNavigation();

  return (
    <TabsSubNavigation style={style} theme={theme}>
      <TabsSubNavigation.Tab
        name={'Reading list'} onPress={() => navigation.navigate(ROUTE.PROFILE_BOOK_SHELVES)}
        active={routeName === ROUTE.PROFILE_BOOK_SHELVES}
        theme={theme}
      />

      <TabsSubNavigation.Tab
        name={'Connections'}
        onPress={() => navigation.navigate(ROUTE.PROFILE_CONNECTIONS)}
        active={routeName === ROUTE.PROFILE_CONNECTIONS}
        theme={theme}
      />
    </TabsSubNavigation>
  );
}

export const BookSubNavigator = ({routeName, style, currentUserDataFull, book, theme} : {routeName: string, style?: StyleProp<ViewStyle>, currentUserDataFull: IAPI_User_Full, book: IBook, theme?: TabSubNavigationTheme}) => {
  const navigation = useNavigation();

  const isLocked = book?.authors?.find(author => author?.authorRef) === undefined;

  const bookProgress = getBookProgress(currentUserDataFull, book?._id, true);

  return (
    <TabsSubNavigation style={style} theme={theme}>
      <TabsSubNavigation.Tab
        name={'Details'} onPress={() => navigation.navigate(ROUTE.BOOK_DETAIL)}
        active={routeName === ROUTE.BOOK_DETAIL}
        theme={theme}
      />

      { !isLocked &&
        <TabsSubNavigation.Tab
          name={'Readerboard'}
          onPress={() => navigation.navigate(ROUTE.READERBOARD)}
          active={routeName === ROUTE.READERBOARD}
          theme={theme}
        />
      }
      

      { bookProgress !== undefined &&
        <TabsSubNavigation.Tab
          name={'Explore'}
          onPress={() => navigation.navigate(ROUTE.BOOK_EXPLORE)}
          active={routeName === ROUTE.BOOK_EXPLORE}
          theme={theme}
        />
      }

      <TabsSubNavigation.Tab
        name={'Conversations'} onPress={() => navigation.navigate(ROUTE.BOOK_CONVERSATIONS)}
        active={routeName === ROUTE.BOOK_CONVERSATIONS}
        theme={theme}
      />
    </TabsSubNavigation>
  );
}


const TabsMenu = styled.View`
  width: 100%;
  padding-top:${cosmos.unit * 2}px;
  padding-horizontal:${cosmos.unit * 2}px;
`;

const Tab = styled.View`
  height: ${cosmos.unit * 4}px;
  padding-horizontal: ${cosmos.unit * 2}px;
  align-items: center;
  width: auto;
  justify-content: center;
  border-radius: ${cosmos.unit * 2}px;
  border-width: 1px;
`;

const TabWrapper = styled.TouchableOpacity`
  margin-right: ${cosmos.unit * 2}px;
`;
