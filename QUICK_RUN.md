# 🚀 快速运行指南

快速启动 @ldesign/signature 项目的完整指南。

---

## 📋 前置要求

- Node.js >= 18
- pnpm >= 10
- Git

## ⚡ 一键启动

```bash
# 1. 安装所有依赖
pnpm install

# 2. 构建核心包和 React 包
pnpm --filter @ldesign/signature-core run build
pnpm --filter @ldesign/signature-react run build

# 3. 启动 React 演示
cd demos/react-app
pnpm run dev
```

然后打开浏览器访问 http://localhost:3000

---

## 📦 按包构建

### 核心包
```bash
cd packages/core
pnpm run build
# 输出: dist/index.cjs, dist/index.mjs (186 KB)
```

### React 包
```bash
cd packages/react
pnpm run build
# 输出: dist/index.cjs, dist/index.mjs (19.9 KB)
```

### Solid 包
```bash
cd packages/solid
pnpm run build
# 输出: dist/index.cjs, dist/index.mjs (16.1 KB)
```

### Qwik 包
```bash
cd packages/qwik
pnpm run build
# 输出: dist/index.cjs, dist/index.mjs (12.2 KB)
```

---

## 🧪 运行测试

### 核心包测试
```bash
cd packages/core
pnpm run test

# 监视模式
pnpm run test -- --watch

# 覆盖率报告
pnpm run test -- --coverage
```

### 所有包测试
```bash
pnpm run test
```

---

## 🎨 运行演示

### React 演示
```bash
cd demos/react-app
pnpm install  # 首次运行需要
pnpm run dev  # 开发模式
pnpm run build  # 构建生产版本
```

---

## 🔍 代码检查

### TypeScript 类型检查
```bash
# 检查核心包
cd packages/core
pnpm run type-check

# 检查 React 包
cd packages/react
pnpm run type-check
```

### ESLint 检查
```bash
# 检查所有代码
pnpm run lint

# 自动修复
pnpm run lint:fix
```

---

## 🛠️ 常见问题

### Q: 依赖安装失败？
A: 确保使用 pnpm 10+，并清理缓存：
```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

### Q: 构建失败？
A: 按顺序构建，确保核心包先构建：
```bash
# 1. 先构建核心包
pnpm --filter @ldesign/signature-core run build

# 2. 再构建框架包
pnpm --filter @ldesign/signature-react run build
```

### Q: 演示启动失败？
A: 确保已构建依赖包：
```bash
# 从项目根目录
pnpm --filter @ldesign/signature-core run build
pnpm --filter @ldesign/signature-react run build

# 然后启动演示
cd demos/react-app
pnpm run dev
```

### Q: 类型错误？
A: React 包需要配置 tsconfig paths：
```json
{
  "compilerOptions": {
    "paths": {
      "@ldesign/signature-core": ["../core/dist/index.d.ts"]
    }
  }
}
```

---

## 📊 项目状态检查

### 检查构建产物
```bash
# 核心包
ls packages/core/dist

# React 包
ls packages/react/dist

# Solid 包
ls packages/solid/dist

# Qwik 包
ls packages/qwik/dist
```

### 检查包信息
```bash
# 查看所有工作空间包
pnpm list -r --depth=0

# 查看特定包信息
pnpm --filter @ldesign/signature-core list
```

---

## 🔄 开发工作流

### 标准开发流程
```bash
# 1. 开发核心包
cd packages/core
pnpm run dev  # 监视模式

# 2. 在另一个终端开发框架包
cd packages/react
pnpm run dev

# 3. 在第三个终端运行演示
cd demos/react-app
pnpm run dev

# 4. 修改代码后自动重新构建
```

### 测试驱动开发
```bash
# 1. 运行测试监视模式
cd packages/core
pnpm run test -- --watch

# 2. 修改代码
# 3. 测试自动运行
# 4. 确保测试通过后提交
```

---

## 📈 性能基准

### 构建时间
```
core:   ~7s
react:  ~4s
solid:  ~2s
qwik:   ~2s
总计:    ~15s
```

### 包大小
```
core:   186 KB
react:  19.9 KB
solid:  16.1 KB
qwik:   12.2 KB
总计:    234.2 KB
```

---

## 🔗 有用的命令

### 清理所有构建产物
```bash
pnpm -r run clean
```

### 批量构建所有成功的包
```bash
# 从根目录
pnpm --filter @ldesign/signature-core run build && \
pnpm --filter @ldesign/signature-react run build && \
pnpm --filter @ldesign/signature-solid run build && \
pnpm --filter @ldesign/signature-qwik run build
```

### 查看包依赖树
```bash
pnpm list -r --depth=1
```

### 更新所有依赖
```bash
pnpm update -r
```

---

## 📝 脚本快捷方式

创建一个 `scripts/build-all.sh` 快速构建：

```bash
#!/bin/bash
echo "🔨 构建所有包..."
pnpm --filter @ldesign/signature-core run build && \
pnpm --filter @ldesign/signature-react run build && \
pnpm --filter @ldesign/signature-solid run build && \
pnpm --filter @ldesign/signature-qwik run build && \
echo "✅ 构建完成！"
```

---

## 🎯 下一步

1. **运行演示**: `cd demos/react-app && pnpm run dev`
2. **查看文档**: 阅读 PROJECT_SUMMARY.md
3. **运行测试**: `cd packages/core && pnpm run test`
4. **检查清单**: 查看 CHECKLIST.md

---

**更新时间**: 2025-10-30  
**版本**: 1.0
