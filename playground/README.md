# Signature Pad Playground

这是 `@ldesign/signature` 签名组件库的交互式演示项目，展示了原生 JavaScript 和 Vue 组件两种使用方式。

## 功能特性

- 🖊️ **Vue 组件演示** - 使用 `@ldesign/signature-vue` 的完整功能展示
- 📜 **原生 JS 演示** - 直接使用 `@ldesign/signature-core` 核心库
- 🎨 **丰富配置** - 颜色、粗细、背景等可调参数
- 📱 **响应式设计** - 适配桌面、平板和手机
- 🌈 **现代 UI** - 使用 Tailwind CSS + Lucide 图标

## 快速开始

```bash
# 在 signature 根目录
pnpm install

# 构建依赖包
pnpm build

# 运行 playground
pnpm dev:playground
```

或者：

```bash
# 直接进入 playground 目录
cd playground
pnpm install
pnpm dev
```

## 项目结构

```
playground/
├── src/
│   ├── App.vue          # 主应用组件
│   ├── main.ts          # 入口文件
│   ├── style.css        # 全局样式
│   └── vite-env.d.ts    # 类型声明
├── index.html           # HTML 模板
├── package.json
├── vite.config.ts       # Vite 配置
├── tailwind.config.js   # Tailwind 配置
├── postcss.config.js    # PostCSS 配置
└── tsconfig.json        # TypeScript 配置
```

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **TypeScript** - JavaScript 的超集
- **Tailwind CSS** - 原子化 CSS 框架
- **Lucide Vue** - 精美图标库

## 演示内容

### Vue 组件使用

```vue
<template>
  <SignaturePad
    ref="signaturePad"
    :width="600"
    :height="200"
    pen-color="#000000"
    background-color="#ffffff"
    placeholder="请在此处签名"
    @end="onSignEnd"
  />
</template>

<script setup>
import { ref } from 'vue';
import { SignaturePad } from '@ldesign/signature-vue';

const signaturePad = ref(null);

const onSignEnd = () => {
  const dataUrl = signaturePad.value.toDataURL('png');
  console.log(dataUrl);
};
</script>
```

### 原生 JavaScript 使用

```javascript
import { createSignaturePad } from '@ldesign/signature-core';

const canvas = document.getElementById('signature-canvas');

const signaturePad = createSignaturePad(canvas, {
  width: 600,
  height: 200,
  penColor: '#000000',
  background: {
    type: 'color',
    color: '#ffffff',
  },
});

// 导出签名
const dataUrl = signaturePad.toDataURL('png');

// 下载签名
signaturePad.download('my-signature', 'png');
```

## 开发

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 预览构建结果
pnpm preview
```
