// 함수 컴포넌트 상태 맵핑 데이터 구조
const componentMap = new WeakMap();

export function getComponentState(componentFn) {
  return componentMap.get(componentFn);
}

export function setComponentState(componentFn, state) {
  componentMap.set(componentFn, state);
}
