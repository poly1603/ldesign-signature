# React 集成

在 React 项目中使用 @ldesign/signature。

## 📦 安装

```bash
pnpm add @ldesign/signature
```

## 🚀 快速开始

### 使用组件

```tsx
import { SignaturePad } from '@ldesign/signature/react';

export default function App() {
  return (
    <SignaturePad
      width={600}
      height={300}
      penColor="#000000"
      showControls={true}
    />
  );
}
```

### 使用 Hook

```tsx
import { useSignature } from '@ldesign/signature/react';

export default function App() {
  const {
    canvasRef,
    isEmpty,
    canUndo,
    canRedo,
    clear,
    undo,
    redo,
    download,
  } = useSignature({
    width: 600,
    height: 300,
    penColor: '#000000',
  });
  
  return (
    <div>
      <canvas ref={canvasRef} />
      <button onClick={clear} disabled={isEmpty}>清空</button>
      <button onClick={undo} disabled={!canUndo}>撤销</button>
      <button onClick={redo} disabled={!canRedo}>重做</button>
      <button onClick={() => download('signature', 'png')}>下载</button>
    </div>
  );
}
```

## 📋 组件 API

### Props

```typescript
interface SignaturePadProps {
  width?: number;
  height?: number;
  penColor?: string;
  minWidth?: number;
  maxWidth?: number;
  enabled?: boolean;
  showControls?: boolean;
  showClearButton?: boolean;
  showUndoButton?: boolean;
  showRedoButton?: boolean;
  clearButtonText?: string;
  undoButtonText?: string;
  redoButtonText?: string;
  className?: string;
  style?: React.CSSProperties;
  canvasStyle?: React.CSSProperties;
  config?: Partial<SignatureConfig>;
  onBegin?: (event: PointerEvent) => void;
  onChange?: (event: PointerEvent) => void;
  onEnd?: (event: PointerEvent) => void;
  onClear?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}
```

### Ref 方法

```tsx
import { useRef } from 'react';
import { SignaturePad, SignaturePadRef } from '@ldesign/signature/react';

function App() {
  const ref = useRef<SignaturePadRef>(null);
  
  const handleExport = () => {
    if (ref.current) {
      ref.current.clear();
      ref.current.undo();
      ref.current.redo();
      
      const png = ref.current.toDataURL('png');
      const svg = ref.current.toSVG();
      const json = ref.current.toJSON();
      
      ref.current.download('signature', 'png');
    }
  };
  
  return <SignaturePad ref={ref} />;
}
```

## 🎯 Hook API

### useSignature()

```typescript
function useSignature(config?: SignatureConfig): {
  canvasRef: RefObject<HTMLCanvasElement>;
  instance: SignatureInstance | null;
  isEmpty: boolean;
  canUndo: boolean;
  canRedo: boolean;
  initialize: () => void;
  clear: () => void;
  undo: () => void;
  redo: () => void;
  toDataURL: (format?: 'png' | 'jpeg', quality?: number) => string;
  toSVG: () => string;
  toJSON: () => SignatureData | null;
  fromJSON: (data: SignatureData) => void;
  download: (fileName?: string, format?: ExportFormat, quality?: number) => void;
  updateConfig: (config: Partial<SignatureConfig>) => void;
  setEnabled: (enabled: boolean) => void;
}
```

## 💡 使用示例

### 基础示例

```tsx
import React, { useRef } from 'react';
import { SignaturePad, SignaturePadRef } from '@ldesign/signature/react';

export default function App() {
  const signatureRef = useRef<SignaturePadRef>(null);
  
  const handleExport = () => {
    if (signatureRef.current) {
      const png = signatureRef.current.toDataURL('png');
      console.log('导出 PNG:', png);
    }
  };
  
  return (
    <div>
      <SignaturePad
        ref={signatureRef}
        width={800}
        height={400}
        penColor="#0066ff"
        minWidth={1}
        maxWidth={3}
        onEnd={(e) => console.log('签名完成', e)}
      />
      
      <button onClick={handleExport}>导出</button>
    </div>
  );
}
```

### 配置面板示例

```tsx
import React, { useState } from 'react';
import { SignaturePad } from '@ldesign/signature/react';

export default function App() {
  const [config, setConfig] = useState({
    penColor: '#000000',
    minWidth: 0.5,
    maxWidth: 2.5,
  });
  
  return (
    <div>
      <div className="config-panel">
        <label>
          笔触颜色:
          <input
            type="color"
            value={config.penColor}
            onChange={(e) => setConfig({...config, penColor: e.target.value})}
          />
        </label>
        
        <label>
          最小宽度:
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={config.minWidth}
            onChange={(e) => setConfig({...config, minWidth: Number(e.target.value)})}
          />
        </label>
      </div>
      
      <SignaturePad
        penColor={config.penColor}
        minWidth={config.minWidth}
        maxWidth={config.maxWidth}
      />
    </div>
  );
}
```

### 使用 Hook 的高级示例

```tsx
import React, { useEffect } from 'react';
import { useSignature } from '@ldesign/signature/react';
import { GridHelper, SignatureFilter, FilterType } from '@ldesign/signature';

export default function App() {
  const {
    canvasRef,
    isEmpty,
    canUndo,
    canRedo,
    clear,
    undo,
    redo,
    download,
    instance,
  } = useSignature({
    width: 800,
    height: 400,
    penColor: '#000000',
  });
  
  // 添加网格
  useEffect(() => {
    if (canvasRef.current) {
      const grid = new GridHelper(canvasRef.current);
      grid.draw({ showGrid: true });
      
      return () => grid.clear();
    }
  }, [canvasRef]);
  
  // 应用滤镜
  const applyFilter = () => {
    if (canvasRef.current) {
      SignatureFilter.apply(canvasRef.current, FilterType.GRAYSCALE);
    }
  };
  
  return (
    <div>
      <canvas ref={canvasRef} />
      
      <div className="controls">
        <button onClick={clear} disabled={isEmpty}>清空</button>
        <button onClick={undo} disabled={!canUndo}>撤销</button>
        <button onClick={redo} disabled={!canRedo}>重做</button>
        <button onClick={applyFilter}>应用滤镜</button>
        <button onClick={() => download('signature', 'png')}>下载</button>
      </div>
    </div>
  );
}
```

## 🔗 相关文档

- [快速开始](/guide/getting-started)
- [React 示例](/examples/react-examples)

