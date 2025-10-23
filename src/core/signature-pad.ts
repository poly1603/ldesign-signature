/**
 * Signature Pad - Core canvas engine
 */

import {
  SignatureConfig,
  SignatureInstance,
  SignatureData,
  Point,
  Stroke,
  SmoothAlgorithm,
  ExportFormat
} from '../types';
import { HistoryManager } from './history-manager';
import { PointCapture } from './point-capture';
import { StrokeRenderer } from './stroke-renderer';
import { smoothPoints } from '../utils/smoothing';

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<Omit<SignatureConfig, 'container' | 'width' | 'height' | 'background' | 'watermark' | 'onBegin' | 'onChange' | 'onEnd'>> = {
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
  velocityFilterWeight: 0.7,
  smoothAlgorithm: SmoothAlgorithm.CATMULL_ROM,
  smoothTension: 0.5,
  throttle: 16,
  minPointDistance: 5,
  pressureSensitive: true,
  dotSize: 2,
  maxHistorySize: 50,
};

/**
 * Signature Pad Implementation
 */
export class SignaturePad implements SignatureInstance {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: SignatureConfig;
  private strokes: Stroke[] = [];
  private currentStroke: Point[] = [];
  private isDrawing: boolean = false;
  private enabled: boolean = true;

  private historyManager: HistoryManager;
  private pointCapture: PointCapture;
  private strokeRenderer: StrokeRenderer;

  private boundPointerDown: (e: PointerEvent) => void;
  private boundPointerMove: (e: PointerEvent) => void;
  private boundPointerUp: (e: PointerEvent) => void;
  private rafId: number | null = null;

  constructor(canvas: HTMLCanvasElement, config: SignatureConfig = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Initialize managers
    this.historyManager = new HistoryManager(this.config.maxHistorySize);
    this.pointCapture = new PointCapture(
      canvas,
      this.config.minPointDistance,
      this.config.velocityFilterWeight,
      this.config.pressureSensitive
    );
    this.strokeRenderer = new StrokeRenderer(ctx);

    // Setup canvas
    this.setupCanvas();

    // Bind event handlers
    this.boundPointerDown = this.handlePointerDown.bind(this);
    this.boundPointerMove = this.handlePointerMove.bind(this);
    this.boundPointerUp = this.handlePointerUp.bind(this);

    // Attach event listeners
    this.attachEvents();

    // Draw initial background
    this.drawBackground();
  }

  /**
   * Setup canvas with DPI scaling
   */
  private setupCanvas(): void {
    const dpr = window.devicePixelRatio || 1;

    // Get logical size
    const width = this.config.width || this.canvas.clientWidth || 300;
    const height = this.config.height || this.canvas.clientHeight || 150;

    // Set display size (CSS pixels)
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // Set actual size with DPI scaling (device pixels)
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;

    // Scale context to match DPI (所有绘图操作会自动缩放)
    this.ctx.scale(dpr, dpr);
  }

  /**
   * Attach event listeners
   */
  private attachEvents(): void {
    this.canvas.addEventListener('pointerdown', this.boundPointerDown);
    this.canvas.addEventListener('pointermove', this.boundPointerMove);
    this.canvas.addEventListener('pointerup', this.boundPointerUp);
    this.canvas.addEventListener('pointercancel', this.boundPointerUp);
    this.canvas.addEventListener('pointerleave', this.boundPointerUp);

    // Prevent scrolling on touch devices
    this.canvas.style.touchAction = 'none';
  }

  /**
   * Detach event listeners
   */
  private detachEvents(): void {
    this.canvas.removeEventListener('pointerdown', this.boundPointerDown);
    this.canvas.removeEventListener('pointermove', this.boundPointerMove);
    this.canvas.removeEventListener('pointerup', this.boundPointerUp);
    this.canvas.removeEventListener('pointercancel', this.boundPointerUp);
    this.canvas.removeEventListener('pointerleave', this.boundPointerUp);
  }

  /**
   * Handle pointer down event
   */
  private handlePointerDown(event: PointerEvent): void {
    if (!this.enabled) return;

    event.preventDefault();
    this.isDrawing = true;
    this.currentStroke = [];

    const point = this.pointCapture.createPoint(event);
    if (point) {
      this.currentStroke.push(point);
    }

    // Call onBegin callback
    if (this.config.onBegin) {
      this.config.onBegin(event);
    }
  }

  /**
   * Handle pointer move event
   */
  private handlePointerMove(event: PointerEvent): void {
    if (!this.enabled || !this.isDrawing) return;

    event.preventDefault();

    const point = this.pointCapture.createPoint(event);
    if (point) {
      this.currentStroke.push(point);

      // Request render
      if (!this.rafId) {
        this.rafId = requestAnimationFrame(() => {
          this.render();
          this.rafId = null;
        });
      }
    }

    // Call onChange callback
    if (this.config.onChange) {
      this.config.onChange(event);
    }
  }

