import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3003,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});

