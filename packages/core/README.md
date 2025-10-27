# @ldesign/signature-core

Core engine for signature pad component with canvas drawing, touch support, and pressure sensitivity.

## Features

- 🎨 Canvas-based drawing engine
- 👆 Touch and mouse support
- 💪 Pressure sensitivity (Apple Pencil, Wacom, etc.)
- 🌊 Catmull-Rom curve smoothing
- 📦 History management (undo/redo)
- 🔄 Multiple export formats (PNG, JPEG, SVG, JSON)
- 🎯 High-performance rendering
- 📱 Mobile-friendly

## Installation

```bash
pnpm add @ldesign/signature-core
```

## Usage

```typescript
import { createSignaturePad } from '@ldesign/signature-core';

const signaturePad = createSignaturePad({
  container: document.getElementById('signature-container'),
  width: 600,
  height: 400,
  penColor: '#000',
  pressureSensitive: true,
});

// Export
const dataUrl = signaturePad.toDataURL('png');
const svg = signaturePad.toSVG();
const json = signaturePad.toJSON();

// History
signaturePad.undo();
signaturePad.redo();
signaturePad.clear();
```

## License

MIT

