import React from 'react';
import styled from 'styled-components/native';
import { View } from "react-native";

import cosmos, { palette } from "shared/src/cosmos";
import { getLargestImage } from 'shared/src/utils';
import { IImage } from 'shared/src/services';
import { CustomizableButton } from 'theme/Button';
import { useFollow, useUnfollow } from 'hooks/useFollow';
import { cacheKey } from 'hooks/cacheStateKey';
import { LinearGradient } from 'expo-linear-gradient';

const placeholderProfilePic = require('../../assets/images/icon.png');

export const ProfilePageAuthorHeader = ({name, profilePic, isFollowing, userId} : {name: string, profilePic?: IImage, isFollowing?: boolean, userId: string}) => {
  const { mutate: follow, ...followInfo } = useFollow({invalidateKey: [cacheKey.userProfile, userId]});
  const { mutate: unfollow, ...unfollowInfo } = useUnfollow({invalidateKey: [cacheKey.userProfile, userId]});

  return (
    <View>
        <AuthorHeaderContainer source={getLargestImage(profilePic) ? { uri: getLargestImage(profilePic)} : placeholderProfilePic}>
          <ThumbNailGradient
            colors={['transparent', palette.grayscale.black]}
          >
            <AuthorTopText>MEET THE AUTHOR</AuthorTopText>
            <AuthorName>{name}</AuthorName>
            <CustomizableButton
              title={isFollowing ? 'Following' : 'Follow'}
              onPress={() => {
                if (isFollowing) {
                  unfollow({userID: userId});
                } else {
                  follow({userID: userId});
                }
              }}
              style={{height: 42, backgroundColor: isFollowing ? palette.auxillary.charcoal.main : palette.primary.bcBlue  }}
              disabled={followInfo.isLoading || unfollowInfo.isLoading}
              loading={ followInfo.isLoading || unfollowInfo.isLoading }
            />
          </ThumbNailGradient>
          
        </AuthorHeaderContainer>
    </View>
  );
}

const AuthorTopText = styled.Text`
  font-family: granvillebold;
  font-size: 22px;
  line-height: 20px;
  text-align: center;
  color: ${palette.grayscale.white};
  margin-bottom: ${cosmos.unit * 2}px;
`;

const AuthorName = styled.Text`
  font-family: ivarheadline;
  font-size: 36px;
  line-height: 44px;
  text-align: center;
  color: ${palette.grayscale.white};
  margin-bottom: ${cosmos.unit * 4}px;
`;

const AuthorHeaderContainer = styled.ImageBackground`
  width: 100%;
  aspect-ratio: 1;
`;

const ThumbNailGradient = styled(LinearGradient)`
  width: 100%;
  aspect-ratio: 1;
  align-items: flex-start;
  justify-content: flex-end;
  padding: ${cosmos.unit * 3}px ${cosmos.unit * 2}px ${cosmos.unit * 3}px ${cosmos.unit * 2}px;
`;
