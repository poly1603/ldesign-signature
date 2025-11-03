# 批量构建所有成功的包
# PowerShell 脚本

Write-Host "🔨 开始构建所有包..." -ForegroundColor Cyan
Write-Host ""

$packages = @(
    @{ Name = "core"; Filter = "@ldesign/signature-core" },
    @{ Name = "react"; Filter = "@ldesign/signature-react" },
    @{ Name = "solid"; Filter = "@ldesign/signature-solid" },
    @{ Name = "qwik"; Filter = "@ldesign/signature-qwik" }
)

$success = 0
$failed = 0
$startTime = Get-Date

foreach ($pkg in $packages) {
    Write-Host "📦 构建 $($pkg.Name) 包..." -ForegroundColor Yellow
    
    $result = pnpm --filter $pkg.Filter run build 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $($pkg.Name) 构建成功" -ForegroundColor Green
        $success++
    } else {
        Write-Host "❌ $($pkg.Name) 构建失败" -ForegroundColor Red
        Write-Host $result
        $failed++
    }
    
    Write-Host ""
}

$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 构建统计" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ 成功: $success" -ForegroundColor Green
Write-Host "❌ 失败: $failed" -ForegroundColor Red
Write-Host "⏱️  耗时: $($duration.TotalSeconds) 秒" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host ""
    Write-Host "🎉 所有包构建成功！" -ForegroundColor Green
    exit 0
} else {
    Write-Host ""
    Write-Host "⚠️  部分包构建失败，请检查错误信息" -ForegroundColor Red
    exit 1
}
