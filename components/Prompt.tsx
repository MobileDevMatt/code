import React, { useState } from 'react';
import styled, { css } from 'styled-components/native';
import { Image, Text, View, ImageBackground, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Menu } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import cosmos, { palette } from 'shared/src/cosmos';
import { ROUTE } from '../lib/constants';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ParagraphDark, Paragraph } from '../theme/Typography';
import RNPickerSelect from 'react-native-picker-select';
import { IPrompt } from 'shared/src/services/book-service';
import { IAuthorShelfBook } from 'shared/src/services/author-service';
import PlayVideoModal from 'components/video/PlayVideoModal';
import { IUser_Full } from 'shared/src/services/user-service';
import { Avatar } from 'components/Avatar';
import { useGetDiscussionGuidePrompt } from 'hooks/useDiscussionGuide';

interface IPromptProps {
  prompt: IPrompt;
  isEditable: boolean;
  book?: IAuthorShelfBook;
  deleteAction?: () => void;
  creator?: IUser_Full;
}

const PromptComponent = ({ prompt, creator, isEditable, book, deleteAction }: IPromptProps) => {
  const navigation = useNavigation();
  const [showPromptResponse, setShowPromptResponse] = useState(false);
  const [visible, setVisible] = useState(false);
  const { data: discussionGuidePrompt } = useGetDiscussionGuidePrompt({ promptId: prompt._id });


  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const videoThumbNail = prompt?.response?.video?.thumbnails?.large;

  const editPrompt = () => {
    navigation.navigate(ROUTE.ADD_EDIT_PROMPT, { book, prompt, editMode: true });
    closeMenu();
  };

  const deletePrompt = () => {
    deleteAction ? deleteAction() : null;
    closeMenu();
  };

  const EditablePrompt = () => {
    return(
      <Prompt>
        <TopSection>
          {videoThumbNail ?
            <ThumbNail onPress={() => navigation.navigate(ROUTE.RECORD_VIDEO, { prompt, editMode: true })}>
              <ImageBackground
                resizeMode={'cover'}
                borderRadius={3}
                style={{ width: 112, height: 200, justifyContent: 'center', alignItems: 'center' }}
                source={{ uri: videoThumbNail }}
              >
                <MaterialCommunityIcons name={`play`} size={40} color="rgba(255,255,255,0.75)"/>
              </ImageBackground>

            </ThumbNail> : null}
          {!videoThumbNail && isEditable ?
            <AddVideoControl onPress={() => navigation.navigate(ROUTE.VIDEO_ONBOARDING, { prompt, book })}>
              <MaterialCommunityIcons name="plus" size={24} color={palette.primary.bcBlue}/>
              <AddVideoTitle>Add video</AddVideoTitle>
            </AddVideoControl> : null}
          <ParagraphContainer>
            { isEditable ?
              <ActionsContainer>
                <Menu
                  contentStyle={{ backgroundColor: 'transparent' }}
                  visible={visible}
                  onDismiss={closeMenu}
                  anchor={
                    <TouchableOpacity onPress={openMenu}>
                      <MaterialIcons
                        name="more-horiz" size={24}
                        color={palette.grayscale.black}/>
                    </TouchableOpacity>}>
                  <MenuItemContainer>
                    <TouchableOpacity
                      onPress={editPrompt}>
                      <Paragraph>Edit</Paragraph>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deletePrompt}>
                      <Paragraph>Delete</Paragraph>
                    </TouchableOpacity>


                  </MenuItemContainer>
                </Menu>
              </ActionsContainer>
            : null }
            <ParagraphDark>{prompt.promptText}</ParagraphDark>
          </ParagraphContainer>
        </TopSection>
        { isEditable ?
          <>
            <SecondaryTitle>When should readers see this prompt?</SecondaryTitle>
            <RNPickerSelect
              style={{
                ...pickerSelectStyles, iconContainer: {
                  top: 10,
                  right: 12,
                },
              }}
              Icon={() => {
                return <MaterialIcons name="keyboard-arrow-down" size={24} color={palette.grayscale.black}/>;
              }}
              onValueChange={(value) => console.log(value)}
              items={[
                { label: 'Show for all chapters', value: '' },
                { label: 'Show for Chapter 1', value: '' },
              ]}
            />
          </>
        : null }
      </Prompt>
    )
  }

  const AuthorTag = (): JSX.Element => (
    <View style={{flexDirection: 'row', alignItems: "center"}}>
      {creator?.images?.small ?
        <Image
          source={{ uri: `https://${creator?.images?.small}`}}
          style={{ borderRadius: 50, height: 36, width: 36, marginRight: 8 }} />
        : <Avatar name={creator?.name} />
      }
      <View>
        <Text style={{ fontFamily: 'larsseitbold'}}>{creator?.name}</Text>
        <Text>Author</Text>
      </View>
    </View>
  )

  const PublishedPrompt = () => {
    return(
    <Prompt>
      <AboutPrompt>
        <AuthorTag />
        <Text>{prompt.dateCreated}</Text>
      </AboutPrompt>
      <ParagraphContainer>
        <ParagraphDark numberOfLines={4}>{prompt.promptText}</ParagraphDark>
      </ParagraphContainer>
      {videoThumbNail ?
        <ThumbNail onPress={() => setShowPromptResponse(true)}>
          <ImageBackground
            resizeMode={'cover'}
            borderRadius={3}
            style={{ width: 112, height: 200, justifyContent: 'center', alignItems: 'center' }}
            source={{ uri: videoThumbNail }}
          >
            <MaterialCommunityIcons
              name={`play`}
              size={40}
              color="rgba(255,255,255,0.75)"/>
          </ImageBackground>
        </ThumbNail> : null}
      <PlayVideoModal
        isVideoVisible={showPromptResponse}
        hideVideo={() => setShowPromptResponse(false)}
        videoUrl={discussionGuidePrompt?.response?.video?.contentUrl || ''}/>
    </Prompt>

    )
  }

  return isEditable ? <EditablePrompt /> : <PublishedPrompt />;
};

