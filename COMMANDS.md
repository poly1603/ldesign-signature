# 📋 命令速查表

快速查找常用命令。

---

## 🚀 安装和初始化

```bash
# 安装所有依赖
pnpm install

# 清理依赖重新安装
rm -rf node_modules packages/*/node_modules
pnpm install
```

---

## 🏗️ 构建命令

### 构建所有包
```bash
pnpm run build
```

### 构建核心包
```bash
pnpm run build:core
# 或
cd packages/core && pnpm run build
```

### 构建特定包
```bash
cd packages/angular && pnpm run build
cd packages/solid && pnpm run build
cd packages/svelte && pnpm run build
cd packages/qwik && pnpm run build
cd packages/vue && pnpm run build
cd packages/react && pnpm run build
```

### 开发模式 (watch)
```bash
# 所有包 (并行)
pnpm run dev

# 特定包
cd packages/angular && pnpm run dev
```

### 清理构建输出
```bash
# 所有包
pnpm run clean

# 特定包
cd packages/core && pnpm run clean
```

---

## ✨ 代码质量

### ESLint
```bash
# 检查所有文件
pnpm run lint

# 自动修复
pnpm run lint:fix

# 检查特定包
cd packages/angular && pnpm run lint
```

### TypeScript 类型检查
```bash
# 所有包
pnpm run type-check

# 特定包
cd packages/core && pnpm run type-check
```

---

## 🧪 测试

### 运行测试
```bash
# 运行所有测试
pnpm run test

# 带覆盖率
pnpm run test:coverage

# UI 模式
pnpm run test:ui

# Watch 模式
pnpm run test -- --watch
```

### 特定包测试
```bash
cd packages/core && pnpm run test
```

---

## 📚 文档

```bash
# 开发模式
pnpm run docs:dev

# 构建文档
pnpm run docs:build

# 预览文档
pnpm run docs:preview
```

---

## 🎨 包管理

### 在所有包中运行命令
```bash
# 顺序执行
pnpm -r run <command>

# 并行执行
pnpm -r --parallel run <command>

# 过滤特定包
pnpm -r --filter './packages/core' run <command>
```

### 添加依赖

```bash
# 为根目录添加开发依赖
pnpm add -D <package> -w

# 为特定包添加依赖
cd packages/angular
pnpm add <package>

# 添加开发依赖
pnpm add -D <package>
```

---

## 🔍 调试和诊断

### 查看包信息
```bash
# 查看所有包
pnpm list -r --depth=0

# 查看特定包的依赖
cd packages/angular && pnpm list
```

### 检查过期依赖
```bash
pnpm outdated
```

### 查看 workspace 信息
```bash
pnpm ls -r
```

---

## 📦 发布准备

### 版本管理
```bash
# 更新版本
pnpm version patch  # 0.2.0 -> 0.2.1
pnpm version minor  # 0.2.0 -> 0.3.0
pnpm version major  # 0.2.0 -> 1.0.0
```

### 发布前检查
```bash
# 1. 清理
pnpm run clean

# 2. 安装依赖
pnpm install

# 3. Lint
pnpm run lint

# 4. 类型检查
pnpm run type-check

# 5. 测试
pnpm run test

# 6. 构建
pnpm run build

# 7. 文档
pnpm run docs:build
```

---

## 🛠️ 开发工作流

### 开发新功能
```bash
# 1. 切换到包目录
cd packages/angular

# 2. 开发模式
pnpm run dev

# 3. 在另一个终端运行测试
pnpm run test -- --watch

# 4. 提交前检查
pnpm run lint && pnpm run type-check && pnpm run test
```

### 添加新包
```bash
# 1. 创建目录
mkdir -p packages/new-package/src

# 2. 复制配置模板
cp packages/angular/package.json packages/new-package/
cp packages/angular/tsconfig.json packages/new-package/
cp packages/angular/build.config.ts packages/new-package/
cp packages/angular/eslint.config.js packages/new-package/

# 3. 修改 package.json 中的名称

# 4. 安装依赖
pnpm install

# 5. 开始开发
cd packages/new-package && pnpm run dev
```

---

## 🐛 常见问题

### 问题: 模块找不到
```bash
# 清理并重装
pnpm run clean
rm -rf node_modules
pnpm install
```

### 问题: 类型错误
```bash
# 重新生成类型
cd packages/core && pnpm run build
pnpm run type-check
```

### 问题: 构建失败
```bash
# 按顺序构建
cd packages/core && pnpm run build
cd ../vue && pnpm run build
cd ../react && pnpm run build
# ... 等等
```

### 问题: 端口占用
```bash
# 查看端口占用 (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess

# 或指定其他端口
pnpm run docs:dev -- --port 3000
```

---

## 💡 有用的别名

可以在 package.json 中添加更多别名:

```json
{
  "scripts": {
    "validate": "pnpm run lint && pnpm run type-check && pnpm run test",
    "prebuild": "pnpm run clean",
    "build:all": "pnpm run build",
    "dev:docs": "pnpm run docs:dev"
  }
}
```

---

## 📖 更多资源

- [QUICK_START.md](./QUICK_START.md) - 快速开始指南
- [NEXT_STEPS.md](./NEXT_STEPS.md) - 下一步操作
- [packages/README.md](./packages/README.md) - 包开发指南

---

**提示**: 使用 `pnpm run` 查看所有可用命令！
