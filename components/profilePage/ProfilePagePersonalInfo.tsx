import React, { useState } from 'react';
import styled from 'styled-components/native';
import { View, TouchableOpacity, Linking } from "react-native";

import cosmos, { palette } from "shared/src/cosmos";
import { Menu } from 'react-native-paper';
import InstagramIcon from 'components/icons/InstagramIcon';
import TweeterIcon from 'components/icons/TweeterIcon';
import { useSignOut } from 'hooks/useAuth';
import { useQueryClient } from 'react-query';
import { cacheKey } from 'hooks/cacheStateKey';
import { getLargestImage } from 'shared/src/utils';
import { ROUTE } from 'lib/constants';
import { useNavigation } from '@react-navigation/native';
import { IImage } from 'shared/src/services';
import { ProfilePageAuthorHeader } from './ProfilePageAuthorHeader';
import { CustomizableButton } from 'theme/Button';
import { useFollow, useUnfollow } from 'hooks/useFollow';

const placeholderProfilePic = require('../../assets/images/icon.png');

// TODO: Hovo: The errros below are just temporary until we figure out all the endpoint stuff.
let personalWebpage: string | undefined = undefined; // TODO: Hovo: Need to get the endpoint structure before hooking this up
let instagramUrl: string | undefined = undefined; // TODO: Hovo: Need to get the endpoint structure before hooking this up
let twitterUrl: string | undefined = undefined; // TODO: Hovo: Need to get the endpoint structure before hooking this up

interface IProfilePagePersonalInfo {
  name: string,
  bio?: string,
  username?: string,
  profilePic?: IImage,
  numFollowing?: number,
  numFollowers?: number,
  isAuthor?: boolean,
  isSelf: boolean,
  isFollowing?: boolean,
  userId: string,
  invalidateKey?: string | [string, string],
  additionalInvalidateKeys?: string[] | [string, string][];
}

export const ProfilePagePersonalInfo = ({name, bio, username, profilePic, numFollowing, numFollowers, isAuthor, isSelf, isFollowing, userId, invalidateKey, additionalInvalidateKeys} : IProfilePagePersonalInfo) => {
  const navigation = useNavigation();

  // TODO: Hovo: We are invalidating the entire 
  const { mutate: follow, ...followInfo } = useFollow({invalidateKey: invalidateKey, additionalInvalidateKeys: additionalInvalidateKeys});
  const { mutate: unfollow, ...unfollowInfo } = useUnfollow({invalidateKey: invalidateKey, additionalInvalidateKeys: additionalInvalidateKeys});

  const onExternalPersonalLinkPressed = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }

  return (
    <View>
      {isAuthor &&
        <ProfilePageAuthorHeader
          name={name}
          profilePic={profilePic}
          isFollowing={isFollowing}
          userId={userId}
        />
      }
      <ProfileHeaderContainer>
        <UserImage source={getLargestImage(profilePic) ? { uri: getLargestImage(profilePic)} : placeholderProfilePic}/>


        <SettingsButtonsAndFollowContainer>
          { isSelf && 
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <SettingsButton onPress={() => navigation.navigate(ROUTE.EDIT_PROFILE_PAGE)}>
                <SettingsButtonText>Settings</SettingsButtonText>
              </SettingsButton>
              <DrawMenu/>
            </View>
          }

          { (!isSelf && !isAuthor) &&
            <CustomizableButton
              title={isFollowing ? 'Following' : 'Follow'}
              onPress={() => {
                if (isFollowing) {
                  unfollow({userID: userId});
                } else {
                  follow({userID: userId});
                }
              }}
              style={{height: 42, width: 112, backgroundColor: isFollowing ? palette.auxillary.charcoal.main : palette.primary.bcBlue  }}
              disabled={followInfo.isLoading || unfollowInfo.isLoading}
              loading={ followInfo.isLoading || unfollowInfo.isLoading }
            />
          }

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
            { numFollowing &&
              <FollowingFollowerText >
                <FollowingFollowerText style={{fontFamily: 'larsseitbold'}}>{numFollowing}{'\n'}</FollowingFollowerText>
                <FollowingFollowerText>Following</FollowingFollowerText>
              </FollowingFollowerText>
            }

            { numFollowers &&
              <FollowingFollowerText style={{marginStart: 40}}>
                <FollowingFollowerText style={{fontFamily: 'larsseitbold'}}>{numFollowers}{'\n'}</FollowingFollowerText>
                <FollowingFollowerText>Followers</FollowingFollowerText>
              </FollowingFollowerText>
            }
          </View>
        </SettingsButtonsAndFollowContainer>


        </ProfileHeaderContainer>

        <ProfileDetailsContainer>
          { !isAuthor && <UserName>{name}</UserName>}
          {bio !== undefined && bio !== '' && <BioText>{bio}</BioText>}

          {(username || twitterUrl || instagramUrl) &&
            <UserHandleAndSocialContainer>
              <UserHandleText>{username}</UserHandleText>

              {(twitterUrl || instagramUrl) &&
                <View style={{flexDirection: 'row', alignItems: 'center'}}>

                  {twitterUrl &&
                    <SocialMediaButton style={{marginEnd: 18}} onPress={() => onExternalPersonalLinkPressed(twitterUrl!)}>
                    <TweeterIcon width={22} height={23}/>
                    </SocialMediaButton>
                  }

                  {instagramUrl &&
                    <SocialMediaButton onPress={() => onExternalPersonalLinkPressed(instagramUrl!)}>
                    <InstagramIcon width={23} height={23}/>
                    </SocialMediaButton>
                  }
                </View>
              }
            </UserHandleAndSocialContainer>
          }

          { personalWebpage &&
            <TouchableOpacity onPress={() => onExternalPersonalLinkPressed(personalWebpage!)}>
              <PersonalWebsiteText>{personalWebpage}</PersonalWebsiteText>
            </TouchableOpacity>
          }

        </ProfileDetailsContainer>

        <DividerLine/>
    </View>
  );
}

