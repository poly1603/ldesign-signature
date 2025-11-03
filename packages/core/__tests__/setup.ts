/**
 * Vitest Setup File
 * 设置测试环境
 */

// Mock HTMLCanvasElement methods
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function () {
    return {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      globalCompositeOperation: 'source-over',
      clearRect: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      arcTo: () => {},
      quadraticCurveTo: () => {},
      bezierCurveTo: () => {},
      fill: () => {},
      stroke: () => {},
      save: () => {},
      restore: () => {},
      scale: () => {},
      translate: () => {},
      rotate: () => {},
      transform: () => {},
      setTransform: () => {},
      drawImage: () => {},
      createImageData: () => ({ data: new Uint8ClampedArray(), width: 0, height: 0 }),
      getImageData: () => ({ data: new Uint8ClampedArray(), width: 0, height: 0 }),
      putImageData: () => {},
      measureText: () => ({ width: 0 }),
      canvas: null as any,
    } as any
  }

  // Mock toDataURL
  HTMLCanvasElement.prototype.toDataURL = function () {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  }

  // Mock toBlob
  HTMLCanvasElement.prototype.toBlob = function (callback) {
    callback(new Blob())
  }
}

// Mock Image
if (typeof Image === 'undefined') {
  global.Image = class {
    src = ''
    width = 0
    height = 0
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
  } as any
}
