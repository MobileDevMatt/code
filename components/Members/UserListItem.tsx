import React from 'react';
import styled from 'styled-components/native';
import { View } from "react-native";
import ProgressCircle from 'react-native-progress-circle';

import cosmos, { palette } from 'shared/src/cosmos';
import { CustomizableButton } from 'theme/Button';
import { useFollow, useUnfollow } from 'hooks/useFollow';
import { getSmallestImage } from 'shared/src/utils';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { ROUTE } from 'lib/constants';
import { IImage } from 'shared/src/services';
import { IAPI_User_Full } from 'shared/src/services/user-service';


const placeholderProfilePic = require('../../assets/images/icon.png');

/**
 * 
 * @param isSelf - Indicates wether this member is the user, in which case we will use a different background color
 * @param invalidateKey - Query key for the list that this item belongs to. Used so that the query can be invalidated after follow/unfollow success
 */
const UserListItem = ({currentUserData, isSelf = false, name, isFollowing, image, id, invalidateKey, lastActive, bookProgress}
  :{currentUserData: IAPI_User_Full | undefined, isSelf?: boolean, name: string, isFollowing?: boolean, image?: IImage, id: string, invalidateKey: string, lastActive?: Date, bookProgress?: {currentChapter: number, numChapters: number}}) => {
  
    const { mutate: follow, ...followInfo } = useFollow({invalidateKey: invalidateKey});
    const { mutate: unfollow, ...unfollowInfo } = useUnfollow({invalidateKey: invalidateKey});

    const navigation = useNavigation();

    const followUnfollowButtonPressed = () => {
      if (isFollowing) {
        unfollow({userID: id})
      } else {
        follow({userID: id})
      }
    }

    const getBookProgressText = (currentChapter: number, numChapters: number) => {
      return `Chapter ${currentChapter} (${Math.floor(100 * currentChapter / numChapters)}%)`
    }

    return(
      <Container style={{backgroundColor: (isSelf ? palette.grayscale.black : palette.grayscale.white)}}>
        <SubContainer>
          <TouchableOpacity
            onPress={() => {
              if (isSelf) {
                navigation.navigate(ROUTE.ACCOUNT);
              } else {
                navigation.navigate(ROUTE.PUBLIC_PROFILE_PAGE, {currentUserProfilePic: currentUserData?.images, currentUserFullName: currentUserData?.name,  userId: id, additionalInvalidateKeys: [invalidateKey]});
              }
            }}
          >
            { bookProgress && 
              <ProgressCircle
                percent={bookProgress.currentChapter * 100 / bookProgress.numChapters}
                radius={28}
                borderWidth={2}
                color={isSelf ? palette.grayscale.white : palette.grayscale.black}
                shadowColor={ isSelf ? palette.auxillary.charcoal.main : palette.primary.linen}
                bgColor={ isSelf ? palette.primary.navy : palette.grayscale.white}
                outerCircleStyle={{marginVertical: cosmos.unit, marginStart: cosmos.unit * 2}}
              >
                <UserImage source={getSmallestImage(image) ? { uri: getSmallestImage(image)} : placeholderProfilePic}/>
              </ProgressCircle>
            }
            { !bookProgress && 
              <UserImage style={{marginStart: cosmos.unit * 2, marginVertical: cosmos.unit}} source={getSmallestImage(image) ? { uri: getSmallestImage(image)} : placeholderProfilePic}/>
            }
          </TouchableOpacity>
          
      
          <View style={{flex: 1, marginStart: 12, alignItems: 'flex-start', justifyContent: 'center', }}>
            <NameText numberOfLines={1} style={{color: (isSelf ? palette.grayscale.white  : palette.primary.navy)}}>{name}{isSelf ? ' (You)' : ''}</NameText>
            { lastActive && <LastActiveText style={{color: (isSelf ? palette.grayscale.white  : palette.grayscale.granite)}}>active • 1 day ago</LastActiveText>}
            { bookProgress && <LastActiveText style={{color: (isSelf ? palette.grayscale.white  : palette.grayscale.granite)}}>{getBookProgressText(bookProgress.currentChapter, bookProgress.numChapters)}</LastActiveText>}
          </View>
        </SubContainer>

        <FollowAndSettingsContainer >
          { !isSelf &&
            <CustomizableButton
              title={isFollowing ? "Following" : "Follow"}
              onPress={followUnfollowButtonPressed}
              loading={ followInfo.isLoading || unfollowInfo.isLoading }
              disabled={ followInfo.isLoading || unfollowInfo.isLoading }
              style={{
                height: 34,
                borderColor: isFollowing ? palette.grayscale.granite : 'transparent',
                borderWidth: isFollowing ? 1 : 0,
                backgroundColor: isFollowing ? 'transparent' : palette.grayscale.stone
              }}
              textStyle={{
                color: palette.primary.navy,
                fontSize: 15,
                lineHeight: 15,
              }}
            />
          }
        
          <CustomizableButton
            title={"..."}
            onPress={() => {}}
            style={{
              height: 34,
              backgroundColor: 'transparent'
            }}
            textStyle={{
              color: isSelf ? palette.grayscale.granite : palette.grayscale.black,
              fontSize: 24,
              letterSpacing: 2
            }}
          />
        </FollowAndSettingsContainer>
      </Container> 
    );
}

export { UserListItem };


const Container = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const NameText = styled.Text`
  font-family: larsseitbold;
  font-size: 15px;
  line-height: 22px;
`;

const LastActiveText = styled.Text`
  font-family: larsseit;
  font-size: 14px;
  line-height: 20px;
`;

const SubContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-right: ${cosmos.unit}px;
  flex: 1;
`;

const FollowAndSettingsContainer = styled.View`
  width: 154px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const UserImage = styled.ImageBackground`
  width: 48px;
  height: 48px;
  border-radius: 300px;
  overflow: hidden;
`;