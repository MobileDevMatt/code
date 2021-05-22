import React from 'react';
import styled, { css } from 'styled-components/native';
import { FormErrorText } from '../theme/Typography';
import { Controller, useForm } from 'react-hook-form';
import FormControl from './FormControl';
import { palette } from 'shared/src/cosmos';
import { Feather } from '@expo/vector-icons';
import { StyleProp, ViewStyle } from 'react-native';

interface IFormData {
  searchString: string;
}

interface IProps {
  handleSearch?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  placeholder?: string;
  background?: string;
}


const SearchBox = ({ handleSearch, containerStyle, placeholder,background }:IProps) => {
  const { control, errors } = useForm<IFormData>();

  return (
    <Container style={containerStyle}>
      <FormGroup background={background}>
        <Controller
          defaultValue={''}
          control={control}
          render={({ onChange, onBlur, value }) => (
            <SearchInput
              background={background}
              label=""
              placeholder={placeholder ?? 'Search'}
              onChangeText={value => onChange(value)}
              value={value}
              onSubmitEditing={handleSearch}
              returnKeyType={'search'}
              placeholderTextColor={palette.grayscale.granite}
              multiline={false}
              autoCorrect={false}
            />
          )}
          name="searchString"
        />

        {errors?.searchString && <FormErrorText>{errors?.searchString?.message}</FormErrorText>}
        <SearchIcon>
          <Feather
            name='search'
            size={19}
            color={palette.grayscale.granite}
          />
        </SearchIcon>
      </FormGroup>
    </Container>
  );
};

export default SearchBox;

const Container = styled.View`
  background-color: ${palette.grayscale.black};
`;

const FormGroup = styled.View`
  width: 100%;
  background-color: ${palette.grayscale.black};
   ${(props) => {
    if (props?.background === 'light') {
      return css`
            background-color: ${palette.grayscale.white};
        `;
    }
  }}
`;

const SearchInput = styled(FormControl)`
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: transparent;
  padding-left: 50px;
  color: ${palette.grayscale.white};
  ${(props) => {
    if (props?.background === 'light') {
      return css`
              border: 1px solid ${palette.grayscale.stone};
              color:${palette.grayscale.black};
          `;
      }
    }}
`;

const SearchIcon = styled.View`
  position: absolute;
  align-items: flex-end;
  left: 10px;
  top:12px;
`;
