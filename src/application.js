import _ from 'lodash';
import $ from 'jquery';
import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import parse from './parser';
import * as renderers from './renderers';
import { handleInput, handleForm } from './handlers';


export const requestThroughProxy = (url) => {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  return axios.get(`${proxy}${url}`);
};


export const setFormState = (stateIn, inputState, info) => {
  const state = stateIn;
  state.inputState = inputState;
  state.info = info;
};


export const addFeed = (stateIn, feed, newURL) => {
  const state = stateIn;
  state.feeds.push(feed);
  state.feedsURL.push(newURL);
};


export const addArticles = (stateIn, feed) => {
  const state = stateIn;
  const newArticles = feed.articles;
  const oldArticles = state.articles;
  state.articles = _.unionBy(newArticles, oldArticles, 'link');
};


const addUpdate = (stateIn) => {
  const state = stateIn;
  const promiseArray = state.feedsURL.map(requestThroughProxy);
  const promiseAll = Promise.all(promiseArray);
  promiseAll
    .then((responces) => {
      const feeds = responces.map(res => parse(res.data));
      feeds.forEach(feed => addArticles(state, feed));
    });
  window.setTimeout(addUpdate, 5000, state);
};


export const application = () => {
  // Inistatetialization states
  const state = {
    inputState: 'clean',
    info: '',
    feedsURL: [],
    feeds: [],
    articles: [],
  };

  // Initialization handlers (controllers)
  const rssLink = document.querySelector('#rsslink');
  rssLink.addEventListener('input', el => handleInput(el, state));
  const form = document.querySelector('#form-input');
  form.addEventListener('submit', el => handleForm(el, state));

  // Initialization watchers
  WatchJS.watch(state, 'inputState', () => renderers.formRender(state));
  WatchJS.watch(state, 'feeds', () => renderers.feedsRender(state));
  WatchJS.watch(state, 'articles', () => renderers.articlesRender(state));

  // For modal window
  $('#exampleModal').on('show.bs.modal', function func(event) {
    const button = $(event.relatedTarget);
    const recipient = button.data('whatever');
    const modal = $(this);
    modal.find('#exampleModalLabel').html('Description');
    modal.find('#mymodal').html(`${recipient}`);
  });

  // Auto-update articles from feeds
  window.setTimeout(addUpdate, 5000, state);
};
