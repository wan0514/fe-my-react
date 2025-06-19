import { getCurrentState } from './context';

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

    stateBucket[currentIndex] =
      typeof nextValue === 'function' ? nextValue(prev) : nextValue;

    state.rerender();
  }

  state.hookIndex++;

  return [stateBucket[hookIndex], setState];
}
