import $ from 'jquery';
import * as watchers from './watchers';
import getState from './state';
import { inputHandler, formHandler } from './handlers';

export default () => {
  // initialization states
  const state = getState();

  // initialization handlers (controllers)
  const rssLink = document.querySelector('#rsslink');
  rssLink.addEventListener('input', el => inputHandler(el));
  const form = document.querySelector('#form-input');
  form.addEventListener('submit', el => formHandler(el));

  // initialization watchers
  watchers.inputStateWatcher(state, 'inputState');
  watchers.infoWatcher(state, 'info');
  watchers.feedsWatcher(state, 'feeds');
  watchers.articlesWatcher(state, 'articles');

  $('#exampleModal').on('show.bs.modal', function func(event) {
    const button = $(event.relatedTarget);
    const recipient = button.data('whatever');
    const modal = $(this);
    modal.find('#mymodal').html(`${recipient}`);
  });

  return state;
};
