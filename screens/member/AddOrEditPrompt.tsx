import React from 'react';
import styled, { css } from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageBackground, TouchableOpacity, View } from 'react-native';

import cosmos, { palette } from 'shared/src/cosmos';
import { IPrompt } from 'shared/src/services/book-service';
import { useAddDiscussionGuide, useEditDiscussionGuide } from '../../hooks/useDiscussionGuide';
import { FormErrorText, H1Dark, ParagraphDark, UnderlinedText } from 'theme/Typography';

import { Button } from 'theme/Button';
import { ROUTE } from 'lib/constants';
import { Controller, useForm } from 'react-hook-form';
import FormControl from '../../components/FormControl';
import Loading from '../../components/Loading';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IAuthorShelfBook } from 'shared/src/services/author-service';
import { cacheKey } from '../../hooks/cacheStateKey';
import { useQueryClient } from 'react-query';
import { BCContainer } from 'components/containers/BCContainer';


interface IFormData {
  promptText?: string;
  promptChapter?: number;
}

const AddOrEditPrompt = (): JSX.Element => {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { control, handleSubmit, errors, formState } = useForm<IFormData>();
  const { mutate: addPrompt, ...addPromptInfo } = useAddDiscussionGuide();
  const { mutate: editPrompt, ...editPromptInfo } = useEditDiscussionGuide();


  const { book, editMode, prompt } = route.params as { book: IAuthorShelfBook, editMode?: boolean, prompt?: IPrompt };
  const defaultValue = prompt && editMode ? prompt.promptText : '';
  const videoThumbNail = prompt?.response?.video?.thumbnails?.large;

  const handleFormSubmit = (data: IFormData) => {
    if (editMode && prompt) {
      editPrompt({
        _id: prompt._id,
        promptText: data?.promptText,
        promptChapter: data?.promptChapter
      }, {
        onSuccess: () => {
          navigation.navigate(ROUTE.DISCUSSION_PROMPTS, { book });
          queryClient.invalidateQueries(cacheKey.myAuthor);
        },
      });
    } else {
      addPrompt({
        promptText: data.promptText,
        bookId: book.bookData._id!,
      }, {
        onSuccess: () => {
          navigation.navigate(ROUTE.DISCUSSION_PROMPTS, { book });
          queryClient.invalidateQueries(cacheKey.myAuthor);
        },
      });
    }

  };

  const handleRecord = () => {
    navigation.navigate(ROUTE.RECORD_VIDEO, { prompt, editMode: Boolean(videoThumbNail) });
  };

  const pickVideo = async () => {
    navigation.navigate(ROUTE.UPLOAD_VIDEO, { prompt });
  };

  return (
    <BCContainer style={{flex: 1}} pageTitle={'Prompt'} showBackButton={true} hideProfileImage={true}>
      {(addPromptInfo.isLoading || editPromptInfo.isLoading || formState.isSubmitting) ? <Loading/> : null}

      <ScrollContainer contentContainerStyle={{ alignItems: 'center' }} alwaysBounceVertical={false}>
        <TitleContainer>
          <ParagraphDark>We’re looking for questions (and answers) that immerse readers.</ParagraphDark>
          <ParagraphDark style={{ marginTop: 24 }}>That’s why we invited the foremost expert on your book—you—to help us
            create an intimate, immersive, and interactive experience for readers.</ParagraphDark>
        </TitleContainer>

        <FormArea>
          <View>
            <Controller
              defaultValue={defaultValue}
              control={control}
              render={({ onChange, onBlur, value }) => (
                <FormControl
                  label="Question"
                  style={{ height: 190 ,textAlignVertical:'top'}}
                  placeholder={'Here’s your prompt: You’re part of a discussion group talking about your book. Everyone in the group can join the discussion, but you’re the only one who can speak from the author’s point of view.'}
                  onChangeText={value => onChange(value)}
                  value={value}
                  multiline={true}
                  autoCorrect={false}
                />
              )}
              name="promptText"
              rules={{
                required: 'Discussion guide prompt is required',
                minLength: {
                  value: 20,
                  message: 'Discussion guide propmt should be at least 20 characters',
                },
                maxLength: {
                  value: 300,
                  message: 'Discussion guide prompt shouldnt be more than 300 characters',
                },
              }}
            />
            {errors?.promptText && <FormErrorText>{errors?.promptText?.message}</FormErrorText>}
          </View>
          <FaqsText>Check out our <UnderlinedText>content creation FAQs</UnderlinedText> for help.</FaqsText>
        </FormArea>
        {!!editMode && (
          <VideoSection>
            <SecondaryTitle>Video Response</SecondaryTitle>
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
              {!videoThumbNail ?
                <VideoControl onPress={() => navigation.navigate(ROUTE.VIDEO_ONBOARDING, { prompt, book })}>
                  <MaterialCommunityIcons name="plus" size={24} color={palette.primary.bcBlue}/>
                  <AddText>Add video</AddText>
                </VideoControl> : null}
              <VideoButtonContainer>
                <RecordButton onPress={handleRecord}>
                  {videoThumbNail ? <H1Dark>Re-record Video</H1Dark> : null}
                  {!videoThumbNail ? <H1Dark>Record Video</H1Dark> : null}
                </RecordButton>
                <FaqsText>or <TouchableOpacity onPress={pickVideo}><FaqsText><UnderlinedText>upload a
                  video</UnderlinedText></FaqsText></TouchableOpacity> you already recorded.</FaqsText>
              </VideoButtonContainer>
            </TopSection>
          </VideoSection>
        )}

      </ScrollContainer>
      <Button
        title="Save prompt"
        style={{ width: '100%', position: 'absolute', bottom: Math.max(insets.bottom, 16) }}
        onPress={handleSubmit(handleFormSubmit)}
      />
    </BCContainer>


  );
};

