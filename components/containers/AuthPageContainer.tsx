import React from 'react';
import { palette } from 'shared/src/cosmos';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dimensions, Platform } from 'react-native';

const AuthPageContainer: React.FunctionComponent = ({ children }) => {

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{
        height: '90%',
        flex: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: palette.grayscale.white,
        minHeight: Platform.OS !== "ios"? Dimensions.get('window').height:'auto'
      }}
      scrollEnabled={true}
      keyboardShouldPersistTaps={'handled'}
      alwaysBounceVertical={false}
      bounces={false}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

export default AuthPageContainer;
