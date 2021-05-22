import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { View, StyleProp, ViewStyle, Text, TouchableOpacity, Modal, Dimensions, Button } from "react-native";
import cosmos, { palette } from 'shared/src/cosmos';
import { CustomizableButton, TransparentButton } from 'theme/Button';

interface IErrorPopUpData {
  setTitle?: React.Dispatch<React.SetStateAction<string>>,
  setMessage?: React.Dispatch<React.SetStateAction<string | undefined>>,
  setIsVisible?: React.Dispatch<React.SetStateAction<boolean>>,
  setTopImage?: React.Dispatch<React.SetStateAction<any>>,
  setMiddleImage?: React.Dispatch<React.SetStateAction<any>>,

  setButtonText?: React.Dispatch<React.SetStateAction<string | undefined>>,
  setButtonAction?: React.Dispatch<React.SetStateAction<(() => void) | undefined>>,

  setSecondaryButtonText?: React.Dispatch<React.SetStateAction<string | undefined>>,
  setSecondaryButtonAction?: React.Dispatch<React.SetStateAction<(() => void) | undefined>>,
}

const errorPopUpData: IErrorPopUpData = {};

export const showErrorPopUp = ({title, message, topImage, middleImage, buttonText, buttonAction, secondaryButtonText, secordaryButtonAction}
  :{title: string, message?: string, topImage?: any, middleImage?: any, buttonText?: string, buttonAction?: any, secondaryButtonText?: string, secordaryButtonAction?: any}) => {

    if (secondaryButtonText && !secordaryButtonAction || (secordaryButtonAction && !secondaryButtonText)) {
      throw "Error: buttonTwoText and buttonTwoAction has to be both undefined or both set. Can`t set one without the other!";
    }
  
    errorPopUpData.setTitle!(title);
    errorPopUpData.setMessage!(message);
    errorPopUpData.setTopImage!(topImage);
    errorPopUpData.setMiddleImage!(middleImage);
    errorPopUpData.setIsVisible!(true);
    errorPopUpData.setButtonText!(buttonText);
    errorPopUpData.setButtonAction!(() => buttonAction);
    errorPopUpData.setSecondaryButtonText!(secondaryButtonText);
    errorPopUpData.setSecondaryButtonAction!(() => secordaryButtonAction);
};
export const hideErrorPopUp = () => {
  errorPopUpData.setIsVisible!(false);
};

export const ModalErrorPopUp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState<string | undefined>('');
  const [topImage, setTopImage] = useState();
  const [middleImage, setMiddleImage] = useState();
  const [buttonText, setButtonText] = useState<string | undefined>();
  const [buttonAction, setButtonAction] = useState<(() => void) | undefined>();
  const [secondaryButtonText, setSecondaryButtonText] = useState<string | undefined>();
  const [secondaryButtonAction, setSecondaryButtonAction] = useState<(() => void) | undefined>();


  errorPopUpData.setIsVisible = setIsVisible;
  errorPopUpData.setTitle = setTitle;
  errorPopUpData.setMessage = setMessage;
  errorPopUpData.setTopImage = setTopImage;
  errorPopUpData.setMiddleImage = setMiddleImage;
  errorPopUpData.setButtonText = setButtonText;
  errorPopUpData.setButtonAction = setButtonAction;
  errorPopUpData.setSecondaryButtonText = setSecondaryButtonText;
  errorPopUpData.setSecondaryButtonAction = setSecondaryButtonAction;

  const RenderButtons = () => {
    if (!secondaryButtonText) {
      return <CustomizableButton
          style={{marginTop: cosmos.unit, alignSelf: 'flex-end'}}
          textStyle={{fontSize: 16, lineHeight: 16, color: palette.grayscale.white}}
          title={buttonText ? buttonText : 'OK'}
          onPress={() => buttonAction ? buttonAction() : hideErrorPopUp()}
        />
    } else {
      return (
        <ButtonsContainer>
          <CustomizableButton
            style={{marginEnd: 8, backgroundColor: 'transparent', borderWidth: 1, borderRadius: 4, borderColor: palette.auxillary.danger.main}}
            textStyle={{fontSize: 16, lineHeight: 16, color: palette.auxillary.danger.main}}
            title={buttonText ? buttonText : 'Cancel'}
            onPress={() => buttonAction ? buttonAction() : hideErrorPopUp()}
          />

          <CustomizableButton
            style={{backgroundColor: palette.primary.bcBlue, borderWidth: 1, borderRadius: 4, borderColor: palette.primary.bcBlue }}
            textStyle={{fontSize: 16, lineHeight: 16, color: palette.grayscale.white}}
            title={secondaryButtonText}
            onPress={() => secondaryButtonAction && secondaryButtonAction()}
          />
        </ButtonsContainer>
      )
    }
  }

  return (
    <Modal
      transparent={true}
      animationType='fade'
      visible={ isVisible }
    >
      <Container>
        <PopUpView>
          { topImage && <ErrorImage source={topImage}/> }
          <ErrorTitle>{title}</ErrorTitle>
          { middleImage && <ErrorImage style={{marginTop: cosmos.unit}} source={middleImage}/> }
          { message && <ErrorMessage>{message}</ErrorMessage>}
          { RenderButtons() }
        </PopUpView>
      </Container>
    </Modal>
  );
}

const ErrorTitle = styled.Text`
  font-family: larsseitbold;
  font-size: 20px;
  line-height: 22px;
  color: ${palette.primary.navy};
  margin-top: ${cosmos.unit}px;
  text-align: center;
`;

const ErrorMessage = styled.Text`
  font-family: larsseit;
  font-size: 16px;
  line-height: 20px;
  color: ${palette.primary.navy};
  margin-top: ${cosmos.unit}px;
  text-align: center;
`

const ErrorImage = styled.Image`
  width: 50px;
  height: 50px;
`;

const Container = styled.View`
  width: 100%;
  height: 100%;
  padding: ${cosmos.unit * 2}px ${cosmos.unit * 2}px ${cosmos.unit * 2}px ${cosmos.unit * 2}px;
  background-color: ${palette.grayscale.transparentBlack};
  align-items: center;
  justify-content: center;
`;

const PopUpView = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${cosmos.unit * 2}px ${cosmos.unit * 2}px ${cosmos.unit * 2}px ${cosmos.unit * 2}px;
  background-color: ${palette.grayscale.white};
  border-radius: 8px;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  align-self: stretch;
  align-items: center;
  justify-content: flex-end ;
  margin: ${cosmos.unit}px ${cosmos.unit * 2}px 0px ${cosmos.unit * 2}px;
`;
