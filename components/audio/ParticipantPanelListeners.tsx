import React, { useState } from 'react';
import cosmos, { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';
import Collapsible from 'react-native-collapsible';
import { TouchableOpacity } from 'react-native';
import { H1Dark } from 'theme/Typography';
import { Feather } from '@expo/vector-icons';
import { Participant } from './Participant';
import { FadeInView } from '../AnimatedContainers/FadeInView';
import { getLargestImage } from 'shared/src/utils';
import { IListener, PARTICIPANT_TYPE } from 'shared/src/services/conversation-service';
import { useGetUser } from 'hooks/useGetUser';
import { useLiveAudio } from 'context/LiveAudioContext';
import { ModalSheet } from '../ModalSheet';
import { InviteToConversationPopUp } from './InviteToConversationPopUp';

interface IProps {
  isParticipantTypeSpeaker?: boolean;
  participants: IListener[];
}


const ParticipantPanelListeners = ({ isParticipantTypeSpeaker, participants = [] }: IProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isInviteUserModalOpen, setIsInviteUserModalOpen] = useState(false);
  const { liveConversation } = useLiveAudio();
  const { data: user } = useGetUser();
  const isConversationCreator = Boolean(liveConversation?.speakers?.find((speaker) => speaker.isModerator && speaker.userRef === user?._id));
  const collapsePanel = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ParticipantCard>

      <CardTopSection>
        <SpeakerTitle>
          <TouchableOpacity onPress={collapsePanel}>
            {!!collapsed ? (
              <Feather name="chevron-down" size={20} color="black" style={{ marginRight: 5 }}/>
            ) : (
              <Feather name="chevron-up" size={20} color="black" style={{ marginRight: 5 }}/>
            )}

          </TouchableOpacity>
          <H1Dark
            style={{ marginRight: 5 }}> {
            participants?.length === 1 && `1 Listener`}
            {participants?.length > 1 && `${participants?.length} Listeners`}
            {participants?.length === 0 && `0 Listeners`}
          </H1Dark>
        </SpeakerTitle>

        {!!isConversationCreator ? (
          <TouchableOpacity onPress={() => setIsInviteUserModalOpen(true)}>
            <AddButton>Add Listener</AddButton>
          </TouchableOpacity>
        ) : null}
      </CardTopSection>
      <Collapsible collapsed={collapsed}>
        <Participants>
          {participants.map((participant, index) => (
            <Participant
              key={index}
              role={'listener'}
              imageSrc={getLargestImage(participant?.images)}
              name={participant.name}
              participantId={participant.userRef}
              isAskingToSpeak={participant?.isAskingToSpeak}
            />
          ))}
        </Participants>
      </Collapsible>
      <ModalSheet
        isVisible={isInviteUserModalOpen}
        setIsVisible={setIsInviteUserModalOpen}
        onClose={() => setIsInviteUserModalOpen(false)}
        onOpen={() => setIsInviteUserModalOpen(true)}
        content={
          <InviteToConversationPopUp
            setIsInviteUserModalOpen={setIsInviteUserModalOpen}
            conversation={liveConversation}
            inviteType={PARTICIPANT_TYPE.LISTENER}/>
        }/>
    </ParticipantCard>
  );
};

export { ParticipantPanelListeners };

const ParticipantCard = styled(FadeInView)`
  width: 100%;
  padding: ${cosmos.unit * 2}px;
  border-radius: ${cosmos.unit}px;
  margin-bottom: ${cosmos.unit * 2}px;
  background-color: ${palette.grayscale.white};
`;

const CardTopSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${cosmos.unit * 2}px;
`;

const SpeakerTitle = styled.View`
  flex-direction: row;
  align-items: center;
`;

const AddButton = styled(H1Dark)`
  color: ${palette.primary.bcBlue}
`;

const Participants = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`;
