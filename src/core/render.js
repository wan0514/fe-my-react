import { isEventHandler } from './utils/dom';
import { setCurrentState } from './context';
import { getComponentState, setComponentState } from './componentState';
import { initEventDelegation } from './event';

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
    const evaluatedVNode = renderFunctionComponent(vnode);
    const dom = createDom(evaluatedVNode);

    // 컴포넌트 상태에 루트 DOM 저장
    const state = getComponentState(vnode.type);
    if (state) state.dom = dom;

    container.appendChild(dom);
    initEventDelegation(container);
    return;
  }

  const dom = createDom(vnode);
  container.appendChild(dom);

  // 이벤트 위임 초기화
  initEventDelegation(container);
}

/**
 * Virtual DOM 노드를 실제 DOM 노드로 변환합니다.
 *
 * 처리 방식:
 * - 함수형 컴포넌트는 실행 결과를 다시 vnode로 변환하여 재귀 처리됩니다.
 * - TEXT_ELEMENT는 document.createTextNode로 생성됩니다.
 * - 일반 태그는 document.createElement로 생성하고 props를 DOM 속성으로 설정합니다.
 * - children은 배열로 표준화한 뒤, 각 항목을 재귀적으로 DOM으로 변환하여 자식으로 추가합니다.
 *
 * @function
 * @param {Object} vnode - 변환할 Virtual DOM 노드
 * @returns {Node} 변환된 실제 DOM 노드
 */
function createDom(vnode) {
  // 함수형 컴포넌트면 먼저 실행해서 vnode를 얻고 다시 처리
  if (typeof vnode.type === 'function') {
    const evaluatedVNode = renderFunctionComponent(vnode);
    const dom = createDom(evaluatedVNode);
    // 컴포넌트 상태에 최신 루트 DOM 저장
    const state = getComponentState(vnode.type);
    if (state) state.dom = dom;
    return dom;
  }

  // TEXT_ELEMENT 처리
  if (vnode.type === 'TEXT_ELEMENT') {
    return document.createTextNode(vnode.props.nodeValue);
  }

  const { type, props } = vnode;
  const dom = document.createElement(type);

  // prop 설정 (className, 기타 속성 처리)
  for (const key in props) {
    const value = props[key];

    if (isEventHandler(key)) {
      continue; // 이벤트 핸들러는 DOM 속성에 추가하지 않음
    }

    if (key === 'className') {
      dom.className = value;
    } else if (key !== 'children') {
      dom.setAttribute(key, value);
    }
  }

  // children 배열로 표준화
  const children = Array.isArray(props.children)
    ? props.children
    : [props.children];

  // vnode 참조 저장
  dom.__vnode = vnode;

  // 재귀적으로 자식 랜더링
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
 * 함수형 컴포넌트를 실행하여 실제 Virtual DOM 노드(vnode)를 평가합니다.
 *
 * 처리 방식:
 * - vnode.type이 함수인 경우, 해당 함수를 실행하여 반환된 vnode를 리턴합니다.
 * - 각 함수형 컴포넌트는 고유한 상태 저장소(state)를 가집니다.
 * - 컴포넌트가 렌더링되는 시점에 해당 상태를 현재 렌더링 컨텍스트에 설정합니다.
 * - 반환된 vnode는 이후 createDom 또는 render 함수에서 처리되어 실제 DOM으로 변환됩니다.
 *
 * @function
 * @param {Object} vnode - type이 함수인 Virtual DOM 노드
 * @returns {Object} 평가된 Virtual DOM 노드
 */
function renderFunctionComponent(vnode) {
  let state = getComponentState(vnode.type);
  if (!state) state = initComponentInstance(vnode);
  // props 동기화
  state.props = vnode.props;
  // 훅 컨텍스트 준비
  prepareHookContext(state);
  return state.componentType(state.props);
}

/**
 * 훅 컨텍스트를 준비하고 hookIndex를 초기화하며, 현재 상태를 설정합니다.
 *
 * @param {Object} state - 컴포넌트 인스턴스 상태 객체
 */
function prepareHookContext(state) {
  state.hookIndex = 0;
  setCurrentState(state);
}

/**
 * 컴포넌트 인스턴스의 상태를 초기화하고, 재렌더링 콜백을 생성합니다.
 *
 * @param {Object} vnode - 함수형 컴포넌트의 Virtual DOM 노드
 * @returns {Object} 초기화된 컴포넌트 상태 객체
 */
function initComponentInstance(vnode) {
  const state = {
    componentType: vnode.type,
    props: vnode.props,
    hookIndex: 0,
    stateBucket: [],
    dom: null,
    rerender: null
  };
  state.rerender = createRerenderCallback(state);
  setComponentState(vnode.type, state);
  return state;
}

/**
 * 컴포넌트를 다시 호출하여 새로운 VNode를 생성하고, 기존 DOM을 교체하는 재렌더링 콜백을 생성합니다.
 *
 * @param {Object} state - 컴포넌트 인스턴스 상태 객체
 * @returns {Function} 재렌더링을 수행하는 콜백 함수
 */
function createRerenderCallback(state) {
  return () => {
    prepareHookContext(state);
    const nextVNode = state.componentType(state.props);
    const nextDom = createDom(nextVNode);
    const oldDom = state.dom; // 이전 루트 DOM
    oldDom.replaceWith(nextDom); // 안전하게 교체
    state.dom = nextDom; // 상태에 갱신
  };
}
