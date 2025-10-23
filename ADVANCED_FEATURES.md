# 🚀 @ldesign/signature - 高级功能文档

## ✨ 新增功能总览

### 1. 📹 签名回放动画
### 2. 🎨 笔触样式库
### 3. 📐 网格辅助线
### 4. 💾 本地存储/历史记录
### 5. 🖼️ 图像滤镜

---

## 📹 1. 签名回放动画

重现签名绘制过程的动画效果。

### 使用方法

```typescript
import { createReplay } from '@ldesign/signature';

// 获取签名数据
const signatureData = signaturePad.toJSON();

// 创建回放实例
const replay = createReplay(canvas, signatureData);

// 开始回放
replay.play({
  speed: 1,        // 回放速度倍数
  loop: false,     // 是否循环播放
  onFrame: (progress) => {
    console.log(`进度: ${(progress * 100).toFixed(0)}%`);
  },
  onComplete: () => {
    console.log('回放完成');
  }
});

// 控制回放
replay.pause();   // 暂停
replay.resume();  // 恢复
replay.stop();    // 停止
replay.reset();   // 重置
```

### API

| 方法 | 说明 | 参数 |
|-----|------|------|
| `play(options)` | 开始回放 | ReplayOptions |
| `pause()` | 暂停回放 | - |
| `resume()` | 恢复回放 | - |
| `stop()` | 停止回放 | - |
| `reset()` | 重置回放 | - |
| `getProgress()` | 获取进度 (0-1) | - |
| `destroy()` | 销毁实例 | - |

---

## 🎨 2. 笔触样式库

6种专业笔触效果。

### 可用样式

- **DEFAULT** - 默认笔触
- **PEN** - 钢笔效果（均匀线条）
- **BRUSH** - 毛笔效果（有纹理感）
- **PENCIL** - 铅笔效果（有颗粒感）
- **MARKER** - 马克笔效果（半透明）
- **NEON** - 霓虹灯效果（发光）

### 使用方法

```typescript
import { BrushStyle, BrushFactory } from '@ldesign/signature';

// 获取笔触渲染器
const brush = BrushFactory.getBrush(BrushStyle.BRUSH);

// 在自定义渲染中使用
brush.drawStroke(ctx, point1, point2, color, width);
```

### 集成到 SignaturePad

目前笔触样式需要自定义渲染器集成，未来版本将直接支持配置。

---

## 📐 3. 网格辅助线

帮助用户对齐和规范签名。

### 使用方法

```typescript
import { GridHelper } from '@ldesign/signature';

const grid = new GridHelper(canvas);

// 绘制网格和辅助线
grid.draw({
  showGrid: true,           // 显示网格
  gridSize: 20,            // 网格大小 (px)
  gridColor: '#e0e0e0',    // 网格颜色
  gridOpacity: 0.5,        // 网格透明度
  showBaseline: true,      // 显示基线
  baselinePosition: 0.5,   // 基线位置 (0-1)
  baselineColor: '#409eff',// 基线颜色
  showBorder: true,        // 显示签名框
  borderColor: '#409eff'   // 签名框颜色
});

// 清除网格
grid.clear();
```

### 典型用例

```typescript
// 在签名前绘制网格
grid.draw({ showGrid: true, showBaseline: true });

// 签名时网格保持显示
signaturePad.on('begin', () => {
  // 网格继续显示
});

// 签名后清除网格
signaturePad.on('end', () => {
  grid.clear();
});
```

---

## 💾 4. 本地存储/历史记录

自动保存签名到浏览器本地存储。

### 使用方法

```typescript
import { createStorage } from '@ldesign/signature';

// 创建存储实例
const storage = createStorage({
  keyPrefix: 'my_signature_',  // 存储键前缀
  maxHistory: 50,             // 最大历史记录数
  autoSave: true              // 自动保存
});

// 保存签名
const signatureData = signaturePad.toJSON();
const id = storage.save(signatureData, ['重要', '合同']);

// 加载签名
const record = storage.load(id);
if (record) {
  signaturePad.fromJSON(record.data);
}

// 获取历史记录
const history = storage.getHistory();
history.forEach(record => {
  console.log(`ID: ${record.id}, 时间: ${new Date(record.createdAt)}`);
});

// 搜索签名
const results = storage.search('合同');

// 删除签名
storage.delete(id);

// 清空所有历史
storage.clearHistory();

// 获取存储信息
const info = storage.getStorageInfo();
console.log(`存储了 ${info.count} 个签名, 约 ${(info.estimatedSize / 1024).toFixed(2)} KB`);
```

### API

| 方法 | 说明 | 返回值 |
|-----|------|--------|
| `save(data, tags?)` | 保存签名 | string (ID) |
| `load(id)` | 加载签名 | SignatureRecord | null |
| `delete(id)` | 删除签名 | void |
| `getHistory()` | 获取历史列表 | SignatureRecord[] |
| `clearHistory()` | 清空历史 | void |
| `search(query)` | 搜索签名 | SignatureRecord[] |
| `getStorageInfo()` | 获取存储信息 | {count, estimatedSize} |

---

## 🖼️ 5. 图像滤镜

为签名添加视觉效果。

