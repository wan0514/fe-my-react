import js from '@eslint/js';
import react from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';
import babelParser from '@babel/eslint-parser';

export default [
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        requireConfigFile: false
      }
    }
  },
  js.configs.recommended,
  {
    plugins: {
      react
    },
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  },
  prettier
];
