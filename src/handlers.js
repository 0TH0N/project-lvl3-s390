import isURL from 'validator/lib/isURL';
import * as app from './application';
import parse from './parser';


export const inputHandle = (el, formState) => {
  const url = el.target.value;

  if (url === '' || url === null) {
    app.setFormState('clean', '', formState);
    return;
  }

  if (isURL(url)) {
    app.setFormState('valid', '', formState);
    return;
  }

  app.setFormState('invalid', 'Invalid URL', formState);
};


export const formHandle = (el, formState, feedsState) => {
  el.preventDefault();
  const formData = new FormData(el.target);
  const newURL = formData.get('inputURL');
  if (feedsState.feedsURL.includes(newURL)) {
    app.setFormState('invalid', 'This feed is formerly added.', formState);
    return;
  }
  app.setFormState('blocked', 'loading...', formState);
  app.requestThroughProxy(newURL)
    .then((responce) => {
      try {
        const feed = parse(responce.data);
        app.addFeed(feed, feedsState, newURL);
        app.addArticles(feed, feedsState);
        app.setFormState('clean', 'Feed successfully added.', formState);
      } catch
      (err) {
        app.setFormState('invalid', err.message, formState);
      }
    }).catch(() => {
      app.setFormState('invalid', 'Connection error.', formState);
    });
};
