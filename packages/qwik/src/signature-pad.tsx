import { $, component$, useSignal, useVisibleTask$, type QRL } from '@builder.io/qwik'
import type { SignatureConfig, SignatureInstance } from '@ldesign/signature-core'
import { createSignaturePad } from '@ldesign/signature-core'

export interface SignaturePadProps extends Omit<SignatureConfig, 'container'> {
  width?: number
  height?: number
  showControls?: boolean
  clearText?: string
  undoText?: string
  redoText?: string
  class?: string
  onBegin$?: QRL<(event: PointerEvent) => void>
  onChange$?: QRL<(event: PointerEvent) => void>
  onEnd$?: QRL<(event: PointerEvent) => void>
}

export const SignaturePad = component$<SignaturePadProps>((props) => {
  const canvasRef = useSignal<HTMLCanvasElement>()
  const instanceRef = useSignal<SignatureInstance>()
  const isEmpty = useSignal(true)
  const canUndo = useSignal(false)
  const canRedo = useSignal(false)

  // Initialize signature pad
  useVisibleTask$(({ track, cleanup }) => {
    track(() => canvasRef.value)
    
    const canvas = canvasRef.value
    if (!canvas)
      return

    const instance = createSignaturePad(canvas, {
      width: props.width,
      height: props.height,
      penColor: props.penColor,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      velocityFilterWeight: props.velocityFilterWeight,
      smoothAlgorithm: props.smoothAlgorithm,
      smoothTension: props.smoothTension,
      throttle: props.throttle,
      minPointDistance: props.minPointDistance,
      pressureSensitive: props.pressureSensitive,
      dotSize: props.dotSize,
      maxHistorySize: props.maxHistorySize,
      background: props.background,
      watermark: props.watermark,
      onBegin: (e) => {
        isEmpty.value = instance.isEmpty()
        canUndo.value = instance.canUndo()
        canRedo.value = instance.canRedo()
        props.onBegin$?.(e)
      },
      onChange: (e) => {
        isEmpty.value = instance.isEmpty()
        canUndo.value = instance.canUndo()
        canRedo.value = instance.canRedo()
        props.onChange$?.(e)
      },
      onEnd: (e) => {
        isEmpty.value = instance.isEmpty()
        canUndo.value = instance.canUndo()
        canRedo.value = instance.canRedo()
        props.onEnd$?.(e)
      },
    })

    instanceRef.value = instance

    cleanup(() => {
      instance.destroy()
    })
  })

  const handleClear = $(() => {
    const instance = instanceRef.value
    if (instance) {
      instance.clear()
      isEmpty.value = instance.isEmpty()
      canUndo.value = instance.canUndo()
      canRedo.value = instance.canRedo()
    }
  })

  const handleUndo = $(() => {
    const instance = instanceRef.value
    if (instance) {
      instance.undo()
      isEmpty.value = instance.isEmpty()
      canUndo.value = instance.canUndo()
      canRedo.value = instance.canRedo()
    }
  })

  const handleRedo = $(() => {
    const instance = instanceRef.value
    if (instance) {
      instance.redo()
      isEmpty.value = instance.isEmpty()
      canUndo.value = instance.canUndo()
      canRedo.value = instance.canRedo()
    }
  })

  return (
    <div
      class={['ldesign-signature-container', props.class].filter(Boolean).join(' ')}
      style={{
        display: 'inline-block',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        width={props.width || 600}
        height={props.height || 300}
        style={{
          display: 'block',
          border: '1px solid #ccc',
          borderRadius: '4px',
          touchAction: 'none',
        }}
        aria-label="Signature pad"
        role="img"
      />
      {props.showControls && (
        <div
          style={{
            marginTop: '8px',
            display: 'flex',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick$={handleClear}
            disabled={isEmpty.value}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: isEmpty.value ? 'not-allowed' : 'pointer',
              opacity: isEmpty.value ? 0.5 : 1,
              fontSize: '14px',
            }}
          >
            {props.clearText || 'Clear'}
          </button>
          <button
            type="button"
            onClick$={handleUndo}
            disabled={!canUndo.value}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: !canUndo.value ? 'not-allowed' : 'pointer',
              opacity: !canUndo.value ? 0.5 : 1,
              fontSize: '14px',
            }}
          >
            {props.undoText || 'Undo'}
          </button>
          <button
            type="button"
            onClick$={handleRedo}
            disabled={!canRedo.value}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: !canRedo.value ? 'not-allowed' : 'pointer',
              opacity: !canRedo.value ? 0.5 : 1,
              fontSize: '14px',
            }}
          >
            {props.redoText || 'Redo'}
          </button>
        </div>
      )}
    </div>
  )
})
