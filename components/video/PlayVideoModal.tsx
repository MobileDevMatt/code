import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { palette } from 'shared/src/cosmos';

import VideoPlayer from 'components/video/VideoPlayer';

import { Modal, Portal } from 'react-native-paper';

interface IProps {
  isVideoVisible: boolean
  hideVideo: () => void
  videoUrl: string
}

const PlayVideoModal = ({ isVideoVisible, hideVideo, videoUrl }: IProps) => {

  const renderVideoPlayer = () => (
    <VideoPlayer
      videoSource={videoUrl || ''}
      handleDone={hideVideo}
    />
  );

  return (
    <Portal>
      <Modal visible={isVideoVisible} onDismiss={hideVideo}>
        <SafeAreaView style={styles.container}>
          {renderVideoPlayer()}
        </SafeAreaView>
      </Modal>
    </Portal>
  );
};

export default PlayVideoModal;

const styles = StyleSheet.create({
  container: {
    height:500,
    backgroundColor: palette.grayscale.black,
  },
});
