import React, { useState } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import styled from 'styled-components/native';
import cosmos, { palette } from 'shared/src/cosmos';
import { CustomizableButton } from 'theme/Button';
import { ModalSheet } from 'components/ModalSheet';
import { Avatar } from 'components/Avatar';
import { useKeyboard } from 'hooks/useKeyboard';
import { IAPI_User_Full, IFeedCard } from 'shared/src/services/user-service';
import { useGetClubFeed, usePostToClubFeed } from 'hooks/useClubFeed';
import { FeedCard } from './FeedCard';
import { showErrorPopUp } from 'components/ModalErrorPopUp';
import { cacheKey } from 'hooks/cacheStateKey';
import { useQueryClient } from 'react-query';

enum EDITOR_STATE {
  EDITING = "editing",
  POSTING = "posting",
}

interface IClubFeedInterface {
  currentUserData: IAPI_User_Full | undefined,
  clubModeratorId: string | undefined,
  clubId: string,
}

export const ClubFeed = ({currentUserData, clubModeratorId, clubId} : IClubFeedInterface) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorState, setEditorState] = useState<EDITOR_STATE>(EDITOR_STATE.POSTING);
  
  const {data: clubFeedData} = useGetClubFeed(clubId);

  const isModerator = currentUserData?._id === clubModeratorId;

  const PostEditor = () => {
    const queryClient = useQueryClient();

    const [postText, setPostText] = useState('');
    const { mutate: postToClubFeed, isLoading: isPostingToClubFeed } = usePostToClubFeed();

    const screenHeight = Dimensions.get('window').height;
    const [keyboardHeight] = useKeyboard();
    const viewHeight = screenHeight - keyboardHeight - 140;

    const onSavePressed = () => {
      postToClubFeed({clubId: clubId, textContent: postText}, {
        onSuccess: () => {
          queryClient.invalidateQueries(clubId !== undefined ? [cacheKey.clubFeed, clubId] : cacheKey.clubFeed);
          setIsEditorOpen(false);
        },
        onError: (error) => {
          showErrorPopUp({
            title: "Error",
            message: 'Failed to post the message.\nPlease try again',
          });
          console.error("Error: Failed to save post", error);
        }
      })
    }

    return (
      <View style={{width: '100%', height: viewHeight, alignItems: 'stretch', justifyContent: 'space-between'}}>
        <View>
          <EditorTitle>{editorState === EDITOR_STATE.POSTING ? 'Create a feed post' : 'Edit post'}</EditorTitle>

          <InputContainer>
            <Avatar images={currentUserData?.images} name={currentUserData?.name} size={48}/>
            <NameText>{currentUserData?.name}</NameText>
          </InputContainer>

          <TextInputComponent
            placeholder={'Share your thoughts with your jamesbook'}
            value={postText}
            onChangeText={setPostText}
          />
        </View>

        <CustomizableButton
          title={'Save'}
          onPress={onSavePressed}
          disabled={isPostingToClubFeed}
          loading={isPostingToClubFeed}
          style={{marginHorizontal: cosmos.unit * 2, marginBottom: cosmos.unit * 3}}
        />
      </View>
    );
  }

  return (
    <Container>
      { isEditorOpen &&
        <ModalSheet
          isVisible={isEditorOpen}
          setIsVisible={setIsEditorOpen}
          content={<PostEditor/>}/>
      }
      
      
      { isModerator &&
        <InputContainer>
          <Avatar images={currentUserData?.images} name={currentUserData?.name} size={48}/>
          <CustomizableButton
            title='Share your thoughts…'
            onPress={() => {
              setEditorState(EDITOR_STATE.POSTING);
              setIsEditorOpen(true);
            }}
            style={{borderRadius: 4, borderWidth: 1, borderColor: palette.grayscale.granite, backgroundColor: 'transparent', marginStart: 12, flex: 1}}
            textStyle={{color: palette.grayscale.granite, fontSize: 16, lineHeight: 26, fontFamily: 'larsseit', flex: 1, textAlign: 'left'}}
          />
        </InputContainer>
      }

      <FlatList
        data={clubFeedData}
        keyExtractor={(item: IFeedCard) => item._id.toString()}
        style={{marginTop: cosmos.unit * 2}}
        contentContainerStyle={{ paddingBottom: cosmos.unit * 2}}
        ItemSeparatorComponent = {() => <View style={{height: cosmos.unit * 2, backgroundColor: palette.grayscale.whisper}}/>}
        renderItem={({item}) => <FeedCard feedCard={item} currentUserDataFull={currentUserData} isModerator={isModerator}/>}
      />
      
    </Container>
  );
};

const Container = styled.View`
  background-color: ${palette.grayscale.whisper};
  width: 100%;
`;

const InputContainer = styled.View`
  padding: ${cosmos.unit * 2}px;
  margin-top: ${cosmos.unit * 2}px;
  background-color: ${palette.grayscale.white};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
`;

const TextInputComponent = styled.TextInput`
  background-color: transparent;
  margin: ${cosmos.unit * 2}px;
  font-size: 16px;
  line-height: 22px;
`;

const NameText = styled.Text`
  font-family: larsseitbold;
  font-size: 18px;
  line-height: 26px;
  color: ${palette.primary.navy};
  flex: 1;
  text-align: left;
  margin-left: 12px;
`;

const EditorTitle = styled.Text`
  font-family: larsseitbold;
  font-size: 20px;
  line-height: 30px;
  color: ${palette.primary.navy};
  margin-left: ${cosmos.unit * 2}px;
`;
