import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { Video } from 'expo-av';
import cosmos,{ palette } from 'shared/src/cosmos';


interface IProps {
  videoSource: string;
}

const InlineVideoPlayer = ({ videoSource }: IProps) => {
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const videoRef = useRef<Video>();

  useEffect(()=>{
    videoRef?.current?.setPositionAsync(0)
  },[videoSource]);

  return (
    <Container>
      <Video
        ref={videoRef}
        style={{flex:1, width:'100%'}}
        source={{ uri: videoSource }}
        rate={1.0}
        volume={1.0}
        shouldPlay={true}
        resizeMode={Video.RESIZE_MODE_CONTAIN}
        useNativeControls
        // isLooping
        onLoadStart={() => setIsVideoLoading(true)}
        onLoad={() => setIsVideoLoading(false)}
      />
      {isVideoLoading ? <VideoLoader size="large" color={palette.grayscale.white}/> : null}
    </Container>

  );
};

export { InlineVideoPlayer };

const Container = styled.View`
  width: 100%;
  height: ${cosmos.unit * 40}px;
  background-color: ${palette.grayscale.black};
`;

const VideoLoader = styled(ActivityIndicator)`
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
`;

