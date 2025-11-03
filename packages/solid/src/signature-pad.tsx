import type { Component } from 'solid-js'
import type { JSX } from 'solid-js'
import type { SignatureConfig } from '@ldesign/signature-core'
import { createSignature } from './create-signature'

export interface SignaturePadProps extends Omit<SignatureConfig, 'container'> {
  width?: number
  height?: number
  showControls?: boolean
  clearText?: string
  undoText?: string
  redoText?: string
  class?: string
  style?: JSX.CSSProperties
  ref?: (el: HTMLCanvasElement) => void
}

export const SignaturePad: Component<SignaturePadProps> = (props) => {
  let canvasRef: HTMLCanvasElement | undefined

  const [state, actions] = createSignature(
    () => canvasRef,
    {
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
      onBegin: props.onBegin,
      onChange: props.onChange,
      onEnd: props.onEnd,
    },
  )

  return (
    <div
      class={`ldesign-signature-container ${props.class || ''}`}
      style={{
        display: 'inline-block',
        position: 'relative',
        ...props.style,
      }}
    >
      <canvas
        ref={(el) => {
          canvasRef = el
          props.ref?.(el)
        }}
        width={props.width || 600}
        height={props.height || 300}
        style={{
          display: 'block',
          border: '1px solid #ccc',
          'border-radius': '4px',
          'touch-action': 'none',
        }}
        aria-label="Signature pad"
        role="img"
      />
      {props.showControls && (
        <div
          style={{
            'margin-top': '8px',
            display: 'flex',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => actions.clear()}
            disabled={state.isEmpty()}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              'border-radius': '4px',
              background: 'white',
              cursor: state.isEmpty() ? 'not-allowed' : 'pointer',
              opacity: state.isEmpty() ? 0.5 : 1,
              'font-size': '14px',
            }}
          >
            {props.clearText || 'Clear'}
          </button>
          <button
            type="button"
            onClick={() => actions.undo()}
            disabled={!state.canUndo()}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              'border-radius': '4px',
              background: 'white',
              cursor: !state.canUndo() ? 'not-allowed' : 'pointer',
              opacity: !state.canUndo() ? 0.5 : 1,
              'font-size': '14px',
            }}
          >
            {props.undoText || 'Undo'}
          </button>
          <button
            type="button"
            onClick={() => actions.redo()}
            disabled={!state.canRedo()}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              'border-radius': '4px',
              background: 'white',
              cursor: !state.canRedo() ? 'not-allowed' : 'pointer',
              opacity: !state.canRedo() ? 0.5 : 1,
              'font-size': '14px',
            }}
          >
            {props.redoText || 'Redo'}
          </button>
        </div>
      )}
    </div>
  )
}
