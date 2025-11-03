# 🚀 快速开始指南

欢迎使用 @ldesign/signature 多框架签名组件!

## 📋 前置要求

- Node.js >= 18
- pnpm >= 8

## 🔧 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

## 🏗️ 构建所有包

```bash
# 构建所有包
pnpm -r --filter './packages/*' run build

# 或逐个构建
cd packages/core && pnpm run build
cd ../vue && pnpm run build
cd ../react && pnpm run build
# ... 等等
```

## 🧪 运行测试

```bash
# 运行所有测试
pnpm run test

# 运行测试并查看覆盖率
pnpm run test -- --coverage

# 运行测试 UI
pnpm run test:ui
```

## ✨ 代码检查

```bash
# 运行 ESLint
pnpm run lint

# 自动修复 lint 问题
pnpm run lint --fix

# TypeScript 类型检查
pnpm -r run type-check
```

## 📚 启动文档

```bash
# 开发模式
pnpm run docs:dev

# 构建文档
pnpm run docs:build

# 预览构建的文档
pnpm run docs:preview
```

## 🎨 开发某个包

```bash
# 进入包目录
cd packages/angular

# 开发模式 (watch)
pnpm run dev

# 构建
pnpm run build

# 运行测试
pnpm run test

# Lint
pnpm run lint
```

## 🔍 使用示例

### Angular

```bash
cd packages/angular/examples
pnpm install
pnpm run dev
```

### Solid.js

```bash
cd packages/solid/examples
pnpm install
pnpm run dev
```

### Svelte

```bash
cd packages/svelte/examples
pnpm install
pnpm run dev
```

### Qwik

```bash
cd packages/qwik/examples
pnpm install
pnpm run dev
```

## 📦 包结构

```
packages/
├── core/       - 核心功能 (框架无关)
├── vue/        - Vue 3 集成
├── react/      - React 18+ 集成
├── angular/    - Angular 16+ 集成
├── solid/      - Solid.js 集成
├── svelte/     - Svelte 4/5 集成
└── qwik/       - Qwik 集成
```

## 🛠️ 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装所有依赖 |
| `pnpm run build` | 构建当前包 |
| `pnpm run dev` | 开发模式 (watch) |
| `pnpm run test` | 运行测试 |
| `pnpm run lint` | 运行 ESLint |
| `pnpm run type-check` | TypeScript 类型检查 |
| `pnpm -r run <script>` | 在所有包中运行脚本 |

## 🐛 故障排查

### 问题: `@ldesign/builder` 找不到

**解决方案:**
```bash
# 确保在正确的 workspace 中
cd ../../..  # 回到 monorepo 根目录
pnpm install
```

### 问题: 构建失败

**解决方案:**
```bash
# 清理并重新构建
pnpm run clean
pnpm install
pnpm run build
```

### 问题: 类型错误

**解决方案:**
```bash
# 检查 tsconfig.json 配置
pnpm run type-check

# 查看详细错误
tsc --noEmit --pretty
```

### 问题: ESLint 错误

**解决方案:**
```bash
# 自动修复
pnpm run lint --fix

# 如果还有问题,手动修复或调整规则
```

## 📖 更多资源

- [完整重构计划](./MONOREPO_REFACTOR_PLAN.md)
- [进度总结](./PROGRESS_SUMMARY.md)
- [下一步指南](./NEXT_STEPS.md)
- [开发工作流](./packages/README.md)
- [会话总结](./SESSION_SUMMARY.md)

## 🎯 下一步

1. ✅ 安装依赖
2. ✅ 构建核心包
3. ✅ 构建框架包
4. ⏭️ 运行测试验证
5. ⏭️ 创建演示项目
6. ⏭️ 编写文档

## 💡 小贴士

- 使用 `pnpm -r` 在所有包中运行命令
- 使用 `--filter` 过滤特定包
- 使用 `--parallel` 并行执行命令
- 使用 `workspace:*` 引用本地包

## 🤝 贡献

查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解贡献指南 (待创建)。

---

**快乐编码!** 🎉
