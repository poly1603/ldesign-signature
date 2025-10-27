/**
 * Signature replay animation
 * 签名回放动画
 */

import { SignatureData, Stroke, Point } from '../types';

export interface ReplayOptions {
  /** 回放速度倍数 (default: 1) */
  speed?: number;
  /** 是否循环播放 (default: false) */
  loop?: boolean;
  /** 每帧回调 */
  onFrame?: (progress: number) => void;
  /** 完成回调 */
  onComplete?: () => void;
}

export class SignatureReplay {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private signatureData: SignatureData;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private animationId: number | null = null;
  private currentStrokeIndex: number = 0;
  private currentPointIndex: number = 0;
  private startTime: number = 0;

  constructor(canvas: HTMLCanvasElement, signatureData: SignatureData) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
    this.signatureData = signatureData;
  }

  /**
   * 开始回放
   */
  play(options: ReplayOptions = {}): void {
    if (this.isPlaying && !this.isPaused) return;

    const {
      speed = 1,
      loop = false,
      onFrame,
      onComplete,
    } = options;

    this.isPlaying = true;
    this.isPaused = false;

    if (this.currentStrokeIndex === 0 && this.currentPointIndex === 0) {
      this.startTime = Date.now();
      this.clear();
    }

    const animate = () => {
      if (!this.isPlaying || this.isPaused) return;

      const currentStroke = this.signatureData.strokes[this.currentStrokeIndex];
      if (!currentStroke) {
        // 所有笔画绘制完成
        this.isPlaying = false;

        if (loop) {
          this.reset();
          setTimeout(() => this.play(options), 500);
        } else if (onComplete) {
          onComplete();
        }
        return;
      }

      // 绘制当前点
      if (this.currentPointIndex < currentStroke.points.length) {
        this.drawPoint(currentStroke, this.currentPointIndex);
        this.currentPointIndex++;

        // 计算进度
        const totalPoints = this.signatureData.strokes.reduce(
          (sum, s) => sum + s.points.length,
          0
        );
        const completedPoints = this.signatureData.strokes
          .slice(0, this.currentStrokeIndex)
          .reduce((sum, s) => sum + s.points.length, 0) + this.currentPointIndex;
        const progress = completedPoints / totalPoints;

        if (onFrame) {
          onFrame(progress);
        }
      } else {
        // 当前笔画完成，移到下一个笔画
        this.currentStrokeIndex++;
        this.currentPointIndex = 0;
      }

      // 根据速度调整延迟
      const delay = 16 / speed; // 约60fps的基础
      setTimeout(() => {
        this.animationId = requestAnimationFrame(animate);
      }, delay);
    };

    animate();
  }

  /**
   * 暂停回放
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * 恢复回放
   */
  resume(): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.play();
    }
  }

  /**
   * 停止回放
   */
  stop(): void {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 重置回放
   */
  reset(): void {
    this.stop();
    this.currentStrokeIndex = 0;
    this.currentPointIndex = 0;
    this.clear();
  }

  /**
   * 绘制点
   */
  private drawPoint(stroke: Stroke, pointIndex: number): void {
    if (pointIndex === 0) return;

    const p1 = stroke.points[pointIndex - 1];
    const p2 = stroke.points[pointIndex];

    this.ctx.save();
    this.ctx.strokeStyle = stroke.color;
    this.ctx.lineWidth = (stroke.minWidth + stroke.maxWidth) / 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();

    this.ctx.restore();
  }

  /**
   * 清空画布
   */
  private clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 获取当前进度 (0-1)
   */
  getProgress(): number {
    const totalPoints = this.signatureData.strokes.reduce(
      (sum, s) => sum + s.points.length,
      0
    );
    const completedPoints = this.signatureData.strokes
      .slice(0, this.currentStrokeIndex)
      .reduce((sum, s) => sum + s.points.length, 0) + this.currentPointIndex;
    return completedPoints / totalPoints;
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.stop();
  }
}

/**
 * 创建回放实例
 */
export function createReplay(canvas: HTMLCanvasElement, signatureData: SignatureData): SignatureReplay {
  return new SignatureReplay(canvas, signatureData);
}

