/**
 * @ldesign/signature-core - Main entry point
 */

// Core
export { SignaturePad, createSignaturePad } from './core/signature-pad';
export { HistoryManager } from './core/history-manager';
export { PointCapture } from './core/point-capture';
export { StrokeRenderer } from './core/stroke-renderer';

// Types
export type * from './types';
export type { BrushStyleType } from './types';

// Utils
export * from './utils/smoothing';
export * from './utils/cropper';
export * from './utils/scaler';
export * from './utils/compressor';
export * from './utils/validator';

// Renderers
export { CanvasRenderer } from './renderers/canvas-renderer';
export { SVGRenderer } from './renderers/svg-renderer';

// Features
export { SignatureReplay, createReplay } from './features/replay';
export type { ReplayOptions } from './features/replay';
export { BrushStyle, BrushFactory } from './features/brush-styles';
export type { BrushRenderer } from './features/brush-styles';
export { GridHelper } from './features/grid';
export type { GridOptions } from './features/grid';
export { SignatureStorage, createStorage } from './features/storage';
export type { StorageOptions, SignatureRecord } from './features/storage';
export { SignatureFilter, FilterType } from './features/filters';

