export let __CURRENT_STATE = null;

export function setCurrentState(state) {
  __CURRENT_STATE = state;
}

export function getCurrentState() {
  return __CURRENT_STATE;
}
