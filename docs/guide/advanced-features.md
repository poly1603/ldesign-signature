# 高级功能

探索 @ldesign/signature 的所有高级功能。

## 📹 签名回放

动画重现签名绘制过程。

### 基础用法

```typescript
import { createReplay } from '@ldesign/signature';

// 获取签名数据
const signatureData = signature.toJSON();

// 创建回放实例
const replay = createReplay(replayCanvas, signatureData);

// 开始回放
replay.play();
```

### 自定义选项

```typescript
replay.play({
  speed: 2,         // 2倍速播放
  loop: true,       // 循环播放
  onFrame: (progress) => {
    console.log(`进度: ${(progress * 100).toFixed(0)}%`);
    updateProgressBar(progress);
  },
  onComplete: () => {
    console.log('回放完成！');
  }
});
```

### 控制回放

```typescript
replay.pause();   // 暂停
replay.resume();  // 恢复
replay.stop();    // 停止
replay.reset();   // 重置到开始
```

[查看完整文档](/features/replay)

## 🎨 笔触样式

6种专业笔触效果。

### 可用样式

```typescript
import { BrushStyle, BrushFactory } from '@ldesign/signature';

// 默认笔触
BrushStyle.DEFAULT

// 钢笔效果 (均匀线条)
BrushStyle.PEN

// 毛笔效果 (有纹理)
BrushStyle.BRUSH

// 铅笔效果 (颗粒感)
BrushStyle.PENCIL

// 马克笔 (半透明)
BrushStyle.MARKER

// 霓虹灯 (发光)
BrushStyle.NEON
```

### 使用笔触

```typescript
const brush = BrushFactory.getBrush(BrushStyle.BRUSH);

// 在自定义渲染器中使用
brush.drawStroke(ctx, point1, point2, color, width);
```

[查看完整文档](/features/brush-styles)

## 📐 网格辅助

显示网格和辅助线帮助用户规范签名。

### 基础用法

```typescript
import { GridHelper } from '@ldesign/signature';

const grid = new GridHelper(canvas);

// 绘制网格
grid.draw({
  showGrid: true,
  gridSize: 20,
  showBaseline: true,
  baselinePosition: 0.5,
});

// 清除网格
grid.clear();
```

### 完整配置

```typescript
grid.draw({
  showGrid: true,              // 显示网格
  gridSize: 20,               // 网格大小 (像素)
  gridColor: '#e0e0e0',       // 网格颜色
  gridOpacity: 0.5,           // 网格透明度
  showBaseline: true,         // 显示基线
  baselinePosition: 0.5,      // 基线位置 (0=顶部, 1=底部)
  baselineColor: '#409eff',   // 基线颜色
  showBorder: true,           // 显示边框
  borderColor: '#409eff',     // 边框颜色
});
```

### 典型用例

```typescript
// 签名前显示网格
grid.draw({ showGrid: true, showBaseline: true });

// 签名后清除网格
signature.on('end', () => {
  grid.clear();
});
```

[查看完整文档](/features/grid)

## 💾 本地存储

自动保存签名到浏览器本地存储。

### 基础用法

```typescript
import { createStorage } from '@ldesign/signature';

const storage = createStorage({ maxHistory: 50 });

// 保存签名
const data = signature.toJSON();
const id = storage.save(data, ['重要', '合同']);

// 加载签名
const record = storage.load(id);
if (record) {
  signature.fromJSON(record.data);
}
```

### 历史记录管理

```typescript
// 获取所有历史记录
const history = storage.getHistory();

// 显示历史列表
history.forEach(record => {
  console.log(`
    ID: ${record.id}
    时间: ${new Date(record.createdAt).toLocaleString()}
    标签: ${record.tags?.join(', ')}
  `);
});

// 搜索签名
const results = storage.search('合同');

// 删除签名
storage.delete(id);

// 清空所有历史
storage.clearHistory();
```

### 存储信息

```typescript
const info = storage.getStorageInfo();
console.log(`存储了 ${info.count} 个签名`);
console.log(`占用空间约 ${(info.estimatedSize / 1024).toFixed(2)} KB`);
```

[查看完整文档](/features/storage)

## 🖼️ 图像滤镜

为签名添加专业的视觉效果。

### 可用滤镜

```typescript
import { SignatureFilter, FilterType } from '@ldesign/signature';

// 黑白
FilterType.GRAYSCALE

// 反色
FilterType.INVERT

// 复古 (棕褐色)
FilterType.SEPIA

// 锐化
FilterType.SHARPEN

// 模糊
FilterType.BLUR

// 对比度
FilterType.CONTRAST

// 亮度
FilterType.BRIGHTNESS
```

### 应用滤镜

```typescript
const canvas = signature.getCanvas();

// 黑白效果
SignatureFilter.apply(canvas, FilterType.GRAYSCALE);

// 复古效果
SignatureFilter.apply(canvas, FilterType.SEPIA);

// 锐化（增强细节）
SignatureFilter.apply(canvas, FilterType.SHARPEN);

// 模糊（强度可调）
SignatureFilter.apply(canvas, FilterType.BLUR, 2);

// 对比度（1.5倍）
SignatureFilter.apply(canvas, FilterType.CONTRAST, 1.5);
```

### 滤镜链

```typescript
// 组合多个滤镜
const canvas = signature.getCanvas();

// 先锐化，再提高对比度，最后复古效果
SignatureFilter.apply(canvas, FilterType.SHARPEN);
SignatureFilter.apply(canvas, FilterType.CONTRAST, 1.3);
SignatureFilter.apply(canvas, FilterType.SEPIA);

// 导出结果
const result = signature.toDataURL('png');
```

[查看完整文档](/features/filters)

## 🎨 背景和水印

### 设置背景

```typescript
// 纯色背景
const sig = createSignaturePad(canvas, {
  background: {
    type: 'color',
    color: '#f0f0f0',
  }
});

// 图片背景
const sig2 = createSignaturePad(canvas, {
  background: {
    type: 'image',
    imageUrl: '/path/to/background.png',
    imageFit: 'cover',  // 'cover' | 'contain' | 'fill'
  }
});

// 透明背景
const sig3 = createSignaturePad(canvas, {
  background: {
    type: 'transparent',
  }
});
```

### 添加水印

```typescript
const sig = createSignaturePad(canvas, {
  watermark: {
    text: 'Confidential',
    position: 'bottom-right',  // 位置
    opacity: 0.3,              // 透明度
    fontSize: 14,              // 字体大小
    color: '#999999',          // 颜色
  }
});
```

## ✂️ 签名处理

### 裁剪空白

```typescript
import { cropSignature } from '@ldesign/signature';

const canvas = signature.getCanvas();

// 裁剪签名（去除空白区域）
const cropped = cropSignature(canvas, {
  padding: 10,                    // 边距
  backgroundColor: 'transparent'  // 背景色
});

// 使用裁剪后的 Canvas
const croppedUrl = cropped.toDataURL('png');
```

### 缩放签名

```typescript
import { scaleSignature } from '@ldesign/signature';

const canvas = signature.getCanvas();

// 缩放到指定尺寸
const scaled = scaleSignature(canvas, {
  width: 300,
  height: 150,
  maintainAspectRatio: true,  // 保持宽高比
  mode: 'contain',            // 'contain' | 'cover' | 'fill'
});
```

### 压缩签名

```typescript
import { compressSignature } from '@ldesign/signature';

const canvas = signature.getCanvas();

// 压缩 JPEG（限制文件大小）
const compressed = compressSignature(canvas, 'jpeg', {
  quality: 0.8,
  maxSize: 100 * 1024,  // 最大 100KB
  maxIterations: 10,
});
```

## 🔍 签名验证

### 提取特征

```typescript
import { extractFeatures } from '@ldesign/signature';

const data = signature.toJSON();
const features = extractFeatures(data);

console.log('笔画数:', features.strokeCount);
console.log('总长度:', features.totalLength);
console.log('边界框:', features.boundingBox);
console.log('平均压力:', features.avgPressure);
console.log('总时间:', features.totalTime);
```

### 对比签名

```typescript
import { compareSignatures } from '@ldesign/signature';

const sig1Data = signature1.toJSON();
const sig2Data = signature2.toJSON();

// 计算相似度
const result = compareSignatures(sig1Data, sig2Data);

console.log('相似度:', result.score);  // 0-1, 1 = 完全相同
console.log('Hausdorff 距离:', result.hausdorffDistance);
console.log('特征差异:', result.featureDifferences);

// 判断是否为同一人签名
if (result.score > 0.8) {
  console.log('很可能是同一人的签名');
} else {
  console.log('可能不是同一人的签名');
}
```

### 验证签名

```typescript
import { validateSignature } from '@ldesign/signature';

const data = signature.toJSON();
const result = validateSignature(data);

if (result.isValid) {
  console.log('签名有效');
} else {
  console.log('签名无效:', result.errors);
}
```

## 🎯 完整工作流示例

```typescript
import {
  createSignaturePad,
  createReplay,
  GridHelper,
  createStorage,
  SignatureFilter,
  FilterType,
  cropSignature,
  scaleSignature,
} from '@ldesign/signature';

// 1. 初始化
const sig = createSignaturePad(canvas);
const grid = new GridHelper(canvas);
const storage = createStorage();

// 2. 显示网格辅助
grid.draw({ showGrid: true, showBaseline: true });

// 3. 签名完成后
sig.on('end', () => {
  // 清除网格
  grid.clear();
  
  // 应用滤镜
  const canvas = sig.getCanvas();
  SignatureFilter.apply(canvas, FilterType.SHARPEN);
  
  // 裁剪并缩放
  const cropped = cropSignature(canvas, { padding: 10 });
  const scaled = scaleSignature(cropped, {
    width: 400,
    height: 200,
  });
  
  // 保存
  const data = sig.toJSON();
  const id = storage.save(data, ['处理后']);
  
  // 导出
  const finalUrl = scaled.toDataURL('png');
  
  // 可选：回放演示
  const replay = createReplay(replayCanvas, data);
  replay.play({ speed: 1 });
});
```

## 🔗 下一步

- [最佳实践](/guide/best-practices) - 学习使用技巧
- [API 文档](/api/signature-pad) - 查看完整 API
- [功能文档](/features/replay) - 深入了解每个功能

