/**
 * Smoothing algorithms for signature strokes
 */

import { Point, SmoothAlgorithm } from '../types';

/**
 * Calculate distance between two points
 */
function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Catmull-Rom spline interpolation
 * Based on smooth-signature implementation
 * 
 * @param points - Control points
 * @param tension - Tension parameter (0-1, default 0.5)
 * @returns Smoothed points
 */
export function catmullRomSpline(points: Point[], tension: number = 0.5): Point[] {
  if (points.length < 2) return points;
  if (points.length === 2) return points;

  const result: Point[] = [];
  const alpha = tension;

  // Add first point
  result.push(points[0]);

  // For each segment
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i === points.length - 2 ? points[points.length - 1] : points[i + 2];

    // Calculate distances for parameterization
    const d1 = distance(p0, p1);
    const d2 = distance(p1, p2);
    const d3 = distance(p2, p3);

    // Interpolate multiple points between p1 and p2
    const steps = Math.max(Math.ceil(d2 / 2), 1);

    for (let t = 0; t < steps; t++) {
      const u = t / steps;

      // Catmull-Rom basis functions
      const tt = u * u;
      const ttt = tt * u;

      const q0 = -alpha * ttt + 2 * alpha * tt - alpha * u;
      const q1 = (2 - alpha) * ttt + (alpha - 3) * tt + 1;
      const q2 = (alpha - 2) * ttt + (3 - 2 * alpha) * tt + alpha * u;
      const q3 = alpha * ttt - alpha * tt;

      const x = q0 * p0.x + q1 * p1.x + q2 * p2.x + q3 * p3.x;
      const y = q0 * p0.y + q1 * p1.y + q2 * p2.y + q3 * p3.y;

      // Interpolate pressure
      const pressure = p1.pressure + (p2.pressure - p1.pressure) * u;

      result.push({
        x,
        y,
        pressure,
        timestamp: p1.timestamp + (p2.timestamp - p1.timestamp) * u,
      });
    }
  }

  // Add last point
  result.push(points[points.length - 1]);

  return result;
}

/**
 * Quadratic Bezier smoothing
 * Fast smoothing algorithm
 */
export function quadraticBezier(points: Point[]): Point[] {
  if (points.length < 3) return points;

  const result: Point[] = [points[0]];

  for (let i = 0; i < points.length - 2; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const p2 = points[i + 2];

    // Control point is p1
    const steps = 10;
    for (let t = 0; t <= steps; t++) {
      const u = t / steps;
      const uu = u * u;
      const oneMinusU = 1 - u;
      const oneMinusUU = oneMinusU * oneMinusU;

      const x = oneMinusUU * p0.x + 2 * oneMinusU * u * p1.x + uu * p2.x;
      const y = oneMinusUU * p0.y + 2 * oneMinusU * u * p1.y + uu * p2.y;
      const pressure = oneMinusUU * p0.pressure + 2 * oneMinusU * u * p1.pressure + uu * p2.pressure;

      result.push({
        x,
        y,
        pressure,
        timestamp: p0.timestamp + (p2.timestamp - p0.timestamp) * u,
      });
    }
  }

  result.push(points[points.length - 1]);

  return result;
}

/**
 * Cubic Bezier smoothing
 * High quality smoothing
 */
export function cubicBezier(points: Point[]): Point[] {
  if (points.length < 4) return points;

  const result: Point[] = [points[0]];

  for (let i = 0; i < points.length - 3; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const p2 = points[i + 2];
    const p3 = points[i + 3];

    const steps = 15;
    for (let t = 0; t <= steps; t++) {
      const u = t / steps;
      const uu = u * u;
      const uuu = uu * u;
      const oneMinusU = 1 - u;
      const oneMinusUU = oneMinusU * oneMinusU;
      const oneMinusUUU = oneMinusUU * oneMinusU;

      const x = oneMinusUUU * p0.x + 3 * oneMinusUU * u * p1.x + 3 * oneMinusU * uu * p2.x + uuu * p3.x;
      const y = oneMinusUUU * p0.y + 3 * oneMinusUU * u * p1.y + 3 * oneMinusU * uu * p2.y + uuu * p3.y;
      const pressure = oneMinusUUU * p0.pressure + 3 * oneMinusUU * u * p1.pressure + 3 * oneMinusU * uu * p2.pressure + uuu * p3.pressure;

      result.push({
        x,
        y,
        pressure,
        timestamp: p0.timestamp + (p3.timestamp - p0.timestamp) * u,
      });
    }
  }

  result.push(points[points.length - 1]);

  return result;
}

/**
 * Apply smoothing algorithm to points
 */
export function smoothPoints(points: Point[], algorithm: SmoothAlgorithm, tension?: number): Point[] {
  if (points.length < 2) return points;

  switch (algorithm) {
    case SmoothAlgorithm.CATMULL_ROM:
      return catmullRomSpline(points, tension);
    case SmoothAlgorithm.BEZIER_QUADRATIC:
      return quadraticBezier(points);
    case SmoothAlgorithm.BEZIER_CUBIC:
      return cubicBezier(points);
    case SmoothAlgorithm.NONE:
      return points;
    default:
      return catmullRomSpline(points, tension);
  }
}

/**
 * Calculate velocity between two points
 */
export function calculateVelocity(p1: Point, p2: Point): number {
  const dist = distance(p1, p2);
  const timeDelta = p2.timestamp - p1.timestamp;

  if (timeDelta === 0) return 0;

  return dist / timeDelta;
}

/**
 * Calculate stroke width based on velocity and pressure
 */
export function calculateStrokeWidth(
  velocity: number,
  pressure: number,
  minWidth: number,
  maxWidth: number,
  velocityFilterWeight: number = 0.7
): number {
  // Velocity-based width (slower = thicker)
  const velocityWidth = maxWidth - (velocity * velocityFilterWeight);

  // Pressure-based width
  const pressureWidth = minWidth + pressure * (maxWidth - minWidth);

  // Combine both (average)
  let width = (velocityWidth + pressureWidth) / 2;

  // Clamp to min/max
  width = Math.max(minWidth, Math.min(maxWidth, width));

  return width;
}

