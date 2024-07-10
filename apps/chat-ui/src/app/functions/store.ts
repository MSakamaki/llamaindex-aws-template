import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';

const store = {
  get userName() {
    return localStorage.getItem('username') ?? '';
  },
  set username(username: string) {
    localStorage.setItem('username', username);
  },
  get tokens() {
    return {
      IdToken: localStorage.getItem('idToken') ?? '',
      AccessToken: localStorage.getItem('accessToken') ?? '',
      RefreshToken: localStorage.getItem('refreshToken') ?? '',
    };
  },
  set tokens(authResult: AuthenticationResultType) {
    localStorage.setItem('idToken', authResult.IdToken ?? '');
    localStorage.setItem('accessToken', authResult.AccessToken ?? '');
    localStorage.setItem('refreshToken', authResult.RefreshToken ?? '');
  },
};
export default store;
