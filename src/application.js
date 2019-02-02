import $ from 'jquery';
import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import parser from './parser';
import * as renderers from './renderers';
import { inputHandle, formHandle } from './handlers';


export const requestThroughProxy = (url) => {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  return axios.get(`${proxy}${url}`);
};


export const addArticles = (feed, stateIn) => {
  const state = stateIn;
  const newArticles = feed.articles.reverse();
  const oldArticlesURL = state.articles.map(el => el.link);
  newArticles.forEach((newArticle) => {
    if (!oldArticlesURL.includes(newArticle.link)) {
      state.articles.unshift(newArticle);
    }
  });
};


const addUpdate = (stateIn) => {
  const state = stateIn;
  const feedsURL = state.feeds.map(el => el.link);
  const promiseArray = feedsURL.map(requestThroughProxy);
  const promiseAll = Promise.all(promiseArray);
  promiseAll
    .then((responces) => {
      const feeds = responces.map(res => parser(res.data));
      feeds.forEach(feed => addArticles(feed, state));
    });
  window.setTimeout(addUpdate, 5000, stateIn);
};


export const application = () => {
  // Initialization states
  const state = {
    inputState: 'clean',
    info: '',
    feeds: [],
    articles: [],
  };

  // Initialization handlers (controllers)
  const rssLink = document.querySelector('#rsslink');
  rssLink.addEventListener('input', el => inputHandle(el, state));
  const form = document.querySelector('#form-input');
  form.addEventListener('submit', el => formHandle(el, state));

  // Initialization watchers
  WatchJS.watch(state, 'inputState', () => renderers.inputRender(state));
  WatchJS.watch(state, 'info', () => renderers.infoRender(state));
  WatchJS.watch(state, 'feeds', () => renderers.feedsRender(state));
  WatchJS.watch(state, 'articles', () => renderers.articlesRender(state));

  // For modal window
  $('#exampleModal').on('show.bs.modal', function func(event) {
    const button = $(event.relatedTarget);
    const recipient = button.data('whatever');
    const modal = $(this);
    modal.find('#mymodal').html(`${recipient}`);
  });

  // Auto-update articles from feeds
  window.setTimeout(addUpdate, 5000, state);
};
