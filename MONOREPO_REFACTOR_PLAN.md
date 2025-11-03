# @ldesign/signature Monorepo Refactor Plan

## 🎯 Project Overview

This document outlines the comprehensive refactoring plan to transform @ldesign/signature into a multi-framework, production-ready monorepo with exceptional code quality, performance, and developer experience.

## 📦 Package Structure

```
packages/
├── core/                 # Framework-agnostic core library
│   ├── src/
│   │   ├── core/        # SignaturePad, HistoryManager, etc.
│   │   ├── renderers/   # Canvas & SVG renderers
│   │   ├── features/    # Replay, Storage, Filters, Grid, Brushes
│   │   ├── utils/       # Smoothing, Cropping, Scaling, Compression
│   │   └── types/       # TypeScript definitions
│   ├── __tests__/       # Unit tests
│   ├── build.config.ts  # Builder configuration
│   ├── eslint.config.js # ESLint configuration
│   └── tsconfig.json    # TypeScript configuration
│
├── vue/                 # Vue 3 integration
│   ├── src/
│   │   ├── components/  # SignaturePad, SignatureReplay
│   │   ├── composables/ # useSignature, useSignatureHistory
│   │   └── index.ts
│   ├── examples/        # Demo project (using @ldesign/launcher)
│   └── __tests__/
│
├── react/               # React 18+ integration
│   ├── src/
│   │   ├── components/  # SignaturePad, SignatureReplay
│   │   ├── hooks/       # useSignature, useSignatureHistory
│   │   └── index.ts
│   ├── examples/
│   └── __tests__/
│
├── angular/             # Angular 16+ integration
│   ├── src/
│   │   ├── components/  # SignaturePadComponent
│   │   ├── services/    # SignatureService
│   │   ├── directives/  # SignatureDirective
│   │   └── index.ts
│   ├── examples/
│   └── __tests__/
│
├── solid/               # Solid.js integration
│   ├── src/
│   │   ├── primitives/  # createSignature, createSignatureHistory
│   │   ├── components/  # SignaturePad
│   │   └── index.ts
│   ├── examples/
│   └── __tests__/
│
├── svelte/              # Svelte 4/5 integration
│   ├── src/
│   │   ├── components/  # SignaturePad.svelte
│   │   ├── stores/      # signatureStore
│   │   └── index.ts
│   ├── examples/
│   └── __tests__/
│
└── qwik/                # Qwik integration
    ├── src/
    │   ├── components/  # SignaturePad (with $ hooks)
    │   └── index.ts
    ├── examples/
    └── __tests__/
```

## 🚀 Enhanced Features

### Core Enhancements

#### 1. **Multi-Layer Support**
```typescript
interface Layer {
  id: string
  name: string
  visible: boolean
  opacity: number
  locked: boolean
  strokes: Stroke[]
}

class LayerManager {
  addLayer(name: string): Layer
  removeLayer(id: string): void
  setActiveLayer(id: string): void
  mergeLayer(sourceId: string, targetId: string): void
  reorderLayers(ids: string[]): void
}
```

#### 2. **Advanced Brush Styles**
```typescript
enum BrushType {
  PEN = 'pen',           // Standard pen
  MARKER = 'marker',     // Flat marker
  SPRAY = 'spray',       // Spray paint
  CALLIGRAPHY = 'calligraphy', // Calligraphic pen
  PENCIL = 'pencil',     // Textured pencil
  AIRBRUSH = 'airbrush', // Soft airbrush
}

interface BrushConfig {
  type: BrushType
  size: number
  opacity: number
  flow: number
  hardness: number
  texture?: ImageData
}
```

#### 3. **Gesture Recognition**
```typescript
interface GestureRecognizer {
  onPinchZoom(callback: (scale: number) => void): void
  onRotate(callback: (angle: number) => void): void
  onPan(callback: (dx: number, dy: number) => void): void
  onTwoFingerTap(callback: () => void): void
}
```

#### 4. **Collaborative Editing Hooks**
```typescript
interface CollaborationAdapter {
  broadcastStroke(stroke: Stroke): void
  receiveStroke(callback: (stroke: Stroke, userId: string) => void): void
  syncCursor(position: Point): void
  receiveCursor(callback: (position: Point, userId: string) => void): void
}
```

#### 5. **Advanced Tools**
```typescript
enum Tool {
  PEN = 'pen',
  ERASER = 'eraser',
  SELECTION = 'selection',
  FILL = 'fill',
  EYEDROPPER = 'eyedropper',
  SHAPE = 'shape',      // Rectangle, Circle, Line
}

interface ToolManager {
  setActiveTool(tool: Tool): void
  getActiveTool(): Tool
  configureToolOptions(tool: Tool, options: any): void
}
```

#### 6. **Accessibility Features**
```typescript
interface AccessibilityConfig {
  keyboardNavigation: boolean
  screenReaderAnnouncements: boolean
  highContrastMode: boolean
  focusIndicators: boolean
  alternativeInputMethods: {
    keyboard: boolean
    voice: boolean
    eyeTracking: boolean
  }
}
```

### Performance Optimizations

#### 1. **Point Sampling Optimization**
- Use Web Workers for heavy computations
- Implement point pooling to reduce GC pressure
- Add intelligent throttling based on performance metrics

#### 2. **Rendering Optimizations**
- Implement dirty rectangle tracking
- Use OffscreenCanvas for background rendering
- Add Level-of-Detail (LOD) rendering for complex signatures
- Implement canvas tiling for large canvases

#### 3. **Memory Management**
- Implement WeakMap caching for computed values
- Add automatic cleanup of old history entries
- Use Object pooling for frequently created objects
- Monitor and prevent memory leaks

