<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <PenTool class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900">Signature Pad</h1>
              <p class="text-sm text-slate-500">@ldesign/signature</p>
            </div>
          </div>
          <a href="https://github.com/nicepkg/ldesign" target="_blank" class="text-slate-500 hover:text-slate-700">
            <Github class="w-6 h-6" />
          </a>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="max-w-6xl mx-auto px-4 py-8">
      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all',
            activeTab === tab.id 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Demo Card - 两个演示共用相同的布局 -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-slate-900">
              {{ activeTab === 'vue' ? 'Vue 组件' : '原生 JavaScript' }}
            </h2>
            <p class="text-sm text-slate-500">
              {{ activeTab === 'vue' ? '@ldesign/signature-vue' : '@ldesign/signature-core' }}
            </p>
          </div>
        </div>

        <div class="p-6">
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Canvas Area -->
            <div class="flex-1">
              <!-- Vue Demo -->
              <div v-show="activeTab === 'vue'" class="space-y-3">
                <div class="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <SignaturePad
                    ref="vueSignaturePad"
                    :width="canvasWidth"
                    :height="200"
                    :config="vueConfig"
                    @end="onStrokeEnd"
                  />
                </div>
                <!-- Toolbar -->
                <div class="flex items-center gap-2 flex-wrap">
                  <button class="btn" :disabled="!vueCanUndo" @click="vueUndo" title="撤销">
                    <Undo2 class="w-4 h-4" />
                  </button>
                  <button class="btn" :disabled="!vueCanRedo" @click="vueRedo" title="重做">
                    <Redo2 class="w-4 h-4" />
                  </button>
                  <div class="w-px h-6 bg-slate-200" />
                  <button class="btn btn-danger" :disabled="vueIsEmpty" @click="vueClear" title="清空">
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <div class="w-px h-6 bg-slate-200" />
                  <button class="btn" :disabled="vueIsEmpty" @click="vueDownload('png')" title="下载 PNG">
                    <Download class="w-4 h-4" />
                  </button>
                  <button class="btn" :disabled="vueIsEmpty" @click="vueDownload('svg')" title="下载 SVG">
                    <FileImage class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Native Demo -->
              <div v-show="activeTab === 'native'" class="space-y-3">
                <div class="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <canvas ref="nativeCanvas" />
                </div>
                <!-- Toolbar -->
                <div class="flex items-center gap-2 flex-wrap">
                  <button class="btn" :disabled="!nativeCanUndo" @click="nativeUndo" title="撤销">
                    <Undo2 class="w-4 h-4" />
                  </button>
                  <button class="btn" :disabled="!nativeCanRedo" @click="nativeRedo" title="重做">
                    <Redo2 class="w-4 h-4" />
                  </button>
                  <div class="w-px h-6 bg-slate-200" />
                  <button class="btn btn-danger" :disabled="nativeIsEmpty" @click="nativeClear" title="清空">
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <div class="w-px h-6 bg-slate-200" />
                  <button class="btn" :disabled="nativeIsEmpty" @click="nativeDownload('png')" title="下载 PNG">
                    <Download class="w-4 h-4" />
                  </button>
                  <button class="btn" :disabled="nativeIsEmpty" @click="nativeDownload('svg')" title="下载 SVG">
                    <FileImage class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Config Panel - 两个演示共用相同的配置面板 -->
            <div class="w-full lg:w-64 space-y-5">
              <!-- Brush Style -->
              <div>
                <label class="text-sm font-medium text-slate-700 mb-2 block">笔刷样式</label>
                <div class="grid grid-cols-3 gap-2">
                  <button 
                    v-for="brush in brushStyles" 
                    :key="brush.value"
                    :class="[
                      'px-2 py-1.5 text-xs rounded-lg border transition-all',
                      currentBrushStyle === brush.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-slate-200 hover:border-slate-300'
                    ]"
                    @click="setBrushStyle(brush.value)"
                  >
                    {{ brush.label }}
                  </button>
                </div>
              </div>

              <!-- Pen Color -->
              <div>
                <label class="text-sm font-medium text-slate-700 mb-2 block">笔画颜色</label>
                <div class="flex gap-2 flex-wrap">
                  <button 
                    v-for="color in penColors" 
                    :key="color"
                    :class="[
                      'w-8 h-8 rounded-lg border-2 transition-all',
                      currentPenColor === color ? 'border-blue-500 scale-110' : 'border-slate-200'
                    ]"
                    :style="{ backgroundColor: color }"
                    @click="setPenColor(color)"
                  />
                  <input type="color" v-model="currentPenColor" @change="setPenColor(currentPenColor)" class="w-8 h-8 rounded cursor-pointer" />
                </div>
              </div>

              <!-- Stroke Width -->
              <div>
                <label class="text-sm font-medium text-slate-700 mb-2 block">
                  笔画粗细: {{ currentMaxWidth.toFixed(1) }}
                </label>
                <input 
                  type="range" 
                  v-model.number="currentMaxWidth"
                  :min="1"
                  :max="10"
                  :step="0.5"
                  class="w-full"
                  @change="setStrokeWidth"
                />
              </div>

              <!-- Info -->
              <div class="bg-slate-50 rounded-lg p-3">
                <h4 class="text-sm font-medium text-slate-700 mb-2">功能说明</h4>
                <ul class="text-xs text-slate-500 space-y-1">
                  <li>• 支持鼠标、触摸、手写笔</li>
                  <li>• 压力感应（需设备支持）</li>
                  <li>• 多种笔刷效果</li>
                  <li>• 撤销/重做</li>
                  <li>• PNG/SVG 导出</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Code Example -->
        <div class="border-t border-slate-100">
          <button 
            class="w-full p-4 text-left flex items-center justify-between text-sm font-medium text-slate-600 hover:bg-slate-50"
            @click="showCode = !showCode"
          >
            <span class="flex items-center gap-2">
              <Code class="w-4 h-4" />
              查看代码示例
            </span>
            <ChevronDown :class="['w-4 h-4 transition-transform', showCode && 'rotate-180']" />
          </button>
          <div v-show="showCode" class="p-4 pt-0">
            <pre class="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm"><code>{{ activeTab === 'vue' ? vueCode : nativeCode }}</code></pre>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import { SignaturePad } from '@ldesign/signature-vue';
