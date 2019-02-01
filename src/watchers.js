import WatchJS from 'melanke-watchjs';
import * as renderers from './renderers';


export const inputStateWatcher = (stateIn, type) => WatchJS.watch(stateIn, type, () => {
  renderers.inputRender(stateIn);
});


export const infoWatcher = (stateIn, type) => WatchJS.watch(stateIn, type, () => {
  renderers.infoRender(stateIn);
});


export const feedsWatcher = (stateIn, type) => WatchJS.watch(stateIn, type, () => {
  renderers.feedsRender(stateIn);
});


export const articlesWatcher = (stateIn, type) => WatchJS.watch(stateIn, type, () => {
  renderers.articlesRender(stateIn);
});
