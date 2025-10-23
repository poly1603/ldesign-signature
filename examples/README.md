# @ldesign/signature - 使用示例

本目录包含 @ldesign/signature 的各种使用示例。

## 📁 文件说明

### basic.html
基础功能演示，包括：
- Canvas 绘图
- 配置面板（笔触颜色、粗细、平滑算法）
- 控制按钮（清空、撤销、重做）
- 多格式导出（PNG、JPEG、SVG、JSON）
- 导出预览
- 功能特性介绍

## 🚀 运行示例

### 方法 1: 直接打开（仅用于查看结构）
```bash
# 直接在浏览器中打开 basic.html
open examples/basic.html
```

注意：直接打开只能看到页面结构和说明，无法运行实际功能。

### 方法 2: 构建后使用（完整功能）

#### 步骤 1: 构建库
```bash
cd libraries/signature
pnpm install
pnpm build
```

#### 步骤 2: 创建测试项目
```bash
mkdir test-signature
cd test-signature
npm init -y
npm install ../libraries/signature
```

#### 步骤 3: 创建 HTML 文件
```html
<!DOCTYPE html>
<html>
<head>
  <title>Signature Test</title>
</head>
<body>
  <canvas id="signature" width="600" height="300"></canvas>
  <button onclick="signature.clear()">清空</button>
  <button onclick="signature.undo()">撤销</button>
  <button onclick="signature.redo()">重做</button>
  <button onclick="download()">下载</button>
  
  <script type="module">
    import { createSignaturePad } from '@ldesign/signature';
    
    const canvas = document.getElementById('signature');
    window.signature = createSignaturePad(canvas, {
      penColor: '#000000',
      minWidth: 0.5,
      maxWidth: 2.5,
      smoothAlgorithm: 'catmull-rom',
    });
    
    window.download = () => {
      signature.download('my-signature', 'png');
    };
  </script>
</body>
</html>
```

## 📚 更多示例

### 原生 JavaScript

```javascript
import { createSignaturePad } from '@ldesign/signature';

const canvas = document.getElementById('canvas');
const signature = createSignaturePad(canvas, {
  width: 600,
  height: 300,
  penColor: '#0066ff',
  minWidth: 1,
  maxWidth: 3,
  smoothAlgorithm: 'catmull-rom',
  pressureSensitive: true,
  onBegin: (e) => console.log('开始绘制'),
  onChange: (e) => console.log('绘制中'),
  onEnd: (e) => console.log('结束绘制'),
});

// 操作
signature.clear();
signature.undo();
signature.redo();

// 导出
const png = signature.toDataURL('png');
const svg = signature.toSVG();
const json = signature.toJSON();

// 下载
signature.download('signature', 'png');
```

### Vue 3 组件

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
  const png = signatureRef.value.toDataURL('png');
  console.log(png);
};

const onBegin = (e) => console.log('开始', e);
const onChange = (e) => console.log('绘制中', e);
const onEnd = (e) => console.log('结束', e);
</script>
```

### Vue 3 Composable

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
  download,
} = useSignature({
  width: 600,
  height: 300,
  penColor: '#0066ff',
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

### React 组件

```tsx
import React, { useRef } from 'react';
import { SignaturePad, SignaturePadRef } from '@ldesign/signature/react';

function App() {
  const signatureRef = useRef<SignaturePadRef>(null);
  
  const handleExport = () => {
    if (signatureRef.current) {
      const png = signatureRef.current.toDataURL('png');
      console.log(png);
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

### React Hook

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
    penColor: '#0066ff',
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

## 🎨 高级用法

### 自定义背景

```javascript
const signature = createSignaturePad(canvas, {
  background: {
    type: 'color',
    color: '#f0f0f0',
  },
});

// 或使用图片背景
const signature2 = createSignaturePad(canvas, {
  background: {
    type: 'image',
    imageUrl: '/path/to/background.png',
    imageFit: 'cover',
  },
});
```

### 添加水印

```javascript
const signature = createSignaturePad(canvas, {
  watermark: {
    text: 'Confidential',
    position: 'bottom-right',
    opacity: 0.3,
    fontSize: 14,
    color: '#999999',
  },
});
```

### 签名验证

```javascript
import { compareSignatures, extractFeatures } from '@ldesign/signature';

const signature1Data = signature1.toJSON();
const signature2Data = signature2.toJSON();

// 比较相似度
const result = compareSignatures(signature1Data, signature2Data);
console.log('相似度:', result.score); // 0-1, 1 = 完全相同

// 提取特征
const features = extractFeatures(signature1Data);
console.log('笔画数:', features.strokeCount);
console.log('总长度:', features.totalLength);
console.log('边界框:', features.boundingBox);
```

### 签名处理

```javascript
import { cropSignature, scaleSignature, compressSignature } from '@ldesign/signature';

const canvas = signature.getCanvas();

// 裁剪（去除空白）
const croppedCanvas = cropSignature(canvas, { padding: 10 });

// 缩放
const scaledCanvas = scaleSignature(canvas, {
  width: 300,
  height: 150,
  maintainAspectRatio: true,
});

// 压缩
const compressedDataUrl = compressSignature(canvas, 'jpeg', {
  quality: 0.8,
  maxSize: 100 * 1024, // 100 KB
});
```

## 📖 API 文档

完整的 API 文档请参见根目录的 [README.md](../README.md)。

## 🐛 问题反馈

如果您在使用示例时遇到问题，请：
1. 确保已正确构建库 (`pnpm build`)
2. 检查浏览器控制台的错误信息
3. 查看 README.md 中的完整文档
4. 在 GitHub 上提交 Issue

## 📝 许可证

MIT License © 2025 LDesign Team

