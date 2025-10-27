/**
 * Grid and guide lines
 * 网格和辅助线
 */

export interface GridOptions {
  /** 是否显示网格 */
  showGrid?: boolean;
  /** 网格大小 (px) */
  gridSize?: number;
  /** 网格颜色 */
  gridColor?: string;
  /** 网格透明度 */
  gridOpacity?: number;
  /** 是否显示基线 */
  showBaseline?: boolean;
  /** 基线位置 (0-1, 0.5 = 中间) */
  baselinePosition?: number;
  /** 基线颜色 */
  baselineColor?: string;
  /** 是否显示签名框 */
  showBorder?: boolean;
  /** 签名框颜色 */
  borderColor?: string;
}

export class GridHelper {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
  }

  /**
   * 绘制网格和辅助线
   */
  draw(options: GridOptions = {}): void {
    const {
      showGrid = true,
      gridSize = 20,
      gridColor = '#e0e0e0',
      gridOpacity = 0.5,
      showBaseline = true,
      baselinePosition = 0.5,
      baselineColor = '#409eff',
      showBorder = true,
      borderColor = '#409eff',
    } = options;

    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.save();

    // 绘制网格
    if (showGrid) {
      this.ctx.strokeStyle = gridColor;
      this.ctx.globalAlpha = gridOpacity;
      this.ctx.lineWidth = 0.5;

      // 垂直线
      for (let x = 0; x <= width; x += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, height);
        this.ctx.stroke();
      }

      // 水平线
      for (let y = 0; y <= height; y += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(width, y);
        this.ctx.stroke();
      }
    }

    // 绘制基线
    if (showBaseline) {
      const y = height * baselinePosition;

      this.ctx.strokeStyle = baselineColor;
      this.ctx.globalAlpha = 0.8;
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([5, 5]);

      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();

      this.ctx.setLineDash([]);
    }

    // 绘制签名框
    if (showBorder) {
      this.ctx.strokeStyle = borderColor;
      this.ctx.globalAlpha = 1;
      this.ctx.lineWidth = 2;

      this.ctx.strokeRect(10, 10, width - 20, height - 20);
    }

    this.ctx.restore();
  }

  /**
   * 清除网格
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

