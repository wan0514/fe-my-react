import { defineConfig } from 'vite';
import autoImportPlugin from './plugins/autoImportPlugin.js';

export default defineConfig({
  plugins: [
    autoImportPlugin({
      identifier: 'createElement',
      from: 'src/core/createElement'
    })
  ],
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'createElement',
    jsxFragment: 'Fragment'
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
