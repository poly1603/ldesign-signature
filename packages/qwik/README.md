# @ldesign/signature-qwik

Qwik 组件,用于手写签名功能,支持 Resumability(可恢复性)。

## ✨ 特性

- 🚀 即时可交互 (Resumability)
- 📦 Zero Hydration 开销
- 🔧 完整的 TypeScript 支持
- ⚡ 极致性能和加载速度
- ♿ 无障碍访问支持
- 📱 响应式设计
- 🎯 优化的序列化

## 📦 安装

```bash
npm install @ldesign/signature-qwik @ldesign/signature-core @builder.io/qwik
# 或
pnpm add @ldesign/signature-qwik @ldesign/signature-core @builder.io/qwik
```

## 🚀 快速开始

### 基础用法

```tsx
import { component$ } from '@builder.io/qwik'
import { SignaturePad } from '@ldesign/signature-qwik'

export default component$(() => {
  return (
    <SignaturePad
      width={600}
      height={300}
      penColor="#0066ff"
      showControls={true}
      onBegin$={(e) => {
        console.log('开始绘制', e)
      }}
      onChange$={(e) => {
        console.log('绘制中', e)
      }}
      onEnd$={(e) => {
        console.log('结束绘制', e)
      }}
    />
  )
})
```

### 使用 Signal 管理状态

```tsx
import { component$, useSignal, $ } from '@builder.io/qwik'
import { SignaturePad } from '@ldesign/signature-qwik'

export default component$(() => {
  const signatureData = useSignal<string>('')
  const isEmpty = useSignal(true)

  const handleExport = $(() => {
    // 注意: 实际使用中需要通过 ref 访问组件方法
    console.log('导出签名')
  })

  return (
    <div>
      <SignaturePad
        width={600}
        height={300}
        penColor="#000000"
        showControls={true}
      />
      
      <button onClick$={handleExport}>导出签名</button>
      
      {isEmpty.value && <p>画布为空,请开始绘制</p>}
    </div>
  )
})
```

### 使用 useStore

```tsx
import { component$, useStore, $ } from '@builder.io/qwik'
import { SignaturePad } from '@ldesign/signature-qwik'

export default component$(() => {
  const state = useStore({
    penColor: '#000000',
    width: 600,
    height: 300,
    isEmpty: true,
  })

  const handleColorChange = $((color: string) => {
    state.penColor = color
  })

  return (
    <div>
      <div>
        <button onClick$={() => handleColorChange('#000000')}>黑色</button>
        <button onClick$={() => handleColorChange('#ff0000')}>红色</button>
        <button onClick$={() => handleColorChange('#0000ff')}>蓝色</button>
      </div>

      <SignaturePad
        width={state.width}
        height={state.height}
        penColor={state.penColor}
        showControls={true}
      />
    </div>
  )
})
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

#### QRL 事件

使用 `$` 后缀的事件处理器实现懒加载:

| 事件 | 类型 | 说明 |
|------|------|------|
| onBegin$ | QRL<(event: PointerEvent) => void> | 开始绘制 |
| onChange$ | QRL<(event: PointerEvent) => void> | 绘制中 |
| onEnd$ | QRL<(event: PointerEvent) => void> | 结束绘制 |

## 🎯 使用场景

### 结合 Qwik City

```tsx
import { component$, $ } from '@builder.io/qwik'
import { useNavigate } from '@builder.io/qwik-city'
import { SignaturePad } from '@ldesign/signature-qwik'

export default component$(() => {
  const nav = useNavigate()

  const handleSave = $(async () => {
    // 保存签名到服务器
    const response = await fetch('/api/signature', {
      method: 'POST',
      // body: signatureData
    })

    if (response.ok) {
      await nav('/success')
    }
  })

  return (
    <div>
      <h1>请在下方签名</h1>
      <SignaturePad width={600} height={300} showControls={true} />
      <button onClick$={handleSave}>保存签名</button>
    </div>
  )
})
```

### 表单集成

```tsx
import { component$, useStore, $ } from '@builder.io/qwik'
import { SignaturePad } from '@ldesign/signature-qwik'

