import $ from 'jquery';
import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import parse from './parser';
import * as renderers from './renderers';
import { inputHandle, formHandle } from './handlers';


export const requestThroughProxy = (url) => {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  return axios.get(`${proxy}${url}`);
};


export const setFormState = (inputState, info, stateIn) => {
  const state = stateIn;
  state.inputState = inputState;
  state.info = info;
};


export const addFeed = (feed, feedsStateIn, newURL) => {
  const state = feedsStateIn;
  state.feeds.push(feed);
  state.feedsURL.push(newURL);
};


export const addArticles = (feed, feedsStateIn) => {
  const feedsState = feedsStateIn;
  const newArticles = feed.articles.reverse();
  const oldArticlesURL = feedsState.articles.map(el => el.link);
  newArticles.forEach((newArticle) => {
    if (!oldArticlesURL.includes(newArticle.link)) {
      feedsState.articles.unshift(newArticle);
    }
  });
};


const addUpdate = (feedsState) => {
  const promiseArray = feedsState.feedsURL.map(requestThroughProxy);
  const promiseAll = Promise.all(promiseArray);
  promiseAll
    .then((responces) => {
      const feeds = responces.map(res => parse(res.data));
      feeds.forEach(feed => addArticles(feed, feedsState));
    });
  window.setTimeout(addUpdate, 5000, feedsState);
};


export const application = () => {
  // Initialization states
  const formState = {
    inputState: 'clean',
    info: '',
  };

  const feedsState = {
    feedsURL: [],
    feeds: [],
    articles: [],
  };

  // Initialization handlers (controllers)
  const rssLink = document.querySelector('#rsslink');
  rssLink.addEventListener('input', el => inputHandle(el, formState));
  const form = document.querySelector('#form-input');
  form.addEventListener('submit', el => formHandle(el, formState, feedsState));

  // Initialization watchers
  WatchJS.watch(formState, 'inputState', () => renderers.formRender(formState));
  WatchJS.watch(feedsState, 'feeds', () => renderers.feedsRender(feedsState));
  WatchJS.watch(feedsState, 'articles', () => renderers.articlesRender(feedsState));

  // For modal window
  $('#exampleModal').on('show.bs.modal', function func(event) {
    const button = $(event.relatedTarget);
    const recipient = button.data('whatever');
    const modal = $(this);
    modal.find('#exampleModalLabel').html('Description');
    modal.find('#mymodal').html(`${recipient}`);
  });

  // Auto-update articles from feeds
  window.setTimeout(addUpdate, 5000, feedsState);
};
