import { getCurrentState } from './context';
import { reRender } from './render';

export function useState(initialValue) {
  //현재 설정된 컴포넌트의 상태 가져오기
  const state = getCurrentState();
  const { hookIndex, stateBucket } = state;

  if (stateBucket[hookIndex] === undefined) {
    stateBucket[hookIndex] = initialValue;
  }

  // #1 이 훅이 사용할 “슬롯 번호”를 고정(snapshot)
  const currentIndex = hookIndex;

  function setState(nextValue) {
    const prev = stateBucket[currentIndex];
    const next = typeof nextValue === 'function' ? nextValue(prev) : nextValue;

    if (Object.is(prev, next)) {
      return; // 값이 동일하면 리렌더링 방지
    }
    stateBucket[currentIndex] = next;
    reRender();
  }

  // #2. 다음 훅 호출을 위해 인덱스 증가
  state.hookIndex++;

  // #1 을 참조하여 반환
  return [stateBucket[currentIndex], setState];
}
