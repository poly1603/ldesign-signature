# 基础用法

本页面详细介绍 @ldesign/signature 的基础使用方法。

## 📝 创建签名板

### 最简单的方式

```typescript
import { createSignaturePad } from '@ldesign/signature';

const canvas = document.getElementById('canvas');
const signature = createSignaturePad(canvas);
```

### 带配置的创建

```typescript
const signature = createSignaturePad(canvas, {
  width: 600,
  height: 300,
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
});
```

## ⚙️ 配置选项

### 尺寸配置

```typescript
{
  width: 600,    // Canvas 宽度 (像素)
  height: 300,   // Canvas 高度 (像素)
}
```

### 笔触配置

```typescript
{
  penColor: '#000000',        // 笔触颜色 (CSS 颜色值)
  minWidth: 0.5,             // 最小笔触宽度
  maxWidth: 2.5,             // 最大笔触宽度
  dotSize: 2,                // 单点大小
}
```

**笔触颜色支持**：
- 十六进制: `'#000000'`
- RGB: `'rgb(0, 0, 0)'`
- RGBA: `'rgba(0, 0, 0, 0.8)'`
- 命名颜色: `'black'`, `'red'`, `'blue'`

### 平滑配置

```typescript
{
  smoothAlgorithm: 'catmull-rom',  // 平滑算法
  smoothTension: 0.5,              // 平滑张力 (0-1)
}
```

**可用的平滑算法**：
- `'catmull-rom'` - Catmull-Rom 样条曲线（推荐，最平滑）
- `'bezier-quadratic'` - 二次贝塞尔曲线（快速）
- `'bezier-cubic'` - 三次贝塞尔曲线（高质量）
- `'none'` - 无平滑（最快，适合调试）

### 捕获配置

```typescript
{
  minPointDistance: 5,          // 最小点间距 (像素)
  throttle: 16,                // 节流时间 (毫秒)
  velocityFilterWeight: 0.7,   // 速度过滤权重 (0-1)
}
```

### 压力感应

```typescript
{
  pressureSensitive: true,  // 启用压力感应
}
```

支持的设备：
- ✅ Apple Pencil
- ✅ Wacom 手写笔
- ✅ Surface Pen
- ✅ 其他支持 Pointer Events 的压感设备

### 历史管理

```typescript
{
  maxHistorySize: 50,  // 最大历史记录数
}
```

### 事件回调

```typescript
{
  onBegin: (event) => {
    console.log('开始绘制', event);
  },
  onChange: (event) => {
    console.log('绘制中', event);
  },
  onEnd: (event) => {
    console.log('结束绘制', event);
  },
}
```

## 🎯 基本操作

### 清空签名

```typescript
signature.clear();
```

### 撤销操作

```typescript
// 撤销最后一笔
signature.undo();

// 检查能否撤销
if (signature.canUndo()) {
  signature.undo();
}
```

### 重做操作

```typescript
// 重做
signature.redo();

// 检查能否重做
if (signature.canRedo()) {
  signature.redo();
}
```

### 检查状态

```typescript
// 检查是否为空
if (signature.isEmpty()) {
  alert('请先签名！');
}

// 检查能否操作
console.log('可撤销:', signature.canUndo());
console.log('可重做:', signature.canRedo());
console.log('是否启用:', signature.isEnabled());
```

## 📤 导出签名

### 导出为 PNG

```typescript
const pngDataUrl = signature.toDataURL('png');

// 显示在页面上
const img = document.createElement('img');
img.src = pngDataUrl;
document.body.appendChild(img);
```

### 导出为 JPEG

```typescript
// 默认质量
const jpeg = signature.toDataURL('jpeg');

// 自定义质量 (0-1, 1 = 最高质量)
const highQuality = signature.toDataURL('jpeg', 0.95);
const lowQuality = signature.toDataURL('jpeg', 0.7);
```

### 导出为 SVG

```typescript
const svgString = signature.toSVG();

// 创建 Blob
const blob = new Blob([svgString], { type: 'image/svg+xml' });
const url = URL.createObjectURL(blob);

// 在新窗口打开
window.open(url);
```

### 导出为 JSON

```typescript
const jsonData = signature.toJSON();

// 序列化保存
const json = JSON.stringify(jsonData, null, 2);
console.log(json);
```

### 直接下载

```typescript
// 下载 PNG
signature.download('my-signature', 'png');

// 下载 JPEG (自定义质量)
signature.download('signature', 'jpeg', 0.9);

// 下载 SVG
signature.download('signature', 'svg');

// 下载 JSON 数据
signature.download('signature-data', 'json');
```

## 🔄 导入签名

### 从 JSON 导入

```typescript
// 获取 JSON 数据
const saved = localStorage.getItem('signature');
const data = JSON.parse(saved);

// 导入签名
signature.fromJSON(data);
```

