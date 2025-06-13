import { createElement } from '../core/createElement';
import { render } from '../core/render';

describe('render', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('render 함수가 h1 태그를 렌더링해야 합니다.', () => {
    const vnode = createElement('h1', { className: 'test-title' }, 'Hello');
    render(vnode, container);

    const h1 = container.querySelector('h1');

    expect(h1).toBeTruthy();
    expect(h1.textContent).toBe('Hello');
    expect(h1.className).toBe('test-title');
  });

  it('중첩된 vnode를 렌더링해야 합니다.', () => {
    const vnode = createElement(
      'div',
      null,
      createElement('h1', null, 'Title'),
      createElement('p', null, 'Paragraph')
    );
    render(vnode, container);

    const h1 = container.querySelector('h1');
    const p = container.querySelector('p');
    expect(h1.textContent).toBe('Title');
    expect(p.textContent).toBe('Paragraph');
  });

  it('렌더링 전에 기존 DOM을 초기화해야 합니다.', () => {
    container.innerHTML = '<span>Old</span>';
    const vnode = createElement('div', null, 'New');
    render(vnode, container);

    expect(container.innerHTML).not.toContain('Old');
    expect(container.textContent).toBe('New');
  });

  it('함수형 컴포넌트를 렌더링해야 합니다.', () => {
    const Sample = () => createElement('p', null, 'Sample Text');
    const vnode = createElement(Sample, null);
    render(vnode, container);

    const p = container.querySelector('p');
    expect(p).toBeTruthy();
    expect(p.textContent).toBe('Sample Text');
  });

  it('중첩된 함수형 컴포넌트를 렌더링해야 합니다.', () => {
    const Inner = () => createElement('span', null, 'Inner');
    const Middle = () => createElement('div', null, createElement(Inner));
    const Outer = () => createElement('section', null, createElement(Middle));

    const vnode = createElement(Outer, null);
    render(vnode, container);

    const section = container.querySelector('section');
    const div = container.querySelector('div');
    const span = container.querySelector('span');

    expect(section).toBeTruthy();
    expect(div).toBeTruthy();
    expect(span).toBeTruthy();
    expect(span.textContent).toBe('Inner');
  });
});
