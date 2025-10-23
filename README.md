# @ldesign/signature

<div align="center">

# ✍️ @ldesign/signature

**功能强大的手写签名组件**

Canvas 绘图 · 触摸支持 · 压力感应 · Catmull-Rom 平滑 · 多格式导出

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](./CHANGELOG.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](./tsconfig.json)
[![Platform](https://img.shields.io/badge/platform-Desktop%2BMobile-green.svg)](#特性)

</div>

---

## ✨ 特性

### 核心功能
- 🎨 **Canvas 绘图引擎** - 高性能实时渲染
- 🖱️ **鼠标 & 触摸支持** - 完整的 Pointer Events API
- 📱 **多点触控防误触** - 智能识别主触摸点
- ✏️ **压力感应** - Apple Pencil / Wacom / Surface Pen
- 🌊 **Catmull-Rom 平滑** - 高级样条曲线平滑算法
- ⚡ **点采样优化** - 智能距离/时间过滤
- 🎯 **动态笔触** - 速度-粗细自适应映射

### 操作功能
- ↩️ **撤销/重做** - 完整的历史管理（最多 50 步）
- 🗑️ **清空画布** - 一键清除签名
- 📊 **签名状态检测** - isEmpty / canUndo / canRedo

### 导出功能
- 🖼️ **PNG 导出** - 支持透明背景
- 📷 **JPEG 导出** - 质量可调
- 🎨 **SVG 导出** - 矢量格式
- 📦 **JSON 导出** - 完整笔画数据
- 💾 **一键下载** - 直接保存到本地

### 高级功能
- 🎨 **背景定制** - 纯色/图片/透明
- 💧 **水印支持** - 文字/图片水印
- ✂️ **签名裁剪** - 自动去除空白
- 📏 **签名缩放** - 智能适应尺寸
- 🗜️ **签名压缩** - 文件大小优化
- 🔍 **签名验证** - 相似度对比算法
- 📈 **特征提取** - 笔画分析

### 框架支持
- ⚛️ **React 组件** - 完整的 Hook 和组件封装
- 💚 **Vue 3 组件** - Composition API 和组件封装
- 📦 **原生 JavaScript** - 无框架依赖使用

---

## 📦 安装

```bash
npm install @ldesign/signature
# or
pnpm add @ldesign/signature
# or
yarn add @ldesign/signature
```

---

## 🚀 快速开始

### 原生 JavaScript

```typescript
import { createSignaturePad } from '@ldesign/signature';

const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;

const signature = createSignaturePad(canvas, {
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
  smoothAlgorithm: 'catmull-rom',
  pressureSensitive: true,
});

// 清空
signature.clear();

// 撤销/重做
signature.undo();
signature.redo();

// 导出
const pngDataUrl = signature.toDataURL('png');
const svgString = signature.toSVG();
const jsonData = signature.toJSON();

// 下载
signature.download('my-signature', 'png');
```

### Vue 3

```vue
<template>
  <SignaturePad
    ref="signatureRef"
    :width="600"
    :height="300"
    pen-color="#0066ff"
    :min-width="1"
    :max-width="3"
    :show-controls="true"
    @begin="onBegin"
    @change="onChange"
    @end="onEnd"
  />
  
  <button @click="handleExport">导出</button>
</template>

<script setup>
import { ref } from 'vue';
import { SignaturePad } from '@ldesign/signature/vue';

const signatureRef = ref(null);

const handleExport = () => {
  const dataUrl = signatureRef.value.toDataURL('png');
  console.log('导出签名:', dataUrl);
};

const onBegin = (e) => console.log('开始绘制', e);
const onChange = (e) => console.log('绘制中', e);
const onEnd = (e) => console.log('结束绘制', e);
</script>
```

或使用 Composable：

```vue
<script setup>
import { useSignature } from '@ldesign/signature/vue';

const {
  canvasRef,
  isEmpty,
  canUndo,
  canRedo,
  clear,
  undo,
  redo,
  toDataURL,
  toSVG,
  download,
} = useSignature({
  width: 600,
  height: 300,
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
});
</script>

<template>
  <div>
    <canvas ref="canvasRef"></canvas>
    <button @click="clear" :disabled="isEmpty">清空</button>
    <button @click="undo" :disabled="!canUndo">撤销</button>
    <button @click="redo" :disabled="!canRedo">重做</button>
    <button @click="() => download('signature', 'png')">下载</button>
  </div>
</template>
```

### React

```tsx
import React, { useRef } from 'react';
import { SignaturePad, SignaturePadRef } from '@ldesign/signature/react';

function App() {
  const signatureRef = useRef<SignaturePadRef>(null);
  
  const handleExport = () => {
    if (signatureRef.current) {
      const dataUrl = signatureRef.current.toDataURL('png');
      console.log('导出签名:', dataUrl);
    }
  };
  
  return (
    <div>
      <SignaturePad
        ref={signatureRef}
        width={600}
        height={300}
        penColor="#0066ff"
        minWidth={1}
        maxWidth={3}
        showControls={true}
        onBegin={(e) => console.log('开始', e)}
        onChange={(e) => console.log('绘制中', e)}
        onEnd={(e) => console.log('结束', e)}
      />
      
      <button onClick={handleExport}>导出</button>
    </div>
  );
}
```

或使用 Hook：

```tsx
import React from 'react';
import { useSignature } from '@ldesign/signature/react';

function App() {
  const {
    canvasRef,
    isEmpty,
    canUndo,
    canRedo,
    clear,
    undo,
    redo,
    download,
  } = useSignature({
    width: 600,
    height: 300,
    penColor: '#000000',
  });
  
  return (
    <div>
      <canvas ref={canvasRef} />
      <button onClick={clear} disabled={isEmpty}>清空</button>
      <button onClick={undo} disabled={!canUndo}>撤销</button>
      <button onClick={redo} disabled={!canRedo}>重做</button>
      <button onClick={() => download('signature', 'png')}>下载</button>
    </div>
  );
}
```

---

## ⚙️ 配置选项

```typescript
interface SignatureConfig {
  // 尺寸
  width?: number;              // Canvas 宽度
  height?: number;             // Canvas 高度
  
  // 笔触
  penColor?: string;           // 笔触颜色 (default: '#000000')
  minWidth?: number;           // 最小笔触宽度 (default: 0.5)
  maxWidth?: number;           // 最大笔触宽度 (default: 2.5)
  dotSize?: number;            // 单点大小 (default: 2)
  
  // 平滑
  smoothAlgorithm?: 'catmull-rom' | 'bezier-quadratic' | 'bezier-cubic' | 'none';
  smoothTension?: number;      // 平滑张力 0-1 (default: 0.5)
  
  // 捕获
  minPointDistance?: number;   // 最小点间距 (default: 5)
  throttle?: number;           // 节流时间 ms (default: 16)
  velocityFilterWeight?: number; // 速度过滤权重 (default: 0.7)
  
  // 压感
  pressureSensitive?: boolean; // 启用压力感应 (default: true)
  
  // 历史
  maxHistorySize?: number;     // 最大历史记录数 (default: 50)
  
  // 背景
  background?: {
    type: 'color' | 'image' | 'transparent';
    color?: string;
    imageUrl?: string;
    imageFit?: 'cover' | 'contain' | 'fill';
  };
  
  // 水印
  watermark?: {
    text?: string;
    imageUrl?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity?: number;
    fontSize?: number;
    color?: string;
  };
  
  // 事件
  onBegin?: (event: PointerEvent) => void;
  onChange?: (event: PointerEvent) => void;
  onEnd?: (event: PointerEvent) => void;
}
```

---

## 🛠️ API

### SignaturePad 实例方法

```typescript
// 操作
clear(): void                    // 清空画布
undo(): void                     // 撤销
redo(): void                     // 重做
isEmpty(): boolean               // 是否为空
canUndo(): boolean              // 能否撤销
canRedo(): boolean              // 能否重做

// 导出
toDataURL(format?: 'png' | 'jpeg', quality?: number): string
toSVG(): string
toJSON(): SignatureData
download(fileName?: string, format?: 'png' | 'jpeg' | 'svg' | 'json', quality?: number): void

// 导入
fromJSON(data: SignatureData): void

// 配置
updateConfig(config: Partial<SignatureConfig>): void
getCanvas(): HTMLCanvasElement
setEnabled(enabled: boolean): void
isEnabled(): boolean
destroy(): void
```

### 工具函数

```typescript
// 平滑算法
import { smoothPoints, catmullRomSpline, quadraticBezier, cubicBezier } from '@ldesign/signature';

// 裁剪
import { cropSignature, trimSignature, detectBoundingBox } from '@ldesign/signature';

// 缩放
import { scaleSignature, resizeSignature, scaleSignatureByPercent } from '@ldesign/signature';

// 压缩
import { compressSignature, optimizeSignatureForWeb, dataUrlToBlob } from '@ldesign/signature';

// 验证
import { compareSignatures, validateSignature, extractFeatures, calculateComplexityScore } from '@ldesign/signature';
```

---

## 🎯 使用场景

- 📝 **电子签名** - 合同、协议签署
- 💳 **支付确认** - POS 机、移动支付
- 📋 **表单签名** - 在线表单、问卷
- 🏥 **医疗记录** - 处方签名、同意书
- 📦 **物流签收** - 快递签名确认
- 🎨 **手写输入** - 手写识别、涂鸦板
- 🖼️ **艺术创作** - 数字绘画、签名设计

---

## 🌟 特性亮点

### 1. 高级平滑算法
采用 **Catmull-Rom 样条曲线** 平滑算法（参考 smooth-signature），提供媲美专业绘图软件的平滑效果。

### 2. 压力感应支持
完整支持 Apple Pencil、Wacom、Surface Pen 等压感设备，笔触粗细随压力动态变化。

### 3. 智能速度映射
根据绘制速度自动调整笔触粗细，慢速绘制更粗，快速绘制更细，模拟真实书写。

### 4. 多格式导出
支持 PNG、JPEG、SVG、JSON 四种格式，满足不同场景需求。

### 5. 框架无关
核心库无任何依赖，可在任意 JavaScript 环境使用。Vue 和 React 适配器为可选依赖。

---

## 📄 许可证

MIT License © 2025 LDesign Team

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📚 相关链接

- [GitHub Repository](https://github.com/ldesign/signature)
- [Documentation](https://ldesign.github.io/signature)
- [Changelog](./CHANGELOG.md)
- [Examples](./examples)
