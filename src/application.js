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


const generateNewArticles = (document) => {
  const documentArticles = document.querySelectorAll('item');
  const newArticles = [];

  documentArticles.forEach((el) => {
    const article = {
      title: el.querySelector('title').textContent,
      description: el.querySelector('description').textContent,
      link: el.querySelector('link').textContent,
    };
    newArticles.push(article);
  });

  return newArticles;
};

const addArticles = (document) => {
  const newArticles = generateNewArticles(document).reverse();
  const oldArticlesURL = state.articles.map(el => el.link);
  newArticles.forEach((newArticle) => {
    if (!oldArticlesURL.includes(newArticle.link)) {
      state.articles.unshift(newArticle);
    }
  });
};


const generateNewFeed = (document, url) => ({
  title: document.querySelector('title').textContent,
  description: document.querySelector('description').textContent,
  link: url,
});

const addFeed = (document, url) => {
  const newFeed = generateNewFeed(document, url);
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


export const chekcUpdate = (stateIn) => {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  const { feeds } = stateIn;
  const feedsURL = feeds.map(el => el.link);
  feedsURL.forEach((feedURL) => {
    axios.get(`${proxy}${feedURL}`)
      .then((res) => {
        const document = parser(res.data);
        addArticles(document);
      });
  });
  window.setTimeout(chekcUpdate, 5000, stateIn);
};
