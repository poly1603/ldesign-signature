/**
 * Brush style effects
 * 笔触样式效果
 */

import { Point } from '../types';

export enum BrushStyle {
  /** 默认笔触 */
  DEFAULT = 'default',
  /** 钢笔效果 */
  PEN = 'pen',
  /** 毛笔效果 */
  BRUSH = 'brush',
  /** 铅笔效果 */
  PENCIL = 'pencil',
  /** 马克笔效果 */
  MARKER = 'marker',
  /** 霓虹灯效果 */
  NEON = 'neon',
}

export interface BrushRenderer {
  /** 绘制笔画段 */
  drawStroke(ctx: CanvasRenderingContext2D, p1: Point, p2: Point, color: string, width: number): void;
}

/**
 * 默认笔触
 */
export class DefaultBrush implements BrushRenderer {
  drawStroke(ctx: CanvasRenderingContext2D, p1: Point, p2: Point, color: string, width: number): void {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    ctx.restore();
  }
}

/**
 * 钢笔笔触 - 均匀线条
 */
export class PenBrush implements BrushRenderer {
  drawStroke(ctx: CanvasRenderingContext2D, p1: Point, p2: Point, color: string, width: number): void {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width * 0.8; // 更细
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    ctx.restore();
  }
}

/**
 * 毛笔笔触 - 有纹理感
 */
export class BrushBrush implements BrushRenderer {
  drawStroke(ctx: CanvasRenderingContext2D, p1: Point, p2: Point, color: string, width: number): void {
    ctx.save();

    // 毛笔效果：多层叠加，边缘柔和
    const layers = 3;
    for (let i = 0; i < layers; i++) {
      const alpha = 0.3 + (i * 0.2);
      const w = width * (1 - i * 0.15);

      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = w;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.restore();
  }
}

/**
 * 铅笔笔触 - 有颗粒感
 */
export class PencilBrush implements BrushRenderer {
  drawStroke(ctx: CanvasRenderingContext2D, p1: Point, p2: Point, color: string, width: number): void {
    ctx.save();

    // 铅笔效果：细线 + 随机颗粒
    ctx.strokeStyle = color;
    ctx.lineWidth = width * 0.6;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.7;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // 添加颗粒
    const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    const particles = Math.floor(distance / 3);

    for (let i = 0; i < particles; i++) {
      const t = i / particles;
      const x = p1.x + (p2.x - p1.x) * t + (Math.random() - 0.5) * width;
      const y = p1.y + (p2.y - p1.y) * t + (Math.random() - 0.5) * width;

      ctx.fillStyle = color;
      ctx.globalAlpha = Math.random() * 0.3;
      ctx.fillRect(x, y, 1, 1);
    }

    ctx.restore();
  }
}

/**
 * 马克笔笔触 - 半透明叠加
 */
export class MarkerBrush implements BrushRenderer {
  drawStroke(ctx: CanvasRenderingContext2D, p1: Point, p2: Point, color: string, width: number): void {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width * 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.6; // 半透明

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    ctx.restore();
  }
}

/**
 * 霓虹灯笔触 - 发光效果
 */
export class NeonBrush implements BrushRenderer {
  drawStroke(ctx: CanvasRenderingContext2D, p1: Point, p2: Point, color: string, width: number): void {
    ctx.save();

    // 外层发光
    ctx.strokeStyle = color;
    ctx.lineWidth = width * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.globalAlpha = 0.5;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // 内层实线
    ctx.shadowBlur = 0;
    ctx.lineWidth = width * 0.5;
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    ctx.restore();
  }
}

/**
 * 笔触工厂
 */
export class BrushFactory {
  private static brushes: Map<BrushStyle, BrushRenderer> = new Map([
    [BrushStyle.DEFAULT, new DefaultBrush()],
    [BrushStyle.PEN, new PenBrush()],
    [BrushStyle.BRUSH, new BrushBrush()],
    [BrushStyle.PENCIL, new PencilBrush()],
    [BrushStyle.MARKER, new MarkerBrush()],
    [BrushStyle.NEON, new NeonBrush()],
  ]);

  static getBrush(style: BrushStyle): BrushRenderer {
    return this.brushes.get(style) || new DefaultBrush();
  }
}

