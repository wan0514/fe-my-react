/**
 * @param {{ identifier: string, from: string }} options
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
