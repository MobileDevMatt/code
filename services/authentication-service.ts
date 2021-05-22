import Amplify, { Auth } from '../../shared/node_modules/aws-amplify';
import { CognitoUser, ISignUpResult } from 'amazon-cognito-identity-js';
import AWSConfig from '../../shared/src/aws-exports';

Amplify.configure(AWSConfig);

/**
 * @description
 * Our authentication service through AWS Amplify.
 * - https://docs.amplify.aws/lib/auth/getting-started/q/platform/js
 * - https://docs.amplify.aws/lib/auth/overview/q/platform/js
 */
export class AuthenticationService {
  /**
   * @description
   * Returns role used in the app from the JWT payload, group list from the cognito pool.
   * Our cognito user pool groups are: 'admins', 'authors', 'users'
   */
  private static getCognitoUserGroupName(groups: string[]): 'admin' | 'author' | 'reader' {
    if(groups.some((group) => group === 'admins')){
      return 'admin';
    } else if(groups.some((group) => group === 'authors')){
      return 'author';
    } else {
      return 'reader';
    }
  }

  /**
   * @description
   * Signs the user in by setting their their user (AWS CognitoUser) information in the browsers LocalStorage.
   */
  static async signin(data: IUserSigninData){
    const {username: email, password} = data;
    try {
      const AWSCognitoUser: CognitoUser = await Auth.signIn({
          username: email.toLowerCase(),
          password
      });
      return AWSCognitoUser;
    } catch(error){
      // TODO: need to create a "type guard" here to handle different type of exceptions. Details: https://stackoverflow.com/questions/42618089/how-do-you-use-typed-errors-in-async-catch
      if (error?.code === "UserNotConfirmedException") {
        throw new Error("Please verify your new user by checking your email");
      }
      else if (error?.code === "NotAuthorizedException") {
        throw new Error(error?.message);
      }
      else if(error?.code) {
        throw new Error(error?.message);
      }
      else {
        throw error;
      }
    }
  }

  /**
   * @description
   * Signs a user up by creating a new AWS Cognito user.
   */
  static async signup(data: IUserSignupData): Promise<ISignUpResult> {
    const {username, email, password, userType} = data;
    const requestPayload = userType === 'author' ? //TODO type this data
      {
        username: email.toLowerCase(),
        password,
        attributes: {
          name: username,
          email: email.toLowerCase(),
          'custom:group': 'authors',
        }
      } :
      {
        username: email.toLowerCase(),
        password,
        attributes: {
          name: username,
          email: email.toLowerCase(),
        }
      };
    try {
      const response = await Auth.signUp(requestPayload);
      return response;
    }
    catch (error){
      if (error?.code === "UsernameExistsException") {
        throw new Error(error?.message);
      }
      else if(error?.code) {
        throw new Error(error?.message);
      }
      else {
        throw error;
      }
    }
  }

  /**
   * @desciption
   * Logs out the currently authenticated user.
   * Internally, AWS Amplify's `Auth.signOut` method removes
   * the logged in user's data from the browser's LocalStorage.
   * This method also clears the full local storage for our app.
   */
  static async signout(): Promise<any> {
    try {
      const response = await Auth.signOut();
      return response;
    }
    catch (error) {
      if(error?.code) {
        throw new Error(error?.message);
      }
      else {
        throw error;
      }
    }
  }

  /**
   * @desciption
   * Extracts the role from the user (AWS CognitoUser) that resides in the browsers LocalStorage.
   */
  static async getUserRole(): Promise<'author' | 'reader' | 'admin'> {
    try {
      const session =  await Auth.currentSession();
      if(session){
        const accessToken = session.getAccessToken();
        const group = AuthenticationService.getCognitoUserGroupName(accessToken.payload['cognito:groups']);
        return group;
      } else {
        return 'reader';
      }
    }
    catch (error) {
      // If there is no current user return null.
      // Erroring will cause the page to crash on login & signup screens.
      return 'reader';
    }
  }

  /**
   * @description
   * Sends a confirmation code to the user's email. The confirmation code
   * is needed for the next step in password recovery process.
   */
  static async sendForgotPasswordEmailCode(email:string){
    try {
      const response = await Auth.forgotPassword(email.toLowerCase());
      return response;
    }
    catch(error) {
      if(error?.code === "UserNotFoundException"){
        throw new Error("Email not found.")
      }
      else if(error?.code === "LimitExceededException") {
        throw new Error("Attempt password reset limit exceeded, please try after some time.")
      }
      else if(error?.code) {
        throw new Error(error?.message);
      }
      else {
        throw error;
      }
    }
  }

  /**
   * @description
   * Sets a new password for the user, after they have provided their email confirmation code,
   * email and new password.
   */
  static async confirmNewPasswordFromForgottenPassword(data: IUserForgotPasswordData){
    const {email, code, password} = data;
    try {
      const response = await Auth.forgotPasswordSubmit(email.toLowerCase(), code, password);
      return response;
    }
    catch(error) {
      if(error?.code === "LimitExceededException") {
        throw new Error("Attempt password reset limit exceeded, please try after some time.")
      }
      else if(error?.code) {
        throw new Error(error?.message);
      }
      else {
        throw error;
      }
    }
  }

  /**
   * @description
   * Checks if there is a currently logged in user.
   * Internally, all that AWS Amplify's `Auth.currentAuthenticatedUser` method does
   * is check if there is user data from the browser's localStorage.
   */
  static async getUser(){
    try {
      const AWSCognitoUser = await Auth.currentAuthenticatedUser() as CognitoUser;
      return AWSCognitoUser;
    }
    catch(error){
      /*
      TODO: open issue on AWS Amplify github
      The method above `Auth.currentAuthenticatedUser` throws an error when it
      is unable to find a signed in user. Ideally this method should not throw an error
      if cant find a signed in user, but insteead resolve to a Promise of null or undefined.

      Why is it problematic that AWS is throwing an error?
          1. Causes problem with HTTP calls and hooks calls.
              For example, if we're using this method in a `useQuery` hook & it cannot find a user:
                  const {data, isSuccess, isError} = useQuery(`getUser`, AuthenticationService.getUser);

              the `isError` value will become `true`. We want `isSuccess` to be become true not `isError`,
              thus we DONT throw an error and instead return null, so we know we can proceed to
              rendering either a logged in or logged out experience.
      */
      return null;
    }
  }
}

export interface IUserSignupData {
  username: string;
  email: string;
  password: string;
  userType: 'author' | 'reader' | 'admin';
}

export interface IUserSigninData {
  username: string;
  password: string;
}

export interface IUserForgotPasswordData {
  email: string;
  password: string;
  code: string;
}

