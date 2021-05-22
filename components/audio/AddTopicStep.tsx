import React from 'react';
import cosmos, { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';
import { FormErrorText, H1Dark, ParagraphDark } from 'theme/Typography';
import { Button } from 'theme/Button';
import { Controller, useForm } from 'react-hook-form';
import FormControl from '../FormControl';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View } from 'react-native';


interface IProps extends IFormData {
  saveTopicAndDescription: (data:IFormData) => void;
}

interface IFormData {
  topic: string;
  description: string;
}

const AddTopicStep = ({ saveTopicAndDescription, topic, description }: IProps) => {
  const { control, handleSubmit, errors } = useForm<IFormData>();

  const handleFormSubmit = (data: IFormData) => {
    saveTopicAndDescription(data);
  };

  return (
    <Wrapper>
      <KeyboardAwareScrollView
        style={{backgroundColor: 'transparent', flex: 1}}
        scrollEnabled={true}
        keyboardShouldPersistTaps={'handled'}
        enableOnAndroid={true}
        alwaysBounceVertical={false}
        bounces={false}
        // behavior={Platform.OS === "ios" ? "padding" : null}
        // enabled
      >
        <View style={{flex: 1}}>
          <H1Dark style={{ marginBottom: cosmos.unit }}>Topic</H1Dark>
          <FormGroup>
            <Controller
              defaultValue={topic}
              control={control}
              render={({ onChange, value }) => (
                <FormControl
                  label=""
                  onChangeText={value => onChange(value)}
                  value={value}
                  multiline={false}
                  autoCorrect={false}
                />
              )}
              name="topic"
            />
            {errors?.topic && <FormErrorText>{errors?.topic?.message}</FormErrorText>}
          </FormGroup>
          <HelpText>This will be the name of the conversation.</HelpText>
          <H1Dark style={{ marginBottom: cosmos.unit, marginTop: cosmos.unit * 3 }}>Description</H1Dark>
          <FormGroup>
            <Controller
              defaultValue={description}
              control={control}
              render={({ onChange, onBlur, value }) => (
                <FormControl
                  label=""
                  style={{ height: 100 ,textAlignVertical:'top'}}
                  // placeholder={'Here’s your prompt: You’re part of a discussion group talking about your book. Everyone in the group can join the discussion, but you’re the only one who can speak from the author’s point of view.'}
                  onChangeText={value => onChange(value)}
                  value={value}
                  multiline={true}
                  autoCorrect={false}
                />
              )}
              name="description"
            />
            {errors?.description && <FormErrorText>{errors?.description?.message}</FormErrorText>}
          </FormGroup>
          <ButtonContainer>
            <Button
              title="Save"
              style={{ width: '100%'}}
              onPress={handleSubmit(handleFormSubmit)}
            />
          </ButtonContainer>
        </View>


      </KeyboardAwareScrollView>

    </Wrapper>
  );
};

export { AddTopicStep };


const Wrapper = styled.View`
  width: 100%;
  padding-top: ${cosmos.unit}px;
  height: 400px;
  padding-horizontal:${cosmos.unit * 2}px;
  padding-bottom: ${cosmos.unit * 8}px;
`;

const FormGroup = styled.View`
  margin-bottom: ${cosmos.unit}px;
`;

const ButtonContainer = styled.View`
  margin-top: ${cosmos.unit * 3}px;
`;

const HelpText = styled(ParagraphDark)`
  color: ${palette.grayscale.granite};
`;
