# Vite Demo 快速启动指南

## 🚀 启动步骤

### 1. 进入项目目录
```bash
cd libraries/signature/examples/vite-demo
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 启动开发服务器
```bash
pnpm dev
```

浏览器会自动打开 http://localhost:3000

---

## 🐛 常见问题解决

### 问题 1: 模块导入错误
**错误信息**: `Cannot find module '@ldesign/signature'`

**解决方案**:
```bash
# 在 signature 根目录安装依赖
cd ../../
pnpm install

# 然后回到 vite-demo 目录
cd examples/vite-demo
pnpm install
```

### 问题 2: TypeScript 类型错误
**错误信息**: `Cannot find type definitions`

**解决方案**:
```bash
# 重新安装类型定义
pnpm install --force
```

### 问题 3: Vite 配置错误
**错误信息**: Vite 相关错误

**解决方案**: 确保 `vite.config.ts` 中的 alias 配置正确
```typescript
resolve: {
  alias: {
    '@ldesign/signature': '../../src/index.ts',
    '@ldesign/signature/vue': '../../src/adapters/vue/index.ts',
  },
}
```

### 问题 4: 端口被占用
**错误信息**: `Port 3000 is already in use`

**解决方案**: 修改 `vite.config.ts` 中的端口号
```typescript
server: {
  port: 3001, // 改为其他端口
  open: true,
  host: true
}
```

---

## 📦 项目结构

```
vite-demo/
├── src/
│   ├── App.vue          # 主应用（5个Tab）
│   ├── main.ts          # 入口
│   └── style.css        # 样式
├── index.html
├── vite.config.ts       # Vite配置
├── tsconfig.json
└── package.json
```

---

## 🎯 功能演示

启动后会看到 5 个功能 Tab：

1. **📝 基础功能** - Canvas 签名、配置面板、多格式导出
2. **🎨 高级功能** - 背景/水印设置、签名处理
3. **🔍 签名验证** - 特征提取、相似度对比
4. **⚡ Composable** - useSignature Hook 演示
5. **🌟 功能特性** - 功能卡片展示

---

## 🔧 开发命令

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

---

## 📝 注意事项

1. **首次运行**: 确保在 signature 根目录运行过 `pnpm install`
2. **热更新**: 修改代码会自动刷新浏览器
3. **TypeScript**: 项目使用严格的 TS 配置
4. **网络访问**: 配置了 `host: true`，可通过 IP 访问

---

## 🎨 自定义

### 修改端口
编辑 `vite.config.ts`:
```typescript
server: {
  port: 3001, // 你的端口
  open: true,
  host: true
}
```

### 修改主题
编辑 `src/style.css` 中的颜色变量

---

## ✅ 验证安装

启动成功后应该看到：
- ✅ 浏览器自动打开
- ✅ 显示 5 个 Tab 切换按钮
- ✅ 可以在 Canvas 上绘制签名
- ✅ 控制按钮正常工作

---

## 🆘 需要帮助？

如果遇到问题：
1. 检查 Node.js 版本 (需要 >= 18)
2. 检查 pnpm 版本 (需要 >= 8)
3. 清除缓存: `pnpm store prune`
4. 重新安装: `rm -rf node_modules && pnpm install`

---

**问题已解决！现在可以正常启动了。** 🎉

