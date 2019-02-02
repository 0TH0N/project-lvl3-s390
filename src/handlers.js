import isURL from 'validator/lib/isURL';
import { addArticles, requestThroughProxy } from './application';
import parser from './parser';


export const inputHandle = (el, stateIn) => {
  const state = stateIn;
  const url = el.target.value;

  if (url === '' || url === null) {
    state.inputState = 'clean';
    state.info = '';
    return;
  }

  if (isURL(url)) {
    state.inputState = 'valid';
    state.info = '';
    return;
  }

  state.inputState = 'invalid';
  state.info = 'Invalid URL';
};


export const formHandle = (el, stateIn) => {
  el.preventDefault();
  const state = stateIn;
  const newURL = document.getElementById('rsslink').value;
  const feedsURL = state.feeds.map(elem => elem.link);
  if (feedsURL.includes(newURL)) {
    state.modalMessage = {
      title: 'Error',
      description: 'This feed is formerly added.',
      color: 'red',
    };
    return;
  }
  state.inputState = 'blocked';
  requestThroughProxy(newURL)
    .then((responce) => {
      const feed = parser(responce.data, newURL);
      if (!feed) {
        state.inputState = 'invalid';
        state.modalMessage = {
          title: 'Error',
          description: 'This URL is not RSS feed.',
          color: 'red',
        };
        return;
      }
      state.feeds.push(feed);
      addArticles(feed, state);
      state.inputState = 'clean';
      state.modalMessage = {
        title: 'Congratulations',
        description: 'Feed successfully added.',
        color: 'green',
      };
    }).catch(() => {
      state.inputState = 'invalid';
      state.modalMessage = {
        title: 'Error',
        description: 'Connection error.',
        color: 'red',
      };
    });
};
