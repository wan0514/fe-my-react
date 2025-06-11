import { defineConfig } from 'vite';

export default defineConfig({
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
