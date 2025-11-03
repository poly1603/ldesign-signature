import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  jsx: true,
  ignores: [
    'dist',
    'es',
    'lib',
    '*.d.ts',
    'node_modules',
  ],
}, {
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'ts/consistent-type-definitions': ['error', 'interface'],
  },
})
