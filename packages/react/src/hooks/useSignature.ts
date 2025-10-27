/**
 * React hook for signature pad
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { SignatureConfig, SignatureInstance, SignatureData, ExportFormat } from '../../../types';
import { createSignaturePad } from '../../../core/signature-pad';

/**
 * Use Signature hook
 */
export function useSignature(config: SignatureConfig = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<SignatureInstance | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  /**
   * Update reactive state
   */
  const updateState = useCallback(() => {
    if (!instanceRef.current) return;

    setIsEmpty(instanceRef.current.isEmpty());
    setCanUndo(instanceRef.current.canUndo());
    setCanRedo(instanceRef.current.canRedo());
  }, []);

  /**
   * Initialize signature pad
   */
  const initialize = useCallback(() => {
    if (!canvasRef.current) return;

    // Destroy previous instance
    if (instanceRef.current) {
      instanceRef.current.destroy();
    }

    // Create new instance
    instanceRef.current = createSignaturePad(canvasRef.current, config);

    // Update state
    updateState();
  }, [config, updateState]);

  /**
   * Clear signature
   */
  const clear = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.clear();
      updateState();
    }
  }, [updateState]);

  /**
   * Undo last stroke
   */
  const undo = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.undo();
      updateState();
    }
  }, [updateState]);

  /**
   * Redo last undone stroke
   */
  const redo = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.redo();
      updateState();
    }
  }, [updateState]);

  /**
   * Export as data URL
   */
  const toDataURL = useCallback((format?: 'png' | 'jpeg', quality?: number): string => {
    if (!instanceRef.current) return '';
    return instanceRef.current.toDataURL(format, quality);
  }, []);

  /**
   * Export as SVG
   */
  const toSVG = useCallback((): string => {
    if (!instanceRef.current) return '';
    return instanceRef.current.toSVG();
  }, []);

  /**
   * Export as JSON
   */
  const toJSON = useCallback((): SignatureData | null => {
    if (!instanceRef.current) return null;
    return instanceRef.current.toJSON();
  }, []);

  /**
   * Import from JSON
   */
  const fromJSON = useCallback((data: SignatureData) => {
    if (instanceRef.current) {
      instanceRef.current.fromJSON(data);
      updateState();
    }
  }, [updateState]);

  /**
   * Download signature
   */
  const download = useCallback((fileName?: string, format?: ExportFormat, quality?: number) => {
    if (instanceRef.current) {
      instanceRef.current.download(fileName, format, quality);
    }
  }, []);

  /**
   * Update configuration
   */
  const updateConfig = useCallback((newConfig: Partial<SignatureConfig>) => {
    if (instanceRef.current) {
      instanceRef.current.updateConfig(newConfig);
    }
  }, []);

  /**
   * Enable/disable signature pad
   */
  const setEnabled = useCallback((enabled: boolean) => {
    if (instanceRef.current) {
      instanceRef.current.setEnabled(enabled);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (canvasRef.current && !instanceRef.current) {
      initialize();
    }
  }, [initialize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return {
    canvasRef,
    instance: instanceRef.current,
    isEmpty,
    canUndo,
    canRedo,
    initialize,
    clear,
    undo,
    redo,
    toDataURL,
    toSVG,
    toJSON,
    fromJSON,
    download,
    updateConfig,
    setEnabled,
  };
}

