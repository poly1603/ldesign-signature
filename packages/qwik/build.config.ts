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
    '@builder.io/qwik',
    '@builder.io/qwik/jsx-runtime',
    '@ldesign/signature-core',
  ],
})
