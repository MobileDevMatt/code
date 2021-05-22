import React, {
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  View,
  useWindowDimensions,
  Image,
  Platform,
} from 'react-native';
import DropdownAlert, { DropdownAlertProps } from 'react-native-dropdownalert';

import crossImg from 'assets/images/cross.png';
import logoImg from 'assets/images/logo.png';

import ToastProgressBar from './ToastProgressBar';
import toastConstants from './toastConstants';
import Sc from './StyledComps';
import {
  IToastRef,
  IToastState,
  IToastProps,
} from '../ToastTypes';

const isIOS = (Platform.OS === 'ios');
const tabBarHeight = isIOS ? 79 : 49; // may need to think something to get tabbat height from react-navigation

const Toast = forwardRef<IToastRef, IToastProps>(({
  onTapCallback: onTapCallbackProps,
}, ref) => {
  const { height } = useWindowDimensions();
  const alertRef = React.useRef<DropdownAlert>(null);

  useImperativeHandle(ref, () => ({
    show(text, message, options = {}) {
      alertRef.current?.alertWithType('info', text, message, options, toastConstants.CLOSE_INTERVAL);
    },
  }))

  const renderTitle = (state: IToastState) => {
    const { title, payload: { titleIcon } } = state;

    return (
      <View style={{ flexDirection: 'row'}}>
        {titleIcon && (
          <Image
            style={{ marginRight: 8 }}
            source={titleIcon}
          />
        )}
        <Sc.TitleText>{title}</Sc.TitleText>
      </View>
    );
  };

  const renderMessage = (state: IToastState) => {
    const { message, payload: { hasMessageIcon } } = state;

    return (
      <Sc.MessageBl>
        {hasMessageIcon && <Sc.MessageIcon
          source={logoImg}
        />}
        <Sc.Message
          numberOfLines={1}
        >
          {message}
        </Sc.Message>
      </Sc.MessageBl>
    );
  };

  const renderContainer = (_props: DropdownAlertProps, state: IToastState) => {
    const { payload: { onTapCallback }} = state;

    return (
      <Sc.Container>
        <Sc.SubContainer>
          <Sc.ContentBl
            onPress={() => {
              if (!onTapCallback) {
                return;
              }

              if (onTapCallbackProps) {
                onTapCallbackProps();
              }

              onTapCallback();
              alertRef.current?.closeAction();
            }}
          >
            {renderTitle(state)}
            {renderMessage(state)}
          </Sc.ContentBl>
          <Sc.CrossBl>
            <Image
              source={crossImg}
            />
          </Sc.CrossBl>
        </Sc.SubContainer>

        <ToastProgressBar interval={toastConstants.CLOSE_INTERVAL} />
      </Sc.Container>
    )
  };

  return (
    <DropdownAlert
      ref={alertRef}
      zIndex={1000000}
      useNativeDriver
      panResponderEnabled={false}
      updateStatusBar={false}
      renderImage={() => null}
      renderTitle={() => null}
      renderMessage={renderContainer}
      defaultContainer={{}}
      defaultTextContainer={{
        flex: 1,
      }}
      infoColor="transparent"
      warnColor="transparent"
      errorColor="transparent"
      successColor="transparent"
      startDelta={height}
      endDelta={height - (tabBarHeight + toastConstants.HEIGHT + toastConstants.MARGIN)}
    />
  );
});

export default Toast;
