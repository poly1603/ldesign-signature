# @ldesign/signature-vue

Vue 3 components for signature pad with canvas drawing and touch support.

## Installation

```bash
pnpm add @ldesign/signature-vue
```

## Usage

### Component

```vue
<template>
  <div>
    <SignaturePad
      ref="signatureRef"
      :width="600"
      :height="400"
      :pen-color="'#000'"
      :pressure-sensitive="true"
      @begin="onBegin"
      @change="onChange"
      @end="onEnd"
    />
    <button @click="clear">Clear</button>
    <button @click="undo">Undo</button>
    <button @click="download">Download</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SignaturePad } from '@ldesign/signature-vue';

const signatureRef = ref<InstanceType<typeof SignaturePad>>();

const clear = () => signatureRef.value?.clear();
const undo = () => signatureRef.value?.undo();
const download = () => signatureRef.value?.download('signature.png');
</script>
```

### Composable

```vue
<script setup lang="ts">
import { useSignature } from '@ldesign/signature-vue';

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
</script>

<template>
  <canvas ref="canvasRef" />
</template>
```

## License

MIT

