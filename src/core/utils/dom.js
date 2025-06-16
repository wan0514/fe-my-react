import { eventMap } from '../event';
/**
 * 주어진 키가 유효한 DOM 이벤트 핸들러 이름인지 확인합니다.
 *
 * JSX에서 onClick, onInput 등으로 들어온 키를 검사하여
 * 실제 DOM 이벤트로 바인딩 가능한지 여부를 반환합니다.
 *
 * @param {string} key - 검사할 props 키 값 (예: 'onClick')
 * @returns {boolean} - 유효한 이벤트 핸들러 키이면 true, 아니면 false
 */
export function isEventHandler(key) {
  if (!key.startsWith('on')) return false;

  return Object.values(eventMap).includes(key);
}
