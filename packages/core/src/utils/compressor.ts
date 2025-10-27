/**
 * Signature compression utilities
 */

import { CompressOptions } from '../types';

/**
 * Compress signature image
 */
export function compressSignature(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' = 'jpeg',
  options: CompressOptions = {}
): string {
  const {
    quality = 0.8,
    maxSize,
    maxIterations = 10,
  } = options;

  // For PNG, just return with basic quality
  if (format === 'png') {
    return canvas.toDataURL('image/png');
  }

  // For JPEG, optimize quality
  let currentQuality = quality;
  let dataUrl = canvas.toDataURL('image/jpeg', currentQuality);

  // If no max size specified, return immediately
  if (!maxSize) {
    return dataUrl;
  }

  // Calculate approximate size (base64 size * 0.75)
  let currentSize = Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);

  // Iteratively reduce quality until size is acceptable
  let iterations = 0;
  while (currentSize > maxSize && iterations < maxIterations && currentQuality > 0.1) {
    currentQuality -= 0.1;
    dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
    currentSize = Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);
    iterations++;
  }

  return dataUrl;
}

/**
 * Optimize signature for web
 */
export function optimizeSignatureForWeb(canvas: HTMLCanvasElement): string {
  // Use JPEG with 85% quality for web optimization
  return compressSignature(canvas, 'jpeg', {
    quality: 0.85,
    maxSize: 500 * 1024, // 500 KB max
  });
}

/**
 * Get data URL size in bytes
 */
export function getDataUrlSize(dataUrl: string): number {
  // Remove data URL prefix
  const base64 = dataUrl.split(',')[1] || dataUrl;

  // Calculate size (base64 is ~1.37x original size)
  return Math.round((base64.length * 3) / 4);
}

/**
 * Convert data URL to Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const base64 = parts[1];

  const binary = atob(base64);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mime });
}

