import { getComponentState, setComponentState } from '../core/componentState';

describe('componentState', () => {
  test('있고, 동일한 함수로 동일한 상태를 가져올 수 있어야 한다', () => {
    function MyComponent() {}
    const state = { count: 1 };

    setComponentState(MyComponent, state);
    const retrieved = getComponentState(MyComponent);

    expect(retrieved).toBe(state);
  });

  test('원시값 키는 내부적으로 객체로 래핑되어 같은 키로 동일한 상태를 반환해야 한다', () => {
    const key = 'myKey';
    const state = { message: 'hello' };

    setComponentState(key, state);
    const retrieved = getComponentState(key);

    expect(retrieved).toBe(state);
  });

  test('같은 instanceKey를 여러 번 사용해도 항상 같은 상태 객체를 반환해야 한다', () => {
    const key = 42;
    const state = { value: 42 };

    setComponentState(key, state);
    expect(getComponentState(key)).toBe(state);
    expect(getComponentState(key)).toBe(state);
  });
});
