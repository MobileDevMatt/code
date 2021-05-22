import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { formatTime } from '../../lib/utils';
import { Camera } from 'expo-camera';
import { palette } from 'shared/src/cosmos';
import styled from 'styled-components/native';


import { Paragraph } from 'theme/Typography';
import VideoPlayer from 'components/video/VideoPlayer';
import { useRespondToPrompt } from 'hooks/useRespondToPrompt';
import { useGetDiscussionGuidePrompt } from 'hooks/useDiscussionGuide';
import { IPrompt } from 'shared/src/services/book-service';
import { ROUTE } from '../../lib/constants';
import Loading from '../../components/Loading';
import { BCContainer } from 'components/containers/BCContainer';

const WINDOW_HEIGHT = Dimensions.get('window').height;

const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

const RecordVideo = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [isVideoRecording, setIsVideoRecording] = useState<boolean>(false);
  const [videoSource, setVideoSource] = useState<any>(null);
  const [codec, setCodec] = useState<any>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const { mutate: addVideoToPrompt, ...addVideoToPromptInfo } = useRespondToPrompt();

  const countRef = useRef(null);
  const route = useRoute();

  const cameraRef = useRef();
  const { editMode = false, prompt } = route.params as { editMode?: boolean, prompt: IPrompt };
  const { data: discussionGuidePrompt, isLoading: isFetchingGuidePrompt } = useGetDiscussionGuidePrompt({ promptId: prompt._id });


  useEffect(() => {
    if (discussionGuidePrompt?.response?.video?.contentUrl && editMode) {
      setVideoSource(discussionGuidePrompt?.response?.video?.contentUrl);
    }
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, [discussionGuidePrompt]);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const handleVideoSubmit = () => {
    if (!codec) {
      navigation.navigate(ROUTE.DISCUSSION_PROMPTS);
      return;
    }
    const fileType = codec || 'mp4';
    const type = `video/${fileType}`;
    const filename = videoSource.split('/').pop();

    const data = { uri: videoSource, name: filename, type };

    addVideoToPrompt({
      promptId: prompt._id,
      videoFile: data,
    }, {
      onSuccess: () => {
        navigation.navigate(ROUTE.DISCUSSION_PROMPTS);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  const handleTimerStart = () => {
    setIsActive(true);
    setIsPaused(true);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  const handleTimerPause = () => {
    clearInterval(countRef.current);
    setIsPaused(false);
  };

  const handleTimerReset = () => {
    clearInterval(countRef.current);
    setIsActive(false);
    setIsPaused(false);
    setTimer(0);
  };

  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        handleTimerReset();
        handleTimerStart();
        const videoRecordPromise = cameraRef.current.recordAsync();
        if (videoRecordPromise) {
          setIsVideoRecording(true);
          const data = await videoRecordPromise;
          const source = data.uri;
          const codec = data.codec || 'mp4';
          if (source) {
            setIsPreview(true);
            setVideoSource(source);
            setCodec(codec);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const stopVideoRecording = () => {
    if (cameraRef.current) {
      setIsPreview(false);
      handleTimerPause();
      setIsVideoRecording(false);
      cameraRef.current.stopRecording();
    }
  };

  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
    setVideoSource(null);
    handleTimerReset();
  };

  const renderVideoPlayer = () => (
    <VideoPlayer
      videoSource={videoSource}
      handleDone={handleVideoSubmit}
      handleReRecord={cancelPreview}
      reRecordText={'Re-record'}
    />
  );


  const renderCaptureControl = () => (
    <BCContainer style={{flex: 1}} showBackButton={true} hideProfileImage={true} backButtonAction={stopVideoRecording}>
      <ControlArea>
        {isVideoRecording ? (
          <>
            <CapturePause
              activeOpacity={0.7}
              onPress={stopVideoRecording}
            >
              <StopIcon/>
            </CapturePause>
            <RecordTextContainer><Paragraph>STOP</Paragraph></RecordTextContainer>
          </>
        ) : (
          <>
            <Capture
              disabled={!isCameraReady}
              onPressOut={stopVideoRecording}
              onPress={recordVideo}
            />
            <RecordTextContainer><Paragraph>RECORD</Paragraph></RecordTextContainer>
          </>

        )}
        <Timer>
          <Paragraph>{formatTime(timer)}</Paragraph>
        </Timer>
      </ControlArea>
    </BCContainer>
  );

  if (hasPermission === null) {
    return <View/>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {(addVideoToPromptInfo.isLoading || isFetchingGuidePrompt) ? <Loading/> : (
        <>
          <Camera
            ref={cameraRef}
            style={styles.container}
            type={cameraType}
            flashMode={Camera.Constants.FlashMode.off}
            onCameraReady={onCameraReady}
            onMountError={(error) => {
              console.log('cammera error', error);
            }}
          />
          <View style={styles.container}>
            {videoSource && renderVideoPlayer()}
            {!videoSource && !isPreview && renderCaptureControl()}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default RecordVideo;

const Timer = styled.View`
  margin-top: 12px;
  padding-horizontal:5px;
  background: rgba(6, 13, 22, 0.75);
`;

const ControlArea = styled.View`
  position: absolute;
  bottom: 38px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const RecordTextContainer = styled.View`
  margin-top: 12px;
`;

const StopIcon = styled.View`
  width: 26px;
  height: 26px;
  border-radius: 2px;
  background-color: ${palette.grayscale.white};
`;

const Capture = styled.TouchableOpacity`
  border-radius: 50px;
  background-color: ${palette.auxillary.crimson.alt};
  border-color: ${palette.grayscale.white};
  border-width: 3px;
  height: ${captureSize}px;
  width: ${captureSize}px;
  margin-horizontal: 31px;
`;

const CapturePause = styled.TouchableOpacity`
  border-radius: 50px;
  border-color: ${palette.grayscale.white};
  border-width: 3px;
  height: ${captureSize}px;
  width: ${captureSize}px;
  margin-horizontal: 31px;
  justify-content: center;
  align-items: center;
`;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
