/**
 * Vue composable for signature pad
 */

import { ref, watch, onMounted, onUnmounted, Ref } from 'vue';
import { SignatureConfig, SignatureInstance, SignatureData, ExportFormat, createSignaturePad } from '@ldesign/signature-core';

/**
 * Use Signature composable
 */
export function useSignature(config: Ref<SignatureConfig> | SignatureConfig = {}) {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const instance = ref<SignatureInstance | null>(null);
  const isEmpty = ref(true);
  const canUndo = ref(false);
  const canRedo = ref(false);

  /**
   * Initialize signature pad
   */
  const initialize = () => {
    if (!canvasRef.value) return;

    // Destroy previous instance
    if (instance.value) {
      instance.value.destroy();
    }

    // Get config value
    const configValue = 'value' in config ? config.value : config;

    // Create new instance
    instance.value = createSignaturePad(canvasRef.value, configValue);

    // Update reactive state
    updateState();
  };

  /**
   * Update reactive state
   */
  const updateState = () => {
    if (!instance.value) return;

    isEmpty.value = instance.value.isEmpty();
    canUndo.value = instance.value.canUndo();
    canRedo.value = instance.value.canRedo();
  };

  /**
   * Clear signature
   */
  const clear = () => {
    if (instance.value) {
      instance.value.clear();
      updateState();
    }
  };

  /**
   * Undo last stroke
   */
  const undo = () => {
    if (instance.value) {
      instance.value.undo();
      updateState();
    }
  };

  /**
   * Redo last undone stroke
   */
  const redo = () => {
    if (instance.value) {
      instance.value.redo();
      updateState();
    }
  };

  /**
   * Export as data URL
   */
  const toDataURL = (format?: 'png' | 'jpeg', quality?: number): string => {
    if (!instance.value) return '';
    return instance.value.toDataURL(format, quality);
  };

  /**
   * Export as SVG
   */
  const toSVG = (): string => {
    if (!instance.value) return '';
    return instance.value.toSVG();
  };

  /**
   * Export as JSON
   */
  const toJSON = (): SignatureData | null => {
    if (!instance.value) return null;
    return instance.value.toJSON();
  };

  /**
   * Import from JSON
   */
  const fromJSON = (data: SignatureData) => {
    if (instance.value) {
      instance.value.fromJSON(data);
      updateState();
    }
  };

  /**
   * Download signature
   */
  const download = (fileName?: string, format?: ExportFormat, quality?: number) => {
    if (instance.value) {
      instance.value.download(fileName, format, quality);
    }
  };

  /**
   * Update configuration
   */
  const updateConfig = (newConfig: Partial<SignatureConfig>) => {
    if (instance.value) {
      instance.value.updateConfig(newConfig);
    }
  };

  /**
   * Enable/disable signature pad
   */
  const setEnabled = (enabled: boolean) => {
    if (instance.value) {
      instance.value.setEnabled(enabled);
    }
  };

  // Watch config changes (if config is reactive)
  if ('value' in config) {
    watch(config, (newConfig) => {
      if (instance.value) {
        instance.value.updateConfig(newConfig);
      }
    }, { deep: true });
  }

  // Initialize on mount
  onMounted(() => {
    if (canvasRef.value) {
      initialize();
    }
  });

  // Cleanup on unmount
  onUnmounted(() => {
    if (instance.value) {
      instance.value.destroy();
      instance.value = null;
    }
  });

  return {
    canvasRef,
    instance,
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

