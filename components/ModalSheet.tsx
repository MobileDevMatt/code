import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Animated, PanResponder } from 'react-native';
import styled from 'styled-components/native';
import palette from 'shared/src/cosmos/palette';
import { ToastService } from 'components/Toast';


interface IModalSheetOptions {
  transparent?: boolean,
  animationType?: 'fade' | 'none' | 'slide',
  useNativeDriver?: boolean;
}

const ModalSheet = ({isVisible, setIsVisible, options, content, onOpen, onClose}: {isVisible: boolean, setIsVisible: React.Dispatch<React.SetStateAction<boolean>>, options?: IModalSheetOptions, content: JSX.Element, onOpen?: () => void, onClose?: () => void}) => {
  const [layoutHeight, setLayoutHeight] = useState(500); // TODO: Hovo: Possibly use screen height at the start
  const yTranslation = useState(new Animated.Value(layoutHeight))[0];

  const closeModal = (animated: boolean) => {
    if (animated) {
      Animated.timing(
        yTranslation,
        {
          toValue: layoutHeight,
          duration: 200, // TODO: Hovo: Possibly use options for this
          useNativeDriver: options?.useNativeDriver ?? true,
        }
      ).start(() => closeModal(false));
    } else {
      setIsVisible(false);
      if (onClose) { onClose(); }
    }
  }

  useEffect(() => {
    if(isVisible) {
      Animated.spring(yTranslation, {
        useNativeDriver: options?.useNativeDriver ?? true,
        toValue: 0,
      }).start(() => { if (onOpen) { onOpen(); } });
    }
  }, [isVisible])

  const panResponder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (_, gestureState) => { yTranslation.setValue(Math.max(0, gestureState.dy)); },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > layoutHeight * 0.3) {
          closeModal(true);
        } else {
          Animated.spring(yTranslation, {
            useNativeDriver: options?.useNativeDriver ?? true,
            toValue: 0,
          }).start();
        }
      }
    }),
    [layoutHeight]
  );

  return (
    <Modal
      transparent={(options?.transparent ?? true)}
      visible={isVisible}
      animationType={options?.animationType ?? 'none'}
    >
      <ToastService
        isModal
        onModalClose={() => {
          closeModal(true);
        }}
      />

      <Container>
        <DismissButton onPress={() => closeModal(true)} />

        <ContentContainer
          style={{ transform: [{translateY: yTranslation}]}}
          onLayout={(event: { nativeEvent: { layout: any; }; }) => setLayoutHeight(event.nativeEvent.layout.height)}
        >
          <TopNotchContainer {...panResponder.panHandlers}>
            <TopNotch />
          </TopNotchContainer>

          {content}

        </ContentContainer>
      </Container>
    </Modal>
  );
};

export {ModalSheet, IModalSheetOptions};

const Container = styled.View`
  background-color: ${palette.grayscale.transparentBlack};
  flex: 1;
  align-items: stretch;
  justify-content: flex-end;
`;

const DismissButton = styled.TouchableOpacity`
  align-items: center;
  flex: 1;
  background-color: transparent;
`;

const ContentContainer = styled(Animated.View)`
  align-items: center;
  width: 100%;
  background-color: ${palette.grayscale.white};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

// Note: Not having this background color here might introduce issues on some Android devices
// since some devices will ignore pan if the view background is fully transparent
const TopNotchContainer = styled.View`
  align-items: center;
  justify-content: center;
  align-self: stretch;
  background-color: #FFFFFF01;
`;

const TopNotch = styled.View`
  width: 47px;
  height: 4px;
  border-radius: 100px;
  background-color: ${palette.grayscale.stone};
  margin-top: 18px;
  margin-bottom: 12px;
`;