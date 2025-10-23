import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '@ldesign/signature',
  description: '功能强大的手写签名组件',
  base: '/signature/',

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/signature-pad' },
      { text: '功能', link: '/features/replay' },
      { text: '框架', link: '/frameworks/vue' },
      { text: '示例', link: '/examples/basic' },
      {
        text: 'v0.3.0',
        items: [
          { text: '更新日志', link: '/changelog' },
          { text: 'GitHub', link: 'https://github.com/ldesign/signature' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
          ]
        },
        {
          text: '使用',
          items: [
            { text: '基础用法', link: '/guide/basic-usage' },
            { text: '高级功能', link: '/guide/advanced-features' },
            { text: '最佳实践', link: '/guide/best-practices' },
          ]
        }
      ],

      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: 'SignaturePad', link: '/api/signature-pad' },
            { text: '配置选项', link: '/api/config' },
            { text: '方法', link: '/api/methods' },
            { text: '事件', link: '/api/events' },
            { text: '类型定义', link: '/api/types' },
          ]
        }
      ],

      '/features/': [
        {
          text: '功能特性',
          items: [
            { text: '签名回放', link: '/features/replay' },
            { text: '笔触样式', link: '/features/brush-styles' },
            { text: '网格辅助', link: '/features/grid' },
            { text: '本地存储', link: '/features/storage' },
            { text: '图像滤镜', link: '/features/filters' },
          ]
        }
      ],

      '/frameworks/': [
        {
          text: '框架集成',
          items: [
            { text: 'Vue 3', link: '/frameworks/vue' },
            { text: 'React', link: '/frameworks/react' },
            { text: 'Lit', link: '/frameworks/lit' },
            { text: 'Vanilla JS', link: '/frameworks/vanilla' },
          ]
        }
      ],

      '/examples/': [
        {
          text: '示例代码',
          items: [
            { text: '基础示例', link: '/examples/basic' },
            { text: '高级示例', link: '/examples/advanced' },
            { text: 'Vue 示例', link: '/examples/vue-examples' },
            { text: 'React 示例', link: '/examples/react-examples' },
            { text: 'Lit 示例', link: '/examples/lit-examples' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ldesign/signature' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 LDesign Team'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/ldesign/signature/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
  },

  markdown: {
    lineNumbers: true,
  },
});

