import { createDom } from './render';

/**
 * 이전에 붙여둔 dom.__vnode와 nextVNode를 비교·패치합니다.
 * - 태그가 바뀌면 통째로 교체
 * - 텍스트 노드는 nodeValue만 업데이트
 * - 일반 엘리먼트는 props와 children만 부분 업데이트
 *
 * @param {Node} dom       이전에 render 또는 patch로 생성된 실제 DOM 노드
 * @param {Object} nextVNode 새로 생성된 VNode
 * @returns {Node} 패치된(혹은 교체된) DOM 노드
 */
export function patch(dom, nextVNode) {
  // 1) 타입이 다르면 완전 교체
  if (dom.__vnode.type !== nextVNode.type) {
    const newDom = createDom(nextVNode);
    dom.replaceWith(newDom);
    return newDom;
  }

  if (nextVNode.type === 'TEXT_ELEMENT') {
    const prevText = dom.__vnode.props.nodeValue;
    const nextText = nextVNode.props.nodeValue;
    if (prevText !== nextText) {
      dom.nodeValue = nextText;
    }
    dom.__vnode = nextVNode;
    return dom;
  }

  // 3) props diff & patch
  const prevProps = dom.__vnode.props;
  const nextProps = nextVNode.props;

  // 3.1) 제거된 prop 처리
  for (const name in prevProps) {
    if (name === 'children' || name === 'key') continue;
    if (!(name in nextProps)) {
      if (name === 'className') {
        dom.className = '';
      } else if (name === 'value') {
        dom.value = '';
      } else {
        dom.removeAttribute(name);
      }
    }
  }

  // 3.2) 새로나온/변경된 prop 처리
  for (const name in nextProps) {
    if (name === 'children' || name === 'key') continue;
    const prev = prevProps[name];
    const next = nextProps[name];
    if (prev === next) continue;

    if (name === 'className') {
      dom.className = next;
    } else if (name === 'value') {
      dom.value = next;
    } else {
      dom.setAttribute(name, next);
    }
  }

  // 4) children diff & patch (key 기반 매칭)

  // prev/next children VNode 배열에서 null/false 제거
  const prevChildren = (
    Array.isArray(dom.__vnode.props.children)
      ? dom.__vnode.props.children
      : [dom.__vnode.props.children]
  ).filter((c) => c != null && c !== false);

  const nextChildren = (
    Array.isArray(nextProps.children)
      ? nextProps.children
      : [nextProps.children]
  ).filter((c) => c != null && c !== false);

  // 기존 DOM 노드들을 key 또는 인덱스를 키로 하는 맵으로 준비
  const existingMap = new Map();
  dom.childNodes.forEach((childDom, idx) => {
    const prevVNodeChild = prevChildren[idx];
    const key =
      prevVNodeChild && prevVNodeChild.props.key != null
        ? prevVNodeChild.props.key
        : idx;
    existingMap.set(key, childDom);
  });

  // nextChildren 순서로 패치 및 신규 엘리먼트 추가
  nextChildren.forEach((childVNode, idx) => {
    const key = childVNode.props.key != null ? childVNode.props.key : idx;
    const matchedDom = existingMap.get(key);
    if (matchedDom) {
      patch(matchedDom, childVNode);
      existingMap.delete(key);
    } else {
      const newDom = createDom(childVNode);
      dom.appendChild(newDom);
    }
  });

  // 새 자식들에 포함되지 않은 기존 DOM은 모두 제거
  existingMap.forEach((childDom) => {
    dom.removeChild(childDom);
  });

  // 5) __vnode 업데이트
  dom.__vnode = nextVNode;
  return dom;
}
