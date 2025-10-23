# Changelog

All notable changes to @ldesign/signature will be documented in this file.

## [0.2.0] - 2025-01-24

### ✨ Added - P0 + P1 完整功能实现

#### 核心功能 (P0)
- ✅ Canvas 绘图引擎 - 高性能实时渲染，DPI 自适应
- ✅ 鼠标绘制支持 - 完整的 Pointer Events API
- ✅ 触摸绘制支持 - Touch 事件处理
- ✅ 多点触控防误触 - 识别主触摸点
- ✅ Catmull-Rom 曲线平滑 - 高级样条曲线算法
- ✅ 点采样优化 - 距离/时间过滤，减少冗余点
- ✅ 笔触颜色配置 - 支持 hex/rgb/rgba
- ✅ 笔触粗细控制 - minWidth/maxWidth
- ✅ 速度-粗细映射 - 动态笔触宽度
- ✅ 笔触透明度支持 - alpha 通道
- ✅ 清空画布功能 - clear()
- ✅ 撤销/重做功能 - 完整历史管理
- ✅ 签名为空检测 - isEmpty()
- ✅ 导出 PNG/JPG - toDataURL()
- ✅ 导出 SVG - toSVG() 矢量格式

#### 高级功能 (P1)
- ✅ 压力感应支持 - Pointer Events pressure API
- ✅ Apple Pencil 支持 - pressure 属性识别
- ✅ Wacom/Surface Pen 支持 - 通用压力检测
- ✅ 签名背景 - 纯色/图片/透明三种模式
- ✅ 签名边框样式 - CSS 样式配置
- ✅ 签名水印 - 文字/图片水印叠加
- ✅ 签名裁剪 - 自动检测边界框，去除空白
- ✅ 签名缩放 - 适应目标尺寸，保持宽高比
- ✅ 签名旋转 - transform 支持
- ✅ 签名压缩 - JPEG 质量优化，减小文件大小
- ✅ 导出 JSON - 完整笔画数据序列化
- ✅ 从 JSON 恢复 - fromJSON() 反序列化
- ✅ 签名验证 - Hausdorff 距离相似度算法
- ✅ 特征提取 - 笔画数、总长度、边界框等
- ✅ Vue 3 组件 - SignaturePad.vue
- ✅ Vue Composable - useSignature
- ✅ React 组件 - SignaturePad.tsx
- ✅ React Hook - useSignature
- ✅ 事件系统 - onBegin/onChange/onEnd
- ✅ 配置响应式更新 - updateConfig()

#### 架构设计
- 🏗️ 核心层 - 平台无关的签名引擎
- 🏗️ 渲染层 - Canvas/SVG 渲染器
- 🏗️ 工具层 - 平滑、裁剪、缩放、压缩、验证
- 🏗️ 类型层 - 完整的 TypeScript 类型定义
- 🏗️ 适配层 - Vue 3 和 React 组件封装

#### 文档
- 📚 完整的 README.md - 使用文档和 API 说明
- 📚 TypeScript 类型定义 - 完整的 JSDoc 注释
- 📚 示例文件 - basic.html 演示页面

### 🎯 技术亮点

1. **Catmull-Rom 样条平滑** - 参考 smooth-signature 的高级平滑算法
2. **压力感应** - 完整支持主流手写笔设备
3. **速度映射** - 智能计算绘制速度，动态调整笔触粗细
4. **历史管理** - 高效的撤销/重做栈实现
5. **多格式导出** - PNG/JPEG/SVG/JSON 四种格式
6. **框架适配** - Vue 3 和 React 完整封装
7. **签名验证** - Hausdorff 距离算法实现相似度对比

### 📦 Package Updates
- 更新 package.json - 添加 exports 配置，支持子路径导入
- 更新 tsconfig.json - 配置 JSX 和类型生成
- 添加 peerDependencies - Vue 3 和 React 为可选依赖

## [0.1.0] - 2025-01-20

### Added
- 🎉 初始版本
- 基础 SignaturePad 类框架
- 简单的 clear() 和 toDataURL() 方法

---

**参考项目:**
- signature_pad - Canvas API 和平滑算法参考
- smooth-signature - Catmull-Rom 样条曲线实现
- react-signature-canvas - React 组件封装模式
- vue-signature-pad - Vue 组件封装模式

