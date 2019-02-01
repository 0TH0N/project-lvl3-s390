import isURL from 'validator/lib/isURL';
import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import * as renderers from './renderers';
import parser from './parser';


export const formWatcher = (stateIn, type) => WatchJS.watch(stateIn, type, () => {
  const state = stateIn;

  const check = () => {
    if (state.inputValue === '' || state.inputValue === null) {
      state.inputState = 'clean';
      return;
    }
    if (isURL(state.inputValue)) {
      state.inputState = 'valid';
      return;
    }
    state.inputState = 'invalid';
  };

  check();
  renderers.inputRender(state);
});


export const enterLinkWatcher = (stateIn, type) => WatchJS.watch(stateIn, type, () => {
  const state = stateIn;
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  if (state.feeds.map(el => el.link).indexOf(state.enterLink) === -1) {
    state.inputState = 'blocked';
    renderers.inputRender(state);
    axios.get(`${proxy}${state.enterLink}`)
      .then((res) => {
        const doc = parser(res.data);
        if (doc.querySelector('rss')) {
          state.newFeed = doc;
        } else {
          state.info = 'NO RSS';
          state.inputState = 'valid';
          renderers.inputRender(state);
          renderers.infoRender(state);
        }
      }).catch(() => {
        state.inputState = 'invalid';
        renderers.inputRender(state);
        state.info = 'error connect to URL';
        renderers.infoRender(state);
      });
  } else {
    state.info = 'This feed is formerly added';
    renderers.infoRender(state);
  }
});


export const newFeedWatcher = (stateIn, type) => WatchJS.watch(stateIn, type, () => {
  const state = stateIn;
  const doc = state.newFeed;
  const newFeed = {
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
    link: state.inputValue,
  };
  state.feeds.push(newFeed);
  state.inputValue = null;
  renderers.feedsRender(state);
  state.newArticles = doc.querySelectorAll('item');
});


export const newArticlesWatcher = (stateIn, type) => WatchJS.watch(stateIn, type, () => {
  const state = stateIn;
  const newArticles = [];
  for (let i = 0; i < state.newArticles.length; i += 1) {
    const article = document.createElement('a');
    article.setAttribute('href', state.newArticles[i].querySelector('link').textContent);
    article.textContent = state.newArticles[i].querySelector('title').textContent;
    newArticles.push(article);
  }
  state.articles = newArticles.concat(state.articles);
  renderers.articlesRender(state);
});
