//전역 타입 선언에 createElement 추가하가 위한 파일

export {};

declare global {
  interface Window {
    createElement: typeof import('../core/createElement').createElement;
    Fragment: any;
  }

  // 테스트 환경 대비
  namespace NodeJS {
    interface Global {
      createElement: typeof import('../core/createElement').createElement;
      Fragment: any;
    }
  }
}
