import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
  failOnWarn: false,
  externals: [
    'solid-js',
    'solid-js/web',
    'solid-js/store',
    '@ldesign/signature-core',
  ],
})
