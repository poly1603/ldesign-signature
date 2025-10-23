# @ldesign/signature - Vite Demo

完整的 Vite + Vue 3 演示应用，展示 @ldesign/signature 的所有功能。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd libraries/signature/examples/vite-demo
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

浏览器会自动打开 http://localhost:3000

### 3. 构建生产版本

```bash
pnpm build
pnpm preview
```

## 📚 功能演示

### Tab 1: 基础功能
- ✅ Canvas 绘图
- ✅ 配置面板（笔触颜色、粗细、平滑算法）
- ✅ 压力感应开关
- ✅ 控制按钮（清空、撤销、重做）
- ✅ 多格式导出（PNG、JPEG、SVG、JSON）
- ✅ 实时状态显示
- ✅ 导出预览

### Tab 2: 高级功能
- ✅ 背景设置（透明/纯色/图片）
- ✅ 水印配置（文字/位置/透明度）
- ✅ 签名裁剪（自动去空白）
- ✅ 签名缩放（智能缩放）
- ✅ 签名压缩（优化文件大小）
- ✅ 处理结果预览

### Tab 3: 签名验证
- ✅ 双签名对比界面
- ✅ 特征提取
- ✅ 相似度对比（Hausdorff 距离）
- ✅ 签名验证
- ✅ 复杂度评分
- ✅ JSON 结果展示

### Tab 4: Composable API
- ✅ useSignature Hook 演示
- ✅ 响应式状态（isEmpty/canUndo/canRedo）
- ✅ 方法调用（clear/undo/redo）
- ✅ 代码示例展示

### Tab 5: 功能特性
- ✅ 12 个功能卡片
- ✅ 功能完成度统计
- ✅ 技术亮点介绍

## 🎨 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **语言**: TypeScript
- **签名库**: @ldesign/signature
- **样式**: 纯 CSS

## 📁 项目结构

```
vite-demo/
├── src/
│   ├── App.vue              # 主应用（5个Tab）
│   ├── main.ts              # 应用入口
│   └── style.css            # 全局样式
├── index.html               # HTML 模板
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TS 配置
├── package.json             # 依赖配置
└── README.md                # 本文件
```

## 🎯 使用示例

### 基础使用（组件）

```vue
<template>
  <SignaturePad
    :width="800"
    :height="400"
    pen-color="#000000"
    :min-width="0.5"
    :max-width="2.5"
    smooth-algorithm="catmull-rom"
    :show-controls="true"
    @begin="onBegin"
    @change="onChange"
    @end="onEnd"
  />
</template>

<script setup>
import { SignaturePad } from '@ldesign/signature/vue';

const onBegin = (e) => console.log('开始绘制');
const onChange = (e) => console.log('绘制中');
const onEnd = (e) => console.log('结束绘制');
</script>
```

### 高级使用（Composable）

```vue
<script setup>
import { useSignature } from '@ldesign/signature/vue';

const {
  canvasRef,
  isEmpty,
  canUndo,
  canRedo,
  clear,
  undo,
  redo,
  toDataURL,
  download,
} = useSignature({
  width: 800,
  height: 400,
  penColor: '#000000',
  smoothAlgorithm: 'catmull-rom',
});
</script>

<template>
  <canvas ref="canvasRef"></canvas>
  <button @click="clear" :disabled="isEmpty">清空</button>
  <button @click="undo" :disabled="!canUndo">撤销</button>
  <button @click="redo" :disabled="!canRedo">重做</button>
</template>
```

### 工具函数

```typescript
import {
  cropSignature,
  scaleSignature,
  compressSignature,
  compareSignatures,
  extractFeatures,
  validateSignature,
} from '@ldesign/signature';

// 裁剪
const cropped = cropSignature(canvas, { padding: 10 });

// 缩放
const scaled = scaleSignature(canvas, {
  width: 400,
  height: 200,
  maintainAspectRatio: true,
});

// 压缩
const compressed = compressSignature(canvas, 'jpeg', {
  quality: 0.8,
  maxSize: 100 * 1024,
});

// 对比
const result = compareSignatures(signature1, signature2);
```

## 🎨 自定义主题

修改 `src/style.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #409eff;
  --danger-color: #f56c6c;
  --border-color: #ddd;
  --background-color: #f5f5f5;
}
```

## 📝 注意事项

1. **开发环境**: 使用 `pnpm dev` 启动
2. **生产构建**: 使用 `pnpm build` 构建
3. **预览**: 使用 `pnpm preview` 预览构建结果
4. **端口**: 默认 3000，可在 `vite.config.ts` 修改

## 🐛 故障排除

### 问题 1: 找不到模块

**解决**: 确保在 signature 根目录运行过 `pnpm install`

### 问题 2: TypeScript 报错

**解决**: 运行 `pnpm install` 安装类型定义

### 问题 3: 热更新不工作

**解决**: 重启开发服务器 `pnpm dev`

## 📖 更多资源

- [完整文档](../../README.md)
- [API 文档](../../README.md#api)
- [实施总结](../../IMPLEMENTATION_SUMMARY.md)
- [项目计划](../../PROJECT_PLAN.md)

## 📄 许可证

MIT License © 2025 LDesign Team

