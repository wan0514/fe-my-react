/**
 * JSX 요소를 Virtual DOM(VNode) 객체로 변환합니다.
 *
 * 이 함수는 구조만 정의하며, 렌더링 여부는 별도 단계에서 판단됩니다.
 * React의 선언형 UI 구성 원리를 따릅니다.
 *
 * @function
 * @param {string | Function} type - 태그 문자열(e.g. 'div') 또는 함수형 컴포넌트
 * @param {Object|null} config - JSX에서 전달된 props 객체 (null일 수 있음)
 * @param {...any} children - 0개 이상의 자식 요소로 다음과 같이 처리됩니다:
 *   - 문자열(string)과 숫자(number)는 TEXT_ELEMENT로 래핑됩니다
 *   - 그 외의 값(null, undefined, boolean 등)은 판단하지 않고 그대로 포함됩니다
 *   - 유효한 children이 1개면 단일 값으로, 2개 이상이면 배열로 props.children에 저장됩니다
 *   - children이 0개인 경우 props.children은 정의되지 않습니다
 * @returns {{ type: string | Function, props: Object }} VNode 객체
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

  if (normalizedChildren.length === 1) {
    props.children = normalizedChildren[0];
  } else if (normalizedChildren.length > 1) {
    props.children = normalizedChildren;
  }

  return { type, props };
}

/**
 * 텍스트 콘텐츠를 Virtual DOM 형태로 래핑합니다.
 *
 * 문자열 또는 숫자 타입의 자식 요소를 TEXT_ELEMENT 타입으로 변환합니다.
 *
 * @function
 * @param {string | number} text - 텍스트 노드로 변환할 값
 * @returns {{ type: string, props: { nodeValue: string | number, children: [] } }} VNode 형태의 텍스트 요소
 */
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  };
}
