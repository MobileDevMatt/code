import React, { useState } from 'react';
import cosmos, { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';
import { Dimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { H1Dark } from 'theme/Typography';
import { AuthorIcon } from '../icons/AuthorIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { getInitials } from 'shared/src/utils';
import { ModalSheet } from '../ModalSheet';
import { ParticipantDetailModal } from './ParticipantDetailModal';
import { RaiseHandIcon } from '../icons/RaiseHandIcon';

interface IProps {
  role: 'author' | 'listener' | 'moderator' | 'speaker';
  imageSrc: string;
  name: string;
  isMuted?: boolean;
  isAskingToSpeak?: boolean;
  isSpeaking?: boolean;
  participantId?: string;
}

const WINDOW_WIDTH = Dimensions.get('window').width;
const INNER_CARD_WIDTH = WINDOW_WIDTH - (cosmos.unit * 8);

const PARTICIPANT_WIDTH = INNER_CARD_WIDTH / 3;

const Participant = ({ role, imageSrc, name, isMuted, isSpeaking,participantId,isAskingToSpeak = false }: IProps) => {
  const [isShowingParticipantModal, setIsShowingParticipantModal] = useState(false);
  const showParticipantModal = () => {
    setIsShowingParticipantModal(true);
  };

  return (
    <ParticipantWrapper onPress={showParticipantModal}>
      <View>
        {!!isSpeaking ? (
          <LinearGradient
            start={[0, 0.5]} end={[0.5, 0]}
            colors={['#EBDB04', '#28C1EA', '#DE7DAF']}
            style={{
              borderRadius: (cosmos.unit * 4) + 3,
              width: (cosmos.unit * 8) + 6,
              height: (cosmos.unit * 8) + 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ParticipantImage imageSrc={imageSrc} name={name}/>
          </LinearGradient>
        ) : (
          <NonSpeakingParticipantAvatar>
            <ParticipantImage imageSrc={imageSrc} name={name}/>
          </NonSpeakingParticipantAvatar>
        )}
        {!!isMuted ? (
          <MuteContainer>
            <Ionicons name="mic-off" size={12} color="black"/>
          </MuteContainer>
        ) : null}
        {!!isAskingToSpeak ? (
          <HandWaveContainer>
            <RaiseHandIcon width={12} height={13}/>
          </HandWaveContainer>
        ) : null}
      </View>
      {role === 'author' ? (
        <View>
          <Name numberOfLines={1}>{name}</Name>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <AuthorIcon height={13} width={12} color={palette.primary.bcBlue}/>
            <AuthorText>Author</AuthorText>
          </View>
        </View>
      ) : null}
      {role === 'moderator' || role === 'speaker' ? (
        <View>
          <Name numberOfLines={1}>{name}</Name>
          <SpeakerText>{role}</SpeakerText>
        </View>
      ) : null}
      {role === 'listener' ? (<Name numberOfLines={1}>{name}</Name>) : null}
      <ModalSheet
        isVisible={isShowingParticipantModal}
        setIsVisible={setIsShowingParticipantModal}
        onClose={() => setIsShowingParticipantModal(false)}
        onOpen={() => setIsShowingParticipantModal(true)}
        content={
          <ParticipantDetailModal participantId={participantId} setIsShowingParticipantModal={setIsShowingParticipantModal}/>
        }/>
    </ParticipantWrapper>
  );
};

const ParticipantImage = ({ imageSrc, name }: { imageSrc: string, name: string }) => {
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

export { Participant };

const ParticipantWrapper = styled.TouchableOpacity`
  align-items: center;
  width: ${PARTICIPANT_WIDTH}px;
  margin-bottom: ${cosmos.unit * 2}px;
`;

const NonSpeakingParticipantAvatar = styled.View`
  border: 3px solid transparent;
`;

const Avatar = styled.Image`
  width: ${cosmos.unit * 8}px;
  height: ${cosmos.unit * 8}px;
  border-radius:  ${cosmos.unit * 4}px;
  background-color: ${palette.grayscale.granite};
  resize-mode: cover;
`;

const InitialsContainer = styled.View`
  width: ${(cosmos.unit * 8)}px;
  height: ${(cosmos.unit * 8)}px;
  border-radius:  ${cosmos.unit * 4}px;
  justify-content: center;
  align-items: center;
  background-color: ${palette.auxillary.ocean.main};
`;

const Initials = styled(H1Dark)`
  color: ${palette.auxillary.ocean.alt};
  font-size: ${cosmos.unit * 2.5}px;
`;

const Name = styled(H1Dark)`
  font-size: 12px;
  margin-top: 2px;
  text-align: center;
`;

const MuteContainer = styled.View`
  position: absolute;
  background-color: ${palette.grayscale.white};
  border:2px solid ${palette.grayscale.granite};
  border-radius:  10px;
  justify-content: center;
  align-items: center;
  right:0;
  width: 20px;
  height: 20px;
`;

const HandWaveContainer = styled.View`
  position: absolute;
  background-color: ${palette.grayscale.white};
  border:1px solid ${palette.grayscale.granite};
  border-radius:  10px;
  justify-content: center;
  align-items: center;
  right:0;
  width: 20px;
  height: 20px;
`;

const AuthorText = styled.Text`
  font-family: larsseit;
  font-size: 12px;
  color:${palette.primary.bcBlue};
  margin-left: 2px;
`;

const SpeakerText = styled.Text`
  font-family: larsseit;
  font-size: 12px;
  text-align: center;
  text-transform: capitalize;
  color:${palette.grayscale.black};
`;
