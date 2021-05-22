import React from 'react';
import styled from 'styled-components/native';
import { ScrollView, View, Text } from "react-native";

import cosmos, { palette } from "shared/src/cosmos";
import { IUserShelf, SHELF_TYPE } from 'shared/src/services/user-service';

import { BookShelf } from 'components/bookComponents/BookShelf';
import { ProfilePagePersonalInfo } from './ProfilePagePersonalInfo';
import { IImage } from 'shared/src/services';
import { BCContainer } from 'components/containers/BCContainer';
import { AuthorClubTabSubNavigator, ProfilePageTabSubNavigator, TabSubNavigationTheme } from 'components/TabsSubNavigation';

interface IProfilePage {
  name: string,
  bio?: string,
  username?: string,
  profilePic?: IImage,
  numFollowing?: number,
  numFollowers?: number,
  currentShelf?: IUserShelf,
  toReadShelf?: IUserShelf,
  pausedShelf?: IUserShelf,
  completedShelf?: IUserShelf,
  isAuthor?: boolean,
  isSelf: boolean,
  isFollowing?: boolean,
  userId: string,
  isPrivate?: boolean,
  invalidateKey?: string | [string, string];
  additionalInvalidateKeys?: string[] | [string, string][];
  currentUserProfilePic?: IImage | undefined;
  currentUserFullName?: string;
  pageTitle: string;
  subNavigatorName?: string;
  subNavigationType?: 'AuthorClubTabSubNavigator' | 'ProfilePageTabSubNavigator';
  subNavTheme?: TabSubNavigationTheme;
}

export const ProfilePage = ({subNavTheme, subNavigatorName, subNavigationType, name, bio, username, profilePic, numFollowing, numFollowers, currentShelf, toReadShelf, pausedShelf, completedShelf, isAuthor, isSelf, isFollowing, userId, isPrivate, invalidateKey, additionalInvalidateKeys, currentUserProfilePic, currentUserFullName, pageTitle}: IProfilePage) => {
  // TODO: Hovo: For userData.numFollowing and userData.numFollowers, use the correct names when the server is ready.
  
  const PrivacyAndNoBooksWarningView = ({}) => {
    let warningMessage = undefined;

    const hasAnyBooks = currentShelf && currentShelf.books.length > 0 || toReadShelf && toReadShelf.books.length > 0 || pausedShelf && pausedShelf.books.length > 0 || completedShelf && completedShelf.books.length > 0;

    if (!isSelf) {
      if (isPrivate) {
        warningMessage = "This profile is private";
      } else {
        if (!hasAnyBooks) {
          warningMessage = `There are currently no books in ${name}\`s shelves`;
        }
      }
    }

    return (
      <>
        { warningMessage &&
            <WarningMessageContainer> 
              <Text style={{textAlign: 'center'}}>{warningMessage}</Text>
            </WarningMessageContainer>
        }
      </>
    )
  }

  return (
    <BCContainer style={{flex: 1}} pageTitle={pageTitle} showBackButton={true} userImage={currentUserProfilePic} userFullName={currentUserFullName}>
      <ScrollView style={{backgroundColor: palette.primary.linen}}>

        { subNavigatorName && subNavigationType === 'AuthorClubTabSubNavigator' && <AuthorClubTabSubNavigator routeName={subNavigatorName} theme={subNavTheme}/>}
        { subNavigatorName && subNavigationType === 'ProfilePageTabSubNavigator' && <ProfilePageTabSubNavigator routeName={subNavigatorName} theme={subNavTheme}/>}

        <ProfilePagePersonalInfo
          name={name}
          bio={bio}
          username={username}
          profilePic={profilePic}
          numFollowing={numFollowing}
          numFollowers={numFollowers}
          isAuthor={isAuthor}
          isSelf={isSelf}
          isFollowing={isFollowing}
          userId={userId}
          invalidateKey={invalidateKey}
          additionalInvalidateKeys={additionalInvalidateKeys}
        />

        <View style={{backgroundColor: palette.grayscale.white}} >
          <BookShelvesContainer>

            <PrivacyAndNoBooksWarningView />

            { currentShelf &&
              <BookShelf
                shelf={currentShelf}
                customName={<BookShelfTitle>CURRENTLY READING</BookShelfTitle>}
                customStyle={{marginTop: 40}}
                isPublicViewer={!isSelf}
                bookShelfType={SHELF_TYPE.CURRENTLY_READING}
                showAddBooksButton={isSelf}
                showEmptyShelf={isSelf}
              />
            }

            { toReadShelf &&
              <BookShelf
                shelf={toReadShelf}
                customName={<BookShelfTitle>SAVED FOR LATER</BookShelfTitle>}
                customStyle={{marginTop: 40}}
                isPublicViewer={!isSelf}
                bookShelfType={SHELF_TYPE.TO_READ}
                showAddBooksButton={isSelf}
                showEmptyShelf={isSelf}
              />
            }

            { pausedShelf &&
              <BookShelf
                shelf={pausedShelf}
                customName={<BookShelfTitle>PAUSED</BookShelfTitle>}
                customStyle={{marginTop: 40}}
                isPublicViewer={!isSelf}
                bookShelfType={SHELF_TYPE.PAUSED}
                showEmptyShelf={isSelf}
              />
            }

            { completedShelf &&
              <BookShelf
                shelf={completedShelf}
                customName={<BookShelfTitle>COMPLETED</BookShelfTitle>}
                customStyle={{marginTop: 40}}
                bookStyle={{ width: 121, height: 182 }}
                isPublicViewer={!isSelf}
                bookShelfType={SHELF_TYPE.COMPLETED}
                showAddBooksButton={isSelf}
                showEmptyShelf={isSelf}
              />
            }
          </BookShelvesContainer>
        </View>
      </ScrollView>
    </BCContainer>
  );
}

const WarningMessageContainer = styled.View`
  align-self: stretch;
  align-items: center;
  justify-content: center;
  border-color: ${palette.grayscale.granite};
  border-radius: 8px;
  border-width: 1px;
  margin: ${cosmos.unit * 2}px ${cosmos.unit * 4}px  0px ${cosmos.unit * 4}px;
  padding: ${cosmos.unit * 4}px ${cosmos.unit * 2}px  ${cosmos.unit * 4}px ${cosmos.unit * 2}px;
`;

const BookShelfTitle = styled.Text`
  font-family: granvillebold;
  font-size: 20px;
  line-height: 20px;
  color: ${palette.primary.navy};
`;

const BookShelvesContainer = styled.View`
  margin-bottom: ${cosmos.unit * 8}px;
`;