/**
 * @ldesign/signature - Type Definitions
 */

/**
 * Device type
 */
export type DeviceType = 'mouse' | 'touch' | 'pen' | 'unknown';

/**
 * Orientation mode
 */
export type OrientationMode = 'auto' | 'portrait' | 'landscape';

/**
 * Brush style type
 */
export type BrushStyleType = 'default' | 'pen' | 'brush' | 'pencil' | 'marker' | 'neon';

/**
 * Point data structure
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Pressure (0-1, default 0.5) */
  pressure: number;
  /** Timestamp */
  timestamp: number;
  /** Velocity (calculated) */
  velocity?: number;
}

/**
 * Stroke data (collection of points)
 */
export interface Stroke {
  /** Points in this stroke */
  points: Point[];
  /** Stroke color */
  color: string;
  /** Min width */
  minWidth: number;
  /** Max width */
  maxWidth: number;
  /** Start timestamp */
  startTime: number;
  /** End timestamp */
  endTime: number;
}

/**
 * Smooth algorithm options
 */
export enum SmoothAlgorithm {
  /** Catmull-Rom spline (default, high quality) */
  CATMULL_ROM = 'catmull-rom',
  /** Quadratic Bezier (fast) */
  BEZIER_QUADRATIC = 'bezier-quadratic',
  /** Cubic Bezier (high quality) */
  BEZIER_CUBIC = 'bezier-cubic',
  /** No smoothing */
  NONE = 'none',
}

/**
 * Export format
 */
export type ExportFormat = 'png' | 'jpeg' | 'svg' | 'json';

/**
 * Background type
 */
export type BackgroundType = 'color' | 'image' | 'transparent';

/**
 * Background configuration
 */
export interface BackgroundConfig {
  /** Background type */
  type: BackgroundType;
  /** Background color (for 'color' type) */
  color?: string;
  /** Background image URL (for 'image' type) */
  imageUrl?: string;
  /** Image fit mode */
  imageFit?: 'cover' | 'contain' | 'fill';
}

/**
 * Watermark configuration
 */
export interface WatermarkConfig {
  /** Watermark text */
  text?: string;
  /** Watermark image URL */
  imageUrl?: string;
  /** Position */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  /** Opacity (0-1) */
  opacity?: number;
  /** Font size (for text watermark) */
  fontSize?: number;
  /** Color (for text watermark) */
  color?: string;
}

/**
 * Signature configuration
 */
export interface SignatureConfig {
  /** Canvas width (default: auto) */
  width?: number;

  /** Canvas height (default: auto) */
  height?: number;

  /** Pen color (default: '#000000') */
  penColor?: string;

  /** Minimum stroke width (default: 0.5) */
  minWidth?: number;

  /** Maximum stroke width (default: 2.5) */
  maxWidth?: number;

  /** Velocity filter weight (0-1, default: 0.7) */
  velocityFilterWeight?: number;

  /** Smooth algorithm (default: CATMULL_ROM) */
  smoothAlgorithm?: SmoothAlgorithm;

  /** Smooth tension (0-1, default: 0.5) */
  smoothTension?: number;

  /** Throttle time for point capture in ms (default: 16) */
  throttle?: number;

  /** Min distance between points in pixels (default: 5) */
  minPointDistance?: number;

  /** Enable pressure sensitivity (default: true) */
  pressureSensitive?: boolean;

  /** Brush style (default: 'default') */
  brushStyle?: BrushStyleType;

  /** Background configuration */
  background?: BackgroundConfig;

  /** Watermark configuration */
  watermark?: WatermarkConfig;

  /** Enable dot drawing for single points (default: true) */
  dotSize?: number;

  /** Maximum history size for undo/redo (default: 50) */
  maxHistorySize?: number;

  /** Canvas container element */
  container?: HTMLElement;

  /** Event callbacks */
  onBegin?: (event: PointerEvent) => void;
  onChange?: (event: PointerEvent) => void;
  onEnd?: (event: PointerEvent) => void;

  /** Auto resize when container size changes (default: true) */
  autoResize?: boolean;

  /** Orientation mode for mobile devices (default: 'auto') */
  orientationMode?: OrientationMode;

  /** Guide lines configuration */
  guideLines?: GuideLinesConfig;

