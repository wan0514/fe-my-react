/**
 * createElement(type, config, ...children)
 *
 * JSX를 Virtual DOM(VNode) 객체로 변환하는 함수입니다.
 * 이 함수는 구조를 정의하는 데 집중하며, 각 노드의 렌더링 여부는
 * 렌더 단계에서 판단됩니다.
 *
 * - type: 태그 문자열(e.g. 'div') 또는 함수형 컴포넌트
 * - config: JSX에서 전달된 props 객체 (null일 수 있음)
 * - children: 0개 이상의 자식 요소로 다음과 같이 처리됩니다:
 *    - 문자열(string)과 숫자(number)는 TEXT_ELEMENT로 래핑됩니다
 *    - 그 외의 값(null, undefined, boolean 등)은 판단하지 않고 그대로 포함됩니다
 *    - 유효한 children이 1개면 단일 값으로, 2개 이상이면 배열로 props.children에 저장됩니다
 *    - children이 0개인 경우 props.children은 정의되지 않습니다
 *
 * 이 함수는 React의 선언형 철학을 반영하여 구조만 정의하고,
 * 렌더링 판단은 별도로 수행되도록 설계되었습니다.
 */
export function createElement(type, config, ...children) {
  const props = { ...config };

  const normalizedChildren = children
    .flat()
    .map((child) =>
      typeof child === 'string' || typeof child === 'number'
        ? createTextElement(child)
        : child
    );

  // children이 없는 경우 props.children은 정의하지 않음
  if (normalizedChildren.length === 1) {
    props.children = normalizedChildren[0];
  } else if (normalizedChildren.length > 1) {
    props.children = normalizedChildren;
  }

  return { type, props };
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  };
}
