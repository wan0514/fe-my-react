/**
 * render(vnode, container)
 *
 * Virtual DOM(VNode)을 실제 DOM으로 변환하여 container에 마운트하는 함수입니다.
 * React의 렌더링 방식과 유사하게 동작하며, 구조는 그대로 따르고 의미 판단은 이 단계에서 수행합니다.
 *
 * - vnode: Virtual DOM 노드. 문자열 태그, 함수형 컴포넌트, TEXT_ELEMENT 등을 포함할 수 있습니다
 * - container: 렌더링 결과를 삽입할 실제 DOM 노드
 *
 * 처리 방식:
 * - null, undefined, boolean과 같은 의미 없는 vnode는 렌더링하지 않고 무시됩니다
 * - 함수형 컴포넌트는 실행하여 실제 vnode로 변환한 뒤 재귀적으로 렌더링됩니다
 * - 일반 태그나 텍스트 vnode는 createDom을 통해 실제 DOM 노드로 변환되어 container에 추가됩니다
 *
 * 이 함수는 구조 + 의미까지 해석하여 실제 화면에 그려주는 단계입니다.
 */
export function render(vnode, container) {
  //TODO diff알고리즘과 Virtual Dom 구현시 변경 예정
  container.innerHTML = '';

  // 의미 없는 루트 vnode는 렌더링하지 않음
  if (!isRenderable(vnode)) {
    return;
  }

  // 함수형 컴포넌트인 경우 실행하여 vnode를 반환받고 다시 렌더링
  if (typeof vnode.type === 'function') {
    const nextVNode = vnode.type(vnode.props);
    return render(nextVNode, container);
  }

  const dom = createDom(vnode);
  container.appendChild(dom);
}

/**
 * createDom(vnode)
 *
 * 주어진 Virtual DOM 노드(vnode)를 실제 DOM 노드로 변환하는 함수입니다.
 * - TEXT_ELEMENT인 경우 텍스트 노드를 생성합니다.
 * - 일반 태그인 경우 DOM 요소를 생성하고 props를 attribute로 설정합니다.
 * - children은 배열로 정규화하여 재귀적으로 처리하며, isRenderable로 필터링합니다.
 *
 * 반환된 DOM 노드는 상위 요소에 append되어 화면에 렌더링됩니다.
 */
function createDom(vnode) {
  // 함수형 컴포넌트면 먼저 실행해서 vnode를 얻고 다시 처리
  if (typeof vnode.type === 'function') {
    const nextVNode = vnode.type(vnode.props);
    return createDom(nextVNode);
  }

  // TEXT_ELMENT 처리
  if (vnode.type === 'TEXT_ELEMENT') {
    return document.createTextNode(vnode.props.nodeValue);
  }

  const { type, props } = vnode;
  const dom = document.createElement(type);

  // prop 설정 (className, 기타 속성 처리)
  for (const key in props) {
    if (key === 'className') {
      dom.className = props[key];
    } else if (key !== 'children' && key !== 'key') {
      dom.setAttribute(key, props[key]);
    }
  }

  //children 배열로 표준화
  const children = Array.isArray(props.children)
    ? props.children
    : [props.children];

  //재귀적으로 자식 랜더링
  children.filter(isRenderable).forEach((child) => {
    const childDom = createDom(child);
    dom.appendChild(childDom);
  });

  return dom;
}

/**
 * isRenderable(child)
 *
 * 해당 child가 실제 DOM으로 렌더링 가능한 값인지 여부를 판단합니다.
 * - null, undefined, boolean은 의미 없는 값으로 간주되어 false를 반환합니다.
 * - 나머지 값들은 true를 반환하여 렌더링 대상이 됩니다.
 */
function isRenderable(child) {
  return !(child === null || child === undefined || typeof child === 'boolean');
}
