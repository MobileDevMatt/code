import React, { ReactElement } from 'react';
import { TouchableOpacity, View, ActivityIndicator, StyleProp, TextStyle, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import cosmos, { palette } from 'shared/src/cosmos';

interface Props {
  title: string;
  onPress: () => void;
  style?: any;
  textColor?: string;
  icon?: ReactElement | string;
  loading?: boolean
  disabled?: boolean
};

interface ICustomizableButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: ReactElement | string;
  loading?: boolean;
  disabled?: boolean;
  iconStyle?: StyleProp<ViewStyle>;
  activityIndicatorColor?: string;
  rightIcon?: ReactElement | string;
  rightIconStyle?: StyleProp<ViewStyle>;
}


export const Button = ({ title, onPress, style, icon, loading = false, disabled = false }: Props): ReactElement => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={style}>
    <Container>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {loading ? <ActivityIndicator size="small" color={palette.grayscale.white}/> : <Text>{title}</Text>}

    </Container>
  </TouchableOpacity>
);

export const CustomizableButton = ({ title, onPress, style, textStyle, icon, loading = false, disabled = false, iconStyle, activityIndicatorColor, rightIcon, rightIconStyle }: ICustomizableButtonProps): ReactElement => (
  <CustomizableButtonTouchable onPress={onPress} disabled={disabled} style={[{paddingHorizontal: cosmos.unit * 2, paddingVertical: cosmos.unit}, style]}>
    {icon &&  <View style={[{marginRight: 8}, iconStyle]}>{icon}</View>}
    {loading ? <ActivityIndicator size="small" color={activityIndicatorColor ?? palette.grayscale.white}/> : <CustomizableButtonText style={textStyle}>{title}</CustomizableButtonText>}
    {rightIcon && <View style={[rightIconStyle, {marginLeft: 8}]}>{rightIcon}</View>}
  </CustomizableButtonTouchable>
);

export const TextButton = ({ title, onPress, style, icon, textColor }: Props): ReactElement => (
  <TouchableOpacity onPress={onPress} style={style}>
    <TextContainer>
      <Text style={{ color: textColor }}>{title}</Text>
      {icon ? <View style={{ paddingTop: 3 }}>{icon}</View> : null}
    </TextContainer>
  </TouchableOpacity>
);

export const SecondaryButton = ({ title, onPress, style, icon, textColor }: Props): ReactElement => (
  <TouchableOpacity onPress={onPress}>
    <SecondaryContainer style={style}>
      <FixedIconWrapper>{icon}</FixedIconWrapper>
      <Text style={{ color: textColor || palette.grayscale.white }}>{title}</Text>
    </SecondaryContainer>
  </TouchableOpacity>
);

export const TransparentButton = ({title, onPress, textStyle, style} : {title: string, onPress: () => void, textStyle?: StyleProp<TextStyle>, style?: StyleProp<ViewStyle>}) => {
  return (
    <TransparentBtn onPress={() => {onPress()}} style={style}>
      <TransparentButtonText style={textStyle}>{title}</TransparentButtonText>
    </TransparentBtn>
  );
}

const CustomizableButtonText = styled.Text`
    font-family: larsseitbold;
    color: ${palette.grayscale.white};
    font-size: 16px;
`;

const CustomizableButtonTouchable = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background: ${palette.primary.bcBlue};
  border-radius: 2px;
`;

const TransparentBtn = styled.TouchableOpacity`
  padding: 6px 6px 6px 6px;
  align-items: center;
  justify-content: center;
`;

const TransparentButtonText = styled.Text`
  font-family: larsseit;
  font-size: 18px;
  line-height: 25px;
  color: ${palette.grayscale.black};
`;

const Container = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  min-width: 165px;
  height: 42px;
  background: ${palette.primary.bcBlue};
  border-radius: 2px;
`;

const SecondaryContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 273px;
  height: 42px;
  background: ${palette.grayscale.black};
  border-radius: 2px;
  border: 1px solid rgba(165,163,157,0.5);
`;

export const Text = styled.Text`
  font-family: larsseitbold;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: ${palette.grayscale.white};
  align-self: center;
`;

const GhostContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 183px;
  height: 44px;
  background: ${palette.grayscale.stone};
  border-radius: 2px;
`;

const TextContainer = styled.View`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  flex-direction: row;
  width: 160px;
  background: transparent;
`;
const GhostText = styled.Text`
  font-family: granvillebold;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: ${palette.grayscale.black};
  align-self: center;
  margin: 10px 0px;
`;

const FixedIconWrapper = styled.View`
  position: absolute;
  left: 10px;
`;
