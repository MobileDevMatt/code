import { AppBar } from 'components/AppBar';
import StatusBarComponent from 'components/StatusBar';
import React, { FunctionComponent } from 'react';

import { StyleProp, View, ViewStyle } from 'react-native';
import { IImage } from 'shared/src/services';

interface Props {
  pageTitle?: string;
  pageWelcomeText?: string;
  userImage?: IImage;
  userFullName?: string;
  style?: StyleProp<ViewStyle>;
  appBarStyle?: StyleProp<ViewStyle>;
  showBackButton?: boolean;
  backButtonText?: string;
  hideProfileImage?: boolean;
  backButtonAction?: () => void;
  disableDefaultBackButtonAction?: boolean;
}

export const BCContainer: FunctionComponent<Props> = ({ pageTitle, pageWelcomeText, children, userImage, userFullName, style, showBackButton, backButtonText, appBarStyle, hideProfileImage, backButtonAction, disableDefaultBackButtonAction }) => {
  return (
    <View style={style}>
      <StatusBarComponent/>
      <AppBar
        welcomeText={pageWelcomeText}
        title={pageTitle}
        image={userImage}
        name={userFullName}
        backButtonText={backButtonText}
        showBackButton={showBackButton}
        style={appBarStyle} 
        hideProfileImage={hideProfileImage}
        backButtonAction={backButtonAction}
        disableDefaultBackButtonAction={disableDefaultBackButtonAction}
      />
      {children}
    </View>
  );
};
