import van from 'vanjs-core';
import { LoginForm } from './view/login.van';
import { Router, navigate } from 'vanjs-routing';
import { ChatUI } from './view/chat.van';
import * as Login from './functions/auth.v3';
import { Await } from 'vanjs-ui';
const { div, span } = van.tags;

export const App = () => {
  const validToken = van.state(Login.validToken());
  return Await(
    {
      value: validToken.val,
      container: span,
      Loading: () => '🌀 Loading...',
      Error: () => '🙀 Request failed.',
    },
    (hasAuth) => {
      console.log('Await', hasAuth);
      if (hasAuth) {
        navigate('/chat', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      return Router({
        basename: '',
        routes: [
          {
            path: '/',
            component: LoginForm,
          },
          {
            path: '/chat',
            component: ChatUI,
          },
        ],
      });
    }
  );
};
