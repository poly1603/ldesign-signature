# Vue 3 集成

在 Vue 3 项目中使用 @ldesign/signature。

## 📦 安装

```bash
pnpm add @ldesign/signature
```

## 🚀 快速开始

### 使用组件

```vue
<template>
  <SignaturePad
    :width="600"
    :height="300"
    pen-color="#000000"
    :show-controls="true"
  />
</template>

<script setup>
import { SignaturePad } from '@ldesign/signature/vue';
</script>
```

### 使用 Composable

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
  penColor: '#000000',
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

## 📋 组件 API

### Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | `number` | `400` | Canvas 宽度 |
| `height` | `number` | `200` | Canvas 高度 |
| `pen-color` | `string` | `'#000000'` | 笔触颜色 |
| `min-width` | `number` | `0.5` | 最小宽度 |
| `max-width` | `number` | `2.5` | 最大宽度 |
| `enabled` | `boolean` | `true` | 是否启用 |
| `show-controls` | `boolean` | `true` | 显示控制按钮 |
| `show-clear-button` | `boolean` | `true` | 显示清空按钮 |
| `show-undo-button` | `boolean` | `true` | 显示撤销按钮 |
| `show-redo-button` | `boolean` | `true` | 显示重做按钮 |
| `clear-button-text` | `string` | `'清空'` | 清空按钮文字 |
| `undo-button-text` | `string` | `'撤销'` | 撤销按钮文字 |
| `redo-button-text` | `string` | `'重做'` | 重做按钮文字 |
| `config` | `Partial<SignatureConfig>` | `{}` | 额外配置 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `begin` | `PointerEvent` | 开始绘制 |
| `change` | `PointerEvent` | 绘制过程中 |
| `end` | `PointerEvent` | 结束绘制 |
| `clear` | - | 清空签名 |
| `undo` | - | 撤销操作 |
| `redo` | - | 重做操作 |

### 暴露的方法

```vue
<template>
  <SignaturePad ref="signatureRef" />
</template>

<script setup>
import { ref } from 'vue';

const signatureRef = ref(null);

// 调用方法
signatureRef.value.clear();
signatureRef.value.undo();
signatureRef.value.redo();

const png = signatureRef.value.toDataURL('png');
const svg = signatureRef.value.toSVG();
const json = signatureRef.value.toJSON();

signatureRef.value.download('signature', 'png');
</script>
```

## 🎯 Composable API

### useSignature()

```typescript
function useSignature(config?: Ref<SignatureConfig> | SignatureConfig): {
  canvasRef: Ref<HTMLCanvasElement | null>;
  instance: Ref<SignatureInstance | null>;
  isEmpty: Ref<boolean>;
  canUndo: Ref<boolean>;
  canRedo: Ref<boolean>;
  initialize: () => void;
  clear: () => void;
  undo: () => void;
  redo: () => void;
  toDataURL: (format?: 'png' | 'jpeg', quality?: number) => string;
  toSVG: () => string;
  toJSON: () => SignatureData | null;
  fromJSON: (data: SignatureData) => void;
  download: (fileName?: string, format?: ExportFormat, quality?: number) => void;
  updateConfig: (config: Partial<SignatureConfig>) => void;
  setEnabled: (enabled: boolean) => void;
}
```

## 💡 使用示例

### 基础示例

```vue
<template>
  <div class="signature-container">
    <SignaturePad
      ref="signatureRef"
      :width="800"
      :height="400"
      pen-color="#0066ff"
      :min-width="1"
      :max-width="3"
      @end="handleSignatureEnd"
    />
    
    <button @click="exportPNG">导出 PNG</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { SignaturePad } from '@ldesign/signature/vue';

const signatureRef = ref(null);

const handleSignatureEnd = () => {
  console.log('签名完成');
};

const exportPNG = () => {
  const dataUrl = signatureRef.value.toDataURL('png');
  console.log('PNG Data URL:', dataUrl);
};
</script>
```

### 配置面板示例

```vue
<template>
  <div>
    <div class="config-panel">
      <label>笔触颜色: <input v-model="config.penColor" type="color"></label>
      <label>最小宽度: <input v-model.number="config.minWidth" type="range" min="0.1" max="5" step="0.1"></label>
      <label>最大宽度: <input v-model.number="config.maxWidth" type="range" min="0.5" max="10" step="0.1"></label>
    </div>
    
    <SignaturePad
      :pen-color="config.penColor"
      :min-width="config.minWidth"
      :max-width="config.maxWidth"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { SignaturePad } from '@ldesign/signature/vue';

const config = reactive({
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
});
</script>
```

### 使用 Composable 的高级示例

```vue
<script setup>
import { ref, watch } from 'vue';
import { useSignature } from '@ldesign/signature/vue';
import { GridHelper, SignatureFilter, FilterType } from '@ldesign/signature';

const config = ref({
  width: 800,
  height: 400,
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
});

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
  instance,
} = useSignature(config);

// 网格辅助
let grid = null;

watch(canvasRef, (canvas) => {
  if (canvas) {
    grid = new GridHelper(canvas);
    grid.draw({ showGrid: true });
  }
});

// 应用滤镜
const applyFilter = () => {
  if (instance.value) {
    const canvas = instance.value.getCanvas();
    SignatureFilter.apply(canvas, FilterType.GRAYSCALE);
  }
};
</script>

<template>
  <div>
    <canvas ref="canvasRef"></canvas>
    
    <div class="controls">
      <button @click="clear" :disabled="isEmpty">清空</button>
      <button @click="undo" :disabled="!canUndo">撤销</button>
      <button @click="redo" :disabled="!canRedo">重做</button>
      <button @click="applyFilter">应用滤镜</button>
      <button @click="() => download('signature', 'png')">下载</button>
    </div>
  </div>
</template>
```

## 🔗 相关文档

- [快速开始](/guide/getting-started)
- [基础用法](/guide/basic-usage)
- [Vue 示例](/examples/vue-examples)

