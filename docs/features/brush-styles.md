# 笔触样式

6种专业笔触效果。

## 🎨 可用样式

### DEFAULT - 默认笔触
标准圆滑笔触，适合大多数场景。

### PEN - 钢笔
均匀的线条，边缘清晰。

### BRUSH - 毛笔
有纹理感的笔触，多层叠加效果。

### PENCIL - 铅笔
带颗粒感的笔触，模拟铅笔质感。

### MARKER - 马克笔
半透明笔触，叠加时颜色加深。

### NEON - 霓虹灯
发光效果，带阴影光晕。

## 🚀 使用方法

```typescript
import { BrushStyle, BrushFactory } from '@ldesign/signature';

// 获取笔触渲染器
const brush = BrushFactory.getBrush(BrushStyle.BRUSH);

// 在自定义渲染中使用
brush.drawStroke(ctx, point1, point2, color, width);
```

## 💡 示例

```typescript
import { BrushStyle, BrushFactory } from '@ldesign/signature';

// 使用毛笔效果
const brush = BrushFactory.getBrush(BrushStyle.BRUSH);

// 使用霓虹灯效果
const neon = BrushFactory.getBrush(BrushStyle.NEON);

// 在渲染循环中
for (let i = 1; i < points.length; i++) {
  brush.drawStroke(ctx, points[i-1], points[i], '#000000', 2);
}
```

## 🎯 样式对比

| 样式 | 效果 | 适用场景 |
|------|------|---------|
| DEFAULT | 标准圆滑 | 通用 |
| PEN | 均匀清晰 | 正式文档 |
| BRUSH | 纹理质感 | 艺术创作 |
| PENCIL | 颗粒感 | 草图、手绘 |
| MARKER | 半透明 | 标记、批注 |
| NEON | 发光 | 特殊效果 |

## 🔗 相关文档

- [高级功能](/guide/advanced-features)

