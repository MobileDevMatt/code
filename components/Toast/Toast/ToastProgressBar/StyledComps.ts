import {
  Animated,
} from 'react-native';
import styled from 'styled-components/native';

import {
  palette,
} from 'shared/src/cosmos';

export default {
  Container: styled.View`
    background-color: ${palette.grayscale.granite};
    overflow: hidden;
    height: 4px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  `,
  Progress: styled(Animated.View)`
    flex: 1;
    background-color: ${palette.grayscale.stone};
  `,
}
