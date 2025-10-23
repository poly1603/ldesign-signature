# Vanilla JavaScript

在原生 JavaScript 项目中使用 @ldesign/signature。

## 📦 安装

```bash
npm install @ldesign/signature
```

或使用 CDN:

```html
<script src="https://unpkg.com/@ldesign/signature/lib/index.umd.js"></script>
```

## 🚀 快速开始

### ESM 模块

```html
<!DOCTYPE html>
<html>
<body>
  <canvas id="signature" width="600" height="300"></canvas>
  <button onclick="sig.clear()">清空</button>
  <button onclick="sig.download('signature', 'png')">下载</button>
  
  <script type="module">
    import { createSignaturePad } from '@ldesign/signature';
    
    const canvas = document.getElementById('signature');
    window.sig = createSignaturePad(canvas, {
      penColor: '#000000',
      minWidth: 0.5,
      maxWidth: 2.5,
    });
  </script>
</body>
</html>
```

### UMD (全局变量)

```html
<!DOCTYPE html>
<html>
<body>
  <canvas id="signature" width="600" height="300"></canvas>
  
  <script src="https://unpkg.com/@ldesign/signature/lib/index.umd.js"></script>
  <script>
    const { createSignaturePad } = window.LDesignSignature;
    
    const canvas = document.getElementById('signature');
    const sig = createSignaturePad(canvas);
  </script>
</body>
</html>
```

## 💡 完整示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>签名示例</title>
  <style>
    body {
      font-family: sans-serif;
      max-width: 900px;
      margin: 50px auto;
      padding: 20px;
    }
    
    canvas {
      border: 2px solid #ddd;
      border-radius: 8px;
      display: block;
      cursor: crosshair;
    }
    
    .controls {
      margin-top: 15px;
      display: flex;
      gap: 10px;
    }
    
    button {
      padding: 10px 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    }
    
    button:hover:not(:disabled) {
      background: #409eff;
      color: white;
      border-color: #409eff;
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <h1>✍️ 签名示例</h1>
  
  <canvas id="signature-canvas" width="800" height="400"></canvas>
  
  <div class="controls">
    <button id="btn-clear">🗑️ 清空</button>
    <button id="btn-undo">↩️ 撤销</button>
    <button id="btn-redo">↪️ 重做</button>
    <button id="btn-export">📤 导出</button>
    <button id="btn-download">💾 下载</button>
  </div>
  
  <div id="preview" style="margin-top: 20px"></div>
  
  <script type="module">
    import { createSignaturePad } from '@ldesign/signature';
    
    const canvas = document.getElementById('signature-canvas');
    
    const signature = createSignaturePad(canvas, {
      penColor: '#000000',
      minWidth: 0.5,
      maxWidth: 2.5,
      smoothAlgorithm: 'catmull-rom',
      onEnd: () => {
        updateButtons();
      },
    });
    
    // 按钮功能
    document.getElementById('btn-clear').onclick = () => {
      signature.clear();
      updateButtons();
    };
    
    document.getElementById('btn-undo').onclick = () => {
      signature.undo();
      updateButtons();
    };
    
    document.getElementById('btn-redo').onclick = () => {
      signature.redo();
      updateButtons();
    };
    
    document.getElementById('btn-export').onclick = () => {
      const dataUrl = signature.toDataURL('png');
      
      const preview = document.getElementById('preview');
      preview.innerHTML = `<img src="${dataUrl}" style="max-width: 100%; border: 1px solid #ddd; border-radius: 4px;">`;
    };
    
    document.getElementById('btn-download').onclick = () => {
      signature.download('signature', 'png');
    };
    
    // 更新按钮状态
    function updateButtons() {
      document.getElementById('btn-clear').disabled = signature.isEmpty();
      document.getElementById('btn-undo').disabled = !signature.canUndo();
      document.getElementById('btn-redo').disabled = !signature.canRedo();
    }
    
    updateButtons();
  </script>
</body>
</html>
```

## 🔗 相关文档

- [快速开始](/guide/getting-started)
- [基础用法](/guide/basic-usage)

