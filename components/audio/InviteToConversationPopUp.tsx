import React, { useState } from 'react';
import { View } from 'react-native';
import { H1Dark, ParagraphDark } from 'theme/Typography';
import { useInviteToConversation } from 'hooks/useConversations';
import { IFollowUserData } from 'shared/src/services/user-service';

import { IConversation, PARTICIPANT_TYPE } from 'shared/src/services/conversation-service';
import styled, { css } from 'styled-components/native';
import cosmos, { palette } from 'shared/src/cosmos';
import { useGetFollowers } from 'hooks/useFollow';
import { getInitials, getSmallestImage } from 'shared/src/utils';
import { CustomizableButton } from 'theme/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';


interface IProps {
  setIsInviteUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conversation: IConversation | null;
  inviteType: PARTICIPANT_TYPE;
}

interface IUserProps{
  user: IFollowUserData;
  isSelected?: boolean;
  onSelectUser?: (user:IFollowUserData) => void;
}

const InviteToConversationPopUp = ({ setIsInviteUserModalOpen, conversation, inviteType }: IProps) => {

  const itemsPerPage = 20;
  const { data: followerData } = useGetFollowers(itemsPerPage);
  const [selectedUsersIds, setSelectedUserIds] = useState<string[]>([]);
  const { mutate: inviteToConversation, isLoading:isSendingConversationInvites } = useInviteToConversation();
  const insets = useSafeAreaInsets();

  const handleUserSelect = (user: IFollowUserData) => {
    const selectedUserIndex = selectedUsersIds.indexOf(user.userRef);
    if(selectedUserIndex > -1){
      selectedUsersIds.splice(selectedUserIndex, 1);
      setSelectedUserIds([...selectedUsersIds])
    }
    else {
      setSelectedUserIds([
        ...selectedUsersIds,
        user.userRef,
      ])
    }
  };

  const handleInvite = () => {
    inviteToConversation({
      conversationId: conversation?._id!,
      inviteeIds: selectedUsersIds,
      participantType: inviteType
    },{
      onSuccess: (data: any) => {
        setIsInviteUserModalOpen(false);
      },
      onError: (error) => {
        console.log(error)
        console.log('error inviting')
      },
    });
  };


  return (
    <InviteToConversationWrapper>
      <H1Dark>{inviteType === PARTICIPANT_TYPE.SPEAKER ? 'Start a conversation with…' : 'Add a listener'}</H1Dark>
      <UsersList  showsVerticalScrollIndicator={false}>
        { followerData?.pages && followerData?.pages?.map(page => {
          return page?.users?.map((user) => {
            return (
              <User
                user={user}
                isSelected={selectedUsersIds.includes(user?.userRef)}
                onSelectUser={() => handleUserSelect(user)}
              />
            );
          })
        })}
      </UsersList>
      <ButtonContainer style={{marginBottom:Math.max(insets.bottom, cosmos.unit * 2)}}>
        <CustomizableButton
          style={{ width:'100%'}}
          loading={isSendingConversationInvites}
          textStyle={{ marginHorizontal: cosmos.unit }}
          title={inviteType === PARTICIPANT_TYPE.SPEAKER ? 'Invite to Speak' : 'Invite'}
          onPress={handleInvite}
        />
      </ButtonContainer>
    </InviteToConversationWrapper>
  );
};

const User = ({user, isSelected = false, onSelectUser}: IUserProps) => {
  return (
    <UserItem onPress={onSelectUser}>
      <UserNameContainer>
        <UserAvatar imageSrc={getSmallestImage(user.images)} name={user?.name}/>
        <View style={{flex:1}}>
          <H1Dark>{user?.name}</H1Dark>
          <UserName>{user?.username}</UserName>
        </View>
        <CheckBoxBorder isSelected={isSelected}>
          {isSelected ? <MaterialCommunityIcons name="check" size={24} color={palette.grayscale.white}/> : null}
        </CheckBoxBorder>
      </UserNameContainer>
    </UserItem>
  )
};

const UserAvatar = ({ imageSrc, name }: { imageSrc: string, name:string }) => {
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
export { InviteToConversationPopUp };

const InviteToConversationWrapper = styled.View`
    padding-horizontal:${cosmos.unit * 2}px;
    align-items: flex-start;
    text-align: left;
    width: 100%;
`;

const UsersList = styled.ScrollView`
  margin-top: ${cosmos.unit * 3}px;
  width: 100%;
  text-align: left;
  height: 500px;
`;

const UserItem = styled.TouchableOpacity`
  display: flex;
  padding: ${cosmos.unit}px;
  justify-content: space-between;
  align-items: center;
  height: ${cosmos.unit * 7.5}px;
`;

const UserName = styled(ParagraphDark)`
  color: ${palette.grayscale.granite};
  font-size: 14px;
`;

const CheckBoxBorder = styled.View`
  width:24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  border-radius: 1px;
  border:1px solid ${palette.grayscale.stone};
   ${(props) => {
  if (props?.isSelected) {
    return css`
      background-color: ${palette.primary.bcBlue};
      border-color: ${palette.primary.bcBlue};
    `;
  }
}}
`;
const UserNameContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
`;
const Avatar = styled.Image`
  width: ${cosmos.unit * 6}px;
  height: ${cosmos.unit * 6}px;
  border-radius:  ${cosmos.unit * 3}px;
  background-color: ${palette.grayscale.granite};
  resize-mode: cover;
  margin-right: ${cosmos.unit * 1.5}px;
`;

const InitialsContainer = styled.View`
  width: ${(cosmos.unit * 6)}px;
  height: ${(cosmos.unit * 6)}px;
  border-radius:  ${cosmos.unit * 3}px;
  margin-right: ${cosmos.unit * 1.5}px;
  justify-content: center;
  align-items: center;
  background-color: ${palette.auxillary.ocean.main};
`;

const Initials = styled(H1Dark)`
  color: ${palette.auxillary.ocean.alt};
  font-size: ${cosmos.unit * 2}px;
`;

const ButtonContainer = styled.View`
  width:100%;
  margin-top: ${cosmos.unit * 2}px;
`;
