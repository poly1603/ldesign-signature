import type { Accessor } from 'solid-js'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import type { ExportFormat, SignatureConfig, SignatureData, SignatureInstance } from '@ldesign/signature-core'
import { createSignaturePad } from '@ldesign/signature-core'

export interface CreateSignatureOptions extends SignatureConfig {
  canvas?: HTMLCanvasElement
}

export interface SignatureActions {
  clear: () => void
  undo: () => void
  redo: () => void
  toDataURL: (format?: 'png' | 'jpeg', quality?: number) => string
  toSVG: () => string
  toJSON: () => SignatureData | null
  fromJSON: (data: SignatureData) => void
  download: (fileName?: string, format?: ExportFormat, quality?: number) => void
  getCanvas: () => HTMLCanvasElement | null
  getInstance: () => SignatureInstance | null
}

export interface SignatureState {
  isEmpty: Accessor<boolean>
  canUndo: Accessor<boolean>
  canRedo: Accessor<boolean>
}

export function createSignature(
  canvasOrGetter: HTMLCanvasElement | (() => HTMLCanvasElement | undefined),
  options: CreateSignatureOptions = {},
): [SignatureState, SignatureActions] {
  let instance: SignatureInstance | null = null

  const [isEmpty, setIsEmpty] = createSignal(true)
  const [canUndo, setCanUndo] = createSignal(false)
  const [canRedo, setCanRedo] = createSignal(false)

  const updateState = () => {
    if (instance) {
      setIsEmpty(instance.isEmpty())
      setCanUndo(instance.canUndo())
      setCanRedo(instance.canRedo())
    }
  }

  const initialize = (canvas: HTMLCanvasElement) => {
    if (instance) {
      instance.destroy()
    }

    instance = createSignaturePad(canvas, {
      ...options,
      onBegin: (e) => {
        options.onBegin?.(e)
        updateState()
      },
      onChange: (e) => {
        options.onChange?.(e)
        updateState()
      },
      onEnd: (e) => {
        options.onEnd?.(e)
        updateState()
      },
    })

    updateState()
  }

  // Handle canvas initialization
  if (typeof canvasOrGetter === 'function') {
    createEffect(() => {
      const canvas = canvasOrGetter()
      if (canvas) {
        initialize(canvas)
      }
    })
  }
  else {
    onMount(() => {
      if (canvasOrGetter) {
        initialize(canvasOrGetter)
      }
    })
  }

  onCleanup(() => {
    if (instance) {
      instance.destroy()
      instance = null
    }
  })

  const state: SignatureState = {
    isEmpty,
    canUndo,
    canRedo,
  }

  const actions: SignatureActions = {
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
    getInstance: () => {
      return instance
    },
  }

  return [state, actions]
}
