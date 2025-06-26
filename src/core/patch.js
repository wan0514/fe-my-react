import { createDom } from './render';
// src/core/render.js

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
    const prevText = dom.__vnode.props.nodeValue; // 이전 텍스트
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

  // 4) children diff & patch (인덱스 기반 단순 매칭)
  const prevChildren = Array.isArray(prevProps.children)
    ? prevProps.children
    : [prevProps.children];
  const nextChildren = Array.isArray(nextProps.children)
    ? nextProps.children
    : [nextProps.children];

  const maxLen = Math.max(prevChildren.length, nextChildren.length);
  for (let i = 0; i < maxLen; i++) {
    const oldChildDom = dom.childNodes[i];
    const prevC = prevChildren[i];
    const nextC = nextChildren[i];

    if (prevC != null && nextC != null) {
      // 양쪽 모두 있을 땐 재귀 패치
      patch(oldChildDom, nextC);
    } else if (nextC != null) {
      // 새로 추가된 자식
      dom.appendChild(createDom(nextC));
    } else if (prevC != null) {
      // 제거된 자식
      dom.removeChild(oldChildDom);
      i--; // 인덱스 보정
    }
  }

  // 5) __vnode 업데이트
  dom.__vnode = nextVNode;
  return dom;
}