export default component$(() => {
  const form = useStore({
    name: '',
    email: '',
    agreement: false,
  })

  const handleSubmit = $(async () => {
    if (!form.agreement) {
      alert('请先签名同意协议')
      return
    }

    console.log('提交表单:', form)
  })

  return (
    <form preventdefault:submit onSubmit$={handleSubmit}>
      <input
        type="text"
        bind:value={form.name}
        placeholder="姓名"
        required
      />
      <input
        type="email"
        bind:value={form.email}
        placeholder="邮箱"
        required
      />
      
      <div>
        <label>请签名同意协议:</label>
        <SignaturePad width={400} height={200} />
      </div>
      
      <button type="submit">提交</button>
    </form>
  )
})
```

### 动态配置

```tsx
import { component$, useSignal, $ } from '@builder.io/qwik'
import { SignaturePad } from '@ldesign/signature-qwik'

export default component$(() => {
  const config = useSignal({
    penColor: '#000000',
    minWidth: 0.5,
    maxWidth: 2.5,
  })

  const updatePenSize = $((size: 'small' | 'medium' | 'large') => {
    config.value = {
      ...config.value,
      minWidth: size === 'small' ? 0.5 : size === 'medium' ? 1 : 2,
      maxWidth: size === 'small' ? 1.5 : size === 'medium' ? 3 : 5,
    }
  })

  return (
    <div>
      <div>
        笔触大小:
        <button onClick$={() => updatePenSize('small')}>小</button>
        <button onClick$={() => updatePenSize('medium')}>中</button>
        <button onClick$={() => updatePenSize('large')}>大</button>
      </div>

      <SignaturePad
        width={600}
        height={300}
        penColor={config.value.penColor}
        minWidth={config.value.minWidth}
        maxWidth={config.value.maxWidth}
        showControls={true}
      />
    </div>
  )
})
```

## 💡 高级用法

### 响应式布局

```tsx
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { SignaturePad } from '@ldesign/signature-qwik'
import { isBrowser } from '@builder.io/qwik/build'

export default component$(() => {
  const size = useSignal({ width: 600, height: 300 })

  useVisibleTask$(() => {
    if (!isBrowser) return

    const updateSize = () => {
      size.value = {
        width: Math.min(window.innerWidth - 40, 800),
        height: Math.min(window.innerWidth - 40, 800) * 0.5,
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  })

  return (
    <SignaturePad
      width={size.value.width}
      height={size.value.height}
      showControls={true}
    />
  )
})
```

### 多语言支持

```tsx
import { component$ } from '@builder.io/qwik'
import { SignaturePad } from '@ldesign/signature-qwik'
import { useI18n } from '~/hooks/use-i18n'

export default component$(() => {
  const i18n = useI18n()

  return (
    <SignaturePad
      width={600}
      height={300}
      showControls={true}
      clearText={i18n.t('clear')}
      undoText={i18n.t('undo')}
      redoText={i18n.t('redo')}
    />
  )
})
```

## 🔧 性能优化

Qwik 的 Resumability 特性带来:
- ✅ **Zero JavaScript 加载** - 初始无需加载 JS
- ✅ **按需懒加载** - 只在交互时加载必要代码
- ✅ **极快的 TTI** - Time to Interactive 接近 0
- ✅ **优化的序列化** - 状态自动序列化和恢复

## 🎓 Qwik 最佳实践

### 使用 $ 语法

```tsx
// ✅ 正确 - 使用 $() 包装处理器
const handleClick = $(() => {
  console.log('点击')
})

// ❌ 错误 - 直接使用函数
const handleClick = () => {
  console.log('点击')
}
```

### Signal 而非 useState

```tsx
// ✅ 推荐 - 使用 useSignal
const count = useSignal(0)
count.value++

// ❌ 避免 - React 风格的 useState
const [count, setCount] = useState(0)
```

## 📚 更多资源

- [Qwik 官方文档](https://qwik.builder.io/)
- [Qwik City 文档](https://qwik.builder.io/qwikcity/overview/)
- [完整文档](../../docs)
- [在线演示](../../examples/qwik)
- [核心包文档](../core/README.md)

## 📄 许可证

MIT © LDesign Team
