/**
 * Stroke rendering system
 */

import { Point, Stroke, BrushStyleType } from '../types';
import { calculateStrokeWidth } from '../utils/smoothing';
import { BrushStyle, BrushFactory, BrushRenderer } from '../features/brush-styles';

/**
 * Stroke Renderer
 * Handles rendering of strokes on canvas
 */
export class StrokeRenderer {
  private ctx: CanvasRenderingContext2D;
  private brushStyle: BrushStyleType = 'default';
  private brushRenderer: BrushRenderer;

  constructor(ctx: CanvasRenderingContext2D, brushStyle: BrushStyleType = 'default') {
    this.ctx = ctx;
    this.brushStyle = brushStyle;
    this.brushRenderer = BrushFactory.getBrush(this.getBrushStyleEnum(brushStyle));
  }

  /**
   * Convert string brush style to enum
   */
  private getBrushStyleEnum(style: BrushStyleType): BrushStyle {
    const map: Record<BrushStyleType, BrushStyle> = {
      'default': BrushStyle.DEFAULT,
      'pen': BrushStyle.PEN,
      'brush': BrushStyle.BRUSH,
      'pencil': BrushStyle.PENCIL,
      'marker': BrushStyle.MARKER,
      'neon': BrushStyle.NEON,
    };
    return map[style] || BrushStyle.DEFAULT;
  }

  /**
   * Set brush style
   */
  setBrushStyle(style: BrushStyleType): void {
    this.brushStyle = style;
    this.brushRenderer = BrushFactory.getBrush(this.getBrushStyleEnum(style));
  }

  /**
   * Get current brush style
   */
  getBrushStyle(): BrushStyleType {
    return this.brushStyle;
  }

  /**
   * Draw a complete stroke
   */
  drawStroke(stroke: Stroke): void {
    const { points, color, minWidth, maxWidth } = stroke;

    if (points.length === 0) return;

    // Single point - draw a dot
    if (points.length === 1) {
      this.drawDot(points[0], maxWidth, color);
      return;
    }

    // Multiple points - draw lines with variable width using brush renderer
    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];

      // Calculate width based on velocity and pressure
      const width = calculateStrokeWidth(
        p2.velocity || 0,
        p2.pressure,
        minWidth,
        maxWidth
      );

      this.brushRenderer.drawStroke(this.ctx, p1, p2, color, width);
    }
  }

  /**
   * Draw a dot (for single point strokes)
   */
  private drawDot(point: Point, radius: number, color: string): void {
    this.ctx.save();
    this.ctx.fillStyle = color;

    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, radius / 2, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.restore();
  }

  /**
   * Draw multiple strokes
   */
  drawStrokes(strokes: Stroke[]): void {
    for (const stroke of strokes) {
      this.drawStroke(stroke);
    }
  }

  /**
   * Clear the canvas
   */
  clear(width: number, height: number): void {
    this.ctx.clearRect(0, 0, width, height);
  }
}

