/**
 * Signature validation and comparison utilities
 */

import { SignatureData, SignatureFeatures, SimilarityResult, Point } from '../types';

/**
 * Extract features from signature data
 */
export function extractFeatures(data: SignatureData): SignatureFeatures {
  const { strokes } = data;

  let totalLength = 0;
  let totalPressure = 0;
  let totalPoints = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let totalDuration = 0;

  for (const stroke of strokes) {
    // Calculate stroke length
    for (let i = 1; i < stroke.points.length; i++) {
      const p1 = stroke.points[i - 1];
      const p2 = stroke.points[i];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      totalLength += Math.sqrt(dx * dx + dy * dy);
    }

    // Calculate average pressure
    for (const point of stroke.points) {
      totalPressure += point.pressure;
      totalPoints++;

      // Update bounding box
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    // Calculate stroke duration
    totalDuration += stroke.endTime - stroke.startTime;
  }

  return {
    strokeCount: strokes.length,
    totalLength,
    boundingBox: {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    },
    avgStrokeDuration: strokes.length > 0 ? totalDuration / strokes.length : 0,
    avgPressure: totalPoints > 0 ? totalPressure / totalPoints : 0,
    totalTime: totalDuration,
  };
}

/**
 * Calculate Hausdorff distance between two point sets
 * (measures similarity between signatures)
 */
function hausdorffDistance(points1: Point[], points2: Point[]): number {
  const distance = (p1: Point, p2: Point) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const directedDistance = (setA: Point[], setB: Point[]): number => {
    let maxDist = 0;

    for (const pointA of setA) {
      let minDist = Infinity;

      for (const pointB of setB) {
        const dist = distance(pointA, pointB);
        minDist = Math.min(minDist, dist);
      }

      maxDist = Math.max(maxDist, minDist);
    }

    return maxDist;
  };

  const d1 = directedDistance(points1, points2);
  const d2 = directedDistance(points2, points1);

  return Math.max(d1, d2);
}

/**
 * Compare two signatures and calculate similarity
 */
export function compareSignatures(data1: SignatureData, data2: SignatureData): SimilarityResult {
  const features1 = extractFeatures(data1);
  const features2 = extractFeatures(data2);

  // Collect all points from both signatures
  const allPoints1: Point[] = [];
  const allPoints2: Point[] = [];

  for (const stroke of data1.strokes) {
    allPoints1.push(...stroke.points);
  }

  for (const stroke of data2.strokes) {
    allPoints2.push(...stroke.points);
  }

  // Calculate Hausdorff distance
  const hausdorff = hausdorffDistance(allPoints1, allPoints2);

  // Calculate feature differences
  const strokeCountDiff = Math.abs(features1.strokeCount - features2.strokeCount);
  const lengthDiff = Math.abs(features1.totalLength - features2.totalLength);
  const bboxDiff = Math.abs(
    (features1.boundingBox.width * features1.boundingBox.height) -
    (features2.boundingBox.width * features2.boundingBox.height)
  );

  // Normalize differences (0-1 scale)
  const maxDimension = Math.max(data1.width, data1.height, data2.width, data2.height);
  const normalizedHausdorff = Math.min(hausdorff / maxDimension, 1);
  const normalizedStrokeDiff = Math.min(strokeCountDiff / 10, 1);
  const normalizedLengthDiff = Math.min(lengthDiff / (features1.totalLength + features2.totalLength), 1);

  // Calculate similarity score (1 = identical, 0 = completely different)
  const score = 1 - (
    normalizedHausdorff * 0.5 +
    normalizedStrokeDiff * 0.25 +
    normalizedLengthDiff * 0.25
  );

  return {
    score: Math.max(0, Math.min(1, score)),
    hausdorffDistance: hausdorff,
    featureDifferences: {
      strokeCount: strokeCountDiff,
      totalLength: lengthDiff,
      boundingBox: bboxDiff,
    },
  };
}

/**
 * Validate signature (check if it's valid/complete)
 */
export function validateSignature(data: SignatureData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if empty
  if (data.strokes.length === 0) {
    errors.push('Signature is empty');
  }

  // Check stroke count
  if (data.strokes.length < 2) {
    errors.push('Signature has too few strokes (minimum 2 recommended)');
  }

  // Check total length
  const features = extractFeatures(data);
  if (features.totalLength < 100) {
    errors.push('Signature is too short');
  }

  // Check bounding box size
  const minSize = Math.min(features.boundingBox.width, features.boundingBox.height);
  if (minSize < 20) {
    errors.push('Signature is too small');
  }

  // Check drawing time
  if (features.totalTime < 500) {
    errors.push('Signature was drawn too quickly (possible fraud)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate signature complexity score (0-100)
 */
export function calculateComplexityScore(data: SignatureData): number {
  const features = extractFeatures(data);

  // Factors contributing to complexity
  const strokeScore = Math.min(features.strokeCount * 10, 30);
  const lengthScore = Math.min(features.totalLength / 50, 30);
  const timeScore = Math.min(features.totalTime / 100, 20);
  const pressureVariance = features.avgPressure > 0.3 ? 20 : 10;

  return Math.min(strokeScore + lengthScore + timeScore + pressureVariance, 100);
}

