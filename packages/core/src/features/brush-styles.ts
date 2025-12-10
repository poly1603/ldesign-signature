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
 * 毛笔笔触 - 有纹理感，模拟中国书法效果
 */
export class BrushBrush implements BrushRenderer {
  drawStroke(ctx: CanvasRenderingContext2D, p1: Point, p2: Point, color: string, width: number): void {
    ctx.save();

    // 计算方向和距离
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 0.5) {
      ctx.restore();
      return;
    }

    // 根据压力和速度计算笔触宽度变化
    const pressure1 = p1.pressure || 0.5;
    const pressure2 = p2.pressure || 0.5;
    const velocity = p2.velocity || 0;

    // 速度越快，笔触越细（飞白效果）
    const velocityFactor = Math.max(0.3, 1 - velocity * 0.5);

    // 起点和终点的宽度
    const startWidth = width * pressure1 * velocityFactor * 1.5;
    const endWidth = width * pressure2 * velocityFactor * 1.5;

    // 绘制主笔触 - 使用渐变宽度模拟毛笔
    const steps = Math.max(Math.ceil(distance / 2), 1);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = p1.x + dx * t;
      const y = p1.y + dy * t;

      // 插值宽度
      const currentWidth = startWidth + (endWidth - startWidth) * t;

      // 绘制圆点形成笔触
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8 + Math.random() * 0.2;
      ctx.arc(x, y, currentWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 添加墨迹边缘效果（飞白）
    if (velocity > 0.3 && distance > 5) {
      const bristleCount = Math.floor(width * 2);
      for (let i = 0; i < bristleCount; i++) {
        const offsetAngle = Math.atan2(dy, dx) + Math.PI / 2;
        const offset = (Math.random() - 0.5) * width * 1.2;

        const bx1 = p1.x + Math.cos(offsetAngle) * offset;
        const by1 = p1.y + Math.sin(offsetAngle) * offset;
        const bx2 = p2.x + Math.cos(offsetAngle) * offset;
        const by2 = p2.y + Math.sin(offsetAngle) * offset;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.1 + Math.random() * 0.2;
        ctx.lineWidth = 0.5 + Math.random();
        ctx.moveTo(bx1, by1);
        ctx.lineTo(bx2, by2);
        ctx.stroke();
      }
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

