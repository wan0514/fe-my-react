import { getCurrentState } from './context';
import { reRender } from './render';

export function useState(initialValue) {
  //현재 설정된 컴포넌트의 상태 가져오기
  const state = getCurrentState();
  const { hookIndex, stateBucket } = state;

  if (stateBucket[hookIndex] === undefined) {
    stateBucket[hookIndex] = initialValue;
  }

  const currentIndex = hookIndex;

  function setState(nextValue) {
    const prev = stateBucket[currentIndex];
    const next = typeof nextValue === 'function' ? nextValue(prev) : nextValue;

    if (Object.is(prev, next)) {
      return; // 값이 동일하면 리렌더링 방지
    }
    stateBucket[currentIndex] = next;
    reRender(); // 전체 리랜더링 로직
  }

  state.hookIndex++;

  return [stateBucket[currentIndex], setState];
}
