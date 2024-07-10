import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
  ChallengeNameType,
} from '@aws-sdk/client-cognito-identity-provider';
import Store from './store';
import { environment } from '../env/environment';

const region = 'ap-northeast-1';
const client = new CognitoIdentityProviderClient({ region });

interface AuthenticationPros {
  username: string;
  password: string;
}

export const validToken = async (): Promise<Boolean> =>
  new Promise(async (resolve) => {
    const accessToken = Store.tokens.AccessToken;
    if (!accessToken) {
      console.log('User needs to log in');
      resolve(false);
    }

    try {
      const getUserCommand = new GetUserCommand({ AccessToken: accessToken });
      const user = await client.send(getUserCommand);
      console.log('User is authenticated:', user);
      Store.username = user.Username ?? '';
      resolve(true);
    } catch (error: any) {
      if (error.name === 'NotAuthorizedException') {
        console.log('Access token has expired, trying to refresh token...');
        resolve(await refreshAuthToken());
      } else {
        console.log('Error retrieving user:', error);
        resolve(false);
      }
    }
  });

const refreshAuthToken = async (): Promise<boolean> => {
  const refreshToken = Store.tokens.RefreshToken;
  if (!refreshToken) {
    console.log('Refresh token not found');
    return false;
  }

  const params = {
    AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
    ClientId: environment.poolData.ClientId,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  };

  try {
    const refreshTokenCommand = new InitiateAuthCommand(params);
    const authResult = await client.send(refreshTokenCommand);
    console.log('New session:', authResult);
    Store.tokens = authResult.AuthenticationResult ?? {};
  } catch (error) {
    console.log('Error refreshing token:', error);
    return false;
  }

  return true;
};

export const login = async ({
  username,
  password,
}: AuthenticationPros): Promise<boolean> => {
  console.log('LOGIN !!!', username, password);
  const params = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: environment.poolData.ClientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  console.log(params);

  try {
    const command = new InitiateAuthCommand(params);
    const response = await client.send(command);
    console.log('Login success:', response);
    if (response.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
      alert('パスワードが仮登録状態のため、パスワードを一度変更してください');
      return false;
    }

    Store.tokens = response.AuthenticationResult ?? {};
    Store.username = username;
  } catch (error) {
    console.log('Login failed:', error);
    return false;
  }

  return true;
};
