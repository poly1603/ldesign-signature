import { useRef, useState } from 'react';
import { SignaturePad } from '../src/index';
import type { SmoothAlgorithm } from '@ldesign/signature-core';
import './App.css';

export default function App() {
  const signatureRef = useRef<any>(null);

  const [config, setConfig] = useState({
    penColor: '#000000',
    minWidth: 0.5,
    maxWidth: 2.5,
    pressureSensitive: true,
    smoothAlgorithm: 'catmull-rom' as SmoothAlgorithm,
  });

  const [isEmpty, setIsEmpty] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateState = () => {
    if (signatureRef.current) {
      setIsEmpty(signatureRef.current.isEmpty());
      setCanUndo(signatureRef.current.canUndo());
      setCanRedo(signatureRef.current.canRedo());
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear signature?')) {
      signatureRef.current?.clear();
      updateState();
    }
  };

  const handleUndo = () => {
    signatureRef.current?.undo();
    updateState();
  };

  const handleRedo = () => {
    signatureRef.current?.redo();
    updateState();
  };

  const handleDownloadPng = () => {
    signatureRef.current?.download('signature.png', 'png');
  };

  const handleDownloadSvg = () => {
    signatureRef.current?.download('signature.svg', 'svg');
  };

  const handleDownloadJson = () => {
    signatureRef.current?.download('signature.json', 'json');
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🖊️ Signature React Demo</h1>
        <p className="subtitle">React Component with Hooks</p>

        <div className="demo-section">
          <h2>Component Usage</h2>
          <div className="signature-wrapper">
            <SignaturePad
              ref={signatureRef}
              width={800}
              height={400}
              penColor={config.penColor}
              minWidth={config.minWidth}
              maxWidth={config.maxWidth}
              pressureSensitive={config.pressureSensitive}
              smoothAlgorithm={config.smoothAlgorithm}
              onBegin={() => console.log('Drawing started')}
              onChange={updateState}
              onEnd={() => {
                console.log('Drawing ended');
                updateState();
              }}
            />
          </div>

          <div className="controls">
            <button onClick={handleUndo} disabled={!canUndo}>↶ Undo</button>
            <button onClick={handleRedo} disabled={!canRedo}>↷ Redo</button>
            <button onClick={handleClear} disabled={isEmpty} className="danger">🗑️ Clear</button>
            <button onClick={handleDownloadPng} disabled={isEmpty} className="secondary">📥 PNG</button>
            <button onClick={handleDownloadSvg} disabled={isEmpty} className="secondary">📥 SVG</button>
            <button onClick={handleDownloadJson} disabled={isEmpty} className="secondary">📥 JSON</button>
          </div>

          <div className="config-panel">
            <h3>⚙️ Settings</h3>

            <div className="config-item">
              <label>Pen Color</label>
              <input
                type="color"
                value={config.penColor}
                onChange={(e) => setConfig({ ...config, penColor: e.target.value })}
              />
            </div>

            <div className="config-item">
              <label>Min Width: {config.minWidth.toFixed(1)}</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={config.minWidth}
                onChange={(e) => setConfig({ ...config, minWidth: parseFloat(e.target.value) })}
              />
            </div>

            <div className="config-item">
              <label>Max Width: {config.maxWidth.toFixed(1)}</label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={config.maxWidth}
                onChange={(e) => setConfig({ ...config, maxWidth: parseFloat(e.target.value) })}
              />
            </div>

            <div className="config-item">
              <label>Smooth Algorithm</label>
              <select
                value={config.smoothAlgorithm}
                onChange={(e) => setConfig({ ...config, smoothAlgorithm: e.target.value as SmoothAlgorithm })}
              >
                <option value="catmull-rom">Catmull-Rom (Best)</option>
                <option value="bezier-cubic">Cubic Bezier</option>
                <option value="bezier-quadratic">Quadratic Bezier</option>
                <option value="none">None</option>
              </select>
            </div>

            <div className="config-item">
              <label>
                <input
                  type="checkbox"
                  checked={config.pressureSensitive}
                  onChange={(e) => setConfig({ ...config, pressureSensitive: e.target.checked })}
                />
                Pressure Sensitive
              </label>
            </div>
          </div>
        </div>

        <div className="info">
          <strong>💡 React Features:</strong>
          <ul>
            <li>Controlled component with props</li>
            <li>useRef for instance methods</li>
            <li>Event callbacks for drawing lifecycle</li>
            <li>useSignature hook for advanced usage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

