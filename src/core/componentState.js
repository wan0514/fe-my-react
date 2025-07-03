// 컴포넌트별 상태 맵
const componentStateMap = new WeakMap();

// 원시 키를 더미 객체의 WeakRef로 매핑하는 Map
const keyRegistry = new Map();

// 더미 객체가 가비지 수집될 때 keyRegistry 항목을 자동으로 정리하는 FinalizationRegistry
const finalizationRegistry = new FinalizationRegistry((primitiveKey) => {
  keyRegistry.delete(primitiveKey);
});

/**
 * 주어진 instanceKey를 WeakMap 키로 사용할 수 있는 객체로 변환합니다.
 *
 * instanceKey가 null이 아닌 객체인 경우 해당 객체를 그대로 반환합니다.
 * 문자열, 숫자, 심볼, 불리언, null, undefined 등의 원시값인 경우,
 * 내부 keyRegistry 맵을 통해 각 원시값에 대응되는 고유한 더미 객체를 생성 또는 조회하여 반환합니다.
 * 이를 통해 동일한 원시값에 대해 일관된 객체 참조를 제공하여 WeakMap에 안전하게 사용할 수 있습니다.
 *
 * @param {object|string|number|symbol|boolean|null|undefined} instanceKey
 *   사용자로부터 전달된 키 (원시값 또는 객체)
 * @returns {object}
 *   WeakMap의 키로 사용할 수 있는 객체 참조
 */
function toWeakKey(instanceKey) {
  if (
    (typeof instanceKey === 'object' || typeof instanceKey === 'function') &&
    instanceKey !== null
  ) {
    return instanceKey;
  }
  // 원시 키 처리 경로
  let ref = keyRegistry.get(instanceKey);
  let wk = ref && ref.deref();
  if (!wk) {
    wk = {};
    // WeakRef로 더미 객체 저장
    keyRegistry.set(instanceKey, new WeakRef(wk));
    // 가비지 수집 시 keyRegistry 정리를 위해 FinalizationRegistry에 등록
    finalizationRegistry.register(wk, instanceKey);
  }
  return wk;
}

// 컴포넌트 상태 조회 함수
export function getComponentState(instanceKey) {
  const wk = toWeakKey(instanceKey);
  return componentStateMap.get(wk);
}

// 컴포넌트 상태 저장 함수
export function setComponentState(instanceKey, state) {
  const wk = toWeakKey(instanceKey);
  componentStateMap.set(wk, state);
}
