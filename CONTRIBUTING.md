# Contributing to @ldesign/signature

Thank you for your interest in contributing to @ldesign/signature! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)

## 📜 Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive community.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (recommended package manager)
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/signature.git
cd signature
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/ldesign/signature.git
```

## 🛠️ Development Setup

### Install Dependencies

```bash
pnpm install
```

### Build All Packages

```bash
# Build all packages
pnpm --filter "@ldesign/*" run build

# Build specific package
pnpm --filter "@ldesign/signature-core" run build
```

### Run Tests

```bash
# Run core package tests
cd packages/core
pnpm test

# Watch mode
pnpm test --watch
```

### Type Check

```bash
# Type check all packages
pnpm --filter "@ldesign/signature-*" --filter "!*-demo*" run type-check
```

### Start Dev Mode

```bash
# Watch mode for core package
cd packages/core
pnpm run dev
```

### Documentation

```bash
# Start documentation dev server
pnpm run docs:dev

# Build documentation
pnpm run docs:build

# Preview built documentation
pnpm run docs:preview
```

## 📁 Project Structure

```
signature/
├── packages/                 # Main packages
│   ├── core/                # Core engine (framework-agnostic)
│   ├── react/               # React adapter
│   ├── vue/                 # Vue 3 adapter
│   ├── angular/             # Angular adapter
│   ├── solid/               # Solid.js adapter
│   ├── svelte/              # Svelte adapter
│   ├── qwik/                # Qwik adapter
│   └── lit/                 # Lit (Web Components) adapter
│
├── demos/                    # Demo applications
│   ├── react-app/           # React demo
│   └── vue-app/             # Vue demo
│
├── docs/                     # VitePress documentation
│   ├── .vitepress/          # VitePress config
│   ├── guide/               # User guides
│   ├── api/                 # API reference
│   ├── features/            # Feature documentation
│   └── frameworks/          # Framework integration guides
│
├── BUILD_STATUS.md          # Build status and progress
└── CONTRIBUTING.md          # This file
```

## 🔄 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run tests
cd packages/core
pnpm test

# Type check
pnpm run type-check

# Build to ensure no errors
pnpm run build
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add new smoothing algorithm"
git commit -m "fix: resolve touch event handling issue"
git commit -m "docs: update API documentation"
git commit -m "test: add tests for PointCapture"
git commit -m "chore: update dependencies"
```

Commit types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semi-colons, etc)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🧪 Testing

### Writing Tests

All tests use Vitest. Place tests in `__tests__` directory within the package.

Example test structure:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { SignaturePad } from '../src/core/signature-pad'

describe('SignaturePad', () => {
  let canvas: HTMLCanvasElement
  let signaturePad: SignaturePad

  beforeEach(() => {
    canvas = document.createElement('canvas')
    signaturePad = new SignaturePad(canvas)
  })

  describe('initialization', () => {
    it('should create instance successfully', () => {
      expect(signaturePad).toBeInstanceOf(SignaturePad)
    })
  })
})
```

### Running Tests

```bash
# Run all tests
cd packages/core
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage
```

## 📖 Documentation

### Documentation Structure

Documentation is built with VitePress and located in the `docs/` directory.

### Adding Documentation

1. Create or edit markdown files in appropriate directories:
   - `docs/guide/` - User guides
   - `docs/api/` - API reference
   - `docs/features/` - Feature documentation
   - `docs/frameworks/` - Framework guides

2. Update sidebar in `docs/.vitepress/config.ts` if needed

3. Preview your changes:

```bash
pnpm run docs:dev
```

## 📤 Submitting Changes

### Pull Request Process

1. **Update your fork:**

```bash
git fetch upstream
git rebase upstream/main
```

2. **Push your changes:**

```bash
git push origin feature/your-feature-name
```

3. **Create Pull Request:**
   - Go to GitHub and create a Pull Request
   - Fill in the PR template
   - Link related issues

4. **PR Description should include:**
   - What changes were made
   - Why these changes were needed
   - How to test the changes
   - Screenshots (if UI changes)
   - Breaking changes (if any)

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow conventional format
- [ ] No breaking changes (or documented if necessary)

## 🎨 Code Style

### TypeScript

- Use TypeScript for all code
- Enable strict mode
- Define proper types (avoid `any`)
- Use interfaces for public APIs

### Formatting

- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multiline

### Naming Conventions

- `PascalCase` for classes and interfaces
- `camelCase` for functions and variables
- `UPPER_SNAKE_CASE` for constants
- `kebab-case` for file names

### Comments

- Use JSDoc for public APIs
- Write clear, concise comments
- Explain "why", not "what"

Example:

```typescript
/**
 * Calculate velocity between two points
 * 
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Velocity in pixels per millisecond
 */
export function calculateVelocity(p1: Point, p2: Point): number {
  // Calculate distance using Pythagorean theorem
  const dist = Math.sqrt(
    Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
  )
  
  const timeDelta = p2.timestamp - p1.timestamp
  return timeDelta === 0 ? 0 : dist / timeDelta
}
```

## 🐛 Reporting Bugs

### Before Reporting

- Check existing issues
- Try latest version
- Reduce to minimal reproducible example

### Bug Report Should Include

- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, browser, versions)
- Code example or screenshot

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check if feature already exists or is planned
2. Explain use case and benefits
3. Provide examples if possible
4. Be open to discussion

## ❓ Questions

For questions:
- Check documentation first
- Search existing issues
- Create a discussion or issue

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for contributing to @ldesign/signature! Your efforts help make this project better for everyone.

---

**Happy Coding! 🎉**
