import van from 'vanjs-core';
const { div } = van.tags;

export const Loading = div(
  {
    class: 'my-2.5 min-h-4 w-full flex justify-center items-center',
    ariaLabel: '読み込み中',
  },
  div({
    class: 'animate-ping h-2 w-2 bg-blue-600 rounded-full',
  }),
  div({
    class: 'animate-ping h-2 w-2 bg-blue-600 rounded-full mx-4',
  }),
  div({
    class: 'animate-ping h-2 w-2 bg-blue-600 rounded-full',
  })
);
