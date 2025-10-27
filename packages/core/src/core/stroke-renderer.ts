/**
 * Stroke rendering system
 */

import { Point, Stroke } from '../types';
import { calculateStrokeWidth } from '../utils/smoothing';

/**
 * Stroke Renderer
 * Handles rendering of strokes on canvas
 */
export class StrokeRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
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

    // Multiple points - draw lines with variable width
    this.ctx.strokeStyle = color;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

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

      this.drawLine(p1, p2, width, color);
    }
  }

  /**
   * Draw a line segment between two points
   */
  private drawLine(p1: Point, p2: Point, width: number, color: string): void {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();

    this.ctx.restore();
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

