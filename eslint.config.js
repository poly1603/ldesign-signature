import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    vue: true,
    react: true,
    svelte: true,
    formatters: {
      css: true,
      html: true,
      markdown: 'prettier',
    },
    ignores: [
      '**/dist',
      '**/es',
      '**/lib',
      '**/*.d.ts',
      '**/node_modules',
      '**/coverage',
      '**/.vitepress/cache',
      '**/.vitepress/dist',
    ],
  },
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'ts/consistent-type-definitions': ['error', 'interface'],
      'vue/multi-word-component-names': 'off',
      'react/prop-types': 'off',
      'ts/no-explicit-any': 'warn',
    },
  },
)
