import React from 'react';
import styled from 'styled-components/native';
import { View, StyleProp, ViewStyle } from "react-native";

import { palette } from "shared/src/cosmos";

const TextInputWithTitle = ({title, value, onChangeText, maxLength, multiline, placeholder, style, onFocusChanged}
  :{title: string, value: string, onChangeText: (arg0: string) => void, maxLength?: number, multiline?: boolean, placeholder?: string, style?: StyleProp<ViewStyle>, onFocusChanged?: (arg0: boolean) => void}) => {
  return (
    <View style={Object.assign({alignSelf: 'stretch'}, style)}>
      <FieldTitle>{title}</FieldTitle>
      <InputContainer 
        maxLength={maxLength}
        multiline={multiline}
        placeholder={placeholder}
        value={value}
        onChangeText={(text: string) => onChangeText(text)}
        onEndEditing={() => { if (onFocusChanged) onFocusChanged(false)}}
        onFocus={() => { if (onFocusChanged) onFocusChanged(true)}}
      />
    </View>
  );
};

export default TextInputWithTitle;

const FieldTitle = styled.Text`
  font-family: larsseitbold;
  font-size: 18px;
  line-height: 25px;
  color: ${palette.primary.navy};
`;

const InputContainer = styled.TextInput`
  border-width: 1px;
  border-color: ${palette.grayscale.granite};
  border-radius: 2px;
  margin-top: 10px;
  min-height: 52px;
  padding: 12px;
  font-family: larsseit;
  font-size: 16px;
  line-height: 20.8px;
  color: ${palette.primary.navy};
`;
