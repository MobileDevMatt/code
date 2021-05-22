import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { ImageBackground, StyleSheet, View } from 'react-native';

import cosmos, { palette } from 'shared/src/cosmos';
import Loading from 'components/Loading';
import { useGetDiscussionGuide } from 'hooks/useGetDiscussionGuide';
import { H1, Paragraph, SectionTitleDark } from 'theme/Typography';
import Prompt from 'components/Prompt';
import { FilterIcon } from 'components/icons/FilterIcon';
import { IBook } from 'shared/src/services/book-service';
import { IVideo } from 'shared/src/services/club-service';
import { PageToggle } from 'components/PageToggle';
import { InlineVideoPlayer } from '../../components/video/InlineVideoPlayer';
import { formatTime } from '../../lib/utils';
import { ModalSheet } from 'components/ModalSheet';
import { IAPI_User_Full } from 'shared/src/services/user-service';
import { getBookProgress } from 'shared/src/utils';
import { UpdateChapterProgress } from 'components/bookManager/UpdateChapterProgress';
import { BCContainer } from 'components/containers/BCContainer';
import { ROUTE } from 'lib/constants';
import { BookSubNavigator } from 'components/TabsSubNavigation';

interface IProps {
  guideId: string;
  playlist: IVideo[];
  userDataFull: IAPI_User_Full;
  book?: IBook;
}

export const BookExplore = ({ guideId, playlist, userDataFull, book }: IProps): JSX.Element => {

  const { data: discussionGuide, isLoading } = useGetDiscussionGuide(guideId);
  const promptList = discussionGuide?.prompts;

  const [activePage, setActivePage] = useState(0);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollViewRef = useRef();
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [progress, setProgress ] = useState<number>(0);

  useEffect(() => {
    const myProgress = getBookProgress(userDataFull, book?._id);
    setProgress(myProgress);
  }, [userDataFull]);

  const authorVideo = playlist[activeIndex];

  const promptListBasedOnProgress = promptList?.filter(p => p?.promptChapter <= progress || p?.promptChapter === 0);

  const savePageIndex = (index: number) => {
    setActivePage(index);
  };

  return isLoading ? <Loading/> : (
    <BCContainer pageTitle={book?.title} showBackButton={true} userImage={userDataFull?.images} userFullName={userDataFull?.name} style={{flex:1}}>

    { userDataFull && book &&
      <BookSubNavigator routeName={ROUTE.BOOK_EXPLORE} currentUserDataFull={userDataFull} book={book}/>
    }

      <ModalSheet
        isVisible={isUpdatingProgress}
        setIsVisible={setIsUpdatingProgress}
        onClose={() => setIsUpdatingProgress(false)}
        onOpen={() => setIsUpdatingProgress(true)}
        content={
          <View style={{alignSelf: 'stretch'}}>
            { isUpdatingProgress &&
              <UpdateChapterProgress
                bookProgress={progress}
                numberOfChapters={book?.chapterCount!}
                callback={() => setIsUpdatingProgress(false)}
                bookId={book?._id}
              />
            }
          </View>
        }
      />

      <PageToggle
        leftTabText={'Author interview'}
        index={activePage}
        setIndex={savePageIndex}
        rightTabText={'Discussion Guide'}
      />
      <ExplorePageContainer
        style={{ backgroundColor: activePage === 0 ? palette.grayscale.black : palette.primary.linen }}>
        <PanelWrapper>
          {activePage === 0 ? (
            <AuthorInterviewContainer
              ref={scrollViewRef}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: cosmos.unit * 6 }}
              alwaysBounceVertical={false}
            >
              <InlineVideoPlayer videoSource={authorVideo?.contentUrl}/>
              <AuthorBackgroundContainer>
                <H1>Background research</H1>
                <BackgroundDescription>{authorVideo?.description}</BackgroundDescription>
              </AuthorBackgroundContainer>
              <PlaylistTitleContainer>
                <PlaylistTitle>Full playlist</PlaylistTitle>
              </PlaylistTitleContainer>
              <PlaylistContainer>
                {playlist.map((video, index) => {
                  return (
                    <PlaylistItem
                      onPress={() => {
                        scrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: true });
                        setActiveIndex(index);
                      }}
                      style={{ backgroundColor: activeIndex === index ? palette.grayscale.granite + '1a' : palette.grayscale.black }}>
                      <ImageBackground
                        resizeMode={'contain'}
                        borderRadius={3}
                        style={styles.thumbnail}
                        source={{ uri: video?.thumbnails?.medium }}
                      >
                        <DurationContainer>
                          <Duration>{formatTime(video.duration / 1000)}</Duration>
                        </DurationContainer>
                      </ImageBackground>
                      <PlaylistName>{video.title}</PlaylistName>
                    </PlaylistItem>
                  );
                })}

              </PlaylistContainer>
            </AuthorInterviewContainer>
          ) : (
            <DiscussionGuidesContainer
              contentContainerStyle={{ alignItems: 'center', paddingBottom: cosmos.unit * 6 }}
              alwaysBounceVertical={false}
            >
              <TitleContainer>
                <SectionTitleDark>Filter</SectionTitleDark>
                <View style={{ flexDirection: 'row' }}>
                  <SettingsButton onPress={() => setIsUpdatingProgress(true)}>
                    <SettingsButtonText>Update progress</SettingsButtonText>
                  </SettingsButton>
                  <SettingsButton onPress={() => console.log('Todo: hook up prompt filters')}>
                    <FilterIcon height={12} width={12}/>
                  </SettingsButton>

                </View>
              </TitleContainer>
              <Prompts>
                {promptListBasedOnProgress?.map((prompt, index) => (
                  <Prompt
                    creator={discussionGuide?.createdBy}
                    prompt={prompt}
                    key={index}
                    isEditable={false}/>
                ))}
              </Prompts>
            </DiscussionGuidesContainer>
          )}
        </PanelWrapper>
      </ExplorePageContainer>
    </BCContainer>
  );
};

