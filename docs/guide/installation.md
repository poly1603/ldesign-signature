# 安装

## 📦 包管理器安装

### npm

```bash
npm install @ldesign/signature
```

### pnpm (推荐)

```bash
pnpm add @ldesign/signature
```

### yarn

```bash
yarn add @ldesign/signature
```

## 🌐 CDN 使用

### UMD 版本

```html
<!-- 从 unpkg 加载 -->
<script src="https://unpkg.com/@ldesign/signature/lib/index.umd.js"></script>

<script>
  const { createSignaturePad } = window.LDesignSignature;
  const signature = createSignaturePad(canvas);
</script>
```

### ESM 版本

```html
<script type="module">
  import { createSignaturePad } from 'https://unpkg.com/@ldesign/signature/es/index.js';
  const signature = createSignaturePad(canvas);
</script>
```

## 🎯 框架集成

### Vue 3

```bash
pnpm add @ldesign/signature
```

```vue
<template>
  <SignaturePad />
</template>

<script setup>
import { SignaturePad } from '@ldesign/signature/vue';
</script>
```

### React

```bash
pnpm add @ldesign/signature
```

```tsx
import { SignaturePad } from '@ldesign/signature/react';

export default function App() {
  return <SignaturePad />;
}
```

### Lit (Web Component)

```bash
pnpm add @ldesign/signature
```

```html
<signature-pad></signature-pad>

<script type="module">
  import '@ldesign/signature/lit';
</script>
```

## 📋 依赖说明

### 核心库

核心库 **零依赖**，可在任何 JavaScript 环境使用。

### 框架适配器

框架适配器需要对应的框架作为 peer dependency：

- `@ldesign/signature/vue` - 需要 Vue 3.0+
- `@ldesign/signature/react` - 需要 React 16.8+
- `@ldesign/signature/lit` - 需要 Lit 2.0+

这些依赖是**可选的**，只在使用对应适配器时需要安装。

## 🔧 TypeScript 配置

如果使用 TypeScript，确保 `tsconfig.json` 包含：

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["node"]
  }
}
```

类型定义已包含在包中，无需额外安装 `@types` 包。

## 🛠️ 开发环境

### 推荐配置

- **Node.js**: >= 18.0.0
- **TypeScript**: >= 5.0.0
- **包管理器**: pnpm (推荐)

### Vite 项目

```bash
# 创建 Vite 项目
pnpm create vite my-signature-app --template vue-ts

cd my-signature-app
pnpm install

# 安装签名库
pnpm add @ldesign/signature
```

### Next.js 项目

```bash
npx create-next-app@latest my-signature-app
cd my-signature-app
npm install @ldesign/signature
```

## 📦 构建产物

包含以下构建产物：

- `es/` - ESM 格式（用于现代打包工具）
- `lib/` - CommonJS 格式（用于 Node.js）
- `es/index.d.ts` - TypeScript 类型定义

## 🔍 版本检查

```bash
# 查看已安装版本
npm list @ldesign/signature

# 查看最新版本
npm view @ldesign/signature version
```

## 📝 更新日志

查看 [CHANGELOG](/changelog) 了解每个版本的变更内容。

## ⚠️ 注意事项

### 浏览器兼容性

需要支持以下 Web API：
- Canvas API
- Pointer Events
- requestAnimationFrame

### 打包工具配置

如果使用 Webpack，确保正确处理 `.vue` 文件：

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
};
```

Vite 和 Rollup 无需额外配置。

## 🆘 获取帮助

如果在安装过程中遇到问题：

1. 检查 Node.js 版本 (需要 >= 18)
2. 清除缓存: `pnpm store prune` 或 `npm cache clean --force`
3. 删除 `node_modules` 重新安装
4. 查看 [GitHub Issues](https://github.com/ldesign/signature/issues)

