import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-native-paper';

import AppNavigator from './navigation/AppNavigator';
import customTheme from 'theme/customTheme';
import styled from "styled-components/native";
import { palette } from "shared/src/cosmos";
import { ModalErrorPopUp } from 'components/ModalErrorPopUp';

async function loadResourcesAsync() {
  try {
    await Promise.all([
      Asset.loadAsync([
        require('./assets/images/splash.png'),
        require('./assets/images/icon.png'),
        require('./assets/images/logo-white.png'),
        require('./assets/images/aurora-background-type-one.png')]),
      Font.loadAsync({
        ...Ionicons.font,
        'granville': require('./assets/fonts/granville.otf'),
        'granvillebold': require('./assets/fonts/granvillebold.otf'),
        'larsseit': require('./assets/fonts/larsseit.otf'),
        'larsseitbold': require('./assets/fonts/larsseitbold.otf'),
        'ivarheadline': require('./assets/fonts/ivarheadline.otf'),
      }),
    ]);
  } catch (e) {
    console.log('Error: ', e);
  }
}

function handleLoadingError(error: any) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete: any) {
  setLoadingComplete(true);
}

interface IAppProps {
  skipLoadingScreen?: any;
}

const App = (props: IAppProps) => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const { skipLoadingScreen } = props;
  if (!isLoadingComplete && !skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  }
  return (
    <Provider theme={customTheme}>
      <Container>
        <AppNavigator/>
        <ModalErrorPopUp/>
      </Container>
    </Provider>
  );
};

export default App;

const Container = styled.View`
  flex: 1;
  background-color: ${palette.grayscale.black}
`;
