import js from '@eslint/js';
import react from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import vitest from 'eslint-plugin-vitest';

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
    files: ['**/*.test.js', '**/__tests__/**/*.js'],
    plugins: {
      vitest
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/expect-expect': 'off'
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals
      }
    }
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
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error'
    }
  },
  prettier
];
