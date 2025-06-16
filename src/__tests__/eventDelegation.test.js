import { beforeEach, describe, expect, test, vi } from 'vitest';
import { initEventDelegation } from '../core/event';

describe('event delegation', () => {
  let root;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
    initEventDelegation(root);
  });

  test('click 이벤트가 위임되어 핸들러가 실행된다', () => {
    const button = document.createElement('button');
    const handleClick = vi.fn();

    button.__vnode = { props: { onClick: handleClick } };
    root.appendChild(button);

    button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('핸들러가 없는 경우 실행되지 않는다', () => {
    const div = document.createElement('div');
    div.__vnode = { props: {} };
    root.appendChild(div);

    div.click();

    expect(true).toBe(true); // 에러 없이 통과
  });

  test('부모에 핸들러가 있으면 위임되어 실행된다', () => {
    const parent = document.createElement('div');
    const child = document.createElement('button');
    const handleClick = vi.fn();

    parent.__vnode = { props: { onClick: handleClick } };
    parent.appendChild(child);
    root.appendChild(parent);

    child.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('root에서 직접 이벤트가 발생하면 무시된다', () => {
    const handleClick = vi.fn();
    root.__vnode = { props: { onClick: handleClick } };

    root.click();

    expect(handleClick).not.toHaveBeenCalled();
  });

  test('focusin 이벤트를 통해 onFocus 핸들러가 우회 실행된다', () => {
    const input = document.createElement('input');
    const handleFocus = vi.fn();

    input.__vnode = { props: { onFocus: handleFocus } };
    root.appendChild(input);

    const focusinEvent = new FocusEvent('focusin', { bubbles: true });
    input.dispatchEvent(focusinEvent);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  test('focusout 이벤트를 통해 onBlur 핸들러가 우회 실행된다', () => {
    const input = document.createElement('input');
    const handleBlur = vi.fn();

    input.__vnode = { props: { onBlur: handleBlur } };
    root.appendChild(input);

    const focusoutEvent = new FocusEvent('focusout', { bubbles: true });
    input.dispatchEvent(focusoutEvent);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('mouseover 이벤트를 통해 onMouseEnter 핸들러가 실행된다', () => {
    const div = document.createElement('div');
    const handleEnter = vi.fn();

    div.__vnode = { props: { onMouseEnter: handleEnter } };
    root.appendChild(div);

    const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
    div.dispatchEvent(mouseoverEvent);

    expect(handleEnter).toHaveBeenCalledTimes(1);
  });

  test('mouseout 이벤트를 통해 onMouseLeave 핸들러가 실행된다', () => {
    const div = document.createElement('div');
    const handleLeave = vi.fn();

    div.__vnode = { props: { onMouseLeave: handleLeave } };
    root.appendChild(div);

    const mouseoutEvent = new MouseEvent('mouseout', { bubbles: true });
    div.dispatchEvent(mouseoutEvent);

    expect(handleLeave).toHaveBeenCalledTimes(1);
  });

  test('stopPropagation 호출 시 상위 핸들러 실행되지 않음', () => {
    const parent = document.createElement('div');
    const child = document.createElement('button');

    const parentHandler = vi.fn();
    const childHandler = (e) => {
      e.stopPropagation();
    };

    parent.__vnode = { props: { onClick: parentHandler } };
    child.__vnode = { props: { onClick: childHandler } };

    parent.appendChild(child);
    root.appendChild(parent);

    child.click();

    expect(parentHandler).not.toHaveBeenCalled();
  });

  test('stopPropagation 호출하지 않으면 상위 핸들러까지 실행됨', () => {
    const parent = document.createElement('div');
    const child = document.createElement('button');

    const parentHandler = vi.fn();
    const childHandler = vi.fn();

    parent.__vnode = { props: { onClick: parentHandler } };
    child.__vnode = { props: { onClick: childHandler } };

    parent.appendChild(child);
    root.appendChild(parent);

    child.click();

    expect(childHandler).toHaveBeenCalled();
    expect(parentHandler).toHaveBeenCalled();
  });
});