  /**
   * Handle pointer up event
   */
  private handlePointerUp(event: PointerEvent): void {
    if (!this.enabled || !this.isDrawing) return;

    event.preventDefault();
    this.isDrawing = false;

    // Add final point if needed
    const point = this.pointCapture.createPoint(event);
    if (point) {
      this.currentStroke.push(point);
    }

    // Finalize stroke
    if (this.currentStroke.length > 0) {
      this.finalizeStroke();
    }

    this.pointCapture.reset();

    // Call onEnd callback
    if (this.config.onEnd) {
      this.config.onEnd(event);
    }
  }

  /**
   * Finalize current stroke
   */
  private finalizeStroke(): void {
    // Apply smoothing
    let points = this.currentStroke;
    if (this.config.smoothAlgorithm !== SmoothAlgorithm.NONE && points.length > 2) {
      points = smoothPoints(points, this.config.smoothAlgorithm!, this.config.smoothTension);
    }

    // Create stroke object
    const stroke: Stroke = {
      points,
      color: this.config.penColor!,
      minWidth: this.config.minWidth!,
      maxWidth: this.config.maxWidth!,
      startTime: this.currentStroke[0].timestamp,
      endTime: this.currentStroke[this.currentStroke.length - 1].timestamp,
    };

    // Save to history before adding
    this.historyManager.save([...this.strokes]);

    // Add to strokes
    this.strokes.push(stroke);

    // Clear current stroke
    this.currentStroke = [];

    // Final render
    this.render();
  }

  /**
   * Render all strokes
   */
  private render(): void {
    // Clear canvas (使用逻辑尺寸，因为 context 已经缩放了)
    const width = parseInt(this.canvas.style.width) || this.canvas.width;
    const height = parseInt(this.canvas.style.height) || this.canvas.height;
    this.strokeRenderer.clear(width, height);

    // Draw background
    this.drawBackground();

    // Draw all strokes
    this.strokeRenderer.drawStrokes(this.strokes);

    // Draw current stroke (in progress)
    if (this.currentStroke.length > 0) {
      const tempStroke: Stroke = {
        points: this.currentStroke,
        color: this.config.penColor!,
        minWidth: this.config.minWidth!,
        maxWidth: this.config.maxWidth!,
        startTime: this.currentStroke[0].timestamp,
        endTime: this.currentStroke[this.currentStroke.length - 1]?.timestamp || Date.now(),
      };
      this.strokeRenderer.drawStroke(tempStroke);
    }

    // Draw watermark
    this.drawWatermark();
  }

