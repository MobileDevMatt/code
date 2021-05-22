import cosmos from 'shared/src/cosmos';

import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: cosmos.palette.primary.bcBlue,
    accent: cosmos.palette.primary.sage,
  },
};

export type ThemeType = typeof theme;

export default theme;
