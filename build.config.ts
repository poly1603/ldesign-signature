/**
 * Build configuration for @ldesign/signature
 */

export default {
  entry: {
    index: './src/index.ts',
    'adapters/vue/index': './src/adapters/vue/index.ts',
    'adapters/react/index': './src/adapters/react/index.ts',
    'adapters/lit/index': './src/adapters/lit/index.ts',
  },
  external: ['vue', 'react', 'lit', '@ldesign/shared'],
  globals: {
    'vue': 'Vue',
    'react': 'React',
    'lit': 'Lit',
  },
  umdName: 'LDesignSignature',
};

