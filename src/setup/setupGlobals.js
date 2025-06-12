import { createElement } from '../core/createElement.js';

if (typeof window !== 'undefined') {
  window.createElement = createElement;
  //TODO Frament 추가
}

if (typeof global !== 'undefined') {
  global.createElement = createElement;
  //TODO Frament 추가
}
