import { useRef } from 'react'
import { SignaturePad } from '@ldesign/signature-react'
import type { SignaturePadRef } from '@ldesign/signature-react'
import './App.css'

function App() {
  const signatureRef = useRef<SignaturePadRef>(null)

  const handleClear = () => {
    signatureRef.current?.clear()
  }

  const handleUndo = () => {
    signatureRef.current?.undo()
  }

  const handleRedo = () => {
    signatureRef.current?.redo()
  }

  const handleDownload = () => {
    signatureRef.current?.download('signature.png')
  }

  const handleExportPNG = () => {
    const dataUrl = signatureRef.current?.toDataURL('png')
    if (dataUrl) {
      console.log('PNG Data URL:', dataUrl)
      // 显示预览
      const img = new Image()
      img.src = dataUrl
      const preview = document.getElementById('preview')
      if (preview) {
        preview.innerHTML = ''
        preview.appendChild(img)
      }
    }
  }

  const handleExportSVG = () => {
    const svg = signatureRef.current?.toSVG()
    if (svg) {
      console.log('SVG:', svg)
      // 显示预览
      const preview = document.getElementById('preview')
      if (preview) {
        preview.innerHTML = svg
      }
    }
  }

  const handleExportJSON = () => {
    const json = signatureRef.current?.toJSON()
    if (json) {
      console.log('JSON:', json)
      alert(JSON.stringify(json, null, 2))
    }
  }

  return (
    <div className="app">
      <header>
        <h1>@ldesign/signature - React Demo</h1>
        <p>手写签名组件演示</p>
      </header>

      <main>
        <div className="signature-container">
          <h2>签名板</h2>
          <SignaturePad
            ref={signatureRef}
            width={800}
            height={400}
            penColor="#000000"
            minWidth={0.5}
            maxWidth={2.5}
            showControls={true}
            showClearButton={true}
            showUndoButton={true}
            showRedoButton={true}
            clearButtonText="清空"
            undoButtonText="撤销"
            redoButtonText="重做"
          />
        </div>

        <div className="actions">
          <h2>操作</h2>
          <div className="button-group">
            <button onClick={handleClear} className="btn btn-danger">
              清空签名
            </button>
            <button onClick={handleUndo} className="btn">
              撤销
            </button>
            <button onClick={handleRedo} className="btn">
              重做
            </button>
          </div>

          <div className="button-group">
            <button onClick={handleDownload} className="btn btn-primary">
              下载 PNG
            </button>
            <button onClick={handleExportPNG} className="btn">
              导出 PNG
            </button>
            <button onClick={handleExportSVG} className="btn">
              导出 SVG
            </button>
            <button onClick={handleExportJSON} className="btn">
              导出 JSON
            </button>
          </div>
        </div>

        <div className="preview">
          <h2>预览</h2>
          <div id="preview" className="preview-container"></div>
        </div>
      </main>

      <footer>
        <p>
          Powered by <a href="https://github.com/ldesign/signature">@ldesign/signature</a>
        </p>
      </footer>
    </div>
  )
}

export default App
