# @ldesign/signature-react

React components for signature pad with canvas drawing and touch support.

## Installation

```bash
pnpm add @ldesign/signature-react
```

## Usage

### Component

```tsx
import { useRef } from 'react';
import { SignaturePad } from '@ldesign/signature-react';

export default function App() {
  const signatureRef = useRef<any>(null);

  const handleClear = () => signatureRef.current?.clear();
  const handleUndo = () => signatureRef.current?.undo();
  const handleDownload = () => signatureRef.current?.download('signature.png');

  return (
    <div>
      <SignaturePad
        ref={signatureRef}
        width={600}
        height={400}
        penColor="#000"
        pressureSensitive
        onBegin={() => console.log('Started')}
        onChange={() => console.log('Changed')}
        onEnd={() => console.log('Ended')}
      />
      <button onClick={handleClear}>Clear</button>
      <button onClick={handleUndo}>Undo</button>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}
```

### Hook

```tsx
import { useSignature } from '@ldesign/signature-react';

export default function App() {
  const { 
    canvasRef, 
    signaturePad, 
    isEmpty, 
    canUndo, 
    canRedo 
  } = useSignature({
    width: 600,
    height: 400,
  });

  return <canvas ref={canvasRef} />;
}
```

## License

MIT

