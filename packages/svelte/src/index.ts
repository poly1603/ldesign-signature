/**
 * @ldesign/signature-svelte - Svelte components for signature pad
 */

export { default as SignaturePad } from './SignaturePad.svelte'
export { createSignatureStore } from './signature-store'
export type { SignatureStore } from './signature-store'

// Re-export types from core
export type * from '@ldesign/signature-core'
