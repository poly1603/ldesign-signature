# @ldesign/signature-svelte

Svelte 组件和 Store,用于手写签名功能。

## ✨ 特性

- 🎨 响应式 Svelte Store
- 📦 单文件组件 (.svelte)
- 🔧 完整的 TypeScript 支持
- ⚡ 轻量级和高性能
- ♿ 无障碍访问支持
- 📱 响应式设计
- 🔄 Svelte 4 & 5 兼容

## 📦 安装

```bash
npm install @ldesign/signature-svelte @ldesign/signature-core svelte
# 或
pnpm add @ldesign/signature-svelte @ldesign/signature-core svelte
```

## 🚀 快速开始

### 使用组件

```svelte
<script lang="ts">
  import SignaturePad from '@ldesign/signature-svelte'

  let signaturePad: any

  function handleExport() {
    if (signaturePad) {
      const dataUrl = signaturePad.toDataURL('png')
      console.log('导出签名:', dataUrl)
    }
  }

  function handleBegin(event: CustomEvent) {
    console.log('开始绘制', event.detail)
  }

  function handleChange(event: CustomEvent) {
    console.log('绘制中', event.detail)
  }

  function handleEnd(event: CustomEvent) {
    console.log('结束绘制', event.detail)
  }
</script>

<SignaturePad
  bind:this={signaturePad}
  width={600}
  height={300}
  penColor="#0066ff"
  showControls={true}
  on:begin={handleBegin}
  on:change={handleChange}
  on:end={handleEnd}
/>

<button on:click={handleExport}>导出签名</button>
```

### 使用 Store

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { createSignatureStore } from '@ldesign/signature-svelte'

  const signature = createSignatureStore({
    width: 600,
    height: 300,
    penColor: '#000000',
    minWidth: 0.5,
    maxWidth: 2.5,
  })

  let canvas: HTMLCanvasElement

  onMount(() => {
    if (canvas) {
      signature.init(canvas)
    }
  })

  onDestroy(() => {
    signature.destroy()
  })

  function handleExport() {
    const dataUrl = signature.toDataURL('png')
    console.log('导出签名:', dataUrl)
  }
</script>

