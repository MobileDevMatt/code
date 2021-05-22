import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { palette } from 'shared/src/cosmos';

import { BrandLink, Title } from 'theme/Typography';
import FormControl from 'components/FormControl';
import AuthScreenFooter from 'components/AuthScreenFooter';
import AuthPageContainer from 'components/containers/AuthPageContainer';

import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'theme/Button';
import { useSignUp } from 'hooks/useAuth';
import { isValidEmailRegex, isValidName } from 'lib/utils';
import { ROUTE } from 'lib/constants';


interface IFormData {
  email: string;
  password: string;
  username: string;
  userType: 'author' | 'reader' | 'admin';
}


const Signup = () => {
  const navigation = useNavigation();
  const { control, handleSubmit, errors, formState } = useForm<IFormData>();
  const { mutate: signUp, ...signUpInfo } = useSignUp();


  const handleFormSubmit = (data: IFormData) => {
    signUp({
        email: data.email,
        password: data.password,
        username: data.username,
        userType: 'author'
      },
      {
        onSuccess: async () => {
          navigation.navigate(ROUTE.AUTHOR_VERIFY_EMAIL)
        },
      });
  };

  return (
    <Container>

      <AuthPageContainer>
        <CloseContainer onPress={() => {
          navigation.dispatch(StackActions.popToTop());
          navigation.navigate(ROUTE.REGISTRATION);
        }}>
          <MaterialCommunityIcons name="window-close" size={24} color="black"/>
        </CloseContainer>

        <TitleContainer>
          <Title style={{ color: palette.grayscale.black, marginStart: 16 }}>Create an account</Title>
        </TitleContainer>

        <FormArea>
          <FormGroup>
            <Controller
              defaultValue={''}
              control={control}
              render={({ onChange, onBlur, value }) => (
                <FormControl
                  label="What name do you publish under?"
                  onChangeText={value => {
                    onChange(value);
                    delete errors?.username?.message
                  }}
                  value={value}
                  maxLength={50}
                  multiline={false}
                  required
                  autoCorrect={false}
                />
              )}
              name="username"
              rules={{
                required: 'Name is required',
                minLength: {
                  value: 1,
                  message: 'Name cannot be empty',
                },
                validate: (value) => {
                  return isValidName(value) === false ? 'No special characters allowed' : null;
                },
              }}
            />
            {errors?.username?.message && <FormErrorText>{errors?.username?.message}</FormErrorText>}
          </FormGroup>
          <FormGroup>
            <Controller
              defaultValue={''}
              control={control}
              render={({ onChange, onBlur, value }) => (
                <FormControl
                  label="Email Address"
                  onChangeText={value => onChange(value)}
                  value={value}
                  required
                  multiline={false}
                  autoCorrect={false}
                />
              )}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: isValidEmailRegex,
                  message: 'This appears to be an invalid email address.',
                },
              }}
            />
            {errors?.email?.message && <FormErrorText>{errors?.email?.message}</FormErrorText>}
          </FormGroup>
          <FormGroup>
            <Controller
              defaultValue={''}
              control={control}
              render={({ onChange, onBlur, value }) => (
                <FormControl
                  label="Password"
                  required
                  onChangeText={value => onChange(value)}
                  value={value}
                  isPasswordControl={true}
                  multiline={false}
                  autoCorrect={false}
                />
              )}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password length cannot be less than 8 characters',
                },
                maxLength: {
                  value: 64,
                  message: 'Name must be less than 64 characters',
                },
              }}
            />
            {errors?.password?.message && <FormErrorText>{errors?.password?.message}</FormErrorText>}
            {signUpInfo.isError ? (
              <FormErrorText error>
                {(signUpInfo.error as any)?.message} {/* TODO open github issue on `react-query` or check if upgrading means we can avoid casting*/}
              </FormErrorText>
            ) : null}
          </FormGroup>

          <ButtonContainer>
            <Button
              title="Create account"
              style={{ width: '100%' }}
              disabled={signUpInfo.isLoading}
              loading={formState.isSubmitting || signUpInfo.isLoading}
              onPress={handleSubmit(handleFormSubmit)}
            />
            <BrandLinkContainer onPress={() => {
              navigation.dispatch(StackActions.popToTop());
              navigation.navigate(ROUTE.LOGIN)
            }}>
              <BrandLink>Log In to existing account</BrandLink>
            </BrandLinkContainer>
          </ButtonContainer>


        </FormArea>
        <AuthScreenFooter/>
      </AuthPageContainer>
    </Container>
  );
};

export default Signup;

const Container = styled.View`
  position: relative;
  height: 100%;
  background-color: transparent;
  justify-content: flex-end;
`;

const CloseContainer = styled.TouchableOpacity`
  align-items: flex-end;
  width: 100%;
  padding-right: 23px;
  padding-top: 23px;
`;

const TitleContainer = styled.View`
  margin-top: 23px;
`;

const ActionsContainer = styled.View`
  margin-bottom: 35px;
  flex-direction: row;
  justify-content: space-between;
`;

const KeepMeLoggedIn = styled.TouchableOpacity`
  flex-direction: row;
`;
const FormGroup = styled.View`
  margin-bottom: 24px;
`;
const FormArea = styled.View`
  padding-horizontal: 16px;
  margin-top: 36px;
`;
const KeepLoggedInText = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  line-height: 22px;
  margin-left: 8px;
  color: ${palette.grayscale.black};
`;
const FormErrorText = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  margin-top: 3px;
  color: ${palette.auxillary.crimson.alt};
`;


const CheckBoxBorder = styled.View`
  width:24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  border:1px solid ${palette.grayscale.granite}
`;

const NeutralLinkContainer = styled.TouchableOpacity``;
const BrandLinkContainer = styled.TouchableOpacity`
  margin-top: 12px;
`;

const ButtonContainer = styled.View`
  align-items: center;
`;
