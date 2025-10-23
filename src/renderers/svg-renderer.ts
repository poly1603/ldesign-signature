/**
 * SVG renderer for signature export
 */

import { SignatureData } from '../types';

/**
 * Render signature data to SVG string
 */
export function renderToSVG(data: SignatureData): string {
  const { width, height, strokes } = data;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

  // Render each stroke as a path
  for (const stroke of strokes) {
    if (stroke.points.length === 0) continue;

    // Single point - render as circle
    if (stroke.points.length === 1) {
      const point = stroke.points[0];
      const radius = stroke.maxWidth / 2;
      svg += `<circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="${stroke.color}"/>`;
      continue;
    }

    // Multiple points - render as path
    let pathData = `M ${stroke.points[0].x} ${stroke.points[0].y}`;

    for (let i = 1; i < stroke.points.length; i++) {
      const point = stroke.points[i];
      pathData += ` L ${point.x} ${point.y}`;
    }

    svg += `<path d="${pathData}" stroke="${stroke.color}" stroke-width="${stroke.maxWidth}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  }

  svg += '</svg>';

  return svg;
}

/**
 * Export SVG renderer
 */
export class SVGRenderer {
  /**
   * Render signature to SVG string
   */
  static render(data: SignatureData): string {
    return renderToSVG(data);
  }

  /**
   * Render signature to SVG blob
   */
  static toBlob(data: SignatureData): Blob {
    const svgString = renderToSVG(data);
    return new Blob([svgString], { type: 'image/svg+xml' });
  }

  /**
   * Render signature to data URL
   */
  static toDataURL(data: SignatureData): string {
    const blob = this.toBlob(data);
    return URL.createObjectURL(blob);
  }
}