<div>
  <canvas
    bind:this={canvas}
    width={600}
    height={300}
    style="border: 1px solid #ccc; border-radius: 4px; touch-action: none;"
  />

  <div style="margin-top: 8px; display: flex; gap: 8px;">
    <button on:click={() => signature.clear()} disabled={$signature.isEmpty}>
      清空
    </button>
    <button on:click={() => signature.undo()} disabled={!$signature.canUndo}>
      撤销
    </button>
    <button on:click={() => signature.redo()} disabled={!$signature.canRedo}>
      重做
    </button>
    <button on:click={handleExport}>
      导出
    </button>
  </div>

  {#if $signature.isEmpty}
    <p>画布为空,请开始绘制</p>
  {/if}
</div>
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
| showControls | boolean | true | 显示控制按钮 |
| clearText | string | 'Clear' | 清空按钮文本 |
| undoText | string | 'Undo' | 撤销按钮文本 |
| redoText | string | 'Redo' | 重做按钮文本 |

#### 事件

| 事件 | 说明 |
|------|------|
| begin | 开始绘制时触发 |
| change | 绘制过程中触发 |
| end | 结束绘制时触发 |

#### 方法

通过 `bind:this` 访问组件实例方法:
- `clear(): void` - 清空画布
- `undo(): void` - 撤销
- `redo(): void` - 重做
- `toDataURL(format?, quality?): string` - 导出为 Data URL
- `toSVG(): string` - 导出为 SVG
- `toJSON(): SignatureData | null` - 导出为 JSON
- `fromJSON(data): void` - 从 JSON 导入
- `download(fileName?, format?, quality?): void` - 下载文件

### createSignatureStore

创建一个响应式签名 Store。

#### 参数

```typescript
createSignatureStore(config?: SignatureConfig): SignatureStore
```

#### 返回值

**SignatureStore** 对象包含:

**响应式状态 (Readable Stores):**
- `isEmpty: Readable<boolean>` - 是否为空
- `canUndo: Readable<boolean>` - 能否撤销
- `canRedo: Readable<boolean>` - 能否重做

**操作方法:**
- `init(canvas, config?): void` - 初始化签名板
- `clear(): void` - 清空画布
- `undo(): void` - 撤销
- `redo(): void` - 重做
- `toDataURL(format?, quality?): string` - 导出为 Data URL
- `toSVG(): string` - 导出为 SVG
- `toJSON(): SignatureData | null` - 导出为 JSON
- `fromJSON(data): void` - 从 JSON 导入
- `download(fileName?, format?, quality?): void` - 下载文件
- `getCanvas(): HTMLCanvasElement | null` - 获取 canvas 元素
- `destroy(): void` - 销毁实例

## 🎯 使用场景

### 结合 SvelteKit

```svelte
<script lang="ts">
  import { goto } from '$app/navigation'
  import SignaturePad from '@ldesign/signature-svelte'

  let signaturePad: any

  async function handleSave() {
    const dataUrl = signaturePad.toDataURL('png')
    
    // 保存到服务器
    const response = await fetch('/api/signature', {
      method: 'POST',
      body: JSON.stringify({ signature: dataUrl }),
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (response.ok) {
      goto('/success')
    }
  }
</script>

<SignaturePad bind:this={signaturePad} width={600} height={300} />
<button on:click={handleSave}>保存签名</button>
```

### 表单集成

```svelte
<script lang="ts">
  import SignaturePad from '@ldesign/signature-svelte'

  let signaturePad: any
  let formData = {
    name: '',
    email: '',
    signature: ''
  }

  function handleSubmit() {
    formData.signature = signaturePad.toDataURL('png')
    console.log('提交表单:', formData)
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={formData.name} placeholder="姓名" required />
  <input bind:value={formData.email} type="email" placeholder="邮箱" required />
  
  <div>
    <label>签名:</label>
    <SignaturePad bind:this={signaturePad} width={400} height={200} />
  </div>
  
  <button type="submit">提交</button>
</form>
```

### Store 派生状态

```svelte
<script lang="ts">
  import { derived } from 'svelte/store'
  import { createSignatureStore } from '@ldesign/signature-svelte'

  const signature = createSignatureStore()

  // 派生计算属性
  const canSubmit = derived(
    [signature.isEmpty, /* 其他状态 */],
    ([$isEmpty]) => !$isEmpty
  )

  let canvas: HTMLCanvasElement
  $: if (canvas) signature.init(canvas)
</script>

<canvas bind:this={canvas} />

<button disabled={!$canSubmit}>
  {$canSubmit ? '提交' : '请先签名'}
</button>
```

## 💡 高级用法

### 自定义样式

```svelte
<SignaturePad
  width={800}
  height={400}
  penColor="#ff0000"
  minWidth={1}
  maxWidth={4}
  smoothAlgorithm="bezier-cubic"
  class="custom-signature"
/>

<style>
  :global(.custom-signature canvas) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
</style>
```

### 响应式尺寸

```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import SignaturePad from '@ldesign/signature-svelte'

  let width = 600
  let height = 300

  onMount(() => {
    const updateSize = () => {
      width = Math.min(window.innerWidth - 40, 800)
      height = width * 0.5
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  })
</script>

<SignaturePad {width} {height} showControls={true} />
```

### 多语言支持

```svelte
<script lang="ts">
  import SignaturePad from '@ldesign/signature-svelte'

  const lang = {
    clear: '清空',
    undo: '撤销',
    redo: '重做'
  }
</script>

<SignaturePad
  width={600}
  height={300}
  showControls={true}
  clearText={lang.clear}
  undoText={lang.undo}
  redoText={lang.redo}
/>
```

## 🔧 TypeScript 支持

完整的类型定义:

```typescript
import type { 
  SignatureConfig, 
  SignatureData,
  ExportFormat 
} from '@ldesign/signature-svelte'
```

## 📚 更多资源

- [Svelte 官方文档](https://svelte.dev/)
- [SvelteKit 文档](https://kit.svelte.dev/)
- [完整文档](../../docs)
- [在线演示](../../examples/svelte)
- [核心包文档](../core/README.md)

## 📄 许可证

MIT © LDesign Team
