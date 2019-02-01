import * as watchers from './watchers';
import getState from './state';
import { inputHandler, formHandler } from './handlers';

export default () => {
  // initialization states
  const state = getState();

  // initialization handlers (controllers)
  const rssLink = document.querySelector('#rsslink');
  rssLink.addEventListener('input', el => inputHandler(el));
  const form = document.querySelector('#form-input');
  form.addEventListener('submit', el => formHandler(el));

  // initialization watchers
  watchers.inputStateWatcher(state, 'inputState');
  watchers.infoWatcher(state, 'info');
  watchers.feedsWatcher(state, 'feeds');
  watchers.articlesWatcher(state, 'articles');

  return state;
};
