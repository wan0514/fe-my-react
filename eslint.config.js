import js from '@eslint/js';
import react from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';

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
