import { checkURL, checkFeed } from './application';

export const inputHandler = (el) => {
  checkURL(el.target.value);
};


export const formHandler = (el) => {
  el.preventDefault();
  const url = document.getElementById('rsslink');
  checkFeed(url.value);
};