  /**
   * Draw background
   */
  private drawBackground(): void {
    if (!this.config.background) return;

    const { type, color, imageUrl, imageFit } = this.config.background;
    const width = parseInt(this.canvas.style.width) || this.canvas.width;
    const height = parseInt(this.canvas.style.height) || this.canvas.height;

    if (type === 'color' && color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, 0, width, height);
    } else if (type === 'image' && imageUrl) {
      // Load and draw image
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        this.ctx.save();

        if (imageFit === 'cover') {
          const scale = Math.max(
            width / img.width,
            height / img.height
          );
          const x = (width - img.width * scale) / 2;
          const y = (height - img.height * scale) / 2;
          this.ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        } else if (imageFit === 'contain') {
          const scale = Math.min(
            width / img.width,
            height / img.height
          );
          const x = (width - img.width * scale) / 2;
          const y = (height - img.height * scale) / 2;
          this.ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        } else {
          this.ctx.drawImage(img, 0, 0, width, height);
        }

        this.ctx.restore();
      };
    }
    // 'transparent' type - do nothing
  }

  /**
   * Draw watermark
   */
  private drawWatermark(): void {
    if (!this.config.watermark) return;

    const { text, imageUrl, position = 'bottom-right', opacity = 0.3, fontSize = 14, color = '#999999' } = this.config.watermark;
    const width = parseInt(this.canvas.style.width) || this.canvas.width;
    const height = parseInt(this.canvas.style.height) || this.canvas.height;

    this.ctx.save();
    this.ctx.globalAlpha = opacity;

    if (text) {
      this.ctx.font = `${fontSize}px sans-serif`;
      this.ctx.fillStyle = color;

      const metrics = this.ctx.measureText(text);
      const textWidth = metrics.width;
      const textHeight = fontSize;

      let x = 10;
      let y = height - 10;

      if (position.includes('right')) {
        x = width - textWidth - 10;
      } else if (position.includes('center')) {
        x = (width - textWidth) / 2;
      }

      if (position.includes('top')) {
        y = textHeight + 10;
      } else if (position === 'center') {
        y = height / 2;
      }

      this.ctx.fillText(text, x, y);
    }

    this.ctx.restore();
  }

  /**
   * Clear the canvas
   */
  clear(): void {
    this.strokes = [];
    this.currentStroke = [];
    this.historyManager.clear();
    this.render();
  }

  /**
   * Undo last stroke
   */
  undo(): void {
    const prevState = this.historyManager.undo();
    if (prevState !== null) {
      this.strokes = prevState;
      this.render();
    }
  }

  /**
   * Redo last undone stroke
   */
  redo(): void {
    const nextState = this.historyManager.redo();
    if (nextState !== null) {
      this.strokes = nextState;
      this.render();
    }
  }

  /**
   * Check if signature is empty
   */
  isEmpty(): boolean {
    return this.strokes.length === 0;
  }

  /**
   * Check if can undo
   */
  canUndo(): boolean {
    return this.historyManager.canUndo();
  }

  /**
   * Check if can redo
   */
  canRedo(): boolean {
    return this.historyManager.canRedo();
  }

  /**
   * Export as data URL
   */
  toDataURL(format: 'png' | 'jpeg' = 'png', quality: number = 0.92): string {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    return this.canvas.toDataURL(mimeType, quality);
  }

  /**
   * Export as SVG string
   */
  toSVG(): string {
    const width = this.canvas.width;
    const height = this.canvas.height;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // Add background
    if (this.config.background?.type === 'color' && this.config.background.color) {
      svg += `<rect width="${width}" height="${height}" fill="${this.config.background.color}"/>`;
    }

    // Add strokes as paths
    for (const stroke of this.strokes) {
      if (stroke.points.length === 0) continue;

      let path = `M ${stroke.points[0].x} ${stroke.points[0].y}`;
      for (let i = 1; i < stroke.points.length; i++) {
        path += ` L ${stroke.points[i].x} ${stroke.points[i].y}`;
      }

      svg += `<path d="${path}" stroke="${stroke.color}" stroke-width="${stroke.maxWidth}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Export as JSON data
   */
  toJSON(): SignatureData {
    return {
      strokes: this.strokes.map(stroke => ({
        ...stroke,
        points: [...stroke.points],
      })),
      width: this.canvas.width,
      height: this.canvas.height,
      timestamp: Date.now(),
      version: '1.0.0',
    };
  }

  /**
   * Import from JSON data
   */
  fromJSON(data: SignatureData): void {
    this.clear();
    this.strokes = data.strokes.map(stroke => ({
      ...stroke,
      points: [...stroke.points],
    }));
    this.render();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SignatureConfig>): void {
    this.config = { ...this.config, ...config };

    // Update sub-systems
    if (config.minPointDistance !== undefined ||
      config.velocityFilterWeight !== undefined ||
      config.pressureSensitive !== undefined) {
      this.pointCapture.updateConfig({
        minPointDistance: config.minPointDistance,
        velocityFilterWeight: config.velocityFilterWeight,
        pressureSensitive: config.pressureSensitive,
      });
    }

    if (config.maxHistorySize !== undefined) {
      this.historyManager.setMaxSize(config.maxHistorySize);
    }

    // Re-render
    this.render();
  }

  /**
   * Get canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Enable/disable signature pad
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.canvas.style.pointerEvents = enabled ? 'auto' : 'none';
  }

  /**
   * Check if enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Download signature as file
   */
  download(fileName: string = 'signature', format: ExportFormat = 'png', quality: number = 0.92): void {
    let dataUrl: string;
    let extension: string;

    if (format === 'svg') {
      const svgData = this.toSVG();
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      dataUrl = URL.createObjectURL(blob);
      extension = 'svg';
    } else if (format === 'json') {
      const jsonData = JSON.stringify(this.toJSON(), null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      dataUrl = URL.createObjectURL(blob);
      extension = 'json';
    } else {
      dataUrl = this.toDataURL(format, quality);
      extension = format;
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${fileName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up blob URL
    if (format === 'svg' || format === 'json') {
      URL.revokeObjectURL(dataUrl);
    }
  }

  /**
   * Destroy instance and cleanup
   */
  destroy(): void {
    // Cancel any pending animation frame
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Detach events
    this.detachEvents();

    // Clear data
    this.strokes = [];
    this.currentStroke = [];
    this.historyManager.clear();
  }
}

/**
 * Create signature pad instance
 */
export function createSignaturePad(canvas: HTMLCanvasElement, config?: SignatureConfig): SignaturePad {
  return new SignaturePad(canvas, config);
}

