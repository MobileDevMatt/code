import React, { useState } from 'react';
import {
  View,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';

import { palette } from 'shared/src/cosmos';
import {
  TextButton,
} from 'theme/Button';

interface IProps {
  text?: string,
  TextWrapper: React.ElementType,
}

export const MAX_LINES = 12;

export const ReadMore: React.FC<IProps> = ({ text, TextWrapper }) => {
  const [showMore, setShowMore] = useState(false);
  const [textShown, setTextShown] = useState(false);

  if (!text) {
    return null;
  }

  return (
    <View>
      <TextWrapper
        numberOfLines={textShown ? undefined : MAX_LINES}
        onTextLayout={(e: NativeSyntheticEvent<TextLayoutEventData>) => {
          const { length } = e.nativeEvent.lines;

          if (length >= MAX_LINES) {
            setShowMore(true);
          }
        }}
      >
        {text}
      </TextWrapper>

      {showMore && (
        <TextButton
          title={textShown ? 'Read less' : 'Read more'}
          textColor={palette.grayscale.granite}
          onPress={() => {
            setTextShown(!textShown);
          }}
        />
      )}
    </View>
  );
};
