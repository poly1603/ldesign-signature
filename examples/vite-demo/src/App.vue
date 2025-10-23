<template>
  <div class="container">
    <header>
      <h1 style="font-size: 32px; margin-bottom: 10px">✍️ @ldesign/signature</h1>
      <p style="color: #666; margin-bottom: 30px">功能强大的手写签名组件 - Vite + Vue 3 完整示例</p>
    </header>

    <!-- 选项卡 -->
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.id" :class="['tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id">
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab 1: 基础功能 -->
    <div v-show="activeTab === 'basic'" class="section">
      <h2 class="section-title">📝 基础签名功能</h2>

      <div class="config-panel">
        <div class="config-row">
          <div class="config-item">
            <label>笔触颜色:</label>
            <input v-model="basicConfig.penColor" type="color">
          </div>
          <div class="config-item">
            <label>最小宽度:</label>
            <input v-model.number="basicConfig.minWidth" type="range" min="0.1" max="5" step="0.1">
            <span>{{ basicConfig.minWidth }}</span>
          </div>
          <div class="config-item">
            <label>最大宽度:</label>
            <input v-model.number="basicConfig.maxWidth" type="range" min="0.5" max="10" step="0.1">
            <span>{{ basicConfig.maxWidth }}</span>
          </div>
        </div>
        <div class="config-row">
          <div class="config-item">
            <label>平滑算法:</label>
            <select v-model="basicConfig.smoothAlgorithm">
              <option value="catmull-rom">Catmull-Rom（推荐）</option>
              <option value="bezier-quadratic">二次贝塞尔</option>
              <option value="bezier-cubic">三次贝塞尔</option>
              <option value="none">无平滑</option>
            </select>
          </div>
          <div class="config-item">
            <label>压力感应:</label>
            <input v-model="basicConfig.pressureSensitive" type="checkbox">
          </div>
        </div>
      </div>

      <SignaturePad ref="signatureRef" :width="800" :height="400" :pen-color="basicConfig.penColor"
        :min-width="basicConfig.minWidth" :max-width="basicConfig.maxWidth"
        :smooth-algorithm="basicConfig.smoothAlgorithm" :pressure-sensitive="basicConfig.pressureSensitive"
        :show-controls="true" @begin="onBegin" @change="onChange" @end="onEnd" />

      <div class="status">
        <strong>状态:</strong> {{ status.message }} |
        <strong>笔画数:</strong> {{ status.strokeCount }} |
        <strong>事件:</strong> {{ status.lastEvent }}
      </div>

      <div class="controls" style="margin-top: 15px">
        <button class="primary" @click="exportPNG">📷 导出 PNG</button>
        <button class="primary" @click="exportJPEG">📷 导出 JPEG</button>
        <button class="primary" @click="exportSVG">🎨 导出 SVG</button>
        <button class="primary" @click="exportJSON">📦 导出 JSON</button>
        <button @click="downloadSignature">💾 下载签名</button>
      </div>

      <div v-if="exportedImage" class="preview">
        <h3 style="margin-bottom: 10px">导出预览:</h3>
        <img :src="exportedImage" alt="Exported Signature">
      </div>
    </div>

    <!-- Tab 2: 高级功能 -->
    <div v-show="activeTab === 'advanced'" class="section">
      <h2 class="section-title">🎨 高级功能</h2>
      <p class="section-subtitle">背景、水印、裁剪、缩放、压缩</p>

      <div class="config-panel">
        <h3 style="margin-bottom: 10px">背景设置</h3>
        <div class="config-row">
          <div class="config-item">
            <label>背景类型:</label>
            <select v-model="advancedConfig.backgroundType">
              <option value="transparent">透明</option>
              <option value="color">纯色</option>
              <option value="image">图片</option>
            </select>
          </div>
          <div v-if="advancedConfig.backgroundType === 'color'" class="config-item">
            <label>背景颜色:</label>
            <input v-model="advancedConfig.backgroundColor" type="color">
          </div>
        </div>

        <h3 style="margin: 15px 0 10px">水印设置</h3>
        <div class="config-row">
          <div class="config-item">
            <label>水印文字:</label>
            <input v-model="advancedConfig.watermarkText" type="text" style="width: 200px">
          </div>
          <div class="config-item">
            <label>位置:</label>
            <select v-model="advancedConfig.watermarkPosition">
              <option value="bottom-right">右下</option>
              <option value="bottom-left">左下</option>
              <option value="top-right">右上</option>
              <option value="top-left">左上</option>
              <option value="center">居中</option>
            </select>
          </div>
          <div class="config-item">
            <label>透明度:</label>
            <input v-model.number="advancedConfig.watermarkOpacity" type="range" min="0" max="1" step="0.1">
            <span>{{ advancedConfig.watermarkOpacity }}</span>
          </div>
        </div>
      </div>

      <SignaturePad ref="advancedSignatureRef" :width="800" :height="400" pen-color="#0066ff" :min-width="1"
        :max-width="3" :config="advancedSignatureConfig" :show-controls="true" />

      <div class="controls" style="margin-top: 15px">
        <button @click="applyAdvancedConfig">✨ 应用配置</button>
        <button @click="cropSignature">✂️ 裁剪空白</button>
        <button @click="scaleSignature">📏 缩放 50%</button>
        <button @click="compressSignature">🗜️ 压缩优化</button>
      </div>

      <div v-if="advancedResult" class="preview">
        <h3 style="margin-bottom: 10px">处理结果:</h3>
        <img :src="advancedResult" alt="Processed">
        <p style="margin-top: 10px; color: #666">{{ advancedResultInfo }}</p>
      </div>
    </div>

    <!-- Tab 3: 签名验证 -->
    <div v-show="activeTab === 'validation'" class="section">
      <h2 class="section-title">🔍 签名验证与分析</h2>
      <p class="section-subtitle">特征提取、相似度对比、签名验证</p>

      <div class="grid">
        <div>
          <h3 style="margin-bottom: 10px">签名 1</h3>
          <SignaturePad ref="validationSignature1Ref" :width="380" :height="200" pen-color="#409eff"
            :show-controls="true" />
        </div>
        <div>
          <h3 style="margin-bottom: 10px">签名 2</h3>
          <SignaturePad ref="validationSignature2Ref" :width="380" :height="200" pen-color="#67c23a"
            :show-controls="true" />
        </div>
      </div>

      <div class="controls" style="margin-top: 15px">
        <button class="primary" @click="extractFeatures">📊 提取特征</button>
        <button class="primary" @click="compareSignatures">🔄 对比签名</button>
        <button @click="validateSignature">✅ 验证签名</button>
        <button @click="calculateComplexity">📈 复杂度评分</button>
      </div>

      <div v-if="validationResult" class="preview">
        <h3 style="margin-bottom: 10px">分析结果:</h3>
        <pre>{{ validationResult }}</pre>
      </div>
    </div>

    <!-- Tab 4: Composable API -->
    <div v-show="activeTab === 'composable'" class="section">
      <h2 class="section-title">⚡ Composable API 示例</h2>
      <p class="section-subtitle">使用 useSignature Hook</p>

      <div style="margin-bottom: 15px">
        <canvas ref="composableCanvasRef" width="800" height="400"
          style="border: 2px solid #ddd; border-radius: 4px; background: white; display: block"></canvas>
      </div>

      <div class="controls">
        <button :disabled="composableIsEmpty" class="danger" @click="composableClear">🗑️ 清空</button>
        <button :disabled="!composableCanUndo" @click="composableUndo">↩️ 撤销</button>
        <button :disabled="!composableCanRedo" @click="composableRedo">↪️ 重做</button>
        <button class="primary" @click="composableExport">📤 导出</button>
      </div>

      <div class="status">
        <strong>isEmpty:</strong> {{ composableIsEmpty }} |
        <strong>canUndo:</strong> {{ composableCanUndo }} |
        <strong>canRedo:</strong> {{ composableCanRedo }}
      </div>

      <div class="preview" style="margin-top: 15px">
        <h3>代码示例:</h3>
        <pre><code>import { useSignature } from '@ldesign/signature/vue';

const {
  canvasRef,
  isEmpty,
  canUndo,
  canRedo,
  clear,
  undo,
  redo,
  toDataURL,
  download,
} = useSignature({
  width: 800,
  height: 400,
  penColor: '#000000',
});</code></pre>
      </div>
    </div>

    <!-- Tab 5: 功能特性 -->
    <div v-show="activeTab === 'features'" class="section">
      <h2 class="section-title">🌟 功能特性</h2>

      <div class="grid">
        <div class="card">
          <h3>🎨 Canvas 绘图引擎</h3>
          <p>高性能实时渲染，支持 DPI 自适应，requestAnimationFrame 优化</p>
        </div>
        <div class="card">
          <h3>🖱️ 触摸 & 鼠标</h3>
          <p>完整的 Pointer Events API，支持多点触控防误触</p>
        </div>
        <div class="card">
          <h3>✏️ 压力感应</h3>
          <p>支持 Apple Pencil、Wacom、Surface Pen 等压感设备</p>
        </div>
        <div class="card">
          <h3>🌊 Catmull-Rom 平滑</h3>
          <p>高级样条曲线平滑算法，媲美专业绘图软件</p>
        </div>
        <div class="card">
          <h3>↩️ 撤销/重做</h3>
          <p>完整的历史管理，最多支持 50 步操作</p>
        </div>
        <div class="card">
          <h3>📦 多格式导出</h3>
          <p>支持 PNG、JPEG、SVG、JSON 四种格式</p>
        </div>
        <div class="card">
          <h3>🎯 动态笔触</h3>
          <p>速度-粗细自适应映射，模拟真实书写</p>
        </div>
        <div class="card">
          <h3>🔍 签名验证</h3>
          <p>Hausdorff 距离算法，实现相似度对比</p>
        </div>
        <div class="card">
          <h3>✂️ 签名处理</h3>
          <p>裁剪、缩放、旋转、压缩等完整工具</p>
        </div>
        <div class="card">
          <h3>🎨 背景 & 水印</h3>
          <p>支持纯色/图片背景，文字/图片水印</p>
        </div>
        <div class="card">
          <h3>⚛️ 框架支持</h3>
          <p>Vue 3 和 React 完整封装，原生 JS 也可用</p>
        </div>
        <div class="card">
          <h3>📝 TypeScript</h3>
          <p>完整的类型定义，15+ 接口，JSDoc 注释</p>
        </div>
      </div>

      <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 4px">
        <h3 style="margin-bottom: 10px">✅ 功能完成度</h3>
        <p style="margin-bottom: 5px"><strong>P0 核心功能:</strong> 15/15 (100%) ✅</p>
        <p style="margin-bottom: 5px"><strong>P1 高级功能:</strong> 20/20 (100%) ✅</p>
        <p><strong>总计:</strong> 35+/35+ (100%+) ✅</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { SignaturePad } from '@ldesign/signature/vue';
import { useSignature } from '@ldesign/signature/vue';
import {
  cropSignature,
  scaleSignature,
  compressSignature,
  compareSignatures as compareSigs,
  extractFeatures as extractFeaturesUtil,
  validateSignature as validateSig,
  calculateComplexityScore,
} from '@ldesign/signature';
import type { SignatureConfig } from '@ldesign/signature';

// 选项卡
const tabs = [
  { id: 'basic', label: '📝 基础功能' },
  { id: 'advanced', label: '🎨 高级功能' },
  { id: 'validation', label: '🔍 签名验证' },
  { id: 'composable', label: '⚡ Composable' },
  { id: 'features', label: '🌟 功能特性' },
];
const activeTab = ref('basic');

// Tab 1: 基础功能
const signatureRef = ref<any>(null);
const basicConfig = reactive({
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
  smoothAlgorithm: 'catmull-rom' as any,
  pressureSensitive: true,
});

const status = reactive({
  message: '就绪',
  strokeCount: 0,
  lastEvent: '无',
});

const exportedImage = ref('');

const onBegin = (e: PointerEvent) => {
  status.lastEvent = '开始绘制';
};

const onChange = (e: PointerEvent) => {
  status.lastEvent = '绘制中';
  if (signatureRef.value) {
    status.message = signatureRef.value.isEmpty() ? '空' : '有内容';
  }
};

const onEnd = (e: PointerEvent) => {
  status.lastEvent = '结束绘制';
  status.strokeCount++;
};

const exportPNG = () => {
  if (signatureRef.value) {
    exportedImage.value = signatureRef.value.toDataURL('png');
  }
};

const exportJPEG = () => {
  if (signatureRef.value) {
    exportedImage.value = signatureRef.value.toDataURL('jpeg', 0.9);
  }
};

const exportSVG = () => {
  if (signatureRef.value) {
    const svg = signatureRef.value.toSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    exportedImage.value = URL.createObjectURL(blob);
  }
};

const exportJSON = () => {
  if (signatureRef.value) {
    const json = signatureRef.value.toJSON();
    console.log('导出 JSON:', json);
    alert('JSON 数据已输出到控制台');
  }
};

const downloadSignature = () => {
  if (signatureRef.value) {
    signatureRef.value.download('signature', 'png');
  }
};

// Tab 2: 高级功能
const advancedSignatureRef = ref<any>(null);
const advancedConfig = reactive({
  backgroundType: 'transparent' as 'transparent' | 'color' | 'image',
  backgroundColor: '#f0f0f0',
  watermarkText: 'Confidential',
  watermarkPosition: 'bottom-right' as any,
  watermarkOpacity: 0.3,
});

const advancedSignatureConfig = computed<Partial<SignatureConfig>>(() => ({
  background: advancedConfig.backgroundType === 'color' ? {
    type: 'color',
    color: advancedConfig.backgroundColor,
  } : { type: advancedConfig.backgroundType },
  watermark: advancedConfig.watermarkText ? {
    text: advancedConfig.watermarkText,
    position: advancedConfig.watermarkPosition,
    opacity: advancedConfig.watermarkOpacity,
  } : undefined,
}));

const advancedResult = ref('');
const advancedResultInfo = ref('');

const applyAdvancedConfig = () => {
  if (advancedSignatureRef.value) {
    advancedSignatureRef.value.getInstance().updateConfig(advancedSignatureConfig.value);
    alert('配置已应用！');
  }
};

const cropSignature = () => {
  if (advancedSignatureRef.value) {
    const canvas = advancedSignatureRef.value.getInstance().getCanvas();
    const cropped = cropSignature(canvas, { padding: 10 });
    if (cropped) {
      advancedResult.value = cropped.toDataURL('png');
      advancedResultInfo.value = `裁剪后尺寸: ${cropped.width} × ${cropped.height}`;
    }
  }
};

const scaleSignature = () => {
  if (advancedSignatureRef.value) {
    const canvas = advancedSignatureRef.value.getInstance().getCanvas();
    const scaled = scaleSignature(canvas, {
      width: canvas.width * 0.5,
      height: canvas.height * 0.5,
      maintainAspectRatio: true,
    });
    advancedResult.value = scaled.toDataURL('png');
    advancedResultInfo.value = `缩放后尺寸: ${scaled.width} × ${scaled.height} (50%)`;
  }
};

const compressSignature = () => {
  if (advancedSignatureRef.value) {
    const canvas = advancedSignatureRef.value.getInstance().getCanvas();
    const compressed = compressSignature(canvas, 'jpeg', {
      quality: 0.7,
      maxSize: 50 * 1024, // 50 KB
    });
    advancedResult.value = compressed;
    advancedResultInfo.value = `压缩后大小: ${Math.round(compressed.length / 1024)} KB`;
  }
};

// Tab 3: 签名验证
const validationSignature1Ref = ref<any>(null);
const validationSignature2Ref = ref<any>(null);
const validationResult = ref('');

const extractFeatures = () => {
  if (validationSignature1Ref.value) {
    const json = validationSignature1Ref.value.toJSON();
    const features = extractFeaturesUtil(json);
    validationResult.value = JSON.stringify(features, null, 2);
  }
};

const compareSignatures = () => {
  if (validationSignature1Ref.value && validationSignature2Ref.value) {
    const json1 = validationSignature1Ref.value.toJSON();
    const json2 = validationSignature2Ref.value.toJSON();
    const result = compareSigs(json1, json2);
    validationResult.value = JSON.stringify(result, null, 2);
  }
};

const validateSignature = () => {
  if (validationSignature1Ref.value) {
    const json = validationSignature1Ref.value.toJSON();
    const result = validateSig(json);
    validationResult.value = JSON.stringify(result, null, 2);
  }
};

const calculateComplexity = () => {
  if (validationSignature1Ref.value) {
    const json = validationSignature1Ref.value.toJSON();
    const score = calculateComplexityScore(json);
    validationResult.value = `复杂度评分: ${score}/100`;
  }
};

// Tab 4: Composable API
const {
  canvasRef: composableCanvasRef,
  isEmpty: composableIsEmpty,
  canUndo: composableCanUndo,
  canRedo: composableCanRedo,
  clear: composableClear,
  undo: composableUndo,
  redo: composableRedo,
  toDataURL: composableToDataURL,
  initialize: composableInitialize,
} = useSignature({
  width: 800,
  height: 400,
  penColor: '#000000',
});

const composableExport = () => {
  const dataUrl = composableToDataURL('png');
  if (dataUrl) {
    exportedImage.value = dataUrl;
    activeTab.value = 'basic'; // 切换到基础功能查看
  }
};

onMounted(() => {
  // 等待 DOM 更新后初始化 composable
  setTimeout(() => {
    composableInitialize();
  }, 100);
});
</script>
