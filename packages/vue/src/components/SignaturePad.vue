<template>
  <div class="l-signature-pad" :class="{ 'l-signature-pad--disabled': disabled }">
    <canvas ref="canvasRef" class="l-signature-pad__canvas" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import type { SignatureConfig } from '@ldesign/signature-core';
import { useSignature } from '../composables/useSignature';

// Props - 简化的配置，所有高级配置通过 config prop 传入
interface Props {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Disable the signature pad */
  disabled?: boolean;
  /** Full config object - all core options supported */
  config?: Partial<SignatureConfig>;
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 200,
  disabled: false,
});

// Emits
const emit = defineEmits<{
  begin: [event: PointerEvent];
  change: [event: PointerEvent];
  end: [event: PointerEvent];
}>();

// Create config from props
const signatureConfig = computed<SignatureConfig>(() => ({
  width: props.width,
  height: props.height,
  ...props.config,
  onBegin: (e: PointerEvent) => emit('begin', e),
  onChange: (e: PointerEvent) => emit('change', e),
  onEnd: (e: PointerEvent) => emit('end', e),
}));

// Use signature composable - 所有功能都来自 core
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
  updateConfig,
} = useSignature(signatureConfig);

// Watch disabled prop
watch(() => props.disabled, (value) => {
  setEnabled(!value);
}, { immediate: true });

// Expose all methods to parent - 直接暴露 core 的所有功能
defineExpose({
  // 状态
  isEmpty,
  canUndo,
  canRedo,
  // 操作
  clear,
  undo,
  redo,
  // 导出
  toDataURL,
  toSVG,
  toJSON,
  fromJSON,
  download,
  // 配置
  setEnabled,
  updateConfig,
  // 获取实例 - 用于访问 core 的所有功能
  getInstance: () => instance.value,
});
</script>

<style>
.l-signature-pad {
  display: inline-block;
  position: relative;
}

.l-signature-pad--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.l-signature-pad__canvas {
  display: block;
  touch-action: none;
  user-select: none;
}

</style>
