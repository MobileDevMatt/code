import React from 'react';
import { View, StyleProp, ViewStyle } from "react-native";

import { IUserShelf, SHELF_TYPE } from 'shared/src/services/user-service';
import { BookShelfBody } from './BookShelfBody';

interface IBookShelfProps {
  shelf: IUserShelf;
  customName?: JSX.Element;
  bookShelfType: SHELF_TYPE;
  customStyle?: StyleProp<ViewStyle>;
  bookStyle?: StyleProp<ViewStyle>;
  isPublicViewer?: boolean;
  showAddBooksButton?: boolean;
  showEmptyShelf?: boolean;
}

export const BookShelf = (
  {
    shelf,
    customName,
    bookShelfType,
    customStyle,
    bookStyle,
    isPublicViewer,
    showAddBooksButton,
    showEmptyShelf,
  } : IBookShelfProps) => {
    if (shelf.books.length === 0 && !showEmptyShelf) {
      return null;
    }
    
    return (
      <View style={customStyle}>
        <BookShelfBody
          shelf={shelf}
          customName={customName}
          bookShelfType={bookShelfType}
          isPublicViewer={isPublicViewer}
          bookStyle={bookStyle}
          showAddBooksButton={showAddBooksButton ?? false}
        />
      </View>
    );
}
