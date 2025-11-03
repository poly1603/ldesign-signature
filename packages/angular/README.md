# @ldesign/signature-angular

Angular 组件和服务,用于手写签名功能。

## ✨ 特性

- 🎨 完整的 Angular 组件封装
- 📦 RxJS Observable 状态管理
- 🔧 依赖注入服务
- 🎯 TypeScript 类型支持
- ♿ 无障碍访问支持
- 📱 响应式设计

## 📦 安装

```bash
npm install @ldesign/signature-angular @ldesign/signature-core
# 或
pnpm add @ldesign/signature-angular @ldesign/signature-core
```

## 🚀 快速开始

### 使用组件

```typescript
import { Component } from '@angular/core'
import { SignaturePadComponent } from '@ldesign/signature-angular'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SignaturePadComponent],
  template: `
    <ldesign-signature-pad
      [width]="600"
      [height]="300"
      [penColor]="'#0066ff'"
      [showControls]="true"
      (begin)="onBegin($event)"
      (change)="onChange($event)"
      (end)="onEnd($event)"
    />
    
    <button (click)="exportSignature()">导出签名</button>
  `,
})
export class AppComponent {
  @ViewChild(SignaturePadComponent) signaturePad!: SignaturePadComponent

  onBegin(e: PointerEvent) {
    console.log('开始绘制', e)
  }

  onChange(e: PointerEvent) {
    console.log('绘制中', e)
  }

  onEnd(e: PointerEvent) {
    console.log('结束绘制', e)
  }

  exportSignature() {
    const dataUrl = this.signaturePad.toDataURL('png')
    console.log('导出签名:', dataUrl)
  }
}
```

### 使用服务

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core'
import { SignatureService } from '@ldesign/signature-angular'

@Component({
  selector: 'app-signature',
  template: `
    <canvas #canvas></canvas>
    
    <div *ngIf="state$ | async as state">
      <button (click)="clear()" [disabled]="state.isEmpty">清空</button>
      <button (click)="undo()" [disabled]="!state.canUndo">撤销</button>
      <button (click)="redo()" [disabled]="!state.canRedo">重做</button>
    </div>
  `,
})
export class SignatureComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>
  
  state$ = this.signatureService.getState$('main')

  constructor(private signatureService: SignatureService) {}

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement
    const instance = this.signatureService.createSignature('main', canvas, {
      width: 600,
      height: 300,
      penColor: '#000000',
    })
  }

  ngOnDestroy() {
    this.signatureService.destroySignature('main')
  }

  clear() {
    const instance = this.signatureService.getInstance('main')
    instance?.clear()
    this.updateState()
  }

  undo() {
    const instance = this.signatureService.getInstance('main')
    instance?.undo()
    this.updateState()
  }

  redo() {
    const instance = this.signatureService.getInstance('main')
    instance?.redo()
    this.updateState()
  }

  private updateState() {
    const instance = this.signatureService.getInstance('main')
    if (instance) {
      this.signatureService.updateState('main', instance)
    }
  }
}
```

## 📖 API

### SignaturePadComponent

#### 输入属性

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

#### 输出事件

| 事件 | 类型 | 说明 |
|------|------|------|
| begin | EventEmitter<PointerEvent> | 开始绘制 |
| change | EventEmitter<PointerEvent> | 绘制中 |
| end | EventEmitter<PointerEvent> | 结束绘制 |

#### 方法

- `clear(): void` - 清空画布
- `undo(): void` - 撤销
- `redo(): void` - 重做
- `isEmpty(): boolean` - 是否为空
- `canUndo(): boolean` - 能否撤销
- `canRedo(): boolean` - 能否重做
- `toDataURL(format?, quality?): string` - 导出为 Data URL
- `toSVG(): string` - 导出为 SVG
- `toJSON(): SignatureData` - 导出为 JSON
- `fromJSON(data): void` - 从 JSON 导入
- `download(fileName?, format?, quality?): void` - 下载文件

### SignatureService

#### 方法

- `createSignature(id, canvas, config?): SignatureInstance` - 创建签名实例
- `getInstance(id): SignatureInstance | undefined` - 获取实例
- `getState$(id): Observable<SignatureState> | undefined` - 获取状态流
- `updateState(id, instance): void` - 更新状态
- `destroySignature(id): void` - 销毁实例
- `destroyAll(): void` - 销毁所有实例

## 📚 更多资源

- [完整文档](../../docs)
- [在线演示](../../examples/angular)
- [核心包文档](../core/README.md)

## 📄 许可证

MIT © LDesign Team
