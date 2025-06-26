import { useState } from '../core/useState';
import { render } from '../core/render';
import { createElement } from '../core/createElement';

describe('useState 훅', () => {
  let root;
  let vnode;

  beforeEach(() => {
    root = document.createElement('div');
  });

  afterEach(() => {
    delete window.fire;
    delete window.inc1;
    delete window.inc2;
    delete window.bump;
  });

  function mount(AppComponent) {
    vnode = createElement(AppComponent);
    render(vnode, root);
  }

  it('초기 상태값이 DOM에 정확히 반영되어야 한다', () => {
    const App = () => {
      const [count] = useState(5);
      return <div data-testid="count">{count}</div>;
    };

    mount(App);
    const countNode = root.querySelector('[data-testid="count"]');
    expect(countNode.textContent).toBe('5');
  });

  it('상태 변경 시 변경된 상태 값으로 다시 렌더링되어야 한다', () => {
    const App = () => {
      const [count, setCount] = useState(1);
      window.fire = () => setCount((prev) => prev + 1);
      return <div data-testid="count">{count}</div>;
    };

    mount(App);
    const getCount = () => root.querySelector('[data-testid="count"]');

    expect(getCount().textContent).toBe('1');
    window.fire();
    expect(getCount().textContent).toBe('2');
    window.fire();
    expect(getCount().textContent).toBe('3');
  });

  it('여러 useState 호출 간 상태가 독립적으로 유지되어야 한다', () => {
    const App = () => {
      const [count1, setCount1] = useState(0);
      const [count2, setCount2] = useState(100);
      window.inc1 = () => setCount1((prev) => prev + 1);
      window.inc2 = () => setCount2((prev) => prev + 10);
      return (
        <div>
          <span data-testid="count1">{count1}</span>
          <span data-testid="count2">{count2}</span>
        </div>
      );
    };

    mount(App);
    const getCount1 = () => root.querySelector('[data-testid="count1"]');
    const getCount2 = () => root.querySelector('[data-testid="count2"]');

    expect(getCount1().textContent).toBe('0');
    expect(getCount2().textContent).toBe('100');
    window.inc1();
    expect(getCount1().textContent).toBe('1');
    expect(getCount2().textContent).toBe('100');
    window.inc2();
    expect(getCount1().textContent).toBe('1');
    expect(getCount2().textContent).toBe('110');
  });

  it('상태 변경 후 vnode.__dom이 새로운 DOM 노드를 가리켜야 한다', () => {
    const App = () => {
      const [count, setCount] = useState(0);
      window.bump = () => setCount((c) => c + 1);
      return <div data-testid="count">num: {count}</div>;
    };

    mount(App);
    const initialDom = vnode.__dom;
    window.bump();
    const updatedDom = vnode.__dom;

    const countNode = root.querySelector('[data-testid="count"]');
    expect(updatedDom).toBe(countNode);
    expect(updatedDom).not.toBe(initialDom);
    expect(updatedDom.textContent).toBe('num: 1');
  });

  it('중첩 컴포넌트에서 상태 변경 시 해당 부분만 다시 렌더링되어야 한다', () => {
    const App = () => {
      const [countA, setCountA] = useState(0);
      const [countB, setCountB] = useState(0);
      window.incA = () => setCountA((c) => c + 1);
      window.incB = () => setCountB((c) => c + 1);

      function Outer({ children }) {
        return <section>{children}</section>;
      }

      function Inner({ label, count, onInc }) {
        return (
          <div data-testid={`inner-${label}`}>
            <span>
              {label}: {count}
            </span>
            <button data-testid={`btn-${label}`} onClick={onInc}>
              Inc
            </button>
          </div>
        );
      }

      return (
        <Outer>
          <Inner label="A" count={countA} onInc={window.incA} />
          <Inner label="B" count={countB} onInc={window.incB} />
        </Outer>
      );
    };

    mount(App);

    // 초기 DOM 노드 참조 저장
    const nodeA1 = root.querySelector('[data-testid="inner-A"]');
    const nodeB1 = root.querySelector('[data-testid="inner-B"]');

    // A 컴포넌트의 상태만 변경
    window.incA();

    // 변경 후 DOM 노드 참조
    const nodeA2 = root.querySelector('[data-testid="inner-A"]');
    const nodeB2 = root.querySelector('[data-testid="inner-B"]');

    // A는 교체
    expect(nodeA2).not.toBe(nodeA1);
    expect(nodeA2.textContent).toContain('A: 1');

    // B는 그대로 유지
    expect(nodeB2.textContent).toBe(nodeB1.textContent);
    expect(nodeB2.textContent).toContain('B: 0');
  });

  it('같은 값으로 setState 호출 시 리렌더링되지 않아야 한다', () => {
    let renderCount = 0;
    const App = () => {
      const [count, setCount] = useState(0);
      window.same = () => setCount(0);
      renderCount++;
      return <div data-testid="count">{count}</div>;
    };
    mount(App);
    expect(renderCount).toBe(1);
    window.same();
    expect(renderCount).toBe(1); // 값이 같으므로 리렌더링 없어야 함
  });
});
