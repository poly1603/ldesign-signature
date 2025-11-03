/**
 * @ldesign/signature-react - React adapter
 */

export { SignaturePad } from './components/SignaturePad';
export type { SignaturePadRef, SignaturePadProps } from './components/SignaturePad';
export { useSignature } from './hooks/useSignature';

// Re-export core types
export type * from '@ldesign/signature-core';
