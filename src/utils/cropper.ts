/**
 * Signature cropping utilities
 */

import { CropOptions } from '../types';

/**
 * Detect bounding box of signature content
 */
export function detectBoundingBox(canvas: HTMLCanvasElement): {
  x: number;
  y: number;
  width: number;
  height: number;
} | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let hasContent = false;

  // Scan for non-transparent pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];

      if (alpha > 0) {
        hasContent = true;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (!hasContent) return null;

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/**
 * Crop signature to content bounds
 */
export function cropSignature(canvas: HTMLCanvasElement, options: CropOptions = {}): HTMLCanvasElement | null {
  const { padding = 0, backgroundColor = 'transparent' } = options;

  const bbox = detectBoundingBox(canvas);
  if (!bbox) return null;

  // Create new canvas with cropped size
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = bbox.width + padding * 2;
  croppedCanvas.height = bbox.height + padding * 2;

  const ctx = croppedCanvas.getContext('2d');
  if (!ctx) return null;

  // Fill background if specified
  if (backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, croppedCanvas.width, croppedCanvas.height);
  }

  // Draw cropped content
  ctx.drawImage(
    canvas,
    bbox.x, bbox.y, bbox.width, bbox.height,
    padding, padding, bbox.width, bbox.height
  );

  return croppedCanvas;
}

/**
 * Auto-trim signature (remove empty space)
 */
export function trimSignature(canvas: HTMLCanvasElement, padding: number = 10): HTMLCanvasElement | null {
  return cropSignature(canvas, { padding, backgroundColor: 'transparent' });
}

