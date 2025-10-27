/**
 * @ldesign/signature-vue - Vue 3 adapter
 */

export { default as SignaturePad } from './components/SignaturePad.vue';
export { useSignature } from './composables/useSignature';

// Re-export core types
export type * from '@ldesign/signature-core';
