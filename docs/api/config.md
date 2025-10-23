# 配置选项

完整的 SignatureConfig 配置选项说明。

## 📐 尺寸配置

### width

Canvas 宽度（像素）。

- **类型**: `number`
- **默认值**: 自动（Canvas 元素的 clientWidth）
- **示例**: `600`

```typescript
const sig = createSignaturePad(canvas, {
  width: 600,
});
```

### height

Canvas 高度（像素）。

- **类型**: `number`
- **默认值**: 自动（Canvas 元素的 clientHeight）
- **示例**: `300`

```typescript
const sig = createSignaturePad(canvas, {
  height: 300,
});
```

## 🎨 笔触配置

### penColor

笔触颜色。

- **类型**: `string`
- **默认值**: `'#000000'`
- **支持格式**: 所有 CSS 颜色值

```typescript
const sig = createSignaturePad(canvas, {
  penColor: '#000000',      // 十六进制
  // penColor: 'rgb(0,0,0)',   // RGB
  // penColor: 'rgba(0,0,0,0.8)', // RGBA
  // penColor: 'black',        // 命名颜色
});
```

### minWidth

最小笔触宽度。

- **类型**: `number`
- **默认值**: `0.5`
- **建议范围**: `0.1 - 5`

### maxWidth

最大笔触宽度。

- **类型**: `number`
- **默认值**: `2.5`
- **建议范围**: `0.5 - 10`

```typescript
const sig = createSignaturePad(canvas, {
  minWidth: 0.5,   // 最细
  maxWidth: 2.5,   // 最粗
});
```

### dotSize

单点笔触的大小。

- **类型**: `number`
- **默认值**: `2`
- **说明**: 当用户只点击一次时显示的点的大小

## 🌊 平滑配置

### smoothAlgorithm

平滑算法类型。

- **类型**: `SmoothAlgorithm`
- **默认值**: `'catmull-rom'`
- **可选值**:
  - `'catmull-rom'` - Catmull-Rom 样条曲线（推荐）
  - `'bezier-quadratic'` - 二次贝塞尔曲线
  - `'bezier-cubic'` - 三次贝塞尔曲线
  - `'none'` - 无平滑

```typescript
const sig = createSignaturePad(canvas, {
  smoothAlgorithm: 'catmull-rom',  // 最平滑
});
```

### smoothTension

平滑张力参数（仅用于 Catmull-Rom）。

- **类型**: `number`
- **默认值**: `0.5`
- **范围**: `0 - 1`
- **说明**: 值越大越平滑，值越小越接近原始轨迹

```typescript
const sig = createSignaturePad(canvas, {
  smoothAlgorithm: 'catmull-rom',
  smoothTension: 0.5,  // 中等平滑
});
```

## 🎯 捕获配置

### minPointDistance

最小点间距（像素）。

- **类型**: `number`
- **默认值**: `5`
- **说明**: 两个点之间的最小距离，过滤冗余点

```typescript
const sig = createSignaturePad(canvas, {
  minPointDistance: 5,  // 较大值 = 更少的点 = 更流畅但不够精确
});
```

### throttle

事件节流时间（毫秒）。

- **类型**: `number`
- **默认值**: `16`（约 60fps）
- **说明**: pointermove 事件的节流间隔

### velocityFilterWeight

速度过滤权重。

- **类型**: `number`
- **默认值**: `0.7`
- **范围**: `0 - 1`
- **说明**: 用于平滑速度计算，值越大速度变化越平滑

## ✏️ 压力感应

### pressureSensitive

是否启用压力感应。

- **类型**: `boolean`
- **默认值**: `true`
- **支持设备**: Apple Pencil, Wacom, Surface Pen

```typescript
const sig = createSignaturePad(canvas, {
  pressureSensitive: true,  // 启用压感
});
```

## 📚 历史管理

### maxHistorySize

最大历史记录数量。

- **类型**: `number`
- **默认值**: `50`
- **说明**: 限制撤销/重做栈的大小，防止内存溢出

```typescript
const sig = createSignaturePad(canvas, {
  maxHistorySize: 50,  // 最多保存 50 步操作
});
```

## 🎨 背景配置

### background

背景配置对象。

- **类型**: `BackgroundConfig | undefined`
- **默认值**: `undefined`（无背景）

```typescript
interface BackgroundConfig {
  type: 'color' | 'image' | 'transparent';
  color?: string;
  imageUrl?: string;
  imageFit?: 'cover' | 'contain' | 'fill';
}
```

**示例**:

```typescript
// 纯色背景
const sig = createSignaturePad(canvas, {
  background: {
    type: 'color',
    color: '#f5f5f5',
  }
});

// 图片背景
const sig2 = createSignaturePad(canvas, {
  background: {
    type: 'image',
    imageUrl: '/bg.png',
    imageFit: 'cover',
  }
});

// 透明背景
const sig3 = createSignaturePad(canvas, {
  background: {
    type: 'transparent',
  }
});
```

## 💧 水印配置

### watermark

水印配置对象。

- **类型**: `WatermarkConfig | undefined`
- **默认值**: `undefined`（无水印）

```typescript
interface WatermarkConfig {
  text?: string;
  imageUrl?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity?: number;    // 0-1
  fontSize?: number;
  color?: string;
}
```

**示例**:

```typescript
const sig = createSignaturePad(canvas, {
  watermark: {
    text: 'Confidential',
    position: 'bottom-right',
    opacity: 0.3,
    fontSize: 14,
    color: '#999999',
  }
});
```

## 🎯 事件回调

### onBegin

开始绘制时的回调。

- **类型**: `(event: PointerEvent) => void`
- **默认值**: `undefined`

```typescript
const sig = createSignaturePad(canvas, {
  onBegin: (event) => {
    console.log('开始绘制', event);
  }
});
```

### onChange

绘制过程中的回调。

- **类型**: `(event: PointerEvent) => void`
- **默认值**: `undefined`

```typescript
const sig = createSignaturePad(canvas, {
  onChange: (event) => {
    console.log('绘制中', event);
  }
});
```

### onEnd

结束绘制时的回调。

- **类型**: `(event: PointerEvent) => void`
- **默认值**: `undefined`

```typescript
const sig = createSignaturePad(canvas, {
  onEnd: (event) => {
    console.log('签名完成', event);
  }
});
```

## 📦 完整配置示例

```typescript
const signature = createSignaturePad(canvas, {
  // 尺寸
  width: 600,
  height: 300,
  
  // 笔触
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
  dotSize: 2,
  
  // 平滑
  smoothAlgorithm: 'catmull-rom',
  smoothTension: 0.5,
  
  // 捕获
  minPointDistance: 5,
  throttle: 16,
  velocityFilterWeight: 0.7,
  
  // 压感
  pressureSensitive: true,
  
  // 历史
  maxHistorySize: 50,
  
  // 背景
  background: {
    type: 'color',
    color: '#ffffff',
  },
  
  // 水印
  watermark: {
    text: 'Confidential',
    position: 'bottom-right',
    opacity: 0.3,
  },
  
  // 事件
  onBegin: (e) => console.log('Begin'),
  onChange: (e) => console.log('Change'),
  onEnd: (e) => console.log('End'),
});
```

## 🔗 相关文档

- [SignaturePad API](/api/signature-pad)
- [方法列表](/api/methods)
- [事件系统](/api/events)
- [类型定义](/api/types)

