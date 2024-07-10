import van from 'vanjs-core';
import * as TalkRag from '../functions/rag-talk';
import { Loading } from '../components/loading';
const { div, input, button, ul, li, span } = van.tags;

const createMessage = (message: string, isUser: boolean) =>
  li(
    {
      class: `max-w-full flex ${isUser ? 'justify-end' : 'justify-start'}`,
    },
    span(
      {
        class: `max-w-full break-all whitespace-pre-wrap inline-block p-2 rounded-lg m-2 ${
          isUser ? 'bg-gray-200 text-black ml-8' : 'bg-blue-500 text-white mr-8'
        }`,
      },
      message
    )
  );

export const ChatUI = () => {
  const chatHistory = ul({
    class: 'h-96 overflow-auto p-4 border border-gray-300 rounded-md',
  });

  const messageInput = input({
    class: 'border border-gray-300 p-2 rounded-md w-full',
    type: 'text',
    placeholder: 'メッセージを入力...',
    name: 'message',
  });

  const sendButton = button(
    {
      class:
        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2',
      onclick: async () => {
        const question = messageInput.value;
        van.add(chatHistory, createMessage(question, true));
        messageInput.value = '';
        console.log('Sending message:', question);
        const answer = await TalkRag.query(question);

        van.add(chatHistory, createMessage(answer.message, false));
        messageInput.focus();
      },
    },
    '送信'
  );

  const chatInputArea = div({ class: 'flex mt-4' }, () =>
    TalkRag.processing.val
      ? Loading
      : span({ class: 'flex w-full' }, messageInput, sendButton)
  );

  return div(
    {
      class: 'max-w-lg mx-auto my-10',
    },
    chatHistory,
    chatInputArea
  );
};
