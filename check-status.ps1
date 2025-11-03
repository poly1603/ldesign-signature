# 项目状态检查脚本
# 检查项目各个方面的健康状态

Write-Host "🔍 @ldesign/signature 项目状态检查" -ForegroundColor Cyan
Write-Host "=" * 60

# 1. 检查 pnpm
Write-Host "`n📦 检查 pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm 版本: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pnpm 未安装!" -ForegroundColor Red
    exit 1
}

# 2. 检查 Node.js
Write-Host "`n📦 检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js 未安装!" -ForegroundColor Red
    exit 1
}

# 3. 检查 workspace 配置
Write-Host "`n⚙️ 检查 workspace 配置..." -ForegroundColor Yellow
if (Test-Path "pnpm-workspace.yaml") {
    Write-Host "✅ pnpm-workspace.yaml 存在" -ForegroundColor Green
} else {
    Write-Host "❌ pnpm-workspace.yaml 不存在!" -ForegroundColor Red
}

# 4. 检查包目录
Write-Host "`n📁 检查包目录..." -ForegroundColor Yellow
$packages = @("core", "vue", "react", "angular", "solid", "svelte", "qwik")
foreach ($pkg in $packages) {
    $pkgPath = "packages/$pkg"
    if (Test-Path $pkgPath) {
        $hasPackageJson = Test-Path "$pkgPath/package.json"
        $hasSrc = Test-Path "$pkgPath/src"
        
        if ($hasPackageJson -and $hasSrc) {
            Write-Host "  ✅ $pkg - 完整" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ $pkg - 不完整 (package.json: $hasPackageJson, src: $hasSrc)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ❌ $pkg - 不存在" -ForegroundColor Red
    }
}

# 5. 检查配置文件
Write-Host "`n⚙️ 检查配置文件..." -ForegroundColor Yellow
$configs = @(
    "tsconfig.base.json",
    "eslint.config.js",
    "vitest.config.ts",
    ".github/workflows/ci.yml"
)
foreach ($config in $configs) {
    if (Test-Path $config) {
        Write-Host "  ✅ $config" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $config 缺失" -ForegroundColor Red
    }
}

# 6. 检查文档
Write-Host "`n📚 检查文档..." -ForegroundColor Yellow
$docs = @(
    "README.md",
    "QUICK_START.md",
    "NEXT_STEPS.md",
    "MONOREPO_REFACTOR_PLAN.md",
    "PROGRESS_SUMMARY.md",
    "COMMANDS.md"
)
foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "  ✅ $doc" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ $doc 缺失" -ForegroundColor Yellow
    }
}

# 7. 检查 node_modules
Write-Host "`n📦 检查依赖安装..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ 根目录依赖已安装" -ForegroundColor Green
} else {
    Write-Host "⚠️ 根目录依赖未安装 - 运行 'pnpm install'" -ForegroundColor Yellow
}

# 8. 统计代码
Write-Host "`n📊 代码统计..." -ForegroundColor Yellow
$tsFiles = (Get-ChildItem -Path "packages" -Filter "*.ts" -Recurse -File).Count
$tsxFiles = (Get-ChildItem -Path "packages" -Filter "*.tsx" -Recurse -File).Count
$svelteFiles = (Get-ChildItem -Path "packages" -Filter "*.svelte" -Recurse -File).Count
$totalSrc = $tsFiles + $tsxFiles + $svelteFiles

Write-Host "  TypeScript 文件: $tsFiles" -ForegroundColor Cyan
Write-Host "  TSX 文件: $tsxFiles" -ForegroundColor Cyan
Write-Host "  Svelte 文件: $svelteFiles" -ForegroundColor Cyan
Write-Host "  总计源文件: $totalSrc" -ForegroundColor Green

# 9. 建议的下一步
Write-Host "`n🎯 建议的下一步操作:" -ForegroundColor Cyan
Write-Host "  1. 运行 'pnpm install' 安装依赖" -ForegroundColor White
Write-Host "  2. 运行 'pnpm run build:core' 构建核心包" -ForegroundColor White
Write-Host "  3. 运行 'pnpm run type-check' 检查类型" -ForegroundColor White
Write-Host "  4. 运行 'pnpm run lint' 检查代码规范" -ForegroundColor White
Write-Host "  5. 运行 'pnpm run test' 运行测试" -ForegroundColor White

Write-Host "`n✨ 状态检查完成!" -ForegroundColor Green
Write-Host "=" * 60
