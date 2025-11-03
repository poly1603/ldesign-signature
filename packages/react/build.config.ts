import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
  failOnWarn: false,
  externals: [
    'react',
    'react-dom',
    '@ldesign/signature-core',
    'classnames',
  ],
})