const ExplorePageContainer = styled.View`
  flex:1;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding-top: ${cosmos.unit * 2}px;
  padding-horizontal: ${cosmos.unit}px;
`;

const AuthorInterviewContainer = styled.ScrollView`
  background-color: ${palette.grayscale.black}
`;

const DiscussionGuidesContainer = styled.ScrollView`
  background-color: ${palette.primary.linen}
`;

const Prompts = styled.View`
  align-items: center;
  width: 100%;
  padding-top: 16px;
  margin-bottom: 50px;
`;

const SettingsButton = styled.TouchableOpacity`
  margin: 0px ${cosmos.unit / 2}px;
  padding: ${cosmos.unit * 1.5}px ${cosmos.unit * 2}px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${palette.grayscale.stone};
  border-radius: 2px;
`;

const SettingsButtonText = styled.Text`
  font-family: larsseitbold;
  font-size: 16px;
  line-height: 16px;
`;

const PlaylistItem = styled.TouchableOpacity`
  padding-vertical: ${cosmos.unit}px;
  padding-left: ${cosmos.unit}px;
  flex-direction: row;
`;

const BackgroundDescription = styled(Paragraph)`
  color: ${palette.grayscale.granite};
  margin-top: ${cosmos.unit}px;
`;

const AuthorBackgroundContainer = styled.View`
  width:100%;
  padding-horizontal:${cosmos.unit * 2}px;
  margin-top: ${cosmos.unit * 1.5}px;
  margin-bottom: ${cosmos.unit * 4}px;
`;

const PlaylistContainer = styled.View`
  width:100%;
  padding-horizontal:${cosmos.unit}px;
`;

const PlaylistTitleContainer = styled.View`
  width:100%;
  padding-horizontal:${cosmos.unit * 2}px;
`;

const PanelWrapper = styled.View`
  width: 100%;
  margin-bottom: 50px;
`;

const Duration = styled(Paragraph)`
  font-size: 14px;
`;

const PlaylistTitle = styled(H1)`
  margin-bottom: ${cosmos.unit}px;
`;

const PlaylistName = styled(H1)`
  margin-left: ${cosmos.unit * 2.5}px;
  flex:1;
`;

const DurationContainer = styled.View`
  height: 19px;
  justify-content: center;
  align-items: center;
  padding-horizontal:${cosmos.unit}px;
  background-color: rgba(6, 13, 22, 0.75);
`;

const styles = StyleSheet.create({
  thumbnail: {
    width: 104, height: 58,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'black',
    paddingBottom: 6,
    paddingRight: 6,
  },
});