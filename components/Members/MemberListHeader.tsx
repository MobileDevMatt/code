import React, { useState } from 'react';
import styled from 'styled-components/native';

import cosmos, { palette } from 'shared/src/cosmos';
import { TransparentButton } from 'theme/Button';

const MemberListHeader = ({numberOfMembers} : {numberOfMembers: number}) => {
  const [inviteMembersVisible, setInviteMembersVisible] = useState(false);
  const [filterVisible, setfilterVisible] = useState(false);

  return(
    <Container>
      {/* TODO: this need to be changed to show total number of memembers - not the members in the list */}
      <NumberOfMembers>{numberOfMembers} Members</NumberOfMembers>
      {
        /*
        <InviteAndFilterContainer>
          <TransparentButton
            title={'Invite Memebers'}
            onPress={() => setInviteMembersVisible(true)}
            style={{marginEnd: cosmos.unit * 2}}
            textStyle={{fontSize: 15, lineHeight: 22, textDecorationLine: 'underline'}}
            />
          <TransparentButton
            title={'Filter'}
            onPress={() => setfilterVisible(true)}
            style={{marginEnd: cosmos.unit * 2}}
            textStyle={{fontSize: 15, lineHeight: 22, textDecorationLine: 'underline'}}
            />
        </InviteAndFilterContainer>
        */
      }
    </Container>
  );
}

export { MemberListHeader };

const Container = styled.View`
  width: 100%;
  height: 53px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const InviteAndFilterContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NumberOfMembers = styled.Text`
  font-family: larsseitbold;
  font-size: 16px;
  line-height: 24px;
  color: ${palette.primary.navy};
  margin-left: ${cosmos.unit * 2}px;
`;

const InviteMembersAndFilterText = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  line-height: 22px;
  color: ${palette.primary.navy};
`;
