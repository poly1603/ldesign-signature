/**
 * Canvas renderer for signature export
 */

import { SignatureData } from '../types';

/**
 * Render signature data to canvas
 */
export function renderToCanvas(data: SignatureData, canvas?: HTMLCanvasElement): HTMLCanvasElement {
  const targetCanvas = canvas || document.createElement('canvas');
  targetCanvas.width = data.width;
  targetCanvas.height = data.height;

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }

  // Clear canvas
  ctx.clearRect(0, 0, data.width, data.height);

  // Draw strokes
  for (const stroke of data.strokes) {
    if (stroke.points.length === 0) continue;

    ctx.strokeStyle = stroke.color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw single point as dot
    if (stroke.points.length === 1) {
      const point = stroke.points[0];
      ctx.fillStyle = stroke.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, stroke.maxWidth / 2, 0, 2 * Math.PI);
      ctx.fill();
      continue;
    }

    // Draw multiple points as lines
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

    for (let i = 1; i < stroke.points.length; i++) {
      const point = stroke.points[i];
      const width = stroke.minWidth + point.pressure * (stroke.maxWidth - stroke.minWidth);
      ctx.lineWidth = width;
      ctx.lineTo(point.x, point.y);
    }

    ctx.stroke();
  }

  return targetCanvas;
}

/**
 * Export canvas renderer
 */
export class CanvasRenderer {
  /**
   * Render signature to new canvas
   */
  static render(data: SignatureData): HTMLCanvasElement {
    return renderToCanvas(data);
  }

  /**
   * Render signature to data URL
   */
  static toDataURL(data: SignatureData, format: 'png' | 'jpeg' = 'png', quality?: number): string {
    const canvas = renderToCanvas(data);
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    return canvas.toDataURL(mimeType, quality);
  }
}

