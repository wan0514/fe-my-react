/**
 * 특정 식별자가 JSX 코드 내에서 사용될 때 자동으로 import 문을 삽입하는 Vite/Rollup용 플러그인입니다.
 *
 * 예를 들어 JSX 내에서 `createElement`가 사용되었지만 import되지 않은 경우,
 * `import { createElement } from '...'` 구문을 자동으로 추가합니다.
 *
 * @function
 * @param {{ identifier: string, from: string }} options - 자동 import할 식별자 이름과 import 경로
 * @returns {import('vite').Plugin} Vite/Rollup 플러그인 객체
 */
export default function autoImportPlugin({ identifier, from }) {
  return {
    name: `auto-import-${identifier}`,
    transform(code, id) {
      if (!id.endsWith('.jsx')) return;
      if (code.includes(`import { ${identifier} }`)) return;

      const importStatement = `import { ${identifier} } from '${from}';\n`;
      const newCode = importStatement + code;

      return {
        code: newCode,
        map: null
      };
    }
  };
}