export default AddOrEditPrompt;

const ScrollContainer = styled.ScrollView`
  background-color: ${palette.primary.linen}
`;

const TopSection = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: 12px;
`;

const AddText = styled.Text`
  font-family: larsseitbold;
  font-size: ${cosmos.unit * 2}px;
  margin-top: 5px;
  color: ${palette.primary.bcBlue};
`;

const ThumbNail = styled.TouchableOpacity`
  width: 112px;
  height: 200px;
  margin-right: 20px;
`;

const RecordButton = styled.TouchableOpacity`
  width: ${cosmos.unit * 25}px;
  height: ${cosmos.unit * 6}px;
  border: 1px solid ${palette.grayscale.granite};
  margin-bottom: 4px;
  justify-content: center;
  align-items: center;
`;

const TitleContainer = styled.View`
  margin-top: 24px;
  width:100%;
  padding-horizontal:16px
`;

const VideoButtonContainer = styled.View`
  flex:1;
  justify-content: center;
  align-items: center;
`;

const VideoControl = styled.TouchableOpacity`
  width: 112px;
  height: 200px;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  border-radius: 1px;
  border: 2px dashed ${palette.primary.bcBlue};
`;

const FormArea = styled.View`
  padding-horizontal: ${cosmos.unit * 2}px;
  background-color: ${palette.grayscale.white};
  margin-top: ${cosmos.unit * 4}px;
  padding-vertical: ${cosmos.unit * 2}px;
  width:100%;
`;

const VideoSection = styled.View`
  padding-horizontal: ${cosmos.unit * 2}px;
  background-color: ${palette.grayscale.white};
  margin-top: ${cosmos.unit * 3}px;
  padding-vertical: ${cosmos.unit * 2}px;
  margin-bottom: 60px;
  width:100%;
`;

const SecondaryTitle = styled.Text`
  font-family: larsseitbold;
  font-size: 18px;
  line-height: 26px;
  color: ${palette.grayscale.black};
  margin-bottom: 10px;
`;

const FaqsText = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  width: 100%;
  text-align: center;
  margin-top: 16px;
  color: ${palette.grayscale.granite};
`;
