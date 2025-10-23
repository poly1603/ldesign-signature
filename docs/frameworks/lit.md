# Lit 集成

在 Lit 项目中使用 @ldesign/signature Web Component。

## 📦 安装

```bash
pnpm add @ldesign/signature
```

## 🚀 快速开始

### 使用 Web Component

```html
<signature-pad
  width="600"
  height="300"
  pen-color="#000000"
  show-controls
></signature-pad>

<script type="module">
  import '@ldesign/signature/lit';
</script>
```

### 在 Lit 组件中使用

```typescript
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@ldesign/signature/lit';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`
      <signature-pad
        width="600"
        height="300"
        pen-color="#000000"
        show-controls
        @end="${this.handleEnd}"
      ></signature-pad>
    `;
  }
  
  handleEnd(e: CustomEvent) {
    console.log('签名完成', e.detail);
  }
}
```

## 📋 属性 (Attributes)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | `number` | `600` | Canvas 宽度 |
| `height` | `number` | `300` | Canvas 高度 |
| `pen-color` | `string` | `'#000000'` | 笔触颜色 |
| `min-width` | `number` | `0.5` | 最小宽度 |
| `max-width` | `number` | `2.5` | 最大宽度 |
| `smooth-algorithm` | `string` | `'catmull-rom'` | 平滑算法 |
| `pressure-sensitive` | `boolean` | `true` | 压力感应 |
| `enabled` | `boolean` | `true` | 是否启用 |
| `show-controls` | `boolean` | `true` | 显示控制按钮 |
| `show-clear-button` | `boolean` | `true` | 显示清空按钮 |
| `show-undo-button` | `boolean` | `true` | 显示撤销按钮 |
| `show-redo-button` | `boolean` | `true` | 显示重做按钮 |
| `clear-button-text` | `string` | `'清空'` | 清空按钮文字 |
| `undo-button-text` | `string` | `'撤销'` | 撤销按钮文字 |
| `redo-button-text` | `string` | `'重做'` | 重做按钮文字 |

## 🎯 事件

| 事件 | 详情 | 说明 |
|------|------|------|
| `begin` | `PointerEvent` | 开始绘制 |
| `change` | `PointerEvent` | 绘制过程中 |
| `end` | `PointerEvent` | 结束绘制 |
| `clear` | - | 清空签名 |
| `undo` | - | 撤销操作 |
| `redo` | - | 重做操作 |

**监听事件**:

```html
<signature-pad
  @begin="${this.onBegin}"
  @change="${this.onChange}"
  @end="${this.onEnd}"
></signature-pad>
```

```typescript
onBegin(e: CustomEvent) {
  console.log('开始', e.detail);
}

onChange(e: CustomEvent) {
  console.log('绘制中', e.detail);
}

onEnd(e: CustomEvent) {
  console.log('结束', e.detail);
}
```

## 🔧 方法

### 获取元素引用

```typescript
const signaturePad = document.querySelector('signature-pad');

// 调用方法
signaturePad.clear();
signaturePad.undo();
signaturePad.redo();

// 导出
const png = signaturePad.toDataURL('png');
const svg = signaturePad.toSVG();
const json = signaturePad.toJSON();

// 下载
signaturePad.download('signature', 'png');
```

### 在 Lit 组件中使用

```typescript
import { LitElement, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { SignaturePadElement } from '@ldesign/signature/lit';

@customElement('my-form')
export class MyForm extends LitElement {
  @query('signature-pad') signaturePad!: SignaturePadElement;
  
  handleSubmit() {
    if (this.signaturePad.getInstance()?.isEmpty()) {
      alert('请先签名！');
      return;
    }
    
    const dataUrl = this.signaturePad.toDataURL('png');
    console.log('提交签名:', dataUrl);
  }
  
  render() {
    return html`
      <signature-pad width="600" height="300"></signature-pad>
      <button @click="${this.handleSubmit}">提交</button>
    `;
  }
}
```

## 💡 使用示例

### 基础示例

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import '@ldesign/signature/lit';
import type { SignaturePadElement } from '@ldesign/signature/lit';

@customElement('signature-demo')
export class SignatureDemo extends LitElement {
  @query('signature-pad') signaturePad!: SignaturePadElement;
  
  static styles = css`
    .container {
      padding: 20px;
    }
    
    .controls {
      margin-top: 10px;
      display: flex;
      gap: 10px;
    }
  `;
  
  handleExport() {
    const png = this.signaturePad.toDataURL('png');
    console.log('导出:', png);
  }
  
  render() {
    return html`
      <div class="container">
        <signature-pad
          width="800"
          height="400"
          pen-color="#0066ff"
          show-controls
          @end="${() => console.log('签名完成')}"
        ></signature-pad>
        
        <div class="controls">
          <button @click="${this.handleExport}">导出</button>
        </div>
      </div>
    `;
  }
}
```

### 配置面板示例

```typescript
import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import '@ldesign/signature/lit';
import type { SignaturePadElement } from '@ldesign/signature/lit';

@customElement('signature-config-demo')
export class SignatureConfigDemo extends LitElement {
  @state() penColor = '#000000';
  @state() minWidth = 0.5;
  @state() maxWidth = 2.5;
  
  @query('signature-pad') signaturePad!: SignaturePadElement;
  
  handleColorChange(e: Event) {
    this.penColor = (e.target as HTMLInputElement).value;
  }
  
  handleMinWidthChange(e: Event) {
    this.minWidth = Number((e.target as HTMLInputElement).value);
  }
  
  render() {
    return html`
      <div class="config-panel">
        <label>
          笔触颜色:
          <input
            type="color"
            .value="${this.penColor}"
            @input="${this.handleColorChange}"
          />
        </label>
        
        <label>
          最小宽度:
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            .value="${this.minWidth}"
            @input="${this.handleMinWidthChange}"
          />
          <span>${this.minWidth}</span>
        </label>
      </div>
      
      <signature-pad
        width="800"
        height="400"
        pen-color="${this.penColor}"
        min-width="${this.minWidth}"
        max-width="${this.maxWidth}"
      ></signature-pad>
    `;
  }
}
```

## 🔗 相关文档

- [快速开始](/guide/getting-started)
- [Lit 示例](/examples/lit-examples)