### 可用滤镜

- **NONE** - 无滤镜
- **GRAYSCALE** - 黑白
- **INVERT** - 反色
- **SEPIA** - 棕褐色（复古）
- **SHARPEN** - 锐化
- **BLUR** - 模糊
- **CONTRAST** - 对比度
- **BRIGHTNESS** - 亮度

### 使用方法

```typescript
import { SignatureFilter, FilterType } from '@ldesign/signature';

const canvas = signaturePad.getCanvas();

// 应用黑白滤镜
SignatureFilter.apply(canvas, FilterType.GRAYSCALE);

// 应用复古滤镜
SignatureFilter.apply(canvas, FilterType.SEPIA);

// 应用模糊滤镜（强度可调）
SignatureFilter.apply(canvas, FilterType.BLUR, 2);

// 应用对比度滤镜
SignatureFilter.apply(canvas, FilterType.CONTRAST, 1.5);

// 应用亮度滤镜
SignatureFilter.apply(canvas, FilterType.BRIGHTNESS, 1.2);
```

### 滤镜链

```typescript
// 组合多个滤镜
const canvas = signaturePad.getCanvas();

SignatureFilter.apply(canvas, FilterType.CONTRAST, 1.3);
SignatureFilter.apply(canvas, FilterType.SHARPEN);
SignatureFilter.apply(canvas, FilterType.SEPIA);
```

---

## 🎯 完整示例

### 带所有功能的签名应用

```typescript
import { 
  createSignaturePad,
  createReplay,
  createStorage,
  GridHelper,
  SignatureFilter,
  FilterType,
  BrushStyle
} from '@ldesign/signature';

// 1. 创建签名板
const canvas = document.getElementById('signature-canvas');
const signaturePad = createSignaturePad(canvas, {
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5
});

// 2. 添加网格
const grid = new GridHelper(canvas);
grid.draw({ showGrid: true, showBaseline: true });

// 3. 创建存储
const storage = createStorage();

// 4. 签名完成后
signaturePad.on('end', () => {
  // 清除网格
  grid.clear();
  
  // 自动保存
  const data = signaturePad.toJSON();
  const id = storage.save(data);
  console.log('签名已保存:', id);
});

// 5. 导出前应用滤镜
function exportWithFilter(filterType: FilterType) {
  const canvas = signaturePad.getCanvas();
  SignatureFilter.apply(canvas, filterType);
  const dataUrl = signaturePad.toDataURL('png');
  return dataUrl;
}

// 6. 回放签名
function replaySignature() {
  const data = signaturePad.toJSON();
  const replayCanvas = document.getElementById('replay-canvas');
  const replay = createReplay(replayCanvas, data);
  
  replay.play({
    speed: 1,
    loop: false,
    onFrame: (progress) => {
      console.log(`回放进度: ${(progress * 100).toFixed(0)}%`);
    },
    onComplete: () => {
      console.log('回放完成');
    }
  });
}

// 7. 历史记录管理
function loadHistory() {
  const history = storage.getHistory();
  return history.map(record => ({
    id: record.id,
    date: new Date(record.createdAt).toLocaleString(),
    tags: record.tags || []
  }));
}
```

---

## 📊 功能对比表

| 功能 | 基础版 | 高级版 |
|-----|--------|--------|
| Canvas 绘图 | ✅ | ✅ |
| 触摸/鼠标支持 | ✅ | ✅ |
| 压力感应 | ✅ | ✅ |
| 撤销/重做 | ✅ | ✅ |
| 多格式导出 | ✅ | ✅ |
| **签名回放** | ❌ | ✅ |
| **笔触样式** | ❌ | ✅ (6种) |
| **网格辅助** | ❌ | ✅ |
| **本地存储** | ❌ | ✅ |
| **图像滤镜** | ❌ | ✅ (8种) |

---

## 🎨 使用场景

### 1. 电子合同签署
- 使用**网格辅助**规范签名位置
- 使用**本地存储**保存签名记录
- 使用**回放动画**展示签名过程（防伪）

### 2. 艺术创作
- 使用**笔触样式**选择不同效果
- 使用**滤镜**添加艺术效果
- 使用**回放**重现创作过程

### 3. 教育培训
- 使用**网格辅助**教学签名规范
- 使用**回放**演示正确写法
- 使用**历史记录**跟踪学习进度

### 4. 身份认证
- 使用**回放**验证签名过程
- 使用**本地存储**建立签名库
- 使用**对比功能**验证真伪

---

## 🔧 性能优化建议

1. **回放动画** - 大量点时建议降低回放速度
2. **滤镜处理** - 应用滤镜后建议导出，避免重复计算
3. **本地存储** - 定期清理历史记录，避免存储溢出
4. **网格绘制** - 只在需要时绘制，不绘制时性能更好

---

## 📚 更多资源

- [完整 API 文档](./README.md)
- [基础使用教程](./examples/README.md)
- [Vite Demo](./examples/vite-demo/)
- [实施总结](./IMPLEMENTATION_SUMMARY.md)

---

**文档版本**: 1.0  
**最后更新**: 2025-01-24  
**适用版本**: @ldesign/signature v0.3.0+

