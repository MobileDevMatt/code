import React, { useCallback } from 'react';
import styled, { css } from 'styled-components/native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';

import { palette } from 'shared/src/cosmos';
import { IBook } from 'shared/src/services/book-service';
import { useGetDiscussionGuide } from 'hooks/useGetDiscussionGuide';


import Prompt from 'components/Prompt';
import { SectionTitleDark, ParagraphDark } from 'theme/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'theme/Button';
import { ROUTE } from 'lib/constants';
import { IPrompt } from 'shared/src/services/book-service';
import { useDeleteDiscussionGuide } from '../../hooks/useDiscussionGuide';
import Loading from '../../components/Loading';
import { IAuthorShelfBook } from 'shared/src/services/author-service';
import { BCContainer } from 'components/containers/BCContainer';


const DiscussionPrompts: React.FC = ():JSX.Element => {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { book } = route.params as { book: IAuthorShelfBook };
  const guideId = book.discussionGuideRef;
  const bookData: IBook = book.bookData;

  const { data: discussionGuide, refetch } = useGetDiscussionGuide(guideId);
  const { mutate: deletePrompt, ...deletePromptInfo } = useDeleteDiscussionGuide();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [book]),
  );


  const promptList: IPrompt[] = discussionGuide?.prompts || [];

  const removeGuidePrompt = (promptid: string) => {
    deletePrompt(promptid, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const renderPrompts = () => {
    return promptList.map((prompt, index) => (
      <Prompt book={book} prompt={prompt} key={index} deleteAction={() => removeGuidePrompt(prompt._id)} isEditable={true}/>
    ));
  };

  return (
    <BCContainer style={{flex: 1}} showBackButton={true} pageTitle={bookData?.title} hideProfileImage={true}>
      {(deletePromptInfo.isLoading) ? <Loading/> : null}
      <ScrollContainer contentContainerStyle={{ alignItems: 'center' }} alwaysBounceVertical={false}>
        <TitleContainer>
          <Title>Discussion prompts</Title>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTE.ADD_EDIT_PROMPT, { book })}>
            <MaterialCommunityIcons name="plus" size={24} color={palette.grayscale.black}/>
          </TouchableOpacity>
        </TitleContainer>
        <Prompts>
          {promptList?.length ?
            renderPrompts() : (
              <EmptyStateContainer>
                <EmptyStateTitle>Incomplete prompts (0)</EmptyStateTitle>
                <EmptyStateText>
                  Incomplete prompts are only visible to you as drafts to complete when you’re ready. All prompts
                  require text and your video response. Any changes auto-save but will not be made public until you
                  publish this guide.
                </EmptyStateText>
              </EmptyStateContainer>
            )}
        </Prompts>

      </ScrollContainer>
      <Button
        title="Add prompt"
        style={{ width: '100%', position: 'absolute', bottom: Math.max(insets.bottom, 16) }}
        onPress={() => navigation.navigate(ROUTE.ADD_EDIT_PROMPT, { book })}
      />
    </BCContainer>
  );
};

export default DiscussionPrompts;

const Prompts = styled.View`
  align-items: center;
  width: 100%;
  padding-top: 16px;
  margin-bottom: 50px;
`;

const ScrollContainer = styled.ScrollView`
  background-color: ${palette.primary.linen}
`;

const Title = styled(SectionTitleDark)`
  font-size: 24px;
`;

const EmptyStateTitle = styled(SectionTitleDark)`
  text-align: left;
  width: 100%;
`;

const EmptyStateText = styled(ParagraphDark)`
  margin-top: 8px;
`;

const EmptyStateContainer = styled.View`
  padding-horizontal:16px;
  width: 100%;
  margin-top: 20px;
`;

const TitleContainer = styled.View`
  margin-top: 24px;
  width:100%;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal:16px
`;