import { createSignaturePad, type SignatureInstance, type BrushStyleType } from '@ldesign/signature-core';
import { 
  PenTool, Github, Undo2, Redo2, Trash2, Download, FileImage, Code, ChevronDown
} from 'lucide-vue-next';

// Tabs
const tabs = [
  { id: 'vue', label: 'Vue 组件' },
  { id: 'native', label: '原生 JS' },
];
const activeTab = ref('vue');
const showCode = ref(false);

// Canvas size
const canvasWidth = ref(560);

// Shared config
const penColors = ['#000000', '#1e40af', '#dc2626', '#16a34a', '#7c3aed'];
const brushStyles: { value: BrushStyleType; label: string }[] = [
  { value: 'default', label: '默认' },
  { value: 'pen', label: '钢笔' },
  { value: 'brush', label: '毛笔' },
  { value: 'pencil', label: '铅笔' },
  { value: 'marker', label: '马克笔' },
  { value: 'neon', label: '霓虹' },
];

// Current settings (shared between both demos)
const currentPenColor = ref('#000000');
const currentMaxWidth = ref(3);
const currentBrushStyle = ref<BrushStyleType>('default');

// ==================== Vue Demo ====================
const vueSignaturePad = ref<InstanceType<typeof SignaturePad> | null>(null);
const vueIsEmpty = ref(true);
const vueCanUndo = ref(false);
const vueCanRedo = ref(false);

const vueConfig = computed(() => ({
  penColor: currentPenColor.value,
  minWidth: 0.5,
  maxWidth: currentMaxWidth.value,
  brushStyle: currentBrushStyle.value,
  background: { type: 'color' as const, color: '#ffffff' },
}));

const onStrokeEnd = () => {
  updateVueState();
};

const updateVueState = () => {
  if (!vueSignaturePad.value) return;
  vueIsEmpty.value = vueSignaturePad.value.isEmpty.value;
  vueCanUndo.value = vueSignaturePad.value.canUndo.value;
  vueCanRedo.value = vueSignaturePad.value.canRedo.value;
};

const vueUndo = () => {
  vueSignaturePad.value?.undo();
  updateVueState();
};

