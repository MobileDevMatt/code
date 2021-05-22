import styled from 'styled-components/native';

import {
  palette,
} from 'shared/src/cosmos';
import {
  Body,
  baseH1Styles,
} from 'theme/Typography';

import toastConstants from './toastConstants';

export default {
  Container: styled.View`
    flex: 1;
    background-color: ${palette.grayscale.cloud};
    box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    elevation: 4;
    height: ${toastConstants.HEIGHT}px;
    margin-horizontal: ${toastConstants.MARGIN}px;
  `,
  SubContainer: styled.View`
    flex: 1;
    flex-direction: row;
  `,
  ContentBl: styled.TouchableOpacity`
    flex: 1;
    padding-vertical: 14px;
    padding-left: 16px;
  `,
  TitleText: styled(Body)`
    color: ${palette.grayscale.granite};
  `,
  MessageBl: styled.View`
    flex-direction: row;
    alignItems: center;
  `,
  MessageIcon: styled.Image`
    width: 15px;
    height: 15px;
    margin-right: 5px;
  `,
  Message: styled.Text`
    ${baseH1Styles}
    font-size: 15px;
    color: ${palette.primary.navy}
  `,
  CrossBl: styled.View`
    justify-content: center;
    padding-horizontal: 16px;
  `,
};
