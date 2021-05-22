import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import { useQueryClient } from 'react-query';
import styled from 'styled-components/native';
import { palette } from 'shared/src/cosmos';

import { Title, FormErrorText } from 'theme/Typography';
import FormControl from 'components/FormControl';
import AuthScreenFooter from 'components/AuthScreenFooter';
import AuthPageContainer from 'components/containers/AuthPageContainer';

import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'theme/Button';
import { useSignIn, useUserRole } from 'hooks/useAuth';
import { isValidEmailRegex } from 'lib/utils';
import { ROUTE } from 'lib/constants';
import { cacheKey } from 'hooks/cacheStateKey';


interface IFormData {
  email: string;
  password: string;
}


const Login = () => {
  const [checked, setChecked] = useState(false);
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { control, handleSubmit, errors, formState } = useForm<IFormData>();
  const { mutate: signIn, ...signInInfo } = useSignIn();
  const { mutate: getUserRole } = useUserRole();


  const handleFormSubmit = (data: IFormData) => {
    signIn({
      username: data.email,
      password: data.password,
    }, {
      onSuccess: () => {
        getUserRole(undefined, {
          onSuccess: async () => {
            queryClient.invalidateQueries(cacheKey.currentCognitoUser);
            queryClient.invalidateQueries(cacheKey.currentUserRole);
          },
        });
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
          <Title style={{ color: palette.grayscale.black, marginStart: 16 }}>Log In</Title>
        </TitleContainer>

        <FormArea>
          <FormGroup>
            <Controller
              defaultValue={''}
              control={control}
              render={({ onChange, value }) => (
                <FormControl
                  label="Email Address"
                  placeholder={'your@email.com'}
                  onChangeText={value => onChange(value)}
                  value={value}
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
            {errors?.email && <FormErrorText>{errors?.email?.message}</FormErrorText>}
          </FormGroup>
          <FormGroup>
            <Controller
              defaultValue={''}
              control={control}
              render={({ onChange, value }) => (
                <FormControl
                  label="Password"
                  placeholder={'6+ characters'}
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
                  value: 6,
                  message: 'Password length cannot be less than 6 characters',
                },
                maxLength: {
                  value: 64,
                  message: 'Name must be less than 64 characters',
                },
              }}
            />
            {errors?.password && <FormErrorText>{errors?.password?.message}</FormErrorText>}
            {signInInfo.isError ? (
              <FormErrorText error>
                {(signInInfo.error as any)?.message} {/* TODO open github issue on `react-query` or check if upgrading means we can avoid casting*/}
              </FormErrorText>
            ) : null}
          </FormGroup>
          <ActionsContainer>
            <KeepMeLoggedIn onPress={() => {
              setChecked(!checked);
            }}>
              <CheckBoxBorder>
                {checked ? <MaterialCommunityIcons name="check" size={24} color="black"/> : null}
              </CheckBoxBorder>
              <KeepLoggedInText>Keep me logged in</KeepLoggedInText>
            </KeepMeLoggedIn>
          </ActionsContainer>

          <ButtonContainer>
            <Button
              title="Log in"
              style={{ width: '100%' }}
              disabled={signInInfo.isLoading}
              loading={formState.isSubmitting || signInInfo.isLoading}
              onPress={handleSubmit(handleFormSubmit)}
            />
          </ButtonContainer>


        </FormArea>
        <AuthScreenFooter/>
      </AuthPageContainer>
    </Container>
  );
};

export default Login;

const Container = styled.View`
  position: relative;
  height: 100%;
  background-color: transparent;
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

const CheckBoxBorder = styled.View`
  width:24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  border:1px solid ${palette.grayscale.granite}
`;

const ButtonContainer = styled.View`
  align-items: center;
`;
