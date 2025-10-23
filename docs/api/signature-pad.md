# SignaturePad API

SignaturePad 是核心类，提供所有签名功能。

## 构造函数

### createSignaturePad()

创建签名板实例。

```typescript
function createSignaturePad(
  canvas: HTMLCanvasElement,
  config?: SignatureConfig
): SignaturePad
```

**参数**:
- `canvas` - HTMLCanvasElement 元素
- `config` - 可选配置对象

**返回**: SignaturePad 实例

**示例**:

```typescript
import { createSignaturePad } from '@ldesign/signature';

const canvas = document.getElementById('canvas');
const signature = createSignaturePad(canvas, {
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
});
```

## 实例方法

### clear()

清空画布。

```typescript
signature.clear(): void
```

**示例**:

```typescript
signature.clear();
```

---

### undo()

撤销最后一笔。

```typescript
signature.undo(): void
```

**示例**:

```typescript
if (signature.canUndo()) {
  signature.undo();
}
```

---

### redo()

重做最后撤销的一笔。

```typescript
signature.redo(): void
```

**示例**:

```typescript
if (signature.canRedo()) {
  signature.redo();
}
```

---

### isEmpty()

检查签名是否为空。

```typescript
signature.isEmpty(): boolean
```

**返回**: `true` 如果签名为空，否则 `false`

**示例**:

```typescript
if (signature.isEmpty()) {
  alert('请先签名！');
}
```

---

### canUndo()

检查是否可以撤销。

```typescript
signature.canUndo(): boolean
```

**返回**: `true` 如果可以撤销，否则 `false`

---

### canRedo()

检查是否可以重做。

```typescript
signature.canRedo(): boolean
```

**返回**: `true` 如果可以重做，否则 `false`

---

### toDataURL()

导出为 Data URL（PNG 或 JPEG）。

```typescript
signature.toDataURL(
  format?: 'png' | 'jpeg',
  quality?: number
): string
```

**参数**:
- `format` - 图片格式，默认 `'png'`
- `quality` - JPEG 质量（0-1），默认 `0.92`

**返回**: Data URL 字符串

**示例**:

```typescript
// 导出 PNG
const png = signature.toDataURL('png');

// 导出高质量 JPEG
const jpeg = signature.toDataURL('jpeg', 0.95);

// 导出低质量 JPEG（文件更小）
const jpeg = signature.toDataURL('jpeg', 0.7);
```

---

### toSVG()

导出为 SVG 字符串（矢量格式）。

```typescript
signature.toSVG(): string
```

**返回**: SVG XML 字符串

**示例**:

```typescript
const svg = signature.toSVG();

// 创建 Blob
const blob = new Blob([svg], { type: 'image/svg+xml' });
const url = URL.createObjectURL(blob);

// 在新窗口打开
window.open(url);
```

---

### toJSON()

导出为 JSON 数据（包含所有笔画信息）。

```typescript
signature.toJSON(): SignatureData
```

**返回**: SignatureData 对象

**SignatureData 结构**:

```typescript
interface SignatureData {
  strokes: Stroke[];      // 所有笔画
  width: number;          // Canvas 宽度
  height: number;         // Canvas 高度
  timestamp: number;      // 创建时间戳
  version: string;        // 数据版本
}
```

**示例**:

```typescript
const data = signature.toJSON();

// 序列化保存
localStorage.setItem('signature', JSON.stringify(data));

// 打印信息
console.log('笔画数:', data.strokes.length);
console.log('尺寸:', `${data.width}x${data.height}`);
```

---

### fromJSON()

从 JSON 数据导入签名。

```typescript
signature.fromJSON(data: SignatureData): void
```

**参数**:
- `data` - SignatureData 对象

**示例**:

```typescript
const saved = localStorage.getItem('signature');
const data = JSON.parse(saved);

signature.fromJSON(data);
```

---

### download()

直接下载签名文件。

```typescript
signature.download(
  fileName?: string,
  format?: 'png' | 'jpeg' | 'svg' | 'json',
  quality?: number
): void
```

**参数**:
- `fileName` - 文件名（不含扩展名），默认 `'signature'`
- `format` - 文件格式，默认 `'png'`
- `quality` - JPEG 质量（0-1），默认 `0.92`

**示例**:

```typescript
// 下载 PNG
signature.download('my-signature', 'png');

// 下载 JPEG
signature.download('signature', 'jpeg', 0.9);

// 下载 SVG
signature.download('signature', 'svg');

// 下载 JSON 数据
signature.download('signature-data', 'json');
```

---

### updateConfig()

动态更新配置。

```typescript
signature.updateConfig(config: Partial<SignatureConfig>): void
```

**参数**:
- `config` - 部分配置对象

**示例**:

```typescript
// 更改笔触颜色
signature.updateConfig({
  penColor: '#ff0000',
});

// 更改多个配置
signature.updateConfig({
  penColor: '#0066ff',
  minWidth: 1,
  maxWidth: 5,
});
```

---

### getCanvas()

获取 Canvas 元素。

```typescript
signature.getCanvas(): HTMLCanvasElement
```

**返回**: HTMLCanvasElement

**示例**:

```typescript
const canvas = signature.getCanvas();

// 应用滤镜
SignatureFilter.apply(canvas, FilterType.GRAYSCALE);

// 获取上下文
const ctx = canvas.getContext('2d');
```

---

### setEnabled()

启用或禁用签名板。

```typescript
signature.setEnabled(enabled: boolean): void
```

**参数**:
- `enabled` - `true` 启用，`false` 禁用

**示例**:

```typescript
// 禁用签名板
signature.setEnabled(false);

// 启用签名板
signature.setEnabled(true);
```

---

### isEnabled()

检查签名板是否启用。

```typescript
signature.isEnabled(): boolean
```

**返回**: `true` 如果启用，否则 `false`

---

### destroy()

销毁签名板实例，清理资源。

```typescript
signature.destroy(): void
```

**示例**:

```typescript
// 组件卸载时
onUnmounted(() => {
  signature.destroy();
});
```

## 事件

### onBegin

开始绘制时触发。

```typescript
{
  onBegin: (event: PointerEvent) => void
}
```

### onChange

绘制过程中触发（每次添加新点时）。

```typescript
{
  onChange: (event: PointerEvent) => void
}
```

### onEnd

结束绘制时触发。

```typescript
{
  onEnd: (event: PointerEvent) => void
}
```

**示例**:

```typescript
const signature = createSignaturePad(canvas, {
  onBegin: (e) => {
    console.log('开始绘制');
    showTooltip('正在签名...');
  },
  onChange: (e) => {
    updatePreview();
  },
  onEnd: (e) => {
    console.log('签名完成');
    hideTooltip();
    autoSave();
  },
});
```

## 类型定义

### SignatureConfig

完整配置接口，查看 [配置选项文档](/api/config)。

### SignatureData

签名数据接口，查看 [类型定义文档](/api/types)。

## 完整示例

```typescript
import { createSignaturePad } from '@ldesign/signature';

const canvas = document.getElementById('signature-canvas');

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

// 使用方法
signature.clear();
signature.undo();
signature.redo();

const png = signature.toDataURL('png');
const svg = signature.toSVG();
const json = signature.toJSON();

signature.download('signature', 'png');

// 清理
signature.destroy();
```

## 相关文档

- [配置选项](/api/config) - 所有配置选项详解
- [方法列表](/api/methods) - 所有方法详细说明
- [事件系统](/api/events) - 事件详解
- [类型定义](/api/types) - TypeScript 类型

