# @ldesign/signature - React Demo

React 框架手写签名组件演示应用。

## 功能特性

- ✨ 完整的签名板功能
- 🎨 自定义画笔颜色和宽度
- ↩️ 撤销/重做支持
- 💾 多种导出格式（PNG、SVG、JSON）
- 📱 响应式设计
- 🎯 TypeScript 类型支持

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm run dev
```

然后打开浏览器访问 http://localhost:3000

### 构建生产版本

```bash
pnpm run build
```

### 预览生产版本

```bash
pnpm run preview
```

## 使用的包

- `@ldesign/signature-core` - 核心引擎
- `@ldesign/signature-react` - React 组件封装

## 代码示例

```tsx
import { useRef } from 'react'
import { SignaturePad } from '@ldesign/signature-react'
import type { SignaturePadRef } from '@ldesign/signature-react'

function App() {
  const signatureRef = useRef<SignaturePadRef>(null)

  const handleDownload = () => {
    signatureRef.current?.download('signature.png')
  }

  return (
    <div>
      <SignaturePad
        ref={signatureRef}
        width={800}
        height={400}
        penColor="#000000"
        showControls={true}
      />
      <button onClick={handleDownload}>下载签名</button>
    </div>
  )
}
```

## API 参考

### SignaturePad Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 400 | 画布宽度 |
| height | number | 200 | 画布高度 |
| penColor | string | "#000000" | 画笔颜色 |
| minWidth | number | 0.5 | 最小笔画宽度 |
| maxWidth | number | 2.5 | 最大笔画宽度 |
| showControls | boolean | true | 显示控制按钮 |

### SignaturePadRef Methods

- `clear()` - 清空签名
- `undo()` - 撤销
- `redo()` - 重做
- `toDataURL(format?, quality?)` - 导出为 Data URL
- `toSVG()` - 导出为 SVG
- `toJSON()` - 导出为 JSON
- `fromJSON(data)` - 从 JSON 导入
- `download(fileName?, format?, quality?)` - 下载签名

## 技术栈

- React 18
- TypeScript
- Vite
- @ldesign/signature

## 许可证

MIT
