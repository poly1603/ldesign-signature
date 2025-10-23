# 图像滤镜

为签名添加专业的视觉效果。

## 🖼️ 简介

图像滤镜功能提供8种专业滤镜效果，可以快速改变签名的视觉风格。

## 🎨 可用滤镜

- **GRAYSCALE** - 黑白效果
- **INVERT** - 反色效果
- **SEPIA** - 复古（棕褐色）
- **SHARPEN** - 锐化
- **BLUR** - 模糊
- **CONTRAST** - 对比度调整
- **BRIGHTNESS** - 亮度调整
- **NONE** - 无滤镜

## 🚀 基础用法

```typescript
import { SignatureFilter, FilterType } from '@ldesign/signature';

const canvas = signature.getCanvas();

// 应用黑白滤镜
SignatureFilter.apply(canvas, FilterType.GRAYSCALE);
```

## 💡 使用示例

### 黑白效果

```typescript
SignatureFilter.apply(canvas, FilterType.GRAYSCALE);
```

### 复古效果

```typescript
SignatureFilter.apply(canvas, FilterType.SEPIA);
```

### 锐化

```typescript
SignatureFilter.apply(canvas, FilterType.SHARPEN);
```

### 模糊（可调强度）

```typescript
// 轻微模糊
SignatureFilter.apply(canvas, FilterType.BLUR, 1);

// 中度模糊
SignatureFilter.apply(canvas, FilterType.BLUR, 2);

// 重度模糊
SignatureFilter.apply(canvas, FilterType.BLUR, 3);
```

### 对比度

```typescript
// 提高对比度
SignatureFilter.apply(canvas, FilterType.CONTRAST, 1.5);

// 降低对比度
SignatureFilter.apply(canvas, FilterType.CONTRAST, 0.7);
```

### 亮度

```typescript
// 增加亮度
SignatureFilter.apply(canvas, FilterType.BRIGHTNESS, 1.2);

// 降低亮度
SignatureFilter.apply(canvas, FilterType.BRIGHTNESS, 0.8);
```

## 🎨 滤镜链

组合多个滤镜：

```typescript
const canvas = signature.getCanvas();

// 先锐化
SignatureFilter.apply(canvas, FilterType.SHARPEN);

// 再提高对比度
SignatureFilter.apply(canvas, FilterType.CONTRAST, 1.3);

// 最后应用复古效果
SignatureFilter.apply(canvas, FilterType.SEPIA);

// 导出
const result = signature.toDataURL('png');
```

## ⚠️ 注意事项

1. **不可逆操作** - 滤镜会直接修改 Canvas，建议先保存原始数据
2. **性能考虑** - 滤镜处理需要遍历所有像素，大尺寸 Canvas 可能较慢
3. **导出时机** - 应用滤镜后建议立即导出，避免重复处理

## 💡 最佳实践

### 导出前应用滤镜

```typescript
function exportWithFilter(filterType: FilterType) {
  // 1. 获取原始 Canvas
  const canvas = signature.getCanvas();
  
  // 2. 克隆 Canvas
  const cloned = document.createElement('canvas');
  cloned.width = canvas.width;
  cloned.height = canvas.height;
  const ctx = cloned.getContext('2d');
  ctx.drawImage(canvas, 0, 0);
  
  // 3. 在克隆上应用滤镜
  SignatureFilter.apply(cloned, filterType);
  
  // 4. 导出克隆的 Canvas
  return cloned.toDataURL('png');
}

// 使用
const grayscalePng = exportWithFilter(FilterType.GRAYSCALE);
```

## 🔗 相关文档

- [高级功能](/guide/advanced-features)
- [API 文档](/api/signature-pad)

