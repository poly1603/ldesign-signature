import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    esbuild: {
      target: 'es2022',
    },
  },
  failOnWarn: false,
  externals: [
    'lit',
    'lit-html',
    '@lit/reactive-element',
    '@ldesign/signature-core',
  ],
})
