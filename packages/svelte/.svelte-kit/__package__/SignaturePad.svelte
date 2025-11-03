<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { SignatureConfig } from '@ldesign/signature-core'
  import { createSignatureStore } from './signature-store'
  
  export let width: number = 600
  export let height: number = 300
  export let penColor: string = '#000000'
  export let minWidth: number = 0.5
  export let maxWidth: number = 2.5
  export let showControls: boolean = true
  export let clearText: string = 'Clear'
  export let undoText: string = 'Undo'
  export let redoText: string = 'Redo'
  
  // Optional config props
  export let velocityFilterWeight: number | undefined = undefined
  export let smoothAlgorithm: SignatureConfig['smoothAlgorithm'] | undefined = undefined
  export let smoothTension: number | undefined = undefined
  export let throttle: number | undefined = undefined
  export let minPointDistance: number | undefined = undefined
  export let pressureSensitive: boolean | undefined = undefined
  export let dotSize: number | undefined = undefined
  export let maxHistorySize: number | undefined = undefined
  export let background: SignatureConfig['background'] | undefined = undefined
  export let watermark: SignatureConfig['watermark'] | undefined = undefined
  
  // Event handlers
  export let onBegin: ((event: PointerEvent) => void) | undefined = undefined
  export let onChange: ((event: PointerEvent) => void) | undefined = undefined
  export let onEnd: ((event: PointerEvent) => void) | undefined = undefined
  
  let canvas: HTMLCanvasElement
  
  const signature = createSignatureStore({
    width,
    height,
    penColor,
    minWidth,
    maxWidth,
    velocityFilterWeight,
    smoothAlgorithm,
    smoothTension,
    throttle,
    minPointDistance,
    pressureSensitive,
    dotSize,
    maxHistorySize,
    background,
    watermark,
    onBegin,
    onChange,
    onEnd,
  })
  
  onMount(() => {
    if (canvas) {
      signature.init(canvas)
    }
  })
  
  onDestroy(() => {
    signature.destroy()
  })
  
  // Expose methods for parent component access
  export function clear() {
    signature.clear()
  }
  
  export function undo() {
    signature.undo()
  }
  
  export function redo() {
    signature.redo()
  }
  
  export function toDataURL(format?: 'png' | 'jpeg', quality?: number) {
    return signature.toDataURL(format, quality)
  }
  
  export function toSVG() {
    return signature.toSVG()
  }
  
  export function toJSON() {
    return signature.toJSON()
  }
  
  export function fromJSON(data: any) {
    signature.fromJSON(data)
  }
  
  export function download(fileName?: string, format?: any, quality?: number) {
    signature.download(fileName, format, quality)
  }
</script>

<div class="ldesign-signature-container" style="width: {width}px; height: {height}px;">
  <canvas
    bind:this={canvas}
    {width}
    {height}
    aria-label="Signature pad"
    role="img"
  />
  
  {#if showControls}
    <div class="ldesign-signature-controls">
      <button
        type="button"
        on:click={() => signature.clear()}
        disabled={$signature.isEmpty}
      >
        {clearText}
      </button>
      <button
        type="button"
        on:click={() => signature.undo()}
        disabled={!$signature.canUndo}
      >
        {undoText}
      </button>
      <button
        type="button"
        on:click={() => signature.redo()}
        disabled={!$signature.canRedo}
      >
        {redoText}
      </button>
    </div>
  {/if}
</div>

<style>
  .ldesign-signature-container {
    display: inline-block;
    position: relative;
  }
  
  canvas {
    display: block;
    border: 1px solid #ccc;
    border-radius: 4px;
    touch-action: none;
  }
  
  .ldesign-signature-controls {
    margin-top: 8px;
    display: flex;
    gap: 8px;
  }
  
  button {
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 14px;
  }
  
  button:hover:not(:disabled) {
    background: #f5f5f5;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
