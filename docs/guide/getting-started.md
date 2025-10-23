# 快速开始

## 📦 安装

::: code-group

```bash [npm]
npm install @ldesign/signature
```

```bash [pnpm]
pnpm add @ldesign/signature
```

```bash [yarn]
yarn add @ldesign/signature
```

:::

## 🚀 5 分钟快速教程

### 步骤 1: 创建 HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>签名示例</title>
</head>
<body>
  <canvas id="signature-canvas" width="600" height="300"></canvas>
  <button onclick="signature.clear()">清空</button>
  <button onclick="download()">下载</button>
  
  <script type="module" src="/main.js"></script>
</body>
</html>
```

### 步骤 2: 初始化签名板

```typescript
// main.js
import { createSignaturePad } from '@ldesign/signature';

const canvas = document.getElementById('signature-canvas');

const signature = createSignaturePad(canvas, {
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
  smoothAlgorithm: 'catmull-rom',
});

// 导出为全局变量（供 HTML 按钮使用）
window.signature = signature;

window.download = () => {
  signature.download('my-signature', 'png');
};
```

### 步骤 3: 开始绘制

在 Canvas 上绘制您的签名，然后点击下载按钮！

## 🎯 Hello World

最简单的示例：

```typescript
import { createSignaturePad } from '@ldesign/signature';

const canvas = document.querySelector('canvas');
const sig = createSignaturePad(canvas);

// 就这么简单！
```

## 📱 框架快速开始

### Vue 3

```vue
<template>
  <SignaturePad :width="600" :height="300" />
</template>

<script setup>
import { SignaturePad } from '@ldesign/signature/vue';
</script>
```

### React

```tsx
import { SignaturePad } from '@ldesign/signature/react';

export default function App() {
  return <SignaturePad width={600} height={300} />;
}
```

### Lit

```html
<signature-pad width="600" height="300"></signature-pad>

<script type="module">
  import '@ldesign/signature/lit';
</script>
```

## 🎨 基础配置

```typescript
const signature = createSignaturePad(canvas, {
  // 尺寸
  width: 600,
  height: 300,
  
  // 笔触
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
  
  // 平滑
  smoothAlgorithm: 'catmull-rom',
  smoothTension: 0.5,
  
  // 压感
  pressureSensitive: true,
  
  // 事件
  onBegin: (e) => console.log('开始'),
  onChange: (e) => console.log('绘制中'),
  onEnd: (e) => console.log('结束'),
});
```

## 📤 导出签名

```typescript
// 导出 PNG
const png = signature.toDataURL('png');

// 导出 JPEG (高质量)
const jpeg = signature.toDataURL('jpeg', 0.95);

// 导出 SVG (矢量格式)
const svg = signature.toSVG();

// 导出 JSON (笔画数据)
const json = signature.toJSON();

// 直接下载
signature.download('signature', 'png');
```

## 🎯 基本操作

```typescript
// 清空签名
signature.clear();

// 撤销
signature.undo();

// 重做
signature.redo();

// 检查状态
if (signature.isEmpty()) {
  console.log('签名为空');
}

if (signature.canUndo()) {
  signature.undo();
}

if (signature.canRedo()) {
  signature.redo();
}
```

## ⚙️ 更新配置

```typescript
// 动态更新配置
signature.updateConfig({
  penColor: '#ff0000',
  maxWidth: 5,
});
```

## 🔄 导入/导出

```typescript
// 导出签名数据
const data = signature.toJSON();

// 保存到服务器或本地存储
localStorage.setItem('signature', JSON.stringify(data));

// 加载签名数据
const saved = JSON.parse(localStorage.getItem('signature'));
signature.fromJSON(saved);
```

## 🎉 下一步

- 📖 [基础用法](/guide/basic-usage) - 深入了解所有配置选项
- 🚀 [高级功能](/guide/advanced-features) - 探索回放、滤镜等高级功能
- 💻 [API 文档](/api/signature-pad) - 查看完整 API 参考
- 🎨 [示例代码](/examples/basic) - 学习更多实用示例

## ❓ 常见问题

### 如何适配移动端？

签名板已自动支持触摸事件，无需额外配置。建议设置合适的 Canvas 尺寸：

```typescript
const signature = createSignaturePad(canvas, {
  width: window.innerWidth - 40,
  height: 300,
});
```

### 如何保存签名到服务器？

```typescript
const dataUrl = signature.toDataURL('png');

// 上传到服务器
fetch('/api/save-signature', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ signature: dataUrl }),
});
```

### 如何验证签名不为空？

```typescript
if (signature.isEmpty()) {
  alert('请先签名！');
  return;
}

// 提交签名
submitSignature(signature.toDataURL('png'));
```

### 支持哪些浏览器？

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ iOS Safari 11+
- ✅ Android Chrome 60+

### 如何处理高 DPI 屏幕？

签名板已自动处理 DPI 缩放，无需额外配置。在 Retina 显示器上会自动渲染高清签名。

