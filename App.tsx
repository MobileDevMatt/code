import React from 'react';
import Main from './Main';
import { AppProviders } from './context';
import { StatusBar } from 'react-native';
import { palette } from '../shared/src/cosmos';
import { LogBox } from 'react-native';

import { ToastService } from 'components/Toast';

const App = () =>  {
  // Android shows a lot of warnings about timers when using react-native, this ignores all those warnings so we can actually use the console logs when working with Android.
  LogBox.ignoreLogs(['Setting a timer']);

  return (
    <AppProviders>
      <StatusBar backgroundColor={palette.grayscale.black} />
      <Main />
      <ToastService />
    </AppProviders>
  );
}

export default App;
