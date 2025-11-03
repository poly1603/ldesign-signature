import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LDesignSignatureVue',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue', '@ldesign/signature-core', '@vueuse/core'],
      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
})
