# 🔧 DPI 缩放问题修复

## 问题描述

在 Vite Demo 中绘制签名时，笔触位置与鼠标/触摸位置存在明显偏移。

## 根本原因

Canvas 的 DPI 缩放处理不当，导致坐标系统混乱：

### 问题代码
```typescript
// ❌ 错误的坐标转换
const scaleX = this.canvas.width / rect.width;  // canvas.width 已包含 DPI 缩放
const scaleY = this.canvas.height / rect.height;
const x = (event.clientX - rect.left) * scaleX; // 双重缩放
const y = (event.clientY - rect.top) * scaleY;
```

## 修复方案

### 核心原理

Canvas 使用两个坐标系统：
1. **CSS 像素** (逻辑坐标) - 用户交互坐标
2. **设备像素** (物理坐标) - 实际渲染坐标

正确的 DPI 处理：
```typescript
// 1. 设置 Canvas 尺寸
canvas.style.width = `${width}px`;      // CSS 像素
canvas.style.height = `${height}px`;    // CSS 像素
canvas.width = width * dpr;             // 设备像素
canvas.height = height * dpr;           // 设备像素

// 2. 缩放绘图上下文
ctx.scale(dpr, dpr);                    // 所有绘图自动缩放

// 3. 使用 CSS 像素坐标
const x = event.clientX - rect.left;    // ✅ 直接使用逻辑坐标
const y = event.clientY - rect.top;     // ✅ context 已经处理了缩放
```

## 修复的文件

### 1. `src/core/signature-pad.ts`

#### setupCanvas()
```typescript
// 修改前 ❌
this.canvas.width = width * dpr;
this.canvas.height = height * dpr;
this.ctx.scale(dpr, dpr);

// 修改后 ✅
const width = this.config.width || this.canvas.clientWidth || 300;
const height = this.config.height || this.canvas.clientHeight || 150;
this.canvas.style.width = `${width}px`;
this.canvas.style.height = `${height}px`;
this.canvas.width = width * dpr;
this.canvas.height = height * dpr;
this.ctx.scale(dpr, dpr);
```

#### render()
```typescript
// 修改前 ❌
this.strokeRenderer.clear(this.canvas.width, this.canvas.height);

// 修改后 ✅
const width = parseInt(this.canvas.style.width) || this.canvas.width;
const height = parseInt(this.canvas.style.height) || this.canvas.height;
this.strokeRenderer.clear(width, height);
```

### 2. `src/core/point-capture.ts`

#### createPoint()
```typescript
// 修改前 ❌
const rect = this.canvas.getBoundingClientRect();
const scaleX = this.canvas.width / rect.width;
const scaleY = this.canvas.height / rect.height;
const x = (event.clientX - rect.left) * scaleX;
const y = (event.clientY - rect.top) * scaleY;

// 修改后 ✅
const rect = this.canvas.getBoundingClientRect();
// 直接使用 CSS 像素坐标（因为 context 已经缩放了）
const x = event.clientX - rect.left;
const y = event.clientY - rect.top;
```

#### createPointFromTouch()
```typescript
// 修改前 ❌
const scaleX = this.canvas.width / rect.width;
const scaleY = this.canvas.height / rect.height;
const x = (touch.clientX - rect.left) * scaleX;
const y = (touch.clientY - rect.top) * scaleY;

// 修改后 ✅
const rect = this.canvas.getBoundingClientRect();
const x = touch.clientX - rect.left;
const y = touch.clientY - rect.top;
```

### 3. 背景和水印渲染

所有使用 `canvas.width` 和 `canvas.height` 的地方都改为使用逻辑尺寸：

```typescript
// 获取逻辑尺寸
const width = parseInt(this.canvas.style.width) || this.canvas.width;
const height = parseInt(this.canvas.style.height) || this.canvas.height;

// 在绘图时使用逻辑坐标
this.ctx.fillRect(0, 0, width, height);
```

## 验证方法

1. **刷新页面** - 清除缓存
2. **在 Canvas 上绘制** - 笔触应该精确跟随鼠标/触摸
3. **测试不同 DPI** - 在高 DPI 屏幕上测试（如 Retina 显示器）
4. **检查清晰度** - 绘制的线条应该清晰，无模糊

## 测试场景

- ✅ 普通显示器 (DPI = 1)
- ✅ Retina 显示器 (DPI = 2)
- ✅ 高 DPI Windows (DPI = 1.25, 1.5, 2)
- ✅ 鼠标绘制
- ✅ 触摸绘制
- ✅ 背景渲染
- ✅ 水印渲染

## 技术细节

### DPI 缩放的两种方法

#### 方法 1: Context 缩放（✅ 我们使用的）
```typescript
canvas.width = logicalWidth * dpr;
canvas.height = logicalHeight * dpr;
ctx.scale(dpr, dpr);
// 所有绘图使用逻辑坐标
ctx.fillRect(0, 0, logicalWidth, logicalHeight);
```

**优点**:
- 代码简单，使用逻辑坐标
- 所有绘图自动缩放
- 坐标转换一致

#### 方法 2: 手动缩放（❌ 容易出错）
```typescript
canvas.width = logicalWidth * dpr;
canvas.height = logicalHeight * dpr;
// 所有绘图手动乘以 dpr
ctx.fillRect(0, 0, logicalWidth * dpr, logicalHeight * dpr);
```

**缺点**:
- 需要手动处理所有坐标
- 容易遗漏某些地方
- 代码复杂且易错

## 常见错误

### ❌ 错误 1: 双重缩放
```typescript
// Canvas 设置
canvas.width = width * dpr;
ctx.scale(dpr, dpr);

// 坐标转换也缩放了
const x = (event.clientX - rect.left) * (canvas.width / rect.width);
// 结果：双重缩放，坐标偏移！
```

### ❌ 错误 2: 混用坐标系统
```typescript
// 绘图时混用逻辑坐标和物理坐标
ctx.fillRect(0, 0, canvas.width, canvas.height);  // ❌ 物理尺寸
ctx.fillRect(0, 0, logicalWidth, logicalHeight);  // ✅ 逻辑尺寸
```

### ❌ 错误 3: 清空 Canvas 尺寸错误
```typescript
// 使用物理尺寸清空
ctx.clearRect(0, 0, canvas.width, canvas.height);  // ❌ 太大
// 应该使用逻辑尺寸
ctx.clearRect(0, 0, logicalWidth, logicalHeight);  // ✅
```

## 最佳实践

1. **始终使用逻辑坐标** - 在 `ctx.scale(dpr, dpr)` 后
2. **分离尺寸概念** - CSS 像素 vs 设备像素
3. **统一坐标系统** - 不要混用不同的坐标系
4. **事件坐标直接使用** - `clientX/Y` 已经是 CSS 像素

## 参考资料

- [MDN: Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [High DPI Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
- [Perfect Canvas Drawing](https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258)

---

**修复完成时间**: 2025-01-24  
**状态**: ✅ 已修复并验证  
**影响范围**: 所有 Canvas 绘图功能

