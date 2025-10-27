/**
 * Image filters for signature
 * 图像滤镜
 */

export enum FilterType {
  /** 无滤镜 */
  NONE = 'none',
  /** 黑白 */
  GRAYSCALE = 'grayscale',
  /** 反色 */
  INVERT = 'invert',
  /** 棕褐色（复古） */
  SEPIA = 'sepia',
  /** 锐化 */
  SHARPEN = 'sharpen',
  /** 模糊 */
  BLUR = 'blur',
  /** 高对比度 */
  CONTRAST = 'contrast',
  /** 亮度调整 */
  BRIGHTNESS = 'brightness',
}

export class SignatureFilter {
  /**
   * 应用滤镜到Canvas
   */
  static apply(canvas: HTMLCanvasElement, filterType: FilterType, intensity: number = 1): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (filterType) {
      case FilterType.GRAYSCALE:
        this.grayscale(data);
        break;
      case FilterType.INVERT:
        this.invert(data);
        break;
      case FilterType.SEPIA:
        this.sepia(data);
        break;
      case FilterType.SHARPEN:
        this.sharpen(imageData);
        break;
      case FilterType.BLUR:
        this.blur(imageData, intensity);
        break;
      case FilterType.CONTRAST:
        this.contrast(data, intensity);
        break;
      case FilterType.BRIGHTNESS:
        this.brightness(data, intensity);
        break;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * 黑白滤镜
   */
  private static grayscale(data: Uint8ClampedArray): void {
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
  }

  /**
   * 反色滤镜
   */
  private static invert(data: Uint8ClampedArray): void {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
  }

  /**
   * 棕褐色滤镜（复古）
   */
  private static sepia(data: Uint8ClampedArray): void {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
      data[i + 1] = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
      data[i + 2] = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
    }
  }

  /**
   * 锐化滤镜
   */
  private static sharpen(imageData: ImageData): void {
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];
    this.convolve(imageData, kernel);
  }

  /**
   * 模糊滤镜
   */
  private static blur(imageData: ImageData, intensity: number): void {
    const size = Math.floor(intensity * 2) + 1;
    const kernel = new Array(size * size).fill(1 / (size * size));
    this.convolve(imageData, kernel, size);
  }

  /**
   * 对比度调整
   */
  private static contrast(data: Uint8ClampedArray, factor: number): void {
    const contrast = (factor - 1) * 255;
    const intercept = 128 * (1 - factor);

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, factor * data[i] + intercept));
      data[i + 1] = Math.max(0, Math.min(255, factor * data[i + 1] + intercept));
      data[i + 2] = Math.max(0, Math.min(255, factor * data[i + 2] + intercept));
    }
  }

  /**
   * 亮度调整
   */
  private static brightness(data: Uint8ClampedArray, factor: number): void {
    const brightness = (factor - 1) * 255;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, data[i] + brightness));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness));
    }
  }

  /**
   * 卷积运算（用于锐化、模糊等）
   */
  private static convolve(imageData: ImageData, kernel: number[], size: number = 3): void {
    const { width, height, data } = imageData;
    const output = new Uint8ClampedArray(data);
    const half = Math.floor(size / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0;

        for (let ky = 0; ky < size; ky++) {
          for (let kx = 0; kx < size; kx++) {
            const px = Math.min(width - 1, Math.max(0, x + kx - half));
            const py = Math.min(height - 1, Math.max(0, y + ky - half));
            const i = (py * width + px) * 4;
            const ki = ky * size + kx;

            r += data[i] * kernel[ki];
            g += data[i + 1] * kernel[ki];
            b += data[i + 2] * kernel[ki];
          }
        }

        const i = (y * width + x) * 4;
        output[i] = Math.max(0, Math.min(255, r));
        output[i + 1] = Math.max(0, Math.min(255, g));
        output[i + 2] = Math.max(0, Math.min(255, b));
      }
    }

    data.set(output);
  }
}

