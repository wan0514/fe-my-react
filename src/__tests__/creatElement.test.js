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
      expectVNode(vnode, 'div', {
        id: 'x',
        children: {
          type: 'TEXT_ELEMENT',
          props: { nodeValue: 'hi', children: [] }
        }
      });
    });

    it('props 없이 호출할 경우 빈 props 객체로 처리되어야 한다', () => {
      const vnode = createElement('div', null, 'hi');
      expectVNode(vnode, 'div', {
        children: {
          type: 'TEXT_ELEMENT',
          props: { nodeValue: 'hi', children: [] }
        }
      });
      expect(Object.keys(vnode.props)).toEqual(['children']);
    });

    it('config가 undefined일 경우에도 정상 동작해야 한다', () => {
      const vnode = createElement('div', undefined, 'hi');
      expectVNode(vnode, 'div', {
        children: {
          type: 'TEXT_ELEMENT',
          props: { nodeValue: 'hi', children: [] }
        }
      });
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
    it('문자열 children은 TEXT_ELEMENT 타입의 VNode로 변환되어야 한다', () => {
      const vnode = createElement('div', null, 'hi');
      expect(vnode.props.children.type).toBe('TEXT_ELEMENT');
      expect(vnode.props.children.props.nodeValue).toBe('hi');
    });

    it('숫자 children도 TEXT_ELEMENT 타입으로 변환되어야 한다', () => {
      const vnode = createElement('div', null, 123);
      expect(vnode.props.children.type).toBe('TEXT_ELEMENT');
      expect(vnode.props.children.props.nodeValue).toBe(123);
    });

    it('children이 여러 개일 경우 props.children은 배열로 유지되며 각 항목이 VNode 또는 값이어야 한다', () => {
      const vnode = createElement(
        'div',
        { id: 'x' },
        createElement('div', { id: 'y' }, 'hello'),
        createElement('div', { id: 'z' }, 'nice to meet you'),
        null,
        false
      );

      expect(Array.isArray(vnode.props.children)).toBe(true);
      expect(vnode.props.children.length).toBe(4);
      expect(vnode.props.children[0].type).toBe('div');
      expect(vnode.props.children[1].type).toBe('div');
      expect(vnode.props.children[2]).toBe(null);
      expect(vnode.props.children[3]).toBe(false);
    });

    it('null, undefined, boolean children도 props.children에 포함되지만 렌더링되지 않는다', () => {
      const vnode = createElement('div', null, null, undefined, false, true);
      expect(vnode.props.children).toEqual([null, undefined, false, true]);
    });

    it('children에 문자열과 vNode가 혼합되어도 잘 나와야 한다.', () => {
      const vnode = createElement(
        'div',
        null,
        'text',
        createElement('span', null, 'nested')
      );
      expect(Array.isArray(vnode.props.children)).toBe(true);
      expect(vnode.props.children[0].type).toBe('TEXT_ELEMENT');
      expect(vnode.props.children[0].props.nodeValue).toBe('text');
      expect(vnode.props.children[1].type).toBe('span');
      expect(vnode.props.children[1].props.children.type).toBe('TEXT_ELEMENT');
      expect(vnode.props.children[1].props.children.props.nodeValue).toBe(
        'nested'
      );
    });

    it('숫자 children도 TEXT_ELEMENT 타입으로 변환되어야 한다', () => {
      const vnode = createElement('div', null, 123);
      expect(vnode.props.children.type).toBe('TEXT_ELEMENT');
      expect(vnode.props.children.props.nodeValue).toBe(123);
    });

    it('boolean children은 props.children에 포함되지만 렌더링 시 무시된다', () => {
      const vnode = createElement('div', null, false);
      expect(vnode.props.children).toBe(false);
    });
  });

  describe('props 처리', () => {
    it('props로 넘긴 children보다 인자로 받은 children이 우선되어야 한다', () => {
      const vnode = createElement('div', { children: 'manual' }, 'auto');
      expect(vnode.props.children.type).toBe('TEXT_ELEMENT');
      expect(vnode.props.children.props.nodeValue).toBe('auto');
    });
  });
});
