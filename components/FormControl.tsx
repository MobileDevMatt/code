import React, { useState } from 'react';
import { TextInputProps, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import styled from 'styled-components/native';
import { palette } from 'shared/src/cosmos';

interface ITextInputProps extends TextInputProps {
  label?: string;
  isPasswordControl?: boolean;
  required?: boolean;
}

const FormControl = ({ label, isPasswordControl, required, style, ...props }: ITextInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <TextInputContainer>
      {!!label ? <Label>{label}{required && ' *'}</Label> : null}
      <View>
        <TextInputComponent
          {...props}
          style={style}
          underlineColorAndroid={'transparent'}
          secureTextEntry={!showPassword && isPasswordControl}
        />
        {
          !!isPasswordControl ? (
            <ShowPasswordIcon onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={!showPassword ? 'eye' : 'eye-off'}
                size={22}
                color={palette.grayscale.black}
              />
            </ShowPasswordIcon>) : null
        }
      </View>
    </TextInputContainer>
  );
};

export default FormControl;

const TextInputComponent = styled.TextInput`
  min-height: 42px;
  width:100%;
  font-size: 16px;
  padding-horizontal:12px;
  border:1px solid ${palette.grayscale.stone};
  border-radius: 2px;
  font-family: larsseit;
`;

const TextInputContainer = styled.View``;

const Label = styled.Text`
  font-family: larsseitbold;
  font-size: 18px;
  line-height: 26px;
  color: ${palette.grayscale.black};
  margin-bottom: 10px;
`;

const ShowPasswordIcon = styled.TouchableOpacity`
  position: absolute;
  align-items: flex-end;
  right: 10px;
  top:10px
`;
