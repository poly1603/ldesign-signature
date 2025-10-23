<template>
  <div class="signature-pad-container" :class="{ 'signature-pad-disabled': !enabled }">
    <canvas ref="canvasRef" class="signature-pad-canvas" :width="width" :height="height" :style="canvasStyle"></canvas>

    <div v-if="showControls" class="signature-pad-controls">
      <button v-if="showClearButton" class="signature-pad-btn signature-pad-btn-clear" :disabled="isEmpty"
        @click="handleClear">
        {{ clearButtonText }}
      </button>

      <button v-if="showUndoButton" class="signature-pad-btn signature-pad-btn-undo" :disabled="!canUndo"
        @click="handleUndo">
        {{ undoButtonText }}
      </button>

      <button v-if="showRedoButton" class="signature-pad-btn signature-pad-btn-redo" :disabled="!canRedo"
        @click="handleRedo">
        {{ redoButtonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { SignatureConfig } from '../../../types';
import { useSignature } from '../composables/useSignature';

// Props
interface Props {
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
  config?: Partial<SignatureConfig>;
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 200,
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
  enabled: true,
  showControls: true,
  showClearButton: true,
  showUndoButton: true,
  showRedoButton: true,
  clearButtonText: '清空',
  undoButtonText: '撤销',
  redoButtonText: '重做',
});

// Emits
const emit = defineEmits<{
  begin: [event: PointerEvent];
  change: [event: PointerEvent];
  end: [event: PointerEvent];
  clear: [];
  undo: [];
  redo: [];
}>();

// Create config from props
const signatureConfig = computed<SignatureConfig>(() => ({
  width: props.width,
  height: props.height,
  penColor: props.penColor,
  minWidth: props.minWidth,
  maxWidth: props.maxWidth,
  ...props.config,
  onBegin: (e: PointerEvent) => emit('begin', e),
  onChange: (e: PointerEvent) => emit('change', e),
  onEnd: (e: PointerEvent) => emit('end', e),
}));

// Use signature composable
const {
  canvasRef,
  instance,
  isEmpty,
  canUndo,
  canRedo,
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

// Canvas style
const canvasStyle = computed(() => ({
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: props.enabled ? 'crosshair' : 'not-allowed',
}));

// Handle actions
const handleClear = () => {
  clear();
  emit('clear');
};

const handleUndo = () => {
  undo();
  emit('undo');
};

const handleRedo = () => {
  redo();
  emit('redo');
};

// Watch enabled prop
watch(() => props.enabled, (value) => {
  setEnabled(value);
});

// Expose methods to parent
defineExpose({
  clear,
  undo,
  redo,
  toDataURL,
  toSVG,
  toJSON,
  fromJSON,
  download,
  isEmpty: () => isEmpty.value,
  canUndo: () => canUndo.value,
  canRedo: () => canRedo.value,
  getInstance: () => instance.value,
});
</script>

<style scoped>
.signature-pad-container {
  display: inline-block;
  position: relative;
}

.signature-pad-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.signature-pad-canvas {
  display: block;
  background: #fff;
}

.signature-pad-controls {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.signature-pad-btn {
  padding: 6px 16px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.signature-pad-btn:hover:not(:disabled) {
  border-color: #409eff;
  color: #409eff;
}

.signature-pad-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.signature-pad-btn-clear:hover:not(:disabled) {
  border-color: #f56c6c;
  color: #f56c6c;
}
</style>
