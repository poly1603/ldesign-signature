# @ldesign/signature Packages

This directory contains all framework-specific and core packages for the @ldesign/signature library.

## 📦 Package Overview

### Core Package
- **@ldesign/signature-core** - Framework-agnostic signature pad engine
  - Zero dependencies (except internal @ldesign/shared)
  - Pure TypeScript implementation
  - Canvas-based rendering
  - Comprehensive utility functions

### Framework Packages

#### Production Ready ✅
- **@ldesign/signature-vue** - Vue 3 components and composables
- **@ldesign/signature-react** - React 18+ components and hooks
- **@ldesign/signature-lit** - Lit web components

#### New Implementations 🚧
- **@ldesign/signature-angular** - Angular 16+ components and services
- **@ldesign/signature-solid** - Solid.js primitives and components
- **@ldesign/signature-svelte** - Svelte 4/5 components and stores
- **@ldesign/signature-qwik** - Qwik components with resumability

## 🚀 Development Workflow

### Prerequisites
```bash
# Ensure you're using pnpm
corepack enable
pnpm --version  # Should be 8.x or higher
```

### Install Dependencies
```bash
# From root directory
pnpm install
```

### Build All Packages
```bash
# Build all packages
pnpm -r --filter './packages/*' run build

# Build specific package
cd packages/angular
pnpm run build
```

### Development Mode
```bash
# Watch mode for all packages
pnpm -r --parallel --filter './packages/*' run dev

# Watch specific package
cd packages/solid
pnpm run dev
```

### Run Tests
```bash
# Run tests for all packages
pnpm -r --filter './packages/*' run test

# Run tests with coverage
pnpm -r --filter './packages/*' run test:coverage
```

### Lint and Type Check
```bash
# Lint all packages
pnpm -r --filter './packages/*' run lint

# Type check all packages
pnpm -r --filter './packages/*' run type-check
```

## 📝 Adding a New Framework Package

### 1. Create Package Structure
```bash
mkdir -p packages/new-framework/src
cd packages/new-framework
```

### 2. Create package.json
```json
{
  "name": "@ldesign/signature-new-framework",
  "version": "1.0.0",
  "type": "module",
  "main": "./lib/index.cjs",
  "module": "./es/index.js",
  "types": "./es/index.d.ts",
  "exports": {
    ".": {
      "types": "./es/index.d.ts",
      "import": "./es/index.js",
      "require": "./lib/index.cjs"
    }
  },
  "scripts": {
    "build": "ldesign-builder build",
    "dev": "ldesign-builder build --watch",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@ldesign/signature-core": "workspace:*"
  },
  "peerDependencies": {
    "new-framework": "^x.x.x"
  },
  "devDependencies": {
    "@ldesign/builder": "workspace:*",
    "@antfu/eslint-config": "^3.0.0",
    "typescript": "^5.7.3"
  }
}
```

### 3. Create build.config.ts
```typescript
import { defineBuildConfig } from '@ldesign/builder'

export default defineBuildConfig({
  entries: ['src/index.ts'],
  formats: ['esm', 'cjs', 'dts'],
  externals: [
    'new-framework',
    '@ldesign/signature-core',
  ],
  clean: true,
  declaration: true,
})
```

### 4. Create tsconfig.json
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "paths": {
      "@ldesign/signature-core": ["../core/src/index.ts"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. Create eslint.config.js
```typescript
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
})
```

### 6. Implement Framework Integration
```typescript
// src/index.ts
import { createSignaturePad } from '@ldesign/signature-core'
import type { SignatureConfig } from '@ldesign/signature-core'

// Add your framework-specific integration here
export function createFrameworkSignature(config: SignatureConfig) {
  // Implementation
}

// Re-export types
export type * from '@ldesign/signature-core'
```

## 🧪 Testing Guidelines

### Unit Tests
Each package should have comprehensive unit tests covering:
- Component/primitive initialization
- State management
- Event handling
- Integration with core library
- Memory cleanup

### Visual Tests
Use Playwright for visual regression tests:
```typescript
test('signature renders correctly', async ({ page }) => {
  await page.goto('/demo')
  await page.locator('canvas').drawSignature(testData)
  await expect(page).toHaveScreenshot()
})
```

### Performance Tests
Benchmark critical operations:
```typescript
import { bench } from 'vitest'

bench('render 1000 points', () => {
  // Performance test
})
```

## 📖 Documentation

Each package should include:
1. **README.md** - Installation, basic usage, API overview
2. **Examples** - Real-world use cases
3. **API Documentation** - Detailed API reference
4. **Migration Guide** - If applicable

## 🎯 Quality Standards

All packages must:
- ✅ Build without errors
- ✅ Pass all tests (>90% coverage)
- ✅ Have zero ESLint errors
- ✅ Have zero TypeScript errors
- ✅ Include comprehensive documentation
- ✅ Follow consistent code style
- ✅ Properly clean up resources (no memory leaks)

## 🔗 Inter-Package Dependencies

```
@ldesign/signature-core (base)
    ↓
├── @ldesign/signature-vue
├── @ldesign/signature-react  
├── @ldesign/signature-angular
├── @ldesign/signature-solid
├── @ldesign/signature-svelte
└── @ldesign/signature-qwik
```

## 📚 Resources

- [Main Documentation](../docs)
- [Contributing Guide](../CONTRIBUTING.md)
- [Monorepo Refactor Plan](../MONOREPO_REFACTOR_PLAN.md)
- [@ldesign/builder Documentation](../../tools/builder)
- [@ldesign/launcher Documentation](../../tools/launcher)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add/update tests
4. Run quality checks: `pnpm run lint && pnpm run type-check && pnpm run test`
5. Submit a pull request

---

For detailed implementation guidelines, see [MONOREPO_REFACTOR_PLAN.md](../MONOREPO_REFACTOR_PLAN.md)
