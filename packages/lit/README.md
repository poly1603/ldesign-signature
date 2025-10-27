# @ldesign/signature-lit

Lit Web Components for signature pad with canvas drawing and touch support.

## Installation

```bash
pnpm add @ldesign/signature-lit
```

## Usage

### Web Component

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '@ldesign/signature-lit';
  </script>
</head>
<body>
  <signature-pad
    width="600"
    height="400"
    pen-color="#000"
    pressure-sensitive
  ></signature-pad>

  <script>
    const pad = document.querySelector('signature-pad');
    
    // Methods
    pad.clear();
    pad.undo();
    pad.download('signature.png');
    
    // Events
    pad.addEventListener('begin', () => console.log('Started'));
    pad.addEventListener('change', () => console.log('Changed'));
    pad.addEventListener('end', () => console.log('Ended'));
  </script>
</body>
</html>
```

### With Lit

```typescript
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@ldesign/signature-lit';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`
      <signature-pad
        width="600"
        height="400"
        pen-color="#000"
        @begin=${this.handleBegin}
        @change=${this.handleChange}
        @end=${this.handleEnd}
      ></signature-pad>
    `;
  }
  
  handleBegin() {
    console.log('Drawing started');
  }
  
  handleChange() {
    console.log('Drawing changed');
  }
  
  handleEnd() {
    console.log('Drawing ended');
  }
}
```

## License

MIT

