import React from 'react';
import cosmos, { palette } from 'shared/src/cosmos';
import styled, { css } from 'styled-components/native';
import { View } from 'react-native';
import { H1Dark, Paragraph } from 'theme/Typography';
import { IConversation } from 'shared/src/services/conversation-service';
import { Avatar } from '../Avatar';
import { AudioSpeakerIcon } from '../icons/AudioSpeakerIcon';

interface IProps { conversation: IConversation, onPress?: () => void }

const AudioConversationCard = ({ conversation, onPress = () => {}}: IProps ) => {
  const host = conversation?.speakers?.find(host => host.isModerator);

  return (
    <ConversationCard onPress={onPress}>
      <H1Dark>{conversation.title}</H1Dark>
      <HostedBy>hosted by <ModeratorName>{host?.name}</ModeratorName></HostedBy>
      <AvatarContainer>
        {conversation?.speakers?.map((speaker, index) => {
          return (
            <Speaker>
              <Avatar
                key={index}
                images={speaker.images}
                name={speaker?.name}
                size={32}
                fontSize={cosmos.unit}/>
            </Speaker>
          );
        })}
      </AvatarContainer>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AudioSpeakerIcon width={cosmos.unit * 2} height={cosmos.unit * 2} color={palette.auxillary.charcoal.alt}/>
        <NumberOfSpeakers>{conversation?.speakers?.length}</NumberOfSpeakers>
      </View>
    </ConversationCard>
  );
};

export { AudioConversationCard };

const NumberOfSpeakers = styled(Paragraph)`
  font-size: 14px;
  color: ${palette.auxillary.charcoal.alt};
  margin-left: 5px;
`;

const AvatarContainer = styled.View`
  margin-vertical: ${cosmos.unit * 1.5}px;
  flex-direction: row;
`;

const ConversationCard = styled.TouchableOpacity`
  padding: ${cosmos.unit * 2}px;
  width: 100%;
  background-color: ${palette.grayscale.white};
  margin-bottom: ${cosmos.unit * 2}px;
`;

const HostedBy = styled.Text`
  font-family: larsseit;
  font-size: ${cosmos.unit * 1.5}px;
  line-height: 15px;
  color: ${palette.grayscale.black};
`;

const Speaker = styled.View`
  margin-right: ${cosmos.unit}px;
`;

const ModeratorName = styled.Text`
  font-family: larsseitbold;
`;
