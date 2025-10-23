/**
 * React Signature Pad component
 */

import React, { useEffect, useImperativeHandle, forwardRef, CSSProperties } from 'react';
import { SignatureConfig, SignatureData, ExportFormat } from '../../../types';
import { useSignature } from '../hooks/useSignature';

export interface SignaturePadProps {
  width?: number;
  height?: number;
  penColor?: string;
  minWidth?: number;
  maxWidth?: number;
  enabled?: boolean;
  showControls?: boolean;
  showClearButton?: boolean;
  showUndoButton?: boolean;
  showRedoButton?: boolean;
  clearButtonText?: string;
  undoButtonText?: string;
  redoButtonText?: string;
  className?: string;
  style?: CSSProperties;
  canvasStyle?: CSSProperties;
  config?: Partial<SignatureConfig>;
  onBegin?: (event: PointerEvent) => void;
  onChange?: (event: PointerEvent) => void;
  onEnd?: (event: PointerEvent) => void;
  onClear?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export interface SignaturePadRef {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  toDataURL: (format?: 'png' | 'jpeg', quality?: number) => string;
  toSVG: () => string;
  toJSON: () => SignatureData | null;
  fromJSON: (data: SignatureData) => void;
  download: (fileName?: string, format?: ExportFormat, quality?: number) => void;
  isEmpty: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

/**
 * Signature Pad Component
 */
export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>((props, ref) => {
  const {
    width = 400,
    height = 200,
    penColor = '#000000',
    minWidth = 0.5,
    maxWidth = 2.5,
    enabled = true,
    showControls = true,
    showClearButton = true,
    showUndoButton = true,
    showRedoButton = true,
    clearButtonText = '清空',
    undoButtonText = '撤销',
    redoButtonText = '重做',
    className = '',
    style,
    canvasStyle,
    config,
    onBegin,
    onChange,
    onEnd,
    onClear,
    onUndo,
    onRedo,
  } = props;

  // Create config
  const signatureConfig: SignatureConfig = {
    width,
    height,
    penColor,
    minWidth,
    maxWidth,
    ...config,
    onBegin,
    onChange,
    onEnd,
  };

  // Use signature hook
  const {
    canvasRef,
    isEmpty: isEmptyState,
    canUndo: canUndoState,
    canRedo: canRedoState,
    clear,
    undo,
    redo,
    toDataURL,
    toSVG,
    toJSON,
    fromJSON,
    download,
    setEnabled,
  } = useSignature(signatureConfig);

  // Handle actions
  const handleClear = () => {
    clear();
    onClear?.();
  };

  const handleUndo = () => {
    undo();
    onUndo?.();
  };

  const handleRedo = () => {
    redo();
    onRedo?.();
  };

  // Watch enabled prop
  useEffect(() => {
    setEnabled(enabled);
  }, [enabled, setEnabled]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    clear,
    undo,
    redo,
    toDataURL,
    toSVG,
    toJSON,
    fromJSON,
    download,
    isEmpty: () => isEmptyState,
    canUndo: () => canUndoState,
    canRedo: () => canRedoState,
  }));

  const containerClass = `signature-pad-container ${!enabled ? 'signature-pad-disabled' : ''} ${className}`;

  const defaultCanvasStyle: CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: enabled ? 'crosshair' : 'not-allowed',
    background: '#fff',
    display: 'block',
    ...canvasStyle,
  };

  return (
    <div className={containerClass} style={style}>
      <canvas
        ref={canvasRef}
        className="signature-pad-canvas"
        width={width}
        height={height}
        style={defaultCanvasStyle}
      />

      {showControls && (
        <div className="signature-pad-controls" style={controlsStyle}>
          {showClearButton && (
            <button
              className="signature-pad-btn signature-pad-btn-clear"
              disabled={isEmptyState}
              onClick={handleClear}
              style={buttonStyle}
            >
              {clearButtonText}
            </button>
          )}

          {showUndoButton && (
            <button
              className="signature-pad-btn signature-pad-btn-undo"
              disabled={!canUndoState}
              onClick={handleUndo}
              style={buttonStyle}
            >
              {undoButtonText}
            </button>
          )}

          {showRedoButton && (
            <button
              className="signature-pad-btn signature-pad-btn-redo"
              disabled={!canRedoState}
              onClick={handleRedo}
              style={buttonStyle}
            >
              {redoButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
});

SignaturePad.displayName = 'SignaturePad';

// Default styles
const controlsStyle: CSSProperties = {
  marginTop: '8px',
  display: 'flex',
  gap: '8px',
};

const buttonStyle: CSSProperties = {
  padding: '6px 16px',
  fontSize: '14px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  background: '#fff',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

export default SignaturePad;

