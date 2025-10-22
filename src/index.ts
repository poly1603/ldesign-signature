/**
 * @ldesign/signature - 手写签名
 */
export class SignaturePad {
  constructor(private canvas: HTMLCanvasElement) { }
  clear() { const ctx = this.canvas.getContext('2d'); ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height) }
  toDataURL() { return this.canvas.toDataURL() }
}
export function createSignaturePad(canvas: HTMLCanvasElement) { return new SignaturePad(canvas) }

