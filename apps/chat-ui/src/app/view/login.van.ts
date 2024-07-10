import van from 'vanjs-core';
import { navigate } from 'vanjs-routing';
import * as Login from '../functions/auth.v3';

const { div, input, button } = van.tags;

export const LoginForm = () => {
  const form = van.state({
    username: '',
    password: '',
  });
  const usernameInput = input({
    class: 'border border-gray-300 p-2 rounded-md',
    type: 'text',
    placeholder: 'ユーザー名',
    name: 'username',
    autocomplete: 'username',
    onchange: (e) => (form.val.username = e.target.value),
  });

  const passwordInput = input({
    class: 'border border-gray-300 p-2 rounded-md mt-4',
    type: 'password',
    placeholder: 'パスワード',
    name: 'password',
    autocomplete: 'current-password',
    onchange: (e) => (form.val.password = e.target.value),
  });

  const loginButton = button(
    {
      class:
        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4',
      type: 'submit',
      onclick: async () => {
        try {
          if (await Login.login(form.val)) {
            navigate('/chat', { replace: true });
          }
        } catch (e) {
          console.error(e);
        }
      },
    },
    'ログイン'
  );

  return div(
    {
      class: 'max-w-xs mx-auto my-10',
    },
    div(
      { class: 'mb-4 flex flex-col' },
      usernameInput,
      passwordInput,
      loginButton
    )
  );
};