#### 4. **Algorithm Optimizations**
- Optimize Catmull-Rom spline calculation
- Use SIMD operations where available
- Implement progressive rendering for exports

## 🧪 Testing Strategy

### Unit Tests (Vitest)
```typescript
// packages/core/__tests__/signature-pad.test.ts
describe('SignaturePad', () => {
  it('should initialize with default config', () => {})
  it('should capture pointer events correctly', () => {})
  it('should apply smoothing algorithms', () => {})
  it('should handle undo/redo', () => {})
  it('should export in all formats', () => {})
})
```

### Visual Regression Tests (Playwright)
```typescript
// tests/visual/signature-rendering.spec.ts
test('renders smooth curves correctly', async ({ page }) => {
  await page.goto('/demo')
  await page.locator('canvas').drawSignature(testPoints)
  await expect(page).toHaveScreenshot('smooth-curve.png')
})
```

### Performance Tests
```typescript
// benchmarks/point-capture.bench.ts
import { bench } from 'vitest'

bench('capture 1000 points', () => {
  const capture = new PointCapture(canvas, 5, 0.7, true)
  for (let i = 0; i < 1000; i++) {
    capture.createPoint(mockPointerEvent)
  }
})
```

### Memory Leak Tests
```typescript
// tests/memory/leak-detection.test.ts
test('no memory leaks after 1000 create/destroy cycles', async () => {
  const initialMemory = await getMemoryUsage()
  
  for (let i = 0; i < 1000; i++) {
    const pad = createSignaturePad(canvas)
    pad.destroy()
  }
  
  const finalMemory = await getMemoryUsage()
  expect(finalMemory - initialMemory).toBeLessThan(THRESHOLD)
})
```

## 📚 Documentation Structure

```
docs/
├── .vitepress/
│   └── config.ts
├── guide/
│   ├── getting-started.md
│   ├── installation.md
│   ├── basic-usage.md
│   └── advanced-features.md
├── frameworks/
│   ├── vue.md
│   ├── react.md
│   ├── angular.md
│   ├── solid.md
│   ├── svelte.md
│   └── qwik.md
├── api/
│   ├── core.md
│   ├── types.md
│   ├── utils.md
│   └── renderers.md
├── examples/
│   ├── basic-signature.md
│   ├── multi-layer.md
│   ├── custom-brushes.md
│   ├── collaboration.md
│   └── accessibility.md
├── migration/
│   └── from-v0.2.md
└── performance/
    ├── optimization-tips.md
    └── benchmarks.md
```

## 🔧 Build Configuration

### Root package.json
```json
{
  "name": "@ldesign/signature",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "pnpm -r --filter './packages/*' run build",
    "dev": "pnpm -r --parallel --filter './packages/*' run dev",
    "test": "vitest run",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:visual": "playwright test",
    "lint": "eslint packages --fix",
    "type-check": "tsc --noEmit --composite false",
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "release": "changeset publish"
  }
}
```

### Shared TypeScript Config
```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Shared ESLint Config
```typescript
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  react: true,
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },
  ignores: [
    '**/dist',
    '**/es',
    '**/lib',
    '**/*.d.ts',
    '**/node_modules',
  ],
}, {
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'vue/multi-word-component-names': 'off',
    'react/prop-types': 'off',
  },
})
```

## 📊 Quality Gates

### Pre-commit Checks
- ESLint (no errors)
- TypeScript compilation (no errors)
- Unit tests (passing)
- Test coverage (>90%)

### Pre-push Checks
- All tests passing
- Visual regression tests
- Performance benchmarks (no regression)
- Memory leak tests

### CI/CD Pipeline
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Lint
        run: pnpm run lint
      
      - name: Type check
        run: pnpm run type-check
      
      - name: Unit tests
        run: pnpm run test
      
      - name: Build all packages
        run: pnpm run build
      
      - name: Visual regression tests
        run: pnpm run test:visual
```

## 🎯 Success Criteria

- ✅ All packages build without errors
- ✅ Zero ESLint errors across all packages
- ✅ Zero TypeScript errors
- ✅ >90% test coverage
- ✅ All visual regression tests pass
- ✅ Performance benchmarks meet targets
- ✅ No memory leaks detected
- ✅ Comprehensive documentation
- ✅ Working demo for each framework
- ✅ Accessibility compliance (WCAG 2.1 AA)

## 📅 Implementation Timeline

### Phase 1: Core & Infrastructure (Week 1-2)
- ✅ Package structure setup
- ⏳ Enhanced core features
- ⏳ Performance optimizations
- ⏳ Build configuration

### Phase 2: Framework Integrations (Week 3-4)
- ✅ Angular, Solid, Svelte, Qwik packages
- ⏳ Update Vue & React packages
- ⏳ Framework-specific optimizations

### Phase 3: Testing (Week 5)
- ⏳ Unit tests for all packages
- ⏳ Visual regression tests
- ⏳ Performance benchmarks
- ⏳ Memory leak detection

### Phase 4: Documentation & Demos (Week 6)
- ⏳ VitePress documentation
- ⏳ Demo projects for all frameworks
- ⏳ API documentation
- ⏳ Migration guide

### Phase 5: Quality & Polish (Week 7)
- ⏳ ESLint fixes
- ⏳ Type definition improvements
- ⏳ Accessibility improvements
- ⏳ Performance tuning

## 🔄 Next Steps

1. Complete core package enhancements
2. Implement all framework integrations
3. Set up comprehensive testing infrastructure
4. Build demo projects using @ldesign/launcher
5. Create comprehensive documentation
6. Perform quality assurance
7. Release v1.0.0

---

**Status**: 🚧 In Progress  
**Version**: 1.0.0-alpha  
**Last Updated**: 2025-10-30