const vueRedo = () => {
  vueSignaturePad.value?.redo();
  updateVueState();
};

const vueClear = () => {
  vueSignaturePad.value?.clear();
  updateVueState();
};

const vueDownload = (format: 'png' | 'svg') => {
  vueSignaturePad.value?.download(`signature-vue`, format);
};

// ==================== Native Demo ====================
const nativeCanvas = ref<HTMLCanvasElement | null>(null);
const nativeInstance = shallowRef<SignatureInstance | null>(null);
const nativeIsEmpty = ref(true);
const nativeCanUndo = ref(false);
const nativeCanRedo = ref(false);

const initNative = () => {
  if (!nativeCanvas.value) return;
  
  nativeInstance.value = createSignaturePad(nativeCanvas.value, {
    width: canvasWidth.value,
    height: 200,
    penColor: currentPenColor.value,
    minWidth: 0.5,
    maxWidth: currentMaxWidth.value,
    brushStyle: currentBrushStyle.value,
    background: { type: 'color', color: '#ffffff' },
    onEnd: () => updateNativeState(),
  });
  updateNativeState();
};

const updateNativeState = () => {
  if (!nativeInstance.value) return;
  nativeIsEmpty.value = nativeInstance.value.isEmpty();
  nativeCanUndo.value = nativeInstance.value.canUndo();
  nativeCanRedo.value = nativeInstance.value.canRedo();
};

const nativeUndo = () => {
  nativeInstance.value?.undo();
  updateNativeState();
};

const nativeRedo = () => {
  nativeInstance.value?.redo();
  updateNativeState();
};

const nativeClear = () => {
  nativeInstance.value?.clear();
  updateNativeState();
};

const nativeDownload = (format: 'png' | 'svg') => {
  nativeInstance.value?.download(`signature-native`, format);
};

// ==================== Shared Actions ====================
const setPenColor = (color: string) => {
  currentPenColor.value = color;
  vueSignaturePad.value?.updateConfig({ penColor: color });
  nativeInstance.value?.updateConfig({ penColor: color });
};

const setStrokeWidth = () => {
  vueSignaturePad.value?.updateConfig({ maxWidth: currentMaxWidth.value });
  nativeInstance.value?.updateConfig({ maxWidth: currentMaxWidth.value });
};

const setBrushStyle = (style: BrushStyleType) => {
  currentBrushStyle.value = style;
  vueSignaturePad.value?.updateConfig({ brushStyle: style });
  nativeInstance.value?.updateConfig({ brushStyle: style });
};

// Code examples
const vueCode = `<template>
  <SignaturePad
    ref="signaturePad"
    :width="600"
    :height="200"
    :config="{
      penColor: '#000000',
      brushStyle: 'brush', // 毛笔效果
      maxWidth: 3,
    }"
    @end="onEnd"
  />
</template>

<script setup>
import { ref } from 'vue';
import { SignaturePad } from '@ldesign/signature-vue';

const signaturePad = ref(null);

// 清空
signaturePad.value.clear();

// 撤销/重做
signaturePad.value.undo();
signaturePad.value.redo();

// 下载
signaturePad.value.download('signature', 'png');

// 获取 DataURL
const dataUrl = signaturePad.value.toDataURL('png');
<\/script>`;

const nativeCode = `import { createSignaturePad } from '@ldesign/signature-core';

const canvas = document.getElementById('canvas');
const pad = createSignaturePad(canvas, {
  width: 600,
  height: 200,
  penColor: '#000000',
  brushStyle: 'brush', // 毛笔效果
  maxWidth: 3,
  background: { type: 'color', color: '#ffffff' },
});

// 清空
pad.clear();

// 撤销/重做
pad.undo();
pad.redo();

// 下载
pad.download('signature', 'png');

// 获取 DataURL
const dataUrl = pad.toDataURL('png');

// 销毁
pad.destroy();`;

// Lifecycle
onMounted(() => {
  initNative();
});

onUnmounted(() => {
  nativeInstance.value?.destroy();
});
</script>

<style>
.btn {
  @apply p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 
         disabled:opacity-40 disabled:cursor-not-allowed transition-colors;
}
.btn-danger:hover:not(:disabled) {
  @apply border-red-200 bg-red-50 text-red-600;
}
</style>
