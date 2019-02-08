import isURL from 'validator/lib/isURL';
import * as app from './application';
import parse from './parser';


export const handleInput = (el, stateIn) => {
  const url = el.target.value;
  const state = stateIn;

  if (url === '' || url === null) {
    app.setFormState(state, 'clean', '');
    return;
  }

  if (isURL(url)) {
    app.setFormState(state, 'valid', '');
    return;
  }

  app.setFormState(state, 'invalid', 'Invalid URL');
};


export const handleForm = (el, stateIn) => {
  el.preventDefault();
  const state = stateIn;
  const formData = new FormData(el.target);
  const newURL = formData.get('inputURL');
  if (state.feedsURL.includes(newURL)) {
    app.setFormState(state, 'invalid', 'This feed is formerly added.');
    app.setModalMessage(state, 'red', 'Error', 'This feed is formerly added.');
    return;
  }
  app.setFormState(state, 'blocked', 'loading...');
  app.requestThroughProxy(newURL)
    .then((responce) => {
      try {
        const feed = parse(responce.data);
        app.addFeed(state, feed, newURL);
        app.addArticles(state, feed);
        app.setFormState(state, 'clean', '');
        app.setModalMessage(state, 'green', 'Successfull', 'Feed successfully added.');
      } catch (err) {
        app.setFormState(state, 'invalid', err.message);
        app.setModalMessage(state, 'red', 'Error', err.message);
      }
    }).catch(() => {
      app.setFormState(state, 'invalid', 'Connection error.');
      app.setModalMessage(state, 'red', 'Error', 'Connection error.');
    });
};
