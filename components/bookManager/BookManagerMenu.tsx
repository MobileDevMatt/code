import React from 'react';
import { View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import palette from 'shared/src/cosmos/palette';
import { SHELF_TYPE } from 'shared/src/services/user-service';
import cosmos from 'shared/src/cosmos';
import { IImage } from 'shared/src/services';
import { getMediumestImage } from 'shared/src/utils';

const defaultBookImage = require('../../assets/images/icon.png');

export enum BookManagerMenuCallbackType {
  SHOW_UPDATE_PROGRESS = 'SHOW_UPDATE_PROGRESS',
  MARK_CURRENTLY_READING = 'MARK_CURRENTLY_READING',
  MARK_COMPLETE = 'MARK_COMPLETE',
  MARK_PAUSED = 'MARK_PAUSED',
  DELETE_BOOK = 'DELETE_BOOK',
  VIEW_BOOK_PAGE = 'VIEW_BOOK_PAGE',
};

const TransparentBtn = ({title, onButtonPress, textStyle, style} : {title: string, onButtonPress: () => void, textStyle?: StyleProp<TextStyle>, style?: StyleProp<ViewStyle>}) => {
  return (
    <TransparentButton onPress={() => {onButtonPress()}} style={style}>
      <ButtonText style={textStyle}>{title}</ButtonText>
    </TransparentButton>
  );
}

const BookManagerMenu = ({coverImage, bookShelfType, callback} : {coverImage?: IImage, bookShelfType: string, callback: (arg0: BookManagerMenuCallbackType) => void}) => {
  const makeCallback = (callbackType: BookManagerMenuCallbackType) => {
    callback(callbackType);
  }

  return (
    <View style={{alignItems: 'center'}}>
      <BookCoverImage source={ getMediumestImage(coverImage) ? {uri: getMediumestImage(coverImage)} : defaultBookImage}/>

      <ViewBookButton onPress={() => makeCallback(BookManagerMenuCallbackType.VIEW_BOOK_PAGE)}>
        <ViewBookText>View</ViewBookText>
      </ViewBookButton>

      {bookShelfType === SHELF_TYPE.CURRENTLY_READING && 
        <TransparentBtn title={"Update progress"} onButtonPress={() => makeCallback(BookManagerMenuCallbackType.SHOW_UPDATE_PROGRESS)}/>
      }

      {(bookShelfType === SHELF_TYPE.TO_READ
        || bookShelfType === SHELF_TYPE.PAUSED || bookShelfType === SHELF_TYPE.NONE) &&
        <TransparentBtn title={"Mark currently reading"} onButtonPress={() => makeCallback(BookManagerMenuCallbackType.MARK_CURRENTLY_READING)}/>
      }

      { (bookShelfType !== SHELF_TYPE.COMPLETED && bookShelfType !== SHELF_TYPE.NONE) && 
        <TransparentBtn title={"Mark complete"} onButtonPress={() => makeCallback(BookManagerMenuCallbackType.MARK_COMPLETE)}/>
      }

      {bookShelfType === SHELF_TYPE.CURRENTLY_READING && 
        <TransparentBtn title={"Pause reading"} onButtonPress={() => makeCallback(BookManagerMenuCallbackType.MARK_PAUSED)}/>
      }

      { bookShelfType !== SHELF_TYPE.NONE &&
        <TransparentBtn title={"Remove"} textStyle={{color: palette.auxillary.crimson.alt}} onButtonPress={() => makeCallback(BookManagerMenuCallbackType.DELETE_BOOK)} />
      }
    </View>
  );
}

export { BookManagerMenu };

const BookCoverImage = styled.Image`
  width: 79px;
  height: 120px;
`;

const ViewBookText = styled.Text`
  font-family: larsseitbold;
  font-size: 16px;
  line-height: 16px;
  color: ${palette.primary.navy};
`;

const ViewBookButton = styled.TouchableOpacity`
  width: 101px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${palette.grayscale.granite};
  border-radius: 2px;
  margin-top: ${cosmos.unit * 2}px;
  margin-bottom: 20px;
`;

const TransparentButton = styled.TouchableOpacity`
  height: 35px;
  width: 200px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const ButtonText = styled.Text`
  font-family: larsseit;
  font-size: 18px;
  line-height: 25px;
  color: ${palette.grayscale.black};
`;