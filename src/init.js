import * as watchers from './watchers';
import getState from './state';
import { inputHandler, formHandler } from './handlers';

export default () => {
  // initialization states
  const state = getState();

  // initialization handlers (controllers)
  const rssLink = document.querySelector('#rsslink');
  rssLink.addEventListener('input', el => inputHandler(el, state));
  const form = document.querySelector('#form-input');
  form.addEventListener('submit', el => formHandler(el, state));

  // initialization watchers
  watchers.formWatcher(state, 'inputValue');
  watchers.enterLinkWatcher(state, 'enterLink');
  watchers.newFeedWatcher(state, 'newFeed');
  watchers.newArticlesWatcher(state, 'newArticles');
};
