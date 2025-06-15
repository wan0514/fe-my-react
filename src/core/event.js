export const eventMap = Object.freeze({
  click: 'onClick',
  dblclick: 'onDoubleClick',
  mousedown: 'onMouseDown',
  mouseup: 'onMouseUp',
  mouseenter: 'onMouseEnter',
  mouseleave: 'onMouseLeave',
  keydown: 'onKeyDown',
  keyup: 'onKeyUp',
  input: 'onInput',
  change: 'onChange',
  submit: 'onSubmit',
  focus: 'onFocus',
  blur: 'onBlur',
  contextmenu: 'onContextMenu',
  pointerdown: 'onPointerDown',
  pointerup: 'onPointerUp',
  dragstart: 'onDragStart',
  dragend: 'onDragEnd'
});

export function initEventDelegation(root) {
  // 같은 root에 중복 위임 방지
  if (root.__delegated) return;

  Object.keys(eventMap).forEach((eventType) => {
    root.addEventListener(eventType, (event) => {
      handleDelegatedEvent(event, root);
    });
  });

  root.__delegated = true;
}

function handleDelegatedEvent(event, root) {
  const eventType = event.type;
  const propKey = eventMap[eventType];
  if (!propKey) return;

  let node = event.target;

  while (node && node !== root.parentNode) {
    const vnode = node.__vnode;
    const handler = vnode?.props?.[propKey];
    if (typeof handler === 'function') {
      handler(event);
      break;
    }
    node = node.parentNode;
  }
}