### 完整示例：保存和加载

```typescript
// 保存
function saveSignature() {
  const data = signature.toJSON();
  localStorage.setItem('signature', JSON.stringify(data));
  alert('签名已保存！');
}

// 加载
function loadSignature() {
  const saved = localStorage.getItem('signature');
  if (saved) {
    const data = JSON.parse(saved);
    signature.fromJSON(data);
    alert('签名已加载！');
  }
}
```

## 🎨 动态更新配置

```typescript
// 更改笔触颜色
signature.updateConfig({
  penColor: '#ff0000',
});

// 更改笔触粗细
signature.updateConfig({
  minWidth: 1,
  maxWidth: 5,
});

// 更改平滑算法
signature.updateConfig({
  smoothAlgorithm: 'bezier-cubic',
});

// 批量更新
signature.updateConfig({
  penColor: '#0066ff',
  minWidth: 1,
  maxWidth: 3,
  smoothAlgorithm: 'catmull-rom',
});
```

## 🔒 启用/禁用

```typescript
// 禁用签名板（不可绘制）
signature.setEnabled(false);

// 启用签名板
signature.setEnabled(true);

// 检查状态
if (signature.isEnabled()) {
  console.log('签名板已启用');
}
```

## 🧹 清理资源

```typescript
// 销毁签名板实例（移除事件监听器）
signature.destroy();
```

## 💡 使用技巧

### 1. 响应式尺寸

```typescript
function createResponsiveSignature() {
  const width = Math.min(window.innerWidth - 40, 800);
  const height = 300;
  
  return createSignaturePad(canvas, { width, height });
}

// 窗口大小改变时重新创建
window.addEventListener('resize', () => {
  signature.destroy();
  signature = createResponsiveSignature();
});
```

### 2. 验证签名

```typescript
function submitSignature() {
  if (signature.isEmpty()) {
    alert('请先签名！');
    return false;
  }
  
  const dataUrl = signature.toDataURL('png');
  // 提交到服务器
  return true;
}
```

### 3. 预览功能

```typescript
function previewSignature() {
  const dataUrl = signature.toDataURL('png');
  
  const previewImg = document.getElementById('preview');
  previewImg.src = dataUrl;
  previewImg.style.display = 'block';
}
```

### 4. 全屏签名

```typescript
function createFullscreenSignature() {
  const canvas = document.getElementById('canvas');
  
  return createSignaturePad(canvas, {
    width: window.innerWidth,
    height: window.innerHeight,
  });
}
```

## 🎯 完整示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>完整签名示例</title>
  <style>
    canvas {
      border: 2px solid #ddd;
      border-radius: 8px;
      display: block;
      margin: 20px auto;
    }
    
    .controls {
      text-align: center;
      margin-top: 10px;
    }
    
    button {
      margin: 0 5px;
      padding: 10px 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    }
    
    button:hover {
      background: #409eff;
      color: white;
      border-color: #409eff;
    }
  </style>
</head>
<body>
  <h1 style="text-align: center">签名示例</h1>
  
  <canvas id="signature" width="600" height="300"></canvas>
  
  <div class="controls">
    <button onclick="handleClear()">清空</button>
    <button onclick="handleUndo()">撤销</button>
    <button onclick="handleRedo()">重做</button>
    <button onclick="handleDownload()">下载</button>
    <button onclick="handleSave()">保存</button>
    <button onclick="handleLoad()">加载</button>
  </div>
  
  <script type="module">
    import { createSignaturePad } from '@ldesign/signature';
    
    const canvas = document.getElementById('signature');
    const sig = createSignaturePad(canvas, {
      penColor: '#000000',
      minWidth: 0.5,
      maxWidth: 2.5,
      smoothAlgorithm: 'catmull-rom',
      onEnd: () => console.log('签名完成'),
    });
    
    window.handleClear = () => sig.clear();
    window.handleUndo = () => sig.undo();
    window.handleRedo = () => sig.redo();
    window.handleDownload = () => sig.download('signature', 'png');
    
    window.handleSave = () => {
      if (sig.isEmpty()) {
        alert('签名为空！');
        return;
      }
      const data = sig.toJSON();
      localStorage.setItem('signature', JSON.stringify(data));
      alert('保存成功！');
    };
    
    window.handleLoad = () => {
      const saved = localStorage.getItem('signature');
      if (!saved) {
        alert('没有保存的签名！');
        return;
      }
      const data = JSON.parse(saved);
      sig.fromJSON(data);
      alert('加载成功！');
    };
  </script>
</body>
</html>
```

## 🔗 下一步

- [高级功能](/guide/advanced-features) - 探索更多高级功能
- [API 文档](/api/signature-pad) - 查看完整 API
- [框架集成](/frameworks/vue) - 在框架中使用

