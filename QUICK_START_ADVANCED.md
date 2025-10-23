# ⚡ 高级功能快速开始

## 🚀 5分钟上手所有高级功能

### 1. 📹 签名回放 (30秒)

```typescript
import { createSignaturePad, createReplay } from '@ldesign/signature';

// 1. 创建签名板
const pad = createSignaturePad(canvas);

// 2. 签名完成后
pad.on('end', () => {
  const data = pad.toJSON();
  
  // 3. 创建回放
  const replay = createReplay(canvas, data);
  
  // 4. 播放
  replay.play({ speed: 1, loop: false });
});
```

---

### 2. 🎨 切换笔触样式 (1分钟)

```typescript
import { BrushStyle, BrushFactory } from '@ldesign/signature';

// 获取毛笔效果
const brush = BrushFactory.getBrush(BrushStyle.BRUSH);

// 在渲染时使用（需要自定义渲染器）
// 或等待下个版本的内置支持

// 所有可用样式：
// DEFAULT, PEN, BRUSH, PENCIL, MARKER, NEON
```

---

### 3. 📐 显示网格辅助 (30秒)

```typescript
import { GridHelper } from '@ldesign/signature';

const grid = new GridHelper(canvas);

// 绘制网格
grid.draw({
  showGrid: true,
  showBaseline: true,
  baselinePosition: 0.5
});

// 签名后清除
grid.clear();
```

---

### 4. 💾 自动保存签名 (1分钟)

```typescript
import { createStorage } from '@ldesign/signature';

// 创建存储
const storage = createStorage({ maxHistory: 50 });

// 自动保存
pad.on('end', () => {
  const data = pad.toJSON();
  const id = storage.save(data, ['重要']);
  console.log('已保存:', id);
});

// 加载历史
const history = storage.getHistory();
console.log(`共有 ${history.length} 个签名`);

// 加载某个签名
const record = storage.load(id);
if (record) {
  pad.fromJSON(record.data);
}
```

---

### 5. 🖼️ 应用滤镜 (30秒)

```typescript
import { SignatureFilter, FilterType } from '@ldesign/signature';

const canvas = pad.getCanvas();

// 黑白效果
SignatureFilter.apply(canvas, FilterType.GRAYSCALE);

// 复古效果
SignatureFilter.apply(canvas, FilterType.SEPIA);

// 发光效果（先锐化再对比度）
SignatureFilter.apply(canvas, FilterType.SHARPEN);
SignatureFilter.apply(canvas, FilterType.CONTRAST, 1.5);
```

---

## 🎯 组合使用示例

### 完整工作流程

```typescript
import {
  createSignaturePad,
  createReplay,
  GridHelper,
  createStorage,
  SignatureFilter,
  FilterType
} from '@ldesign/signature';

// 1. 初始化
const canvas = document.getElementById('canvas');
const pad = createSignaturePad(canvas, {
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5
});

// 2. 显示网格
const grid = new GridHelper(canvas);
grid.draw({ showGrid: true, showBaseline: true });

// 3. 创建存储
const storage = createStorage();

// 4. 签名开始时
pad.on('begin', () => {
  // 网格保持显示
});

// 5. 签名结束时
pad.on('end', () => {
  // 清除网格
  grid.clear();
  
  // 保存签名
  const data = pad.toJSON();
  const id = storage.save(data, ['新签名']);
  
  // 应用滤镜
  const canvas = pad.getCanvas();
  SignatureFilter.apply(canvas, FilterType.SHARPEN);
});

// 6. 导出按钮
document.getElementById('export').onclick = () => {
  const dataUrl = pad.toDataURL('png');
  // 下载或上传
};

// 7. 回放按钮
document.getElementById('replay').onclick = () => {
  const data = pad.toJSON();
  const replay = createReplay(canvas, data);
  replay.play({
    speed: 1,
    onComplete: () => console.log('回放完成')
  });
};

// 8. 历史记录按钮
document.getElementById('history').onclick = () => {
  const history = storage.getHistory();
  history.forEach(record => {
    console.log(`签名 ${record.id}:`, new Date(record.createdAt));
  });
};
```

---

## 💡 最佳实践

### 1. 性能优化
- 滤镜应用后立即导出，避免重复处理
- 历史记录定期清理
- 网格只在需要时显示

### 2. 用户体验
- 回放速度根据签名复杂度调整
- 网格颜色与背景对比明显
- 保存时提供视觉反馈

### 3. 错误处理
```typescript
try {
  const record = storage.load(id);
  if (record) {
    pad.fromJSON(record.data);
  } else {
    console.error('签名不存在');
  }
} catch (e) {
  console.error('加载失败:', e);
}
```

---

## 📚 更多资源

- [完整功能文档](./ADVANCED_FEATURES.md)
- [API 文档](./README.md)
- [Vite Demo](./examples/vite-demo/)

---

**提示**: 所有功能都已在 Vite Demo 中集成，运行 `pnpm dev` 查看完整演示！

