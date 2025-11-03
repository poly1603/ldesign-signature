# @ldesign/signature-solid

Solid.js 原语和组件,用于手写签名功能。

## ✨ 特性

- 🎨 细粒度响应式系统
- 📦 灵活的原语 (Primitives)
- 🔧 完整的 TypeScript 支持
- ⚡ 极致性能优化
- ♿ 无障碍访问支持
- 📱 响应式设计

## 📦 安装

```bash
npm install @ldesign/signature-solid @ldesign/signature-core solid-js
# 或
pnpm add @ldesign/signature-solid @ldesign/signature-core solid-js
```

## 🚀 快速开始

### 使用组件

```tsx
import { SignaturePad } from '@ldesign/signature-solid'

function App() {
  let signaturePadRef: any

  const handleExport = () => {
    if (signaturePadRef) {
      const dataUrl = signaturePadRef.toDataURL('png')
      console.log('导出签名:', dataUrl)
    }
  }

  return (
    <div>
      <SignaturePad
        ref={signaturePadRef}
        width={600}
        height={300}
        penColor="#0066ff"
        showControls={true}
        onBegin$={(e) => console.log('开始绘制', e)}
        onChange$={(e) => console.log('绘制中', e)}
        onEnd$={(e) => console.log('结束绘制', e)}
      />
      
      <button onClick={handleExport}>导出签名</button>
    </div>
  )
}
```

### 使用原语

```tsx
import { createSignature } from '@ldesign/signature-solid'
import { Show } from 'solid-js'

function SignatureComponent() {
  let canvasRef: HTMLCanvasElement | undefined

  const [state, actions] = createSignature(
    () => canvasRef,
    {
      width: 600,
      height: 300,
      penColor: '#000000',
      minWidth: 0.5,
      maxWidth: 2.5,
      pressureSensitive: true,
    }
  )

  const handleExport = () => {
    const dataUrl = actions.toDataURL('png')
    console.log('导出签名:', dataUrl)
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        style={{
          border: '1px solid #ccc',
          'border-radius': '4px',
          'touch-action': 'none',
        }}
      />

      <div style={{ 'margin-top': '8px', display: 'flex', gap: '8px' }}>
        <button onClick={() => actions.clear()} disabled={state.isEmpty()}>
          清空
        </button>
        <button onClick={() => actions.undo()} disabled={!state.canUndo()}>
          撤销
        </button>
        <button onClick={() => actions.redo()} disabled={!state.canRedo()}>
          重做
        </button>
        <button onClick={handleExport}>
          导出
        </button>
      </div>

      <Show when={state.isEmpty()}>
        <p>画布为空,请开始绘制</p>
      </Show>
    </div>
  )
}
```

## 📖 API

### SignaturePad 组件

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 600 | 画布宽度 |
| height | number | 300 | 画布高度 |
| penColor | string | '#000000' | 笔触颜色 |
| minWidth | number | 0.5 | 最小笔触宽度 |
| maxWidth | number | 2.5 | 最大笔触宽度 |
| smoothAlgorithm | string | 'catmull-rom' | 平滑算法 |
| pressureSensitive | boolean | true | 启用压力感应 |
| showControls | boolean | false | 显示控制按钮 |
| clearText | string | 'Clear' | 清空按钮文本 |
| undoText | string | 'Undo' | 撤销按钮文本 |
| redoText | string | 'Redo' | 重做按钮文本 |
| class | string | - | CSS 类名 |
| style | JSX.CSSProperties | - | 内联样式 |
| ref | (el: HTMLCanvasElement) => void | - | Canvas ref 回调 |

### createSignature 原语

#### 参数

```typescript
createSignature(
  canvasOrGetter: HTMLCanvasElement | (() => HTMLCanvasElement | undefined),
  options?: CreateSignatureOptions
): [SignatureState, SignatureActions]
```

#### 返回值

**SignatureState** - 响应式状态:
- `isEmpty: Accessor<boolean>` - 是否为空
- `canUndo: Accessor<boolean>` - 能否撤销
- `canRedo: Accessor<boolean>` - 能否重做

**SignatureActions** - 操作方法:
- `clear(): void` - 清空画布
- `undo(): void` - 撤销
- `redo(): void` - 重做
- `toDataURL(format?, quality?): string` - 导出为 Data URL
- `toSVG(): string` - 导出为 SVG
- `toJSON(): SignatureData | null` - 导出为 JSON
- `fromJSON(data): void` - 从 JSON 导入
- `download(fileName?, format?, quality?): void` - 下载文件
- `getCanvas(): HTMLCanvasElement | null` - 获取 canvas 元素
- `getInstance(): SignatureInstance | null` - 获取底层实例

## 🎯 使用场景

### 结合 Solid Router

```tsx
import { createSignature } from '@ldesign/signature-solid'
import { useNavigate } from '@solidjs/router'

function SignaturePage() {
  const navigate = useNavigate()
  let canvasRef: HTMLCanvasElement | undefined

  const [state, actions] = createSignature(() => canvasRef, {
    width: 600,
    height: 300,
  })

  const handleSave = async () => {
    const dataUrl = actions.toDataURL('png')
    // 保存到服务器
    await saveSignature(dataUrl)
    navigate('/success')
  }

  return (
    <div>
      <canvas ref={canvasRef} />
      <button onClick={handleSave} disabled={state.isEmpty()}>
        保存签名
      </button>
    </div>
  )
}
```

### 多个签名实例

```tsx
import { createSignature } from '@ldesign/signature-solid'

function MultiSignature() {
  let canvas1: HTMLCanvasElement | undefined
  let canvas2: HTMLCanvasElement | undefined

  const [state1, actions1] = createSignature(() => canvas1)
  const [state2, actions2] = createSignature(() => canvas2)

  const compareSignatures = () => {
    const json1 = actions1.toJSON()
    const json2 = actions2.toJSON()
    // 对比两个签名
    console.log('签名1:', json1)
    console.log('签名2:', json2)
  }

  return (
    <div>
      <h3>签名 1</h3>
      <canvas ref={canvas1} />

      <h3>签名 2</h3>
      <canvas ref={canvas2} />

      <button onClick={compareSignatures}>对比签名</button>
    </div>
  )
}
```

## 💡 高级用法

### 自定义样式

```tsx
<SignaturePad
  width={800}
  height={400}
  penColor="#ff0000"
  minWidth={1}
  maxWidth={4}
  smoothAlgorithm="bezier-cubic"
  style={{
    'box-shadow': '0 2px 8px rgba(0,0,0,0.1)',
    'border-radius': '8px',
  }}
  class="my-signature-pad"
/>
```

### 响应式尺寸

```tsx
import { createSignal, onMount } from 'solid-js'

function ResponsiveSignature() {
  const [size, setSize] = createSignal({ width: 600, height: 300 })

  onMount(() => {
    const updateSize = () => {
      const width = Math.min(window.innerWidth - 40, 800)
      const height = width * 0.5
      setSize({ width, height })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  })

  return (
    <SignaturePad
      width={size().width}
      height={size().height}
      showControls={true}
    />
  )
}
```

## 🔧 性能优化

Solid.js 的细粒度响应式确保了:
- ✅ 只有必要的 DOM 节点更新
- ✅ 无虚拟 DOM 开销
- ✅ 最小的内存占用
- ✅ 极快的初始渲染

## 📚 更多资源

- [Solid.js 官方文档](https://www.solidjs.com/)
- [完整文档](../../docs)
- [在线演示](../../examples/solid)
- [核心包文档](../core/README.md)

## 📄 许可证

MIT © LDesign Team
