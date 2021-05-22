import React, { useState } from 'react';
import styled from 'styled-components/native';
import Hyperlink from 'react-native-hyperlink';

import { H1Dark, Paragraph } from 'theme/Typography';
import cosmos, { palette } from 'shared/src/cosmos';
import { FeedCardHeader } from './FeedCardHeader';
import { IAPI_User_Full, IFeedCard } from 'shared/src/services/user-service';
import { Avatar } from 'components/Avatar';
import { ModalSheet } from 'components/ModalSheet';
import { ActivityIndicator, View } from 'react-native';
import { CustomizableButton } from 'theme/Button';
import { useDeletePostFromClubFeed } from 'hooks/useClubFeed';
import { useQueryClient } from 'react-query';
import { cacheKey } from 'hooks/cacheStateKey';
import { hideErrorPopUp, showErrorPopUp } from 'components/ModalErrorPopUp';
import { useNavigation } from '@react-navigation/native';
import { ROUTE } from 'lib/constants';


export const TextCard = ({feedCard, currentUserData, isModerator} : {feedCard: IFeedCard, currentUserData: IAPI_User_Full | undefined, isModerator: boolean}) => {
  const [isEditPostModalVisible, setIsEditPostModalVisible] = useState(false);
  const { mutate: deletePostFromClubFeed, ...deletePostFromClubFeedInfo } = useDeletePostFromClubFeed();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const onAuthorClicked = () => {
    const routeArgs = {
      currentUserProfilePic: currentUserData?.images,
      currentUserFullName: currentUserData?.name,
      userId: feedCard.data.post?.user?.userRef,
      additionalInvalidateKeys: [cacheKey.myUser]
    }
    navigation.navigate(ROUTE.PUBLIC_PROFILE_PAGE, routeArgs);
  }

  const EditPostComponent = () => {
    return (
      <View style={{alignSelf: 'stretch', marginTop: cosmos.unit * 3, marginBottom: cosmos.unit * 4.5}}>
        <CustomizableButton
          title={deletePostFromClubFeedInfo.isLoading ? 'Removing' : 'Remove'}
          onPress={() => {
            if (feedCard.data.clubRef && feedCard.data.post) {
              deletePostFromClubFeed({clubId: feedCard.data.clubRef._id, postId: feedCard.data.post._id}, {
                onSuccess: () => {
                  // TODO: Hovo: Possibly use optimistic query here.
                  const clubId = feedCard.data.clubRef?._id;
                  queryClient.invalidateQueries(clubId !== undefined ? [cacheKey.clubFeed, clubId] : cacheKey.clubFeed);
                  setIsEditPostModalVisible(false);
                },
                onError: (error) => {
                  showErrorPopUp({
                    title: "Error",
                    message: 'Failed to remove the post.\nPlease try again',
                    buttonAction: () => {
                      setIsEditPostModalVisible(false);
                      hideErrorPopUp();
                    }
                  });
                  console.error('ERROR when trying to remove post from feed card', feedCard, error);
                }
              })
            }
          }}
          style={{backgroundColor: 'transparent'}}
          textStyle={{fontFamily: 'larsseit', fontSize: 18, lineHeight: 25, color: palette.auxillary.crimson.alt}}
          icon={deletePostFromClubFeedInfo.isLoading ? <ActivityIndicator size = 'small' color={palette.primary.bcBlue}/> : undefined}
        />
      </View>
    );
  }

  return (
    <Container>
      <ModalSheet
        isVisible={isEditPostModalVisible}
        setIsVisible={setIsEditPostModalVisible}
        content={EditPostComponent()}/>

      <FeedCardHeader
        feedCard={feedCard}
        currentUserDataFull={currentUserData}
        showOptionsButton={isModerator}
        optionsButtonAction={() => setIsEditPostModalVisible(true)}
      />

      <AvatarContainer onPress={onAuthorClicked}>
        <Avatar
          images={feedCard.data.post?.user?.images}
          name={feedCard.data.post?.user?.name}
          size={48}
        />
        <H1Dark style={{marginStart: cosmos.unit}}>{feedCard.data.post?.user?.name}</H1Dark>
      </AvatarContainer>

      <Hyperlink
        linkDefault={ true }
        linkStyle={{color: palette.primary.bcBlue, fontSize: 16, lineHeight: 22, fontFamily: 'larsseit', textDecorationLine: 'underline' }}
      >
        <Paragraph style={{color: palette.primary.navy, marginTop: cosmos.unit}}>{feedCard.data.post?.text}</Paragraph>
      </Hyperlink>
    </Container>
  );
};

const Container = styled.View`
  padding: ${cosmos.unit * 2}px;
  background-color: ${palette.grayscale.white};
  flex: 1;
`;

const AvatarContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-top: 4px;
  align-items: center;
`;
