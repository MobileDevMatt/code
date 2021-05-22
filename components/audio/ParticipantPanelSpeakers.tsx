import React, { useState } from 'react';
import cosmos, { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';
import { TouchableOpacity, View } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { H1Dark } from 'theme/Typography';
import { Participant } from './Participant';
import { FadeInView } from '../AnimatedContainers/FadeInView';
import { getLargestImage } from 'shared/src/utils';
import { ISpeaker, PARTICIPANT_TYPE } from 'shared/src/services/conversation-service';
import { ModalSheet } from '../ModalSheet';
import { InviteToConversationPopUp } from './InviteToConversationPopUp';
import { useLiveAudio } from 'context/LiveAudioContext';
import { useGetUser } from 'hooks/useGetUser';

interface IProps {
  isParticipantTypeSpeaker?: boolean;
  participants?: ISpeaker[],
}

const ParticipantPanelSpeakers = ({ isParticipantTypeSpeaker, participants = [] }: IProps) => {
  const [animatedHeight, setAnimatedHeight] = useState<number | string>(335);
  const [isInviteUserModalOpen, setIsInviteUserModalOpen] = useState(false);
  const { liveConversation } = useLiveAudio();
  const { data: user } = useGetUser();
  const isConversationCreator = Boolean(liveConversation?.speakers?.find((speaker) => speaker.isModerator && speaker.userRef === user?._id));


  const toggleHeight = () => {
    setAnimatedHeight(animatedHeight === 335 ? 'auto' : 335);
  };

  return (
    <ParticipantCard>
      <View style={{ maxHeight: animatedHeight }}>
        <CardTopSection>

          <SpeakerTitle>
            <Feather name="message-circle" size={20} color="black" style={{ marginRight: 5 }}/>
            <H1Dark>{participants?.length} Speaker</H1Dark>
          </SpeakerTitle>


          {!!isConversationCreator ? (
            <TouchableOpacity onPress={() => setIsInviteUserModalOpen(true)}>
              <AddButton>Add Speaker</AddButton>
            </TouchableOpacity>
          ) : null}

        </CardTopSection>

        <Participants>
          {participants.map((participant, index) => (
            <Participant
              key={index}
              role={'moderator'}
              imageSrc={getLargestImage(participant?.images)}
              name={participant.name}
              isMuted={participant?.isMuted}
              participantId={participant.userRef}
            />
          ))}
        </Participants>
      </View>

      {participants?.length > 6 ? (<ToggleHeightButton onPress={toggleHeight}>
        <>
          <ShowHideText>Show {animatedHeight === 335 ? 'all' : 'less'}</ShowHideText>
          <Feather name="chevron-down" size={cosmos.unit * 2} color="black" style={{ marginLeft: 3 }}/>
        </>
      </ToggleHeightButton>) : null}
      <ModalSheet
        isVisible={isInviteUserModalOpen}
        setIsVisible={setIsInviteUserModalOpen}
        onClose={() => setIsInviteUserModalOpen(false)}
        onOpen={() => setIsInviteUserModalOpen(true)}
        content={
          <InviteToConversationPopUp
            setIsInviteUserModalOpen={setIsInviteUserModalOpen}
            conversation={liveConversation}
            inviteType={PARTICIPANT_TYPE.SPEAKER}/>
        }/>
    </ParticipantCard>
  );
};

export { ParticipantPanelSpeakers };

const ParticipantCard = styled(FadeInView)`
  width: 100%;
  border-radius: ${cosmos.unit}px;
  margin-bottom: ${cosmos.unit * 2}px;
  background-color: ${palette.grayscale.white};
  overflow: hidden;
`;

const CardTopSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${cosmos.unit * 2}px;
  margin-bottom: ${cosmos.unit * 2}px;
`;

const ToggleHeightButton = styled.TouchableOpacity`
  border-top-color: ${palette.grayscale.stone};
  border-top-width: 1px;
  background-color: ${palette.grayscale.white};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${cosmos.unit * 4}px;
`;

const SpeakerTitle = styled.View`
  flex-direction: row;
  align-items: center;
`;

const AddButton = styled(H1Dark)`
  color: ${palette.primary.bcBlue}
`;

const ShowHideText = styled(H1Dark)`
  font-size: ${cosmos.unit * 1.5}px;
`;

const Participants = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: ${cosmos.unit * 2}px;
`;
