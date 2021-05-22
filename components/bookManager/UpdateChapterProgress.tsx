import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import palette from 'shared/src/cosmos/palette';

import Slider from "react-native-slider-custom";
import { LinearGradient } from 'expo-linear-gradient';

import { useUpdateBookProgress } from 'hooks/useManageBook';

import {Button} from 'theme/Button';
import { useQueryClient } from 'react-query';
import { cacheKey } from 'hooks/cacheStateKey';
import cosmos from 'shared/src/cosmos';

export enum UpdateChapterProgressCallbackType {
  DISMISS = 'DISMISS',
};

const UpdateChapterProgress = ({bookProgress, numberOfChapters, bookId, callback} : {bookProgress: number | undefined, numberOfChapters: number, bookId: string, callback: (arg0: UpdateChapterProgressCallbackType) => void}) => {
  const { mutate: updateBookProgress, ...updateBookProgressInfo } = useUpdateBookProgress();
  const [chapter, setChapter] = useState(bookProgress ?? 0);
  const queryClient = useQueryClient();

  const makeBookProgressRequest = (chapter: number) => {
    updateBookProgress({bookId, chapter: chapter},
    {
      onSuccess: () => {
        // TODO: Hovo: We can use optimistic update here
        queryClient.invalidateQueries(cacheKey.myUser);
        callback(UpdateChapterProgressCallbackType.DISMISS);
      },
      onError: (error) => {
        // TODO: Hovo: Handle the error
        console.error("Update progress error", error);
      },
    })
  }

  return (
    <View style={{alignItems: 'center', width: '100%'}}>
      <UpdateBookProgressTitle>Update your progress</UpdateBookProgressTitle>
      <SliderContainer>
        <UpdateBookProgressSliderTopText>I've read through chapter...</UpdateBookProgressSliderTopText>
        <Slider
          minimumValue={0}
          value={chapter}
          step={1}
          maximumValue={numberOfChapters}
          style= {{marginHorizontal: 8, alignSelf: 'stretch', marginTop: 12}}
          thumbTintColor={palette.grayscale.white}
          thumbStyle={{width: 24, height: 24, borderRadius: 360, elevation: 3, shadowOffset: {width:0, height: 1}, shadowColor: palette.grayscale.black, shadowRadius: 2, shadowOpacity: 0.2}}
          onValueChange={(newValue: number) => {setChapter(() => newValue)}}
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
          maximumTrackTintColor={palette.grayscale.stone}
          trackStyle={{height: 13, borderRadius: 4}}
        />
        <UpdateBookProgressSliderBottomText>{chapter} of {numberOfChapters} ({Math.floor(100 * chapter / numberOfChapters)}% complete)</UpdateBookProgressSliderBottomText>
      </SliderContainer>
      <Button title={(chapter < numberOfChapters) ? "Save progress" : "Mark complete"} loading={updateBookProgressInfo.isLoading} disabled={updateBookProgressInfo.isLoading}  onPress={() => {makeBookProgressRequest(chapter)}} style={{marginTop: 18, width: 165, height: 42, marginBottom: 50}}/>
    </View>
  );
}

export { UpdateChapterProgress };

const UpdateBookProgressTitle = styled.Text`
  font-family: ivarheadline;
  font-size: 24px;
  line-height: 30px;
  font-weight: 600;
  margin-top: 22px;
  color: ${palette.grayscale.black};
`;

const UpdateBookProgressSliderTopText = styled.Text`
  font-family: larsseitbold;
  font-size: 14px;
  line-height: 20px;
  color: ${palette.grayscale.black};
  margin-top: 20px;
`;

const UpdateBookProgressSliderBottomText = styled.Text`
  font-family: larsseitbold;
  font-size: 14px;
  line-height: 20px;
  color: ${palette.grayscale.black};
  margin: 12px 0px 20px 0px;
`;

const SliderContainer = styled.View`
  margin: ${cosmos.unit * 2}px ${cosmos.unit * 2}px 0px ${cosmos.unit * 2}px;
  background-color: ${palette.primary.linen};
  align-self: stretch;
  align-items: center;
  justify-content: center;
`;