export default PromptComponent;

const Prompt = styled.View`
  width: 100%;
  padding:20px;
  margin-bottom: 24px;
  background-color: ${palette.grayscale.white};
`;

const AboutPrompt = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: 16
`;

const TopSection = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: 12px;
`;

const MenuItemContainer = styled.View`
  width:156px;
  height: 70px;
  background-color: rgba(10, 22, 37 , 0.8);
  border-radius: 2px;
  padding: ${cosmos.unit}px;
  justify-content: space-between;
`;

const baseTextStyles = css`
  font-family: larsseitbold;
  font-size: 15px;
  margin-top: 5px;
`;

const AddVideoTitle = styled.Text`
  ${baseTextStyles}
  color: ${palette.primary.bcBlue};
`;

const SecondaryTitle = styled.Text`
  ${baseTextStyles}
  color: ${palette.grayscale.black};
  margin-bottom: 5px;
`;

const ActionsContainer = styled.View`
  align-self: flex-end;
`;

const ParagraphContainer = styled.View`
  flex: 1;
`;

const AddVideoControl = styled.TouchableOpacity`
  width: 112px;
  height: 200px;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  border-radius: 1px;
  border: 2px dashed ${palette.primary.bcBlue};
`;

const ThumbNail = styled.TouchableOpacity`
  height: 200px;
  width: 100%;
  margin-top: ${cosmos.unit}px;
  align-items: center;
  background: ${palette.grayscale.black};
`;

const basePickerStyles = {
  fontSize: 16,
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderWidth: 1,
  fontFamily: 'larsseit',
  borderColor: palette.grayscale.stone,
  borderRadius: 1,
  color: palette.grayscale.black,
  paddingRight: 30, // to ensure the text is never behind the icon
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: basePickerStyles,
  inputAndroid: basePickerStyles,
});
