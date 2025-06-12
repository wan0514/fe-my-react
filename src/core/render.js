export function render(vnode, container) {
  //TODO diff알고리즘과 Virtual Dom 구현시 변경 예정
  container.innerHTML = '';

  // 함수형 컴포넌트인 경우 실행하여 vnode를 반환받고 다시 렌더링
  if (typeof vnode.type === 'function') {
    const nextVNode = vnode.type(vnode.props);
    return render(nextVNode, container);
  }

  const dom = createDom(vnode);
  container.appendChild(dom);
}

function createDom(vnode) {
  // TODO createTextElement로 래핑
  // 현재는 리팽이 되어있지 않아서 createDome내부에서 처리
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  const { type, props } = vnode;
  const dom = document.createElement(type);

  // key 설정
  for (const key in props) {
    if (key !== 'children') {
      dom.setAttribute(key, props[key]);
    }
  }

  //prop 설정
  for (const prop in vnode.props) {
    if (prop === 'className') {
      dom.className = vnode.props[prop];
    } else {
      dom.setAttribute(prop, vnode.props[prop]);
    }
  }
  //children 배열로 표준화
  const children = Array.isArray(props.children)
    ? props.children
    : [props.children];

  //재귀적으로 자식 랜더링
  children.forEach((child) => {
    if (child != null) {
      const childDom = createDom(child);
      dom.appendChild(childDom);
    }
  });

  return dom;
}
