import React, { ReactElement, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { getBookProgress, getShelfTypeForBook } from "shared/src/utils";
import { IAPI_User_Full, SHELF_TYPE } from 'shared/src/services/user-service';
import { IImage } from 'shared/src/services';
import BookManager from 'components/bookManager/BookManager';
import { CustomizableButton } from 'theme/Button';
import { palette } from 'shared/src/cosmos';

interface IBookManagerButtonInterface {
  userDataFull: IAPI_User_Full | undefined,
  bookId: string | undefined,
  bookCoverImage?: IImage,
  bookChapterCount?: number | undefined,
  style?: StyleProp<ViewStyle>,
}

export const BookManagerButton = ({userDataFull, bookId, bookCoverImage, bookChapterCount, style} : IBookManagerButtonInterface) : ReactElement => {
  const [manageBookModalIsVisible, setManageBookModalIsVisible] = useState(false);
  const [startWithUpdatingProgress, setStartWithUpdatingProgress] = useState(false);

  const shelfType = getShelfTypeForBook(userDataFull, bookId);

  const onMainButtonPressed = () => {
    setStartWithUpdatingProgress(true);
    setManageBookModalIsVisible(true);
  }

  return (
    <View style={[style, {flexDirection: 'row'}]}>
      { userDataFull && bookId &&
        <BookManager
          isVisible={manageBookModalIsVisible}
          setIsVisible={setManageBookModalIsVisible}
          bookShelfType={shelfType}
          bookId={bookId}
          coverImage={bookCoverImage}
          bookProgress={getBookProgress(userDataFull, bookId)}
          bookChapterCount={bookChapterCount}
          startWithUpdatingProgress={startWithUpdatingProgress}
          setStartWithUpdatingProgress={setStartWithUpdatingProgress}
        />
      }

      <CustomizableButton
        title={ shelfType === SHELF_TYPE.CURRENTLY_READING ? 'Update progress' : 'Mark as reading'}
        onPress={onMainButtonPressed}
        style={{borderTopEndRadius: 0, borderBottomEndRadius: 0}}
      />
      <CustomizableButton
        title={''}
        onPress={() => {setManageBookModalIsVisible(true)}}
        style={{borderTopStartRadius: 0, borderBottomStartRadius: 0, marginStart: 1, width: 41, paddingHorizontal: 0}}
        iconStyle={{marginRight: 0}}
        icon={
          <Feather
            name={'chevron-down'}
            size={20}
            color={palette.grayscale.white}
          />
        }
      />
    </View>
  );
}
