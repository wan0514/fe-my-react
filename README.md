# MyReact: 바닐라 JS로 구현한 React Core

> React의 핵심 개념을 직접 구현하며 동작 원리를 이해하는 프로젝트입니다.

## 프로젝트 목표

이 프로젝트는 React의 내부 동작 방식을 학습하고, 직접 구현해보는 데 목적이 있습니다.  
JSX 파싱부터 컴포넌트 시스템, 상태 관리, 이벤트 위임, 가상 DOM, (선택적으로) SPA 라우터까지 구현합니다.  
궁극적으로 이 프레임워크를 기반으로 간단한 Todo 앱을 제작하는 것이 목표입니다.

## 기술 스택

- Vanilla JavaScript (외부 라이브러리 최소화)
- Vite + Babel 기반 개발 환경
- Vitest를 이용한 테스트 프레임워크
- ESLint Flat Config, Prettier를 통한 코드 스타일 통일

## 디렉토리 구조

```
src/
├── plugins/           # Plugin 구현
├── core/              # React 핵심 기능 직접 구현
│   ├── createElement.js
│   ├── render.js
│   └── ...
├── components/        # 실습용 컴포넌트
├── pages/             # SPA 라우팅이 적용되는 페이지
├── app/               # 진입점 및 공통 설정
│   └── main.jsx
├── __tests__/             # 테스트 파일
└── ...
```

## 프로젝트 설계 문서 (Wiki)

본 프로젝트의 진행 과정에서 도출된 설계 의도, 주요 고민, 구현 전략은 모두 Wiki 문서에 정리되어 있습니다.

읽어보세요:  
[프로젝트 문서 보기](https://github.com/wan0514/fe-my-react/wiki)

## 프로젝트 관리

이 프로젝트는 GitHub Projects를 활용해 Task와 일정을 관리하고 있습니다.  
진행 중인 기능, 우선순위, 완료된 항목은 아래 보드를 통해 확인할 수 있습니다.

👉 [GitHub Projects 보드 보기](https://github.com/users/wan0514/projects/5)

## 진행 상황 (마일스톤 기반)

- [x] 개발 환경 구성 (Vite, Babel, ESLint, Prettier, Vitest)
- [x] JSX → createElement 트랜스파일러 연동
- [x] 컴포넌트 시스템 구현
- [ ] 이벤트 위임 방식 도입
- [ ] 상태 관리 및 리렌더링 시스템 구축
- [ ] (선택) 가상 DOM 및 diff 알고리즘
- [ ] (선택) SPA 라우터
- [ ] Todo App 완성

## 테스트

CI 환경에서 자동으로 다음을 검사합니다:

- ESLint/Prettier 통과 여부
- Vitest 기반 유닛 테스트 통과 여부
- 빌드 성공 여부

```bash
npm run lint
npm run test
npm run build
```

## 이 프로젝트를 통해 배우는 것

- 선언형 UI 프로그래밍의 본질
- React의 데이터 흐름과 렌더링 사이클
- 직접 구현하며 깨닫는 Virtual DOM의 장단점
- 상태 관리의 필요성과 적절한 설계 방식

---

이 프로젝트는 학습용으로 제작되었으며, 프레임워크 개발을 통해 React의 본질을 체득하고자 하는 목적을 갖습니다.
