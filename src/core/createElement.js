/**
 * createElement(type, config, ...children)
 *
 * JSX가 변환된 결과를 받아 Virtual DOM 객체(VNode)를 생성하는 함수.
 * React의 createElement와 동일한 인터페이스를 따르며, 내부에서는
 * config를 기반으로 props 객체를 구성하고 children을 props.children에 포함시킨다.
 *
 * - type: 문자열 태그명(e.g., 'div') 또는 함수형 컴포넌트
 * - config: JSX 속성 객체. 일반적으로 props에 해당하며, null일 수 있음
 * - children: 0개 이상 전달될 수 있으며, 다음 규칙에 따라 처리됨
 *    - 0개: props.children을 설정하지 않음
 *    - 1개: 단일 값으로 props.children에 저장
 *    - 2개 이상: 배열로 props.children에 저장
 *
 * React의 철학(선언형 UI, 직관적 데이터 흐름)을 반영하여,
 * JSX 구조와 VNode 구조가 자연스럽게 매핑되도록 설계됨
 */
export function createElement(type, config, ...children) {
  const props = { ...config };

  if (children.length === 1) {
    props.children = children[0];
  } else if (children.length > 1) {
    props.children = children;
  }

  return { type, props };
}
