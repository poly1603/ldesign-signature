import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: true,
    host: true
  },
  resolve: {
    alias: {
      '@ldesign/signature/vue': path.resolve(__dirname, '../../src/adapters/vue/index.ts'),
      '@ldesign/signature': path.resolve(__dirname, '../../src/index.ts'),
    },
  },
});

