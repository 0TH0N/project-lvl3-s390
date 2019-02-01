import isURL from 'validator/lib/isURL';
import axios from 'axios';
import state from './index';
import parser from './parser';

export const checkURL = (url) => {
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


const addArticles = (document) => {
  const documentArticles = document.querySelectorAll('item');
  const newArticles = [];

  documentArticles.forEach((el) => {
    const article = document.createElement('a');
    article.setAttribute('href', el.querySelector('link').textContent);
    article.textContent = el.querySelector('title').textContent;
    newArticles.push(article);
  });

  state.articles = newArticles.concat(state.articles);
};

const addFeed = (document, url) => {
  const newFeed = {
    title: document.querySelector('title').textContent,
    description: document.querySelector('description').textContent,
    link: url,
  };

  state.feeds.push(newFeed);
  addArticles(document);
};


export const checkFeed = (url) => {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  if (state.feeds.map(el => el.link).indexOf(url) === -1) {
    state.inputState = 'blocked';

    axios.get(`${proxy}${url}`)
      .then((res) => {
        const document = parser(res.data);
        if (document.querySelector('rss')) {
          state.inputState = 'clean';
          state.info = '';
          addFeed(document, url);
        } else {
          state.inputState = 'invalid';
          state.info = 'This URL is not RSS feed';
        }
      }).catch(() => {
        state.inputState = 'invalid';
        state.info = 'Connection error';
      });
  } else {
    state.info = 'This feed is formerly added';
  }
};
