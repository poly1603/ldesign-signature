# 网格辅助

帮助用户对齐和规范签名的辅助工具。

## 📐 简介

网格辅助功能提供网格线、基线、边框等视觉辅助元素，帮助用户绘制更规范的签名。

## 🚀 基础用法

```typescript
import { GridHelper } from '@ldesign/signature';

const grid = new GridHelper(canvas);

// 绘制网格
grid.draw({ showGrid: true });

// 清除网格
grid.clear();
```

## ⚙️ 配置选项

```typescript
grid.draw({
  showGrid: true,              // 显示网格
  gridSize: 20,               // 网格大小 (像素)
  gridColor: '#e0e0e0',       // 网格颜色
  gridOpacity: 0.5,           // 网格透明度 (0-1)
  showBaseline: true,         // 显示基线
  baselinePosition: 0.5,      // 基线位置 (0-1, 0.5=中间)
  baselineColor: '#409eff',   // 基线颜色
  showBorder: true,           // 显示边框
  borderColor: '#409eff',     // 边框颜色
});
```

## 💡 使用示例

### 基础网格

```typescript
const grid = new GridHelper(canvas);

grid.draw({
  showGrid: true,
  gridSize: 20,
});
```

### 签名基线

```typescript
grid.draw({
  showBaseline: true,
  baselinePosition: 0.6,  // 基线在60%位置
  baselineColor: '#409eff',
});
```

### 签名框

```typescript
grid.draw({
  showBorder: true,
  borderColor: '#409eff',
});
```

### 完整配置

```typescript
grid.draw({
  showGrid: true,
  gridSize: 25,
  gridColor: '#e0e0e0',
  gridOpacity: 0.3,
  showBaseline: true,
  baselinePosition: 0.5,
  baselineColor: '#409eff',
  showBorder: true,
  borderColor: '#409eff',
});
```

## 🎯 典型用例

### 签名前显示，签名时清除

```typescript
const grid = new GridHelper(canvas);

// 初始显示网格
grid.draw({ showGrid: true, showBaseline: true });

// 开始签名时清除
signature.on('begin', () => {
  grid.clear();
});
```

### 教学辅助

```typescript
// 显示详细的辅助线
grid.draw({
  showGrid: true,
  gridSize: 20,
  showBaseline: true,
  baselinePosition: 0.5,
  showBorder: true,
});

// 提示用户在基线上签名
console.log('请在蓝色基线上签名');
```

## 🔗 相关文档

- [高级功能](/guide/advanced-features)
- [最佳实践](/guide/best-practices)

