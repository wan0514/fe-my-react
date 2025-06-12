import js from '@eslint/js';
import react from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      '.vite/',
      '.env',
      'public/',
      '*.config.js'
    ]
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
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