  /** Touch gesture options */
  touchGestures?: TouchGesturesConfig;
}

/**
 * Guide lines configuration
 */
export interface GuideLinesConfig {
  /** Enable guide lines */
  enabled?: boolean;
  /** Line color */
  color?: string;
  /** Line width */
  lineWidth?: number;
  /** Line style: 'solid' | 'dashed' | 'dotted' */
  style?: 'solid' | 'dashed' | 'dotted';
  /** Show horizontal center line */
  horizontal?: boolean;
  /** Show vertical center line */
  vertical?: boolean;
  /** Custom lines (positions as percentage 0-100) */
  customLines?: { type: 'horizontal' | 'vertical'; position: number }[];
}

/**
 * Touch gestures configuration
 */
export interface TouchGesturesConfig {
  /** Enable two-finger scroll prevention (default: true) */
  preventScroll?: boolean;
  /** Enable pinch zoom prevention (default: true) */
  preventZoom?: boolean;
  /** Enable double-tap prevention (default: true) */
  preventDoubleTap?: boolean;
}

/**
 * Signature data (for JSON export/import)
 */
export interface SignatureData {
  /** All strokes */
  strokes: Stroke[];
  /** Canvas width */
  width: number;
  /** Canvas height */
  height: number;
  /** Creation timestamp */
  timestamp: number;
  /** Version */
  version: string;
}

/**
 * Signature instance interface
 */
export interface SignatureInstance {
  /**
   * Clear the canvas
   */
  clear(): void;

  /**
   * Undo last stroke
   */
  undo(): void;

  /**
   * Redo last undone stroke
   */
  redo(): void;

  /**
   * Check if signature is empty
   */
  isEmpty(): boolean;

  /**
   * Check if can undo
   */
  canUndo(): boolean;

  /**
   * Check if can redo
   */
  canRedo(): boolean;

  /**
   * Export as data URL
   */
  toDataURL(format?: 'png' | 'jpeg', quality?: number): string;

  /**
   * Export as SVG string
   */
  toSVG(): string;

  /**
   * Export as JSON data
   */
  toJSON(): SignatureData;

  /**
   * Import from JSON data
   */
  fromJSON(data: SignatureData): void;

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SignatureConfig>): void;

  /**
   * Get canvas element
   */
  getCanvas(): HTMLCanvasElement;

  /**
   * Enable/disable signature pad
   */
  setEnabled(enabled: boolean): void;

  /**
   * Check if enabled
   */
  isEnabled(): boolean;

  /**
   * Destroy instance and cleanup
   */
  destroy(): void;

  /**
   * Download signature as file
   */
  download(fileName?: string, format?: ExportFormat, quality?: number): void;
}

/**
 * Crop options
 */
export interface CropOptions {
  /** Padding around content (default: 0) */
  padding?: number;
  /** Background color for cropped area (default: transparent) */
  backgroundColor?: string;
}

/**
 * Scale options
 */
export interface ScaleOptions {
  /** Target width */
  width?: number;
  /** Target height */
  height?: number;
  /** Maintain aspect ratio (default: true) */
  maintainAspectRatio?: boolean;
  /** Scale mode */
  mode?: 'contain' | 'cover' | 'fill';
}

/**
 * Compress options
 */
export interface CompressOptions {
  /** Quality (0-1, for JPEG) */
  quality?: number;
  /** Max file size in bytes */
  maxSize?: number;
  /** Max iterations for compression */
  maxIterations?: number;
}

/**
 * Signature features (for validation)
 */
export interface SignatureFeatures {
  /** Number of strokes */
  strokeCount: number;
  /** Total length of all strokes */
  totalLength: number;
  /** Bounding box */
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Average stroke duration */
  avgStrokeDuration: number;
  /** Average pressure */
  avgPressure: number;
  /** Total drawing time */
  totalTime: number;
}

/**
 * Similarity result
 */
export interface SimilarityResult {
  /** Similarity score (0-1, 1 = identical) */
  score: number;
  /** Hausdorff distance */
  hausdorffDistance: number;
  /** Feature differences */
  featureDifferences: {
    strokeCount: number;
    totalLength: number;
    boundingBox: number;
  };
}

