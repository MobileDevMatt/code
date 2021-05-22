import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { palette } from 'shared/src/cosmos';

import VideoPlayer from 'components/video/VideoPlayer';
import { useRespondToPrompt } from 'hooks/useRespondToPrompt';
import { IPrompt } from 'shared/src/services/book-service';
import { ROUTE } from 'lib/constants';
import Loading from 'components/Loading';
import { useSelectVideo } from 'hooks/useSelectVideo';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { cacheKey } from 'hooks/cacheStateKey';
import { useQueryClient } from 'react-query';


interface VideoProps extends ImageInfo {
  codec?: string
}

const UploadVideo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [video, setVideo] = useState<VideoProps>();
  const { selectVideo } = useSelectVideo();
  const queryClient = useQueryClient();
  const { mutate: addVideoToPrompt, ...addVideoToPromptInfo } = useRespondToPrompt();

  const { prompt } = route.params as { prompt: IPrompt };


  useEffect(() => {
    pickVideo();
  }, []);

  const pickVideo = async () => {
    const video = await selectVideo();
    if (!video.cancelled) {
      setVideo(video);
    } else {
      navigation.goBack();
    }
  };

  const handleVideoSubmit = () => {

    const codec = video?.codec || 'mp4';
    const type = `video/${codec}`;
    const filename = video?.uri.split('/').pop();

    const data = { uri: video?.uri, name: filename, type };

    addVideoToPrompt({
      promptId: prompt._id,
      videoFile: data,
    }, {
      onSuccess: () => {
        navigation.navigate(ROUTE.DISCUSSION_PROMPTS);
        queryClient.invalidateQueries(cacheKey.myAuthor);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };


  const reUpload = async () => {
    pickVideo();
    // navigation.goBack();
  };

  const renderVideoPlayer = () => (
    <VideoPlayer
      videoSource={video?.uri || ''}
      handleDone={handleVideoSubmit}
      handleReRecord={reUpload}
      reRecordText={'Re-upload'}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {(addVideoToPromptInfo.isLoading) ? <Loading/> : null}
      <View style={styles.container}>
        {renderVideoPlayer()}
      </View>
    </SafeAreaView>
  );
};

export default UploadVideo;


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.grayscale.black,
  },
});
