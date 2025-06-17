let hookIndex = 0;
let stateBucket = [];

let _render = null;

export function setRenderFn(fn) {
  _render = fn;
}

export function resetHooks() {
  hookIndex = 0;
}

export function useState(initialValue) {
  const idx = hookIndex;

  stateBucket[idx] = stateBucket[idx] ?? initialValue;

  function setState(newVal) {
    const prev = stateBucket[idx];
    const next = typeof newVal === 'function' ? newVal(prev) : newVal;
    stateBucket[idx] = next;
    _render?.();
  }

  hookIndex++;

  return [stateBucket[idx], setState];
}
