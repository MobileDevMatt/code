import React from 'react';
import cosmos, { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';
import { ActivityIndicator, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { H1Dark, ParagraphDark, SectionTitleDark } from 'theme/Typography';
import { getInitials, getLargestImage } from 'shared/src/utils';
import { useDemoteToListener, usePromoteToModerator, usePromoteToSpeaker } from 'hooks/useConversations';
import { useLiveAudio } from 'context/LiveAudioContext';
import { CustomizableButton } from '../../theme/Button';
import { useGetUser, useGetUserProfile } from 'hooks/useGetUser';
import { useFollow, useUnfollow } from 'hooks/useFollow';
import { cacheKey } from 'hooks/cacheStateKey';
import { ROUTE } from 'lib/constants';

interface IProps {
  participantId?: string
  setIsShowingParticipantModal: React.Dispatch<React.SetStateAction<boolean>>
}


const ParticipantDetailModal = ({ participantId, setIsShowingParticipantModal }: IProps) => {
  const { data: user } = useGetUser();
  const { liveConversation } = useLiveAudio();
  const { mutate: promoteToSpeaker, isLoading: isPromoteToSpeakerRequestInProgress } = usePromoteToSpeaker();
  const { mutate: promoteToModerator, isLoading: isPromoteToModeratorRequestInProgress } = usePromoteToModerator();
  const { mutate: demoteToListener, isLoading: isDemoteToListenerRequestInProgress } = useDemoteToListener();
  const { data: userData, ...userDataFetchInfo } = useGetUserProfile({ userId: participantId });

  const participantIsSpeaker = Boolean(liveConversation?.speakers?.find((speaker) => speaker.userRef === userData?._id));
  const participantIsModerator = Boolean(liveConversation?.speakers?.find((speaker) => speaker.isModerator && speaker.userRef === userData?._id));
  const participantIsListener = Boolean(liveConversation?.listeners?.find((listener) => listener.userRef === userData?._id));

  const isConversationCreator = Boolean(liveConversation?.speakers?.find((speaker) => speaker.isModerator && speaker.userRef === user?._id));
  const isCurrentUser = userData?._id === user?._id;
  const shouldShowParticipantRoleActions = (isConversationCreator && !isCurrentUser);

  const { mutate: follow, ...followInfo } = useFollow({ invalidateKey: cacheKey.followers });
  const { mutate: unfollow, ...unfollowInfo } = useUnfollow({ invalidateKey: cacheKey.followers });

  const navigation = useNavigation();


  const promoteUserToSpeaker = () => {
    promoteToSpeaker({ userId: participantId, conversationId: liveConversation._id }, {
      onSuccess: (data) => {
        setIsShowingParticipantModal((false));
      },
      onError: (data) => {
      },
    });
  };

  const promoteUserToModerator = () => {
    promoteToModerator({ userId: participantId, conversationId: liveConversation._id }, {
      onSuccess: (data) => {
        setIsShowingParticipantModal((false));
      },
      onError: (data) => {
      },
    });
  };

  const demoteUserToListener = () => {
    demoteToListener({ userId: participantId, conversationId: liveConversation._id }, {
      onSuccess: (data) => {
        setIsShowingParticipantModal((false));
      },
      onError: (data) => {
      },
    });
  };

  const followUnfollowButtonPressed = () => {
    if (userData?.isFollowing) {
      unfollow({ userID: userData?._id }, {
        onSuccess: () => {
          userDataFetchInfo.refetch();
        },
      });
    } else {
      follow({ userID: userData?._id! }, {
        onSuccess: () => {
          userDataFetchInfo.refetch();
        },
      });
    }
  };

  const viewProfile = () => {
    navigation.navigate(ROUTE.PUBLIC_PROFILE_PAGE, {
      currentUserProfilePic: userData?.images,
      currentUserFullName: userData?.name,
      userId: userData?._id,
      additionalInvalidateKeys: [cacheKey.followers],
    });
    setIsShowingParticipantModal((false));
  };

  return (
    <ParticipantWrapper>
      {!!userDataFetchInfo.isLoading ? (<ActivityIndicator color={palette.grayscale.black} size={'small'}/>) : (
        <>
          <CardTopSection>
            <ParticipantModalImage name={userData?.name} imageSrc={getLargestImage(userData?.images)}/>
            <View>
              <ButtonContainer>
                <CustomizableButton
                  style={{ alignSelf: 'flex-start', backgroundColor: userData?.isFollowing? palette.auxillary.charcoal.main : palette.primary.bcBlue }}
                  title={userData?.isFollowing ? 'Following' : 'Follow'}
                  onPress={followUnfollowButtonPressed}
                  loading={followInfo.isLoading || unfollowInfo.isLoading}
                  disabled={followInfo.isLoading || unfollowInfo.isLoading}
                />
              </ButtonContainer>
              {/* <TopCardFollowMeta>
                <FollowStat>
                  <H1Dark>100</H1Dark>
                  <ParagraphDark>Following</ParagraphDark>
                </FollowStat>
                <FollowStat>
                  <H1Dark>100</H1Dark>
                  <ParagraphDark>Followers</ParagraphDark>
                </FollowStat>
              </TopCardFollowMeta> */}
            </View>
          </CardTopSection>
          <SectionTitleDark>{userData?.name}</SectionTitleDark>
          <ParagraphDark>{userData?.bio}</ParagraphDark>
          <ButtonArea>
            {!!shouldShowParticipantRoleActions ? (<>
              {!participantIsModerator ? (
                <ActionButton
                  textStyle={{ color: palette.grayscale.black }}
                  title={'Promote to Moderator'}
                  activityIndicatorColor={palette.grayscale.black}
                  loading={isPromoteToModeratorRequestInProgress}
                  onPress={promoteUserToModerator}
                />
              ) : null}
              {!participantIsSpeaker ? (
                <ActionButton
                  textStyle={{ color: palette.grayscale.black }}
                  title={'Promote to Speaker'}
                  activityIndicatorColor={palette.grayscale.black}
                  loading={isPromoteToSpeakerRequestInProgress}
                  onPress={promoteUserToSpeaker}
                />
              ) : null}
              {!participantIsListener ? (
                <ActionButton
                  textStyle={{ color: palette.grayscale.black }}
                  title={'Demote to Listener'}
                  activityIndicatorColor={palette.grayscale.black}
                  loading={isDemoteToListenerRequestInProgress}
                  onPress={demoteUserToListener}
                />
              ) : null}
            </>) : null}
            <ActionButton
              textStyle={{ color: palette.grayscale.black }}
              title={'View Full Profile'}
              onPress={viewProfile}
            />
          </ButtonArea>
        </>
      )}

    </ParticipantWrapper>
  );
};

const ParticipantModalImage = ({ imageSrc, name }: { imageSrc: string, name?: string }) => {
  if (imageSrc) {
    return (
      <Avatar source={{ uri: imageSrc }}/>
    );
  } else {
    return (
      <InitialsContainer>
        <Initials>{getInitials(name)}</Initials>
      </InitialsContainer>
    );
  }
};

export { ParticipantDetailModal };

const Avatar = styled.Image`
  width: ${cosmos.unit * 15}px;
  height: ${cosmos.unit * 15}px;
  border-radius:  ${cosmos.unit * 8}px;
  background-color: ${palette.grayscale.granite};
  resize-mode: cover;
`;

const ActionButton = styled(CustomizableButton)`
  width: 100%;
  border: 1px solid rgba(165, 163, 157, 0.5);
  background-color: transparent;
  margin-bottom: ${cosmos.unit}px;
  height: 42px;
`;

const ButtonContainer = styled.View`
  margin-bottom: ${cosmos.unit * 2}px;
`;

const TopCardFollowMeta = styled.View`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;

const FollowStat = styled.View`
  display: flex;
  flex-direction: column;
  margin-right: ${cosmos.unit * 5}px;
`;

const Initials = styled(H1Dark)`
  color: ${palette.auxillary.ocean.alt};
  font-size: ${cosmos.unit * 5}px;
`;

const InitialsContainer = styled.View`
  width: ${(cosmos.unit * 15)}px;
  height: ${(cosmos.unit * 15)}px;
  border-radius:  ${cosmos.unit * 8}px;
  justify-content: center;
  align-items: center;
  background-color: ${palette.auxillary.ocean.main};
`;

const ParticipantWrapper = styled.View`
  width: 100%;
  padding: ${cosmos.unit * 2}px;
`;

const CardTopSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${cosmos.unit * 2}px;
`;

const ButtonArea = styled.View`
  margin-top: ${cosmos.unit * 3}px;
  margin-bottom:  ${cosmos.unit * 3}px;
`;