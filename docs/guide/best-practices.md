# 最佳实践

本页面介绍使用 @ldesign/signature 的最佳实践和技巧。

## 🎯 性能优化

### 1. 合理设置历史记录大小

```typescript
// ❌ 不推荐：过大的历史记录
const sig = createSignaturePad(canvas, {
  maxHistorySize: 1000,  // 占用太多内存
});

// ✅ 推荐：合理的大小
const sig = createSignaturePad(canvas, {
  maxHistorySize: 50,  // 足够日常使用
});
```

### 2. 适当的点采样

```typescript
// ✅ 平衡性能和质量
const sig = createSignaturePad(canvas, {
  minPointDistance: 5,   // 减少冗余点
  throttle: 16,          // 约 60fps
});

// ⚠️ 调试时可以禁用平滑
const debugSig = createSignaturePad(canvas, {
  smoothAlgorithm: 'none',  // 最快，用于调试
});
```

### 3. 及时销毁实例

```typescript
// Vue 组件
onUnmounted(() => {
  signature.destroy();  // 清理事件监听器
});

// React 组件
useEffect(() => {
  return () => {
    signature.destroy();
  };
}, []);
```

## 📱 移动端优化

### 1. 响应式尺寸

```typescript
function getResponsiveSize() {
  const maxWidth = 800;
  const width = Math.min(window.innerWidth - 40, maxWidth);
  const height = Math.min(width * 0.5, 400);
  
  return { width, height };
}

const { width, height } = getResponsiveSize();
const sig = createSignaturePad(canvas, { width, height });

// 窗口大小改变时调整
window.addEventListener('resize', () => {
  const { width, height } = getResponsiveSize();
  sig.updateConfig({ width, height });
});
```

### 2. 触摸优化

```typescript
// 防止页面滚动
canvas.style.touchAction = 'none';  // 已自动设置

// 调整笔触粗细（移动端适当增大）
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

const sig = createSignaturePad(canvas, {
  minWidth: isMobile ? 1 : 0.5,
  maxWidth: isMobile ? 4 : 2.5,
});
```

### 3. 全屏签名

```typescript
function enterFullscreen() {
  const container = document.getElementById('signature-container');
  container.requestFullscreen();
  
  // 调整 Canvas 尺寸
  sig.updateConfig({
    width: window.innerWidth,
    height: window.innerHeight,
  });
}
```

## 🎨 用户体验

### 1. 签名引导

```typescript
// 显示提示信息
const tooltip = document.createElement('div');
tooltip.textContent = '请在此处签名';
tooltip.style.cssText = 'position: absolute; ...';
container.appendChild(tooltip);

// 开始签名时隐藏提示
sig.on('begin', () => {
  tooltip.style.display = 'none';
});
```

### 2. 网格辅助

```typescript
import { GridHelper } from '@ldesign/signature';

const grid = new GridHelper(canvas);

// 签名前显示网格
grid.draw({
  showGrid: true,
  showBaseline: true,
  gridOpacity: 0.3,  // 低透明度，不干扰签名
});

// 签名后自动清除
sig.on('begin', () => {
  grid.clear();
});
```

### 3. 即时预览

```typescript
let previewTimeout;

sig.on('change', () => {
  // 防抖处理
  clearTimeout(previewTimeout);
  previewTimeout = setTimeout(() => {
    updatePreview();
  }, 500);
});

function updatePreview() {
  const dataUrl = sig.toDataURL('png');
  previewImg.src = dataUrl;
}
```

## 📊 数据管理

### 1. 自动保存

```typescript
import { createStorage } from '@ldesign/signature';

const storage = createStorage();

// 自动保存
sig.on('end', () => {
  const data = sig.toJSON();
  storage.save(data, ['自动保存']);
});
```

### 2. 定期清理

```typescript
// 只保留最近 30 天的签名
function cleanOldSignatures() {
  const history = storage.getHistory();
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  
  history.forEach(record => {
    if (record.createdAt < thirtyDaysAgo) {
      storage.delete(record.id);
    }
  });
}

// 每次启动时清理
cleanOldSignatures();
```

### 3. 版本兼容

```typescript
// 保存版本信息
const data = sig.toJSON();
const saveData = {
  ...data,
  appVersion: '1.0.0',
  savedAt: Date.now(),
};

// 加载时检查版本
function loadSignature(saved) {
  if (saved.version !== '1.0.0') {
    console.warn('签名数据版本不匹配');
    // 可能需要迁移
  }
  
  sig.fromJSON(saved);
}
```

## 🔒 安全性

### 1. 签名验证

```typescript
import { validateSignature, extractFeatures } from '@ldesign/signature';

function submitSignature() {
  const data = sig.toJSON();
  
  // 验证签名有效性
  const validation = validateSignature(data);
  if (!validation.isValid) {
    alert('签名无效: ' + validation.errors.join(', '));
    return;
  }
  
  // 提取特征（用于后续验证）
  const features = extractFeatures(data);
  
  // 提交到服务器
  fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify({
      signature: sig.toDataURL('png'),
      features,
      timestamp: Date.now(),
    }),
  });
}
```

### 2. 防止作弊

```typescript
// 检查签名是否太快（可能是粘贴图片）
const features = extractFeatures(data);

if (features.totalTime < 1000) {
  alert('签名时间过短，请重新签名');
  sig.clear();
  return;
}

if (features.strokeCount < 2) {
  alert('签名过于简单，请重新签名');
  sig.clear();
  return;
}
```

### 3. 时间戳记录

```typescript
let signatureStartTime;

sig.on('begin', () => {
  signatureStartTime = Date.now();
});

sig.on('end', () => {
  const duration = Date.now() - signatureStartTime;
  console.log('签名耗时:', duration, 'ms');
  
  // 记录到数据中
  const data = sig.toJSON();
  const enhanced = {
    ...data,
    metadata: {
      duration,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    },
  };
});
```

## 🎨 UI/UX 优化

### 1. 加载状态

```typescript
const loadingOverlay = document.createElement('div');
loadingOverlay.textContent = '加载中...';

sig.on('begin', () => {
  loadingOverlay.style.display = 'none';
});
```

### 2. 禁用状态样式

```typescript
// 禁用时改变样式
sig.setEnabled(false);
canvas.style.opacity = '0.5';
canvas.style.cursor = 'not-allowed';

// 启用时恢复
sig.setEnabled(true);
canvas.style.opacity = '1';
canvas.style.cursor = 'crosshair';
```

### 3. 触觉反馈（移动端）

```typescript
sig.on('begin', () => {
  // 震动反馈
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
});
```

## 📦 导出优化

### 1. 智能裁剪

```typescript
import { cropSignature } from '@ldesign/signature';

function exportOptimized() {
  const canvas = sig.getCanvas();
  
  // 裁剪空白
  const cropped = cropSignature(canvas, { padding: 10 });
  
  // 导出
  return cropped.toDataURL('png');
}
```

### 2. 压缩优化

```typescript
import { compressSignature } from '@ldesign/signature';

function exportForWeb() {
  const canvas = sig.getCanvas();
  
  // 优化 Web 使用（限制大小）
  return compressSignature(canvas, 'jpeg', {
    quality: 0.85,
    maxSize: 200 * 1024,  // 200KB
  });
}
```

### 3. 批量导出

```typescript
async function exportAll() {
  const png = sig.toDataURL('png');
  const jpeg = sig.toDataURL('jpeg', 0.9);
  const svg = sig.toSVG();
  const json = sig.toJSON();
  
  return {
    png,
    jpeg,
    svg,
    json: JSON.stringify(json),
  };
}
```

## 🔄 状态管理

### Vue 3

```vue
<script setup>
import { ref, watch } from 'vue';
import { useSignature } from '@ldesign/signature/vue';

const config = ref({
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
});

const { canvasRef, updateConfig } = useSignature(config);

// 配置变化时自动更新
watch(config, (newConfig) => {
  updateConfig(newConfig);
}, { deep: true });
</script>
```

### React

```tsx
import { useState, useEffect } from 'react';
import { useSignature } from '@ldesign/signature/react';

function App() {
  const [config, setConfig] = useState({
    penColor: '#000000',
    minWidth: 0.5,
    maxWidth: 2.5,
  });
  
  const { canvasRef, updateConfig } = useSignature(config);
  
  // 配置变化时更新
  useEffect(() => {
    updateConfig(config);
  }, [config]);
  
  return <canvas ref={canvasRef} />;
}
```

## 🐛 错误处理

### 1. 捕获错误

```typescript
try {
  const sig = createSignaturePad(canvas);
} catch (error) {
  console.error('初始化失败:', error);
  alert('签名板初始化失败，请刷新页面重试');
}
```

### 2. 验证 Canvas

```typescript
const canvas = document.getElementById('canvas');

if (!canvas) {
  throw new Error('Canvas 元素不存在');
}

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('元素不是 Canvas');
}

const ctx = canvas.getContext('2d');
if (!ctx) {
  throw new Error('浏览器不支持 Canvas 2D');
}
```

### 3. 导出错误处理

```typescript
function safeExport() {
  try {
    if (sig.isEmpty()) {
      throw new Error('签名为空');
    }
    
    const dataUrl = sig.toDataURL('png');
    return dataUrl;
  } catch (error) {
    console.error('导出失败:', error);
    return null;
  }
}
```

## 💡 使用技巧

### 1. 组合功能

```typescript
// 完整的签名工作流
import {
  createSignaturePad,
  GridHelper,
  SignatureFilter,
  FilterType,
  cropSignature,
  createStorage,
} from '@ldesign/signature';

// 初始化
const sig = createSignaturePad(canvas);
const grid = new GridHelper(canvas);
const storage = createStorage();

// 签名前：显示网格
grid.draw({ showGrid: true });

// 签名中：清除网格
sig.on('begin', () => grid.clear());

// 签名后：处理并保存
sig.on('end', async () => {
  // 1. 应用滤镜
  SignatureFilter.apply(canvas, FilterType.SHARPEN);
  
  // 2. 裁剪
  const cropped = cropSignature(canvas);
  
  // 3. 保存
  const data = sig.toJSON();
  storage.save(data, ['已处理']);
  
  // 4. 上传
  const blob = await fetch(cropped.toDataURL()).then(r => r.blob());
  await uploadToServer(blob);
});
```

### 2. 条件渲染

```typescript
// 根据设备类型调整配置
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;

const config = {
  penColor: '#000000',
  minWidth: isMobile ? 1 : 0.5,
  maxWidth: isMobile ? 4 : isTablet ? 3 : 2.5,
  smoothAlgorithm: isMobile ? 'bezier-quadratic' : 'catmull-rom',
};

const sig = createSignaturePad(canvas, config);
```

### 3. 多签名字段

```typescript
// 管理多个签名字段
const signatures = new Map();

function createSignatureField(id, canvas) {
  const sig = createSignaturePad(canvas);
  signatures.set(id, sig);
  return sig;
}

function validateAll() {
  for (const [id, sig] of signatures) {
    if (sig.isEmpty()) {
      alert(`${id} 签名为空！`);
      return false;
    }
  }
  return true;
}

function exportAll() {
  const data = {};
  for (const [id, sig] of signatures) {
    data[id] = sig.toDataURL('png');
  }
  return data;
}
```

## 🔍 调试技巧

### 1. 调试模式

```typescript
const sig = createSignaturePad(canvas, {
  smoothAlgorithm: 'none',  // 禁用平滑，看原始轨迹
  onBegin: (e) => console.log('Begin:', e),
  onChange: (e) => console.log('Change:', e),
  onEnd: (e) => console.log('End:', e),
});
```

### 2. 性能监控

```typescript
let frameCount = 0;
let lastTime = Date.now();

sig.on('change', () => {
  frameCount++;
  
  const now = Date.now();
  if (now - lastTime >= 1000) {
    console.log('FPS:', frameCount);
    frameCount = 0;
    lastTime = now;
  }
});
```

### 3. 数据分析

```typescript
import { extractFeatures } from '@ldesign/signature';

sig.on('end', () => {
  const data = sig.toJSON();
  const features = extractFeatures(data);
  
  console.table({
    '笔画数': features.strokeCount,
    '总长度': features.totalLength.toFixed(2),
    '绘制时间': features.totalTime,
    '平均压力': features.avgPressure.toFixed(2),
  });
});
```

## 📚 代码组织

### 1. 封装为类

```typescript
class SignatureManager {
  private signature: SignaturePad;
  private storage: SignatureStorage;
  
  constructor(canvas: HTMLCanvasElement) {
    this.signature = createSignaturePad(canvas);
    this.storage = createStorage();
    this.setupEvents();
  }
  
  private setupEvents() {
    this.signature.on('end', () => {
      this.autoSave();
    });
  }
  
  private autoSave() {
    const data = this.signature.toJSON();
    this.storage.save(data, ['自动保存']);
  }
  
  export(format: 'png' | 'jpeg' | 'svg') {
    return this.signature.toDataURL(format);
  }
  
  destroy() {
    this.signature.destroy();
  }
}

// 使用
const manager = new SignatureManager(canvas);
```

### 2. 配置管理

```typescript
// config.ts
export const SIGNATURE_CONFIG = {
  default: {
    penColor: '#000000',
    minWidth: 0.5,
    maxWidth: 2.5,
    smoothAlgorithm: 'catmull-rom',
  },
  
  mobile: {
    penColor: '#000000',
    minWidth: 1,
    maxWidth: 4,
    smoothAlgorithm: 'bezier-quadratic',
  },
  
  professional: {
    penColor: '#000000',
    minWidth: 0.3,
    maxWidth: 3,
    smoothAlgorithm: 'catmull-rom',
    smoothTension: 0.6,
  },
};

// 使用
import { SIGNATURE_CONFIG } from './config';

const isMobile = detectMobile();
const config = isMobile ? SIGNATURE_CONFIG.mobile : SIGNATURE_CONFIG.default;

const sig = createSignaturePad(canvas, config);
```

## 🎯 完整应用示例

查看我们的完整示例项目：

- [Vue 完整示例](/examples/vue-examples)
- [React 完整示例](/examples/react-examples)
- [Lit 完整示例](/examples/lit-examples)

## 📖 参考资料

- [API 文档](/api/signature-pad)
- [配置选项](/api/config)
- [高级功能](/guide/advanced-features)
- [框架集成](/frameworks/vue)

