/**
 * Point capture and event handling
 */

import { Point } from '../types';

/**
 * Point Capture
 * Handles pointer events and captures drawing points
 */
export class PointCapture {
  private canvas: HTMLCanvasElement;
  private minPointDistance: number;
  private lastPoint: Point | null = null;
  private lastVelocity: number = 0;
  private velocityFilterWeight: number;
  private pressureSensitive: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    minPointDistance: number = 5,
    velocityFilterWeight: number = 0.7,
    pressureSensitive: boolean = true
  ) {
    this.canvas = canvas;
    this.minPointDistance = minPointDistance;
    this.velocityFilterWeight = velocityFilterWeight;
    this.pressureSensitive = pressureSensitive;
  }

  /**
   * Create point from pointer event
   */
  createPoint(event: PointerEvent): Point | null {
    const rect = this.canvas.getBoundingClientRect();

    // 直接使用 CSS 像素坐标（因为 context 已经缩放了）
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Get pressure (default 0.5 if not supported)
    let pressure = 0.5;
    if (this.pressureSensitive && 'pressure' in event && event.pressure > 0) {
      pressure = event.pressure;
    }

    const point: Point = {
      x,
      y,
      pressure,
      timestamp: Date.now(),
    };

    // Calculate velocity if we have a previous point
    if (this.lastPoint) {
      const dx = point.x - this.lastPoint.x;
      const dy = point.y - this.lastPoint.y;
      const dt = point.timestamp - this.lastPoint.timestamp;

      if (dt > 0) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        const currentVelocity = distance / dt;

        // Apply velocity filter
        point.velocity = this.velocityFilterWeight * currentVelocity +
          (1 - this.velocityFilterWeight) * this.lastVelocity;

        this.lastVelocity = point.velocity;
      } else {
        point.velocity = this.lastVelocity;
      }

      // Check minimum distance
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.minPointDistance) {
        return null; // Skip point (too close)
      }
    } else {
      point.velocity = 0;
      this.lastVelocity = 0;
    }

    this.lastPoint = point;
    return point;
  }

  /**
   * Create point from touch event
   */
  createPointFromTouch(touch: Touch): Point | null {
    const rect = this.canvas.getBoundingClientRect();

    // 直接使用 CSS 像素坐标（因为 context 已经缩放了）
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Touch events don't have pressure in standard API
    // Use force if available (iOS)
    let pressure = 0.5;
    if (this.pressureSensitive && 'force' in touch && (touch as any).force > 0) {
      pressure = (touch as any).force;
    }

    const point: Point = {
      x,
      y,
      pressure,
      timestamp: Date.now(),
    };

    // Calculate velocity
    if (this.lastPoint) {
      const dx = point.x - this.lastPoint.x;
      const dy = point.y - this.lastPoint.y;
      const dt = point.timestamp - this.lastPoint.timestamp;

      if (dt > 0) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        const currentVelocity = distance / dt;

        point.velocity = this.velocityFilterWeight * currentVelocity +
          (1 - this.velocityFilterWeight) * this.lastVelocity;

        this.lastVelocity = point.velocity;
      } else {
        point.velocity = this.lastVelocity;
      }

      // Check minimum distance
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.minPointDistance) {
        return null;
      }
    } else {
      point.velocity = 0;
      this.lastVelocity = 0;
    }

    this.lastPoint = point;
    return point;
  }

  /**
   * Reset state (call on stroke end)
   */
  reset(): void {
    this.lastPoint = null;
    this.lastVelocity = 0;
  }

  /**
   * Update configuration
   */
  updateConfig(config: {
    minPointDistance?: number;
    velocityFilterWeight?: number;
    pressureSensitive?: boolean;
  }): void {
    if (config.minPointDistance !== undefined) {
      this.minPointDistance = config.minPointDistance;
    }
    if (config.velocityFilterWeight !== undefined) {
      this.velocityFilterWeight = config.velocityFilterWeight;
    }
    if (config.pressureSensitive !== undefined) {
      this.pressureSensitive = config.pressureSensitive;
    }
  }
}

