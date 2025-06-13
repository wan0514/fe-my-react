import inject from '@rollup/plugin-inject';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    inject({
      createElement: [
        path.resolve(__dirname, 'src/core/createElement'),
        'createElement'
      ]
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
