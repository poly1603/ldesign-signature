<template>
  <div class="app">
    <header>
      <h1>@ldesign/signature - Vue Demo</h1>
      <p>手写签名组件演示</p>
    </header>

    <main>
      <div class="signature-container">
        <h2>签名板</h2>
        <SignaturePad
          ref="signatureRef"
          :width="800"
          :height="400"
          pen-color="#000000"
          :min-width="0.5"
          :max-width="2.5"
          :show-controls="true"
          clear-button-text="清空"
          undo-button-text="撤销"
          redo-button-text="重做"
        />
      </div>

      <div class="actions">
        <h2>操作</h2>
        <div class="button-group">
          <button @click="handleClear" class="btn btn-danger">
            清空签名
          </button>
          <button @click="handleUndo" class="btn">
            撤销
          </button>
          <button @click="handleRedo" class="btn">
            重做
          </button>
        </div>

        <div class="button-group">
          <button @click="handleDownload" class="btn btn-primary">
            下载 PNG
          </button>
          <button @click="handleExportPNG" class="btn">
            导出 PNG
          </button>
          <button @click="handleExportSVG" class="btn">
            导出 SVG
          </button>
          <button @click="handleExportJSON" class="btn">
            导出 JSON
          </button>
        </div>
      </div>

      <div class="preview">
        <h2>预览</h2>
        <div ref="previewRef" class="preview-container"></div>
      </div>
    </main>

    <footer>
      <p>
        Powered by <a href="https://github.com/ldesign/signature">@ldesign/signature</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SignaturePad } from '@ldesign/signature-vue'

const signatureRef = ref<InstanceType<typeof SignaturePad>>()
const previewRef = ref<HTMLDivElement>()

const handleClear = () => {
  signatureRef.value?.clear()
}

const handleUndo = () => {
  signatureRef.value?.undo()
}

const handleRedo = () => {
  signatureRef.value?.redo()
}

const handleDownload = () => {
  signatureRef.value?.download('signature.png')
}

const handleExportPNG = () => {
  const dataUrl = signatureRef.value?.toDataURL('png')
  if (dataUrl && previewRef.value) {
    const img = new Image()
    img.src = dataUrl
    previewRef.value.innerHTML = ''
    previewRef.value.appendChild(img)
  }
}

const handleExportSVG = () => {
  const svg = signatureRef.value?.toSVG()
  if (svg && previewRef.value) {
    previewRef.value.innerHTML = svg
  }
}

const handleExportJSON = () => {
  const json = signatureRef.value?.toJSON()
  if (json) {
    console.log('JSON:', json)
    alert(JSON.stringify(json, null, 2))
  }
}
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

header p {
  font-size: 1.2rem;
  color: #666;
}

main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.signature-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
}

.signature-container h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
}

.actions {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
}

.actions h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn:hover {
  background: #f5f5f5;
}

.btn-primary {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.btn-primary:hover {
  background: #66b1ff;
}

.btn-danger {
  background: #f56c6c;
  color: white;
  border-color: #f56c6c;
}

.btn-danger:hover {
  background: #f78989;
}

.preview {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
}

.preview h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
}

.preview-container {
  min-height: 200px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  padding: 1rem;
  background: #fafafa;
}

.preview-container img {
  max-width: 100%;
  height: auto;
}

footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
  color: #666;
}

footer a {
  color: #409eff;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
</style>
