import van from 'vanjs-core';
import Store from './store';
const processing = van.state(false);

const query = async (
  question: string
): Promise<{
  message: string;
}> => {
  processing.val = true;
  return new Promise((resolve, reject) => {
    fetch('/chat_talk', {
      method: 'POST',
      headers: {
        'Content-Type': 'Content-Type: application/json',
        Authorization: Store.tokens.IdToken ?? '',
      },
      body: JSON.stringify({
        token: 'gpt-talk-61a694fb-14af-463e-b96b-21508ec46e8f',
        question: question,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        processing.val = false;
        resolve(data);
      })
      .catch((error) => {
        processing.val = false;
        reject(error);
      });
  });
};

export { processing, query };
