<template>
  <div class="app">
    <div class="container">
      <h1>🖊️ Signature Vue Demo</h1>
      <p class="subtitle">Vue 3 Component with Composables</p>

      <div class="demo-section">
        <h2>Component Usage</h2>
        <div class="signature-wrapper">
          <SignaturePad
            ref="signatureRef"
            :width="800"
            :height="400"
            :pen-color="config.penColor"
            :min-width="config.minWidth"
            :max-width="config.maxWidth"
            :pressure-sensitive="config.pressureSensitive"
            :smooth-algorithm="config.smoothAlgorithm"
            @begin="onBegin"
            @change="onChange"
            @end="onEnd"
          />
        </div>

        <div class="controls">
          <button @click="undo" :disabled="!canUndo">↶ Undo</button>
          <button @click="redo" :disabled="!canRedo">↷ Redo</button>
          <button @click="clear" :disabled="isEmpty" class="danger">🗑️ Clear</button>
          <button @click="downloadPng" :disabled="isEmpty" class="secondary">📥 PNG</button>
          <button @click="downloadSvg" :disabled="isEmpty" class="secondary">📥 SVG</button>
          <button @click="downloadJson" :disabled="isEmpty" class="secondary">📥 JSON</button>
        </div>

        <div class="config-panel">
          <h3>⚙️ Settings</h3>
          
          <div class="config-item">
            <label>Pen Color</label>
            <input v-model="config.penColor" type="color">
          </div>

          <div class="config-item">
            <label>Min Width: {{ config.minWidth.toFixed(1) }}</label>
            <input v-model.number="config.minWidth" type="range" min="0.1" max="5" step="0.1">
          </div>

          <div class="config-item">
            <label>Max Width: {{ config.maxWidth.toFixed(1) }}</label>
            <input v-model.number="config.maxWidth" type="range" min="0.5" max="10" step="0.1">
          </div>

          <div class="config-item">
            <label>Smooth Algorithm</label>
            <select v-model="config.smoothAlgorithm">
              <option value="catmull-rom">Catmull-Rom (Best)</option>
              <option value="bezier-cubic">Cubic Bezier</option>
              <option value="bezier-quadratic">Quadratic Bezier</option>
              <option value="none">None</option>
            </select>
          </div>

          <div class="config-item">
            <label>
              <input v-model="config.pressureSensitive" type="checkbox">
              Pressure Sensitive
            </label>
          </div>
        </div>
      </div>

      <div class="info">
        <strong>💡 Vue 3 Features:</strong>
        <ul>
          <li>Reactive component with props</li>
          <li>Template refs for instance methods</li>
          <li>Event emitters for drawing lifecycle</li>
          <li>useSignature composable for advanced usage</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, ComponentPublicInstance } from 'vue';
import { SignaturePad } from '../src/index';
import type { SmoothAlgorithm } from '@ldesign/signature-core';

const signatureRef = ref<ComponentPublicInstance>();

const config = reactive({
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
  pressureSensitive: true,
  smoothAlgorithm: 'catmull-rom' as SmoothAlgorithm,
});

const isEmpty = ref(true);
const canUndo = ref(false);
const canRedo = ref(false);

const undo = () => {
  (signatureRef.value as any)?.undo();
  updateState();
};

const redo = () => {
  (signatureRef.value as any)?.redo();
  updateState();
};

const clear = () => {
  if (confirm('Clear signature?')) {
    (signatureRef.value as any)?.clear();
    updateState();
  }
};

const downloadPng = () => {
  (signatureRef.value as any)?.download('signature.png', 'png');
};

const downloadSvg = () => {
  (signatureRef.value as any)?.download('signature.svg', 'svg');
};

const downloadJson = () => {
  (signatureRef.value as any)?.download('signature.json', 'json');
};

const updateState = () => {
  const instance = signatureRef.value as any;
  if (instance) {
    isEmpty.value = instance.isEmpty();
    canUndo.value = instance.canUndo();
    canRedo.value = instance.canRedo();
  }
};

const onBegin = () => {
  console.log('Drawing started');
};

const onChange = () => {
  updateState();
};

const onEnd = () => {
  console.log('Drawing ended');
  updateState();
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 32px;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

h2 {
  color: #444;
  font-size: 24px;
  margin-bottom: 20px;
}

.demo-section {
  margin-bottom: 30px;
}

.signature-wrapper {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  background: #f9f9f9;
}

.controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #667eea;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

button:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

button.secondary {
  background: #48bb78;
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

button.secondary:hover:not(:disabled) {
  background: #38a169;
}

button.danger {
  background: #f56565;
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
}

button.danger:hover:not(:disabled) {
  background: #e53e3e;
}

.config-panel {
  background: #f7fafc;
  border-radius: 12px;
  padding: 20px;
}

.config-panel h3 {
  margin-bottom: 15px;
  color: #2d3748;
}

.config-item {
  margin-bottom: 15px;
}

.config-item:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #4a5568;
  font-size: 14px;
  font-weight: 600;
}

input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="color"] {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

select {
  width: 100%;
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.info {
  background: #edf2f7;
  padding: 15px;
  border-radius: 8px;
  font-size: 14px;
  color: #4a5568;
}

.info ul {
  margin-left: 20px;
  margin-top: 5px;
}
</style>

