import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import {ModalSheet} from 'components/ModalSheet';
import { BookManagerMenu, BookManagerMenuCallbackType } from 'components/bookManager/BookManagerMenu';
import { UpdateChapterProgress, UpdateChapterProgressCallbackType } from 'components/bookManager/UpdateChapterProgress';
import { usePauseBook, useMarkBookComplete, useRemoveBook } from 'hooks/useManageBook';
import { ROUTE } from 'lib/constants';
import { useNavigation } from '@react-navigation/native';
import { IImage } from 'shared/src/services';
import { SHELF_TYPE } from 'shared/src/services/user-service';

interface IBookManagerInterface {
  isVisible: boolean,
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
  bookShelfType: SHELF_TYPE,
  bookId: string,
  coverImage?: IImage,
  bookProgress: number | undefined,
  bookChapterCount?: number,
  startWithUpdatingProgress?: boolean,
  setStartWithUpdatingProgress?: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function BookManager({
    isVisible,
    setIsVisible,
    bookShelfType,
    bookId,
    coverImage,
    bookProgress,
    bookChapterCount,
    startWithUpdatingProgress,
    setStartWithUpdatingProgress,
  } : IBookManagerInterface) {

    if (startWithUpdatingProgress !== undefined && setStartWithUpdatingProgress === undefined) {
      throw Error("Error: BookManager setStartWithUpdatingProgress have to be set when using startWithUpdatingProgress");
    }

    const navigation = useNavigation();

    const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
    const { mutate: pauseBook } = usePauseBook();
    const { mutate: markBookComplete } = useMarkBookComplete();
    const { mutate: removeBook } = useRemoveBook();

    // Helps to start the book manager on update progress page if startWithUpdatingProgress was set to true.
    useEffect(() => {
      if (startWithUpdatingProgress) {
        if (setStartWithUpdatingProgress) setStartWithUpdatingProgress(false);
        setIsUpdatingProgress(true);
      }
    }, [startWithUpdatingProgress]);

    const hideAndReset = () => {
      setIsVisible(false);
      setIsUpdatingProgress(false);
      if (setStartWithUpdatingProgress) setStartWithUpdatingProgress(false);
    }

    const bookManagerModalCallback = (callbackType: BookManagerMenuCallbackType | UpdateChapterProgressCallbackType) => {
      switch(callbackType) {
        case BookManagerMenuCallbackType.SHOW_UPDATE_PROGRESS:
          setIsUpdatingProgress(true);
        break;
        case BookManagerMenuCallbackType.MARK_PAUSED:
          hideAndReset();
          pauseBook({bookId: bookId});
        break;
        case BookManagerMenuCallbackType.MARK_COMPLETE:
          hideAndReset();
          markBookComplete({bookId: bookId});
        break;
        case BookManagerMenuCallbackType.MARK_CURRENTLY_READING:
          setIsUpdatingProgress(true);
        break;
        case BookManagerMenuCallbackType.DELETE_BOOK:
          hideAndReset();
          removeBook({bookId: bookId});
        break;
        case UpdateChapterProgressCallbackType.DISMISS:
          hideAndReset();
        break;
        case BookManagerMenuCallbackType.VIEW_BOOK_PAGE:
          hideAndReset();
          navigation.navigate(ROUTE.BOOK, { bookId: bookId})
        break;
      }
    }

    return (
      <ModalSheet
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        onClose={hideAndReset}
        content={
          <View style={{alignSelf: 'stretch'}}>
            { !isUpdatingProgress && <BookManagerMenu coverImage={coverImage} bookShelfType={bookShelfType} callback={bookManagerModalCallback}/>}
            { isUpdatingProgress && <UpdateChapterProgress bookProgress={bookProgress} numberOfChapters={bookChapterCount!} callback={bookManagerModalCallback} bookId={bookId}/>}
          </View>
        }
      />
    );
}
