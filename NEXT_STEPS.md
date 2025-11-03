# 下一步操作指南

## 🎯 立即可执行的任务

### 1. 验证项目结构 ✅
```bash
# 查看已创建的包
ls packages
# 应该看到: angular, core, lit, qwik, react, solid, svelte, vue
```

### 2. 安装依赖 📦
```bash
# 在项目根目录
pnpm install
```

### 3. 尝试构建新包 🔨
```bash
# 构建 Angular 包
cd packages/angular
pnpm run build

# 构建 Solid 包
cd ../solid
pnpm run build

# 构建 Svelte 包
cd ../svelte
pnpm run build

# 构建 Qwik 包
cd ../qwik
pnpm run build
```

### 4. 检查类型错误 🔍
```bash
# 在每个包目录中运行
pnpm run type-check
```

### 5. 运行 ESLint 检查 ✨
```bash
# 在每个包目录中运行
pnpm run lint
```

## 🐛 可能遇到的问题及解决方案

### 问题1: 缺少依赖
**症状**: 构建时提示找不到某些包

**解决**:
```bash
# 在根目录安装缺失的依赖
pnpm add -D <package-name>

# 或在特定包中安装
cd packages/<package-name>
pnpm add <dependency>
```

### 问题2: @ldesign/builder 或 @ldesign/shared 找不到
**症状**: 无法解析 workspace 依赖

**解决**: 确保在根目录的 pnpm-workspace.yaml 中配置了正确的路径:
```yaml
packages:
  - 'packages/*'
  - 'tools/*'
```

### 问题3: TypeScript 类型错误
**症状**: tsc 报告类型不匹配

**解决**: 检查 tsconfig.json 中的 paths 配置是否正确

### 问题4: Svelte 编译错误
**症状**: .svelte 文件无法编译

**解决**: 需要额外的 Svelte 编译器配置,可能需要使用 @sveltejs/package

## 📝 完善文档

接下来需要为其余包创建 README:

```bash
# 创建 Solid README
touch packages/solid/README.md

# 创建 Svelte README  
touch packages/svelte/README.md

# 创建 Qwik README
touch packages/qwik/README.md
```

参考 `packages/angular/README.md` 的格式编写。

## 🧪 创建演示项目

### 使用 @ldesign/launcher 创建演示

```bash
# 在 packages/angular 目录中
mkdir examples
cd examples

# 使用 launcher 创建 Angular 应用
# (根据实际的 launcher 命令调整)
pnpm create @ldesign/launcher angular-demo --template angular

# 然后在演示项目中引入你的包
cd angular-demo
pnpm add @ldesign/signature-angular@workspace:*
```

对每个框架重复此步骤。

## 🔧 配置 pnpm workspace

创建或更新 `pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
  - 'packages/*/examples/*'
  - 'tools/*'
```

## 📚 搭建文档网站

```bash
# 如果 docs 目录还不存在
mkdir -p docs/.vitepress

# 创建 VitePress 配置
touch docs/.vitepress/config.ts

# 安装 VitePress
pnpm add -D vitepress

# 启动文档开发服务器
pnpm run docs:dev
```

## ✅ 质量检查清单

在提交代码前确保:

- [ ] 所有包都能成功构建
- [ ] 没有 TypeScript 类型错误
- [ ] 没有 ESLint 错误  
- [ ] 所有导出的 API 都有完整的类型定义
- [ ] 每个包都有 README 文档
- [ ] 至少有一个可运行的演示项目

## 🚀 发布前检查

准备发布时:

1. 更新所有包的版本号
2. 更新 CHANGELOG.md
3. 确保所有测试通过
4. 构建所有包
5. 生成完整的 API 文档
6. 测试包的安装和使用

## 📞 需要帮助?

- 查看 [完整重构计划](./MONOREPO_REFACTOR_PLAN.md)
- 查看 [进度总结](./PROGRESS_SUMMARY.md)
- 查看 [开发工作流](./packages/README.md)

---

**记住**: 逐步进行,先让基础功能工作,再逐步添加高级特性! 💪
