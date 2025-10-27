/**
 * Signature scaling utilities
 */

import { ScaleOptions } from '../types';

/**
 * Scale signature to target dimensions
 */
export function scaleSignature(canvas: HTMLCanvasElement, options: ScaleOptions): HTMLCanvasElement {
  const {
    width,
    height,
    maintainAspectRatio = true,
    mode = 'contain',
  } = options;

  // Calculate target dimensions
  let targetWidth = width || canvas.width;
  let targetHeight = height || canvas.height;

  if (maintainAspectRatio && width && height) {
    const aspectRatio = canvas.width / canvas.height;

    if (mode === 'contain') {
      // Fit inside target dimensions
      if (targetWidth / targetHeight > aspectRatio) {
        targetWidth = targetHeight * aspectRatio;
      } else {
        targetHeight = targetWidth / aspectRatio;
      }
    } else if (mode === 'cover') {
      // Cover target dimensions
      if (targetWidth / targetHeight > aspectRatio) {
        targetHeight = targetWidth / aspectRatio;
      } else {
        targetWidth = targetHeight * aspectRatio;
      }
    }
    // 'fill' mode - use exact dimensions (no aspect ratio)
  }

  // Create scaled canvas
  const scaledCanvas = document.createElement('canvas');
  scaledCanvas.width = targetWidth;
  scaledCanvas.height = targetHeight;

  const ctx = scaledCanvas.getContext('2d');
  if (!ctx) return canvas;

  // Enable image smoothing for better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Calculate position for centering (contain/cover modes)
  let dx = 0;
  let dy = 0;
  let dw = targetWidth;
  let dh = targetHeight;

  if (mode === 'contain' && maintainAspectRatio && width && height) {
    dx = (width - targetWidth) / 2;
    dy = (height - targetHeight) / 2;
  }

  // Draw scaled image
  ctx.drawImage(canvas, dx, dy, dw, dh);

  return scaledCanvas;
}

/**
 * Resize signature to specific dimensions
 */
export function resizeSignature(canvas: HTMLCanvasElement, width: number, height: number): HTMLCanvasElement {
  return scaleSignature(canvas, {
    width,
    height,
    maintainAspectRatio: false,
    mode: 'fill',
  });
}

/**
 * Scale signature by percentage
 */
export function scaleSignatureByPercent(canvas: HTMLCanvasElement, percent: number): HTMLCanvasElement {
  const width = Math.round(canvas.width * percent / 100);
  const height = Math.round(canvas.height * percent / 100);

  return scaleSignature(canvas, {
    width,
    height,
    maintainAspectRatio: false,
    mode: 'fill',
  });
}

