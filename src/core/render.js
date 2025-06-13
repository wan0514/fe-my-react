/**
 * Virtual DOM(VNode)을 실제 DOM으로 변환하여 container에 마운트합니다.
 * React의 렌더링 방식과 유사하게 동작하며, 함수형 컴포넌트도 처리합니다.
 *
 * 처리 방식:
 * - null, undefined, boolean과 같은 의미 없는 vnode는 렌더링하지 않고 무시됩니다
 * - 함수형 컴포넌트는 실행하여 실제 vnode로 변환한 뒤 재귀적으로 렌더링됩니다
 * - 일반 태그나 텍스트 vnode는 createDom을 통해 실제 DOM 노드로 변환되어 container에 추가됩니다
 *
 * @function
 * @param {Object} vnode - Virtual DOM 객체 (문자열 태그, 함수형 컴포넌트, TEXT_ELEMENT 등)
 * @param {HTMLElement} container - 렌더링 결과를 삽입할 실제 DOM 노드
 * 이 함수는 별도 값을 반환하지 않습니다.
 * @returns {void}
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
    return render(evaluateFunctionComponent(vnode), container);
  }

  const dom = createDom(vnode);
  container.appendChild(dom);
}

/**
 * Virtual DOM 노드를 실제 DOM 노드로 변환합니다.
 *
 * 처리 방식:
 * - 함수형 컴포넌트는 실행 결과를 다시 vnode로 변환하여 재귀 처리됩니다.
 * - TEXT_ELEMENT는 `document.createTextNode`로 생성됩니다.
 * - 일반 태그는 `document.createElement`로 생성하고 props를 DOM 속성으로 설정합니다.
 * - children은 배열로 표준화한 뒤, 각 항목을 재귀적으로 DOM으로 변환하여 자식으로 추가합니다.
 *
 * @function
 * @param {Object} vnode - 변환할 Virtual DOM 노드
 * @returns {Node} 변환된 실제 DOM 노드
 */
function createDom(vnode) {
  // 함수형 컴포넌트면 먼저 실행해서 vnode를 얻고 다시 처리
  if (typeof vnode.type === 'function') {
    return createDom(evaluateFunctionComponent(vnode));
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
 * 주어진 child가 실제 DOM으로 렌더링 가능한 값인지 여부를 판단합니다.
 *
 * 처리 방식:
 * - null, undefined, boolean 값은 무시되며 렌더링되지 않습니다.
 * - 숫자, 문자열, 객체 등은 렌더링 가능한 값으로 간주됩니다.
 *
 * @function
 * @param {*} child - 검사할 값
 * @returns {boolean} 렌더링 가능한 값이면 true, 그렇지 않으면 false
 */
function isRenderable(child) {
  return !(child === null || child === undefined || typeof child === 'boolean');
}

/**
 * 함수형 컴포넌트를 실제 vnode로 평가합니다.
 *
 * 처리 방식:
 * - vnode.type이 함수일 경우, 해당 함수를 실행하여 반환된 vnode를 반환합니다.
 * - 이 vnode는 다시 createDom 또는 render 함수에 의해 처리됩니다.
 *
 * @function
 * @param {Object} vnode - type이 함수인 Virtual DOM 노드
 * @returns {Object} 평가된 Virtual DOM 노드
 */
function evaluateFunctionComponent(vnode) {
  return vnode.type(vnode.props);
}
