import React, { useRef, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { H1 } from 'theme/Typography';
import Slider from 'react-native-slider-custom';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';
import { Image, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatTime } from 'lib/utils';
import { palette } from 'shared/src/cosmos/index';

interface IProps {
  videoSource: string;
  reRecordText?: string;
  handleReRecord?: () => void;
  handleDone: () => void;
}

const VideoPlayer = ({ videoSource, handleReRecord, handleDone, reRecordText }: IProps) => {
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const videoRef = useRef();

  const play = async () => {
    const playbackStatus = await videoRef.current.getStatusAsync();

    if (playbackStatus.isPlaying) {
      setShouldPlay(false);
      videoRef.current.setStatusAsync({ shouldPlay: false });
    }
    else {
      setShouldPlay(true);
      videoRef.current.setStatusAsync({ shouldPlay: true });
    }
  };

  const statusBar = async (event) => {
    let percentage = (event.positionMillis / event.durationMillis * 1000) || 0;
    let time = (event.positionMillis / 1000) || 0;
    let full = event.durationMillis / 1000;

    setTime(Math.round(time));
    setTotalTime(full);
    setPercentage(percentage);
    if (event.didJustFinish) {
      setShouldPlay(false);
      videoRef.current.stopAsync();
    }
  };
  return (
    <Container>
      <Video
        ref={videoRef}
        source={{ uri: videoSource }}
        rate={1.0}
        volume={1.0}
        shouldPlay={true}
        onPlaybackStatusUpdate={(e) => statusBar(e)}
        resizeMode={Video.RESIZE_MODE_CONTAIN}
        style={styles.media}
        isLooping={false}
        onLoadStart={() => setIsVideoLoading(true)}
        onLoad={() => setIsVideoLoading(false)}
      />
      <PreviewContainer>
        {handleReRecord ? <TopActionButton onPress={handleReRecord}>
          <Feather name="rotate-ccw" size={24} color={palette.grayscale.white}/>
          <H1>{reRecordText}</H1>
        </TopActionButton> : null}


        <TopActionButton onPress={() => {
          videoRef.current.stopAsync();
          handleDone();
        }}>
          <Feather name="check" size={24} color={palette.grayscale.white}/>
          <H1>Done</H1>
        </TopActionButton>
      </PreviewContainer>
      {isVideoLoading ? <VideoLoader size="large" color={palette.grayscale.white}/> : null}
      <BottomControls>
        <TouchableOpacity>
          {shouldPlay ? <MaterialCommunityIcons name={`pause`} size={20} color="white" onPress={() => play()}/> : null}
          {!shouldPlay ?
            <MaterialCommunityIcons name={`play-outline`} size={20} color="white" onPress={() => play()}/> : null}
        </TouchableOpacity>
        <Slider
          minimumValue={0}
          value={percentage}
          maximumValue={1000}
          onSlidingComplete={val => {
            setShouldPlay(false);
            videoRef.current.setPositionAsync(val * totalTime);
          }}
          step={0}
          style={{ height: 8, flex: 1, marginHorizontal: 10, borderRadius: 4 }}
          customMinimumTrack={(
            <LinearGradient
              start={[0, 1]} end={[1, 0]}
              colors={['#DE7DAF', '#28C1EA', '#EBDB04']}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 4,
              }}
            />
          )}
          minimumTrackTintColor={'transparent'}
          maximumTrackTintColor={'rgba(249, 249, 247, 0.3)'}
          customThumb={(
            <Image
              style={{ width: 14, height: 14 }}
              source={require('../../assets/images/slider-thumb.png')}
            />
          )}
        />
        <H1>{formatTime(time)}</H1>
      </BottomControls>
    </Container>

  );
};

export default VideoPlayer;

const Container = styled.View`
  align-self: center;
  justify-content: flex-end;
  flex:1;
  position: absolute;
  top:0px;
  bottom: 0;
  width: 100%;
`;

const VideoLoader = styled(ActivityIndicator)`
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
`;

const BottomControls = styled.View`
  width: 100%;
  padding-horizontal:20px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding-vertical: 40px;
  background-color: rgba(0,0,0,0.15);
`;

const PreviewContainer = styled.View`
  width: 100%;
  position: absolute;
  top:0;
  padding-vertical:18px;
  padding-horizontal:25px;
  flex-direction: row;
  justify-content: space-between;
  background-color: rgba(0,0,0,0.15);
`;

const TopActionButton = styled.TouchableOpacity`
  align-items: center;
`;

const styles = StyleSheet.create({
  media: {
    ...StyleSheet.absoluteFillObject,
  },
});
