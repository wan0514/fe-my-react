import { createElement } from '../core/createElement';

//헬퍼 함수
function expectVNode(vnode, expectedType, expectedProps) {
  expect(vnode.type).toBe(expectedType);
  for (const key in expectedProps) {
    expect(vnode.props[key]).toEqual(expectedProps[key]);
  }
}

describe('createElement 함수', () => {
  describe('기본 구조', () => {
    it('type과 props를 포함한 vnode를 생성해야 한다', () => {
      const vnode = createElement('div', { id: 'x' }, 'hi');
      expectVNode(vnode, 'div', { id: 'x', children: 'hi' });
    });

    it('props 없이 호출할 경우 빈 props 객체로 처리되어야 한다', () => {
      const vnode = createElement('div', null, 'hi');
      expectVNode(vnode, 'div', { children: 'hi' });
      expect(Object.keys(vnode.props)).toEqual(['children']);
    });

    it('config가 undefined일 경우에도 정상 동작해야 한다', () => {
      const vnode = createElement('div', undefined, 'hi');
      expectVNode(vnode, 'div', { children: 'hi' });
      expect(Object.keys(vnode.props)).toEqual(['children']);
    });

    it('컴포넌트 함수가 type으로 전달되면 그대로 vnode.type에 저장되어야 한다', () => {
      function MyComponent() {
        return 'dummy';
      }
      const vnode = createElement(MyComponent, null);
      expect(vnode.type).toBe(MyComponent);
    });
  });

  describe('children 처리', () => {
    it('children이 문자열 1개일 경우 props.children이 해당 문자열이어야 한다', () => {
      const vnode = createElement('div', { id: 'x' }, 'hi');
      expect(vnode.props.children).toBe('hi');
    });

    it('children이 여러 개일 경우 props.children이 배열이어야 한다', () => {
      const vnode = createElement(
        'div',
        { id: 'x' },
        createElement('div', { id: 'y' }, 'hello'),
        createElement('div', { id: 'z' }, 'nice to meet you')
      );
      expect(Array.isArray(vnode.props.children)).toBe(true);
    });

    it('children 없이 호출할 경우 props.children이 없어야 한다', () => {
      const vnode = createElement('div', { id: 'x' });
      expect(vnode.props.children).toBeUndefined();
    });

    it('falsy한 children(null, false 등)이 그대로 children으로 들어가는지 확인한다', () => {
      const vnode = createElement('div', null, null);
      expect(vnode.props.children).toBeNull();
    });

    it('children에 문자열과 vNode가 혼합되어도 잘 나와야 한다.', () => {
      const vnode = createElement(
        'div',
        null,
        'text',
        createElement('span', null, 'nested')
      );
      expect(Array.isArray(vnode.props.children)).toBe(true);
      expect(vnode.props.children[0]).toBe('text');
      expect(vnode.props.children[1].type).toBe('span');
      expect(vnode.props.children[1].props.children).toBe('nested');
    });

    it('숫자 children을 그대로 props.children에 할당해야 한다', () => {
      const vnode = createElement('div', null, 123);
      expect(vnode.props.children).toBe(123);
    });

    it('boolean children도 값 그대로 props.children에 포함되어야 한다', () => {
      const vnode = createElement('div', null, false);
      expect(vnode.props.children).toBe(false);
    });
  });

  describe('props 처리', () => {
    it('props로 넘긴 children보다 인자로 받은 children이 우선되어야 한다', () => {
      const vnode = createElement('div', { children: 'manual' }, 'auto');
      expect(vnode.props.children).toBe('auto');
    });
  });
});