const DrawMenu = () => {
  const { mutate: signOut } = useSignOut();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    signOut(undefined,{
      onSuccess:() => {
        queryClient.invalidateQueries(cacheKey.currentCognitoUser);
        queryClient.invalidateQueries(cacheKey.currentUserRole);
      }
    });
  };

  const [menuVisible, setMenuVisible] = useState(false);
  return(
    <Menu
      contentStyle={{ }}
      visible={menuVisible}
      onDismiss={() => setMenuVisible(() => false)}
      anchor={
        <SettingsButton style={{marginStart: 12}} onPress={() => setMenuVisible(() => true)}>
          <SettingsButtonText>...</SettingsButtonText>
        </SettingsButton>
      }
    >
      <Menu.Item onPress={() => {handleLogout()}} title="Log Out" />
    </Menu>
  );
}

const FollowingFollowerText = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  line-height: 22px;
  color: ${palette.primary.navy};
`;

const ProfileHeaderContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;

const UserImage = styled.ImageBackground`
  width: 120px;
  height: 120px;
  margin-left: 21px;
  margin-top: 32px;
  border-radius: 300px;
  border-width: 2px;
  border-color: ${palette.grayscale.white};
  overflow: hidden;
`;

const DividerLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${palette.grayscale.stone};
  margin-top: 32px;
`;

const SettingsButtonsAndFollowContainer = styled.View`
  margin-left: 23px;
  margin-right: 16px;
  margin-top: 41px;
  flex: 1;
`;

const ProfileDetailsContainer = styled.View`
  align-items: flex-start;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 24px;
`;

const UserName = styled.Text`
  font-family: larsseitbold;
  font-size: 20px;
  line-height: 30px;
  color: ${palette.primary.navy};
`;

const BioText = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  line-height: 22px;
  color: ${palette.primary.navy};
  margin-top: 8px;
`;

const UserHandleAndSocialContainer = styled.View`
  margin-top: 8px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const UserHandleText = styled.Text`
  font-family: larsseitbold;
  font-size: 15px;
  line-height: 22px;
  color: ${palette.grayscale.granite};
`;

const SocialMediaButton = styled.TouchableOpacity`
  width: 21px;
  height: 21px;
  align-items: center;
  justify-content: center;
`;

const PersonalWebsiteText = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  line-height: 22px;
  color: ${palette.primary.navy};
  margin-top: 9px;
`;

const SettingsButton = styled.TouchableOpacity`
  padding: ${cosmos.unit * 1.5}px ${cosmos.unit * 2}px;
  margin: 0 ${cosmos.unit}px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${palette.grayscale.stone};
  border-radius: 2px;
`;

const SettingsButtonText = styled.Text`
  font-family: larsseit;
  font-size: 16px;
  line-height: 16px;
  color: ${palette.primary.navy};
`;
