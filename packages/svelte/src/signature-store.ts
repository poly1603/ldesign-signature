import { writable, derived } from 'svelte/store'
import type { Readable } from 'svelte/store'
import type { SignatureConfig, SignatureData, SignatureInstance, ExportFormat } from '@ldesign/signature-core'
import { createSignaturePad } from '@ldesign/signature-core'

export interface SignatureStore {
  // Readable state
  isEmpty: Readable<boolean>
  canUndo: Readable<boolean>
  canRedo: Readable<boolean>
  
  // Actions
  init: (canvas: HTMLCanvasElement, config?: SignatureConfig) => void
  clear: () => void
  undo: () => void
  redo: () => void
  toDataURL: (format?: 'png' | 'jpeg', quality?: number) => string
  toSVG: () => string
  toJSON: () => SignatureData | null
  fromJSON: (data: SignatureData) => void
  download: (fileName?: string, format?: ExportFormat, quality?: number) => void
  getCanvas: () => HTMLCanvasElement | null
  destroy: () => void
}

export function createSignatureStore(config?: SignatureConfig): SignatureStore {
  let instance: SignatureInstance | null = null
  
  // Internal state
  const state = writable({
    isEmpty: true,
    canUndo: false,
    canRedo: false,
  })
  
  const updateState = () => {
    if (instance) {
      state.set({
        isEmpty: instance.isEmpty(),
        canUndo: instance.canUndo(),
        canRedo: instance.canRedo(),
      })
    }
  }
  
  // Derived readable stores
  const isEmpty = derived(state, $state => $state.isEmpty)
  const canUndo = derived(state, $state => $state.canUndo)
  const canRedo = derived(state, $state => $state.canRedo)
  
  return {
    isEmpty,
    canUndo,
    canRedo,
    
    init: (canvas: HTMLCanvasElement, userConfig?: SignatureConfig) => {
      if (instance) {
        instance.destroy()
      }
      
      const finalConfig = { ...config, ...userConfig }
      
      instance = createSignaturePad(canvas, {
        ...finalConfig,
        onBegin: (e) => {
          finalConfig.onBegin?.(e)
          updateState()
        },
        onChange: (e) => {
          finalConfig.onChange?.(e)
          updateState()
        },
        onEnd: (e) => {
          finalConfig.onEnd?.(e)
          updateState()
        },
      })
      
      updateState()
    },
    
    clear: () => {
      instance?.clear()
      updateState()
    },
    
    undo: () => {
      instance?.undo()
      updateState()
    },
    
    redo: () => {
      instance?.redo()
      updateState()
    },
    
    toDataURL: (format = 'png', quality?: number) => {
      return instance?.toDataURL(format, quality) ?? ''
    },
    
    toSVG: () => {
      return instance?.toSVG() ?? ''
    },
    
    toJSON: () => {
      return instance?.toJSON() ?? null
    },
    
    fromJSON: (data: SignatureData) => {
      instance?.fromJSON(data)
      updateState()
    },
    
    download: (fileName = 'signature', format: ExportFormat = 'png', quality?: number) => {
      instance?.download(fileName, format, quality)
    },
    
    getCanvas: () => {
      return instance?.getCanvas() ?? null
    },
    
    destroy: () => {
      if (instance) {
        instance.destroy()
        instance = null
      }
      state.set({
        isEmpty: true,
        canUndo: false,
        canRedo: false,
      })
    },
  }
}
