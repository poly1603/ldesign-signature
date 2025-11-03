/**
 * Utils 单元测试
 */
import { describe, it, expect } from 'vitest'
import {
  smoothPoints,
  catmullRomSpline,
  calculateVelocity,
  calculateStrokeWidth,
} from '../src/utils/smoothing'

describe('Smoothing Utils', () => {
  describe('smoothPoints', () => {
    it('应该平滑点集合', () => {
      const points = [
        { x: 0, y: 0, pressure: 0.5, timestamp: 0 },
        { x: 10, y: 10, pressure: 0.5, timestamp: 10 },
        { x: 20, y: 20, pressure: 0.5, timestamp: 20 },
      ]

      const smoothed = smoothPoints(points, 'catmull-rom' as any)
      expect(smoothed).toBeDefined()
      expect(Array.isArray(smoothed)).toBe(true)
    })

    it('应该处理空数组', () => {
      const smoothed = smoothPoints([], 'catmull-rom' as any)
      expect(smoothed).toBeDefined()
      expect(smoothed.length).toBe(0)
    })

    it('应该处理单个点', () => {
      const points = [{ x: 0, y: 0, pressure: 0.5, timestamp: 0 }]
      const smoothed = smoothPoints(points, 'catmull-rom' as any)
      expect(smoothed.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('catmullRomSpline', () => {
    it('应该生成平滑曲线', () => {
      const points = [
        { x: 0, y: 0, pressure: 0.5, timestamp: 0 },
        { x: 10, y: 10, pressure: 0.5, timestamp: 10 },
        { x: 20, y: 20, pressure: 0.5, timestamp: 20 },
        { x: 30, y: 30, pressure: 0.5, timestamp: 30 },
      ]

      const result = catmullRomSpline(points, 0.5)
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('应该返回包含第一个点的结果', () => {
      const points = [
        { x: 0, y: 0, pressure: 0.5, timestamp: 0 },
        { x: 10, y: 10, pressure: 0.5, timestamp: 10 },
        { x: 20, y: 20, pressure: 0.5, timestamp: 20 },
      ]

      const result = catmullRomSpline(points, 0.5)
      expect(result[0].x).toBe(points[0].x)
      expect(result[0].y).toBe(points[0].y)
    })

    it('应该返回包含最后一个点的结果', () => {
      const points = [
        { x: 0, y: 0, pressure: 0.5, timestamp: 0 },
        { x: 10, y: 10, pressure: 0.5, timestamp: 10 },
        { x: 20, y: 20, pressure: 0.5, timestamp: 20 },
      ]

      const result = catmullRomSpline(points, 0.5)
      const lastPoint = result[result.length - 1]
      const lastInput = points[points.length - 1]
      expect(lastPoint.x).toBe(lastInput.x)
      expect(lastPoint.y).toBe(lastInput.y)
    })
  })

  describe('calculateVelocity', () => {
    it('应该计算两点之间的速度', () => {
      const p1 = { x: 0, y: 0, pressure: 0.5, timestamp: 0 }
      const p2 = { x: 10, y: 0, pressure: 0.5, timestamp: 10 }

      const velocity = calculateVelocity(p1, p2)
      expect(velocity).toBeTypeOf('number')
      expect(velocity).toBeGreaterThanOrEqual(0)
    })

    it('应该返回 0 如果时间差为 0', () => {
      const p1 = { x: 0, y: 0, pressure: 0.5, timestamp: 100 }
      const p2 = { x: 10, y: 0, pressure: 0.5, timestamp: 100 }

      const velocity = calculateVelocity(p1, p2)
      expect(velocity).toBe(0)
    })

    it('速度应该随距离增加而增加', () => {
      const p1 = { x: 0, y: 0, pressure: 0.5, timestamp: 0 }
      const p2Near = { x: 10, y: 0, pressure: 0.5, timestamp: 10 }
      const p2Far = { x: 100, y: 0, pressure: 0.5, timestamp: 10 }

      const velocityNear = calculateVelocity(p1, p2Near)
      const velocityFar = calculateVelocity(p1, p2Far)

      expect(velocityFar).toBeGreaterThan(velocityNear)
    })
  })

  describe('calculateStrokeWidth', () => {
    it('应该根据速度和压力计算笔画宽度', () => {
      const velocity = 1.0
      const pressure = 0.5
      const minWidth = 0.5
      const maxWidth = 2.5

      const width = calculateStrokeWidth(velocity, pressure, minWidth, maxWidth)
      expect(width).toBeTypeOf('number')
      expect(width).toBeGreaterThanOrEqual(minWidth)
      expect(width).toBeLessThanOrEqual(maxWidth)
    })

    it('高速度应该产生更细的笔画', () => {
      const minWidth = 0.5
      const maxWidth = 2.5
      const pressure = 0.5

      const widthSlow = calculateStrokeWidth(0.1, pressure, minWidth, maxWidth)
      const widthFast = calculateStrokeWidth(10, pressure, minWidth, maxWidth)

      expect(widthSlow).toBeGreaterThan(widthFast)
    })

    it('高压力应该产生更粗的笔画', () => {
      const minWidth = 0.5
      const maxWidth = 2.5
      const velocity = 1.0

      const widthLow = calculateStrokeWidth(velocity, 0.1, minWidth, maxWidth)
      const widthHigh = calculateStrokeWidth(velocity, 0.9, minWidth, maxWidth)

      expect(widthHigh).toBeGreaterThan(widthLow)
    })

    it('应该限制在 min 和 max 范围内', () => {
      const minWidth = 1
      const maxWidth = 5

      // 极端情况
      const widthVeryFast = calculateStrokeWidth(1000, 0, minWidth, maxWidth)
      const widthVerySlow = calculateStrokeWidth(0, 1, minWidth, maxWidth)

      expect(widthVeryFast).toBeGreaterThanOrEqual(minWidth)
      expect(widthVeryFast).toBeLessThanOrEqual(maxWidth)
      expect(widthVerySlow).toBeGreaterThanOrEqual(minWidth)
      expect(widthVerySlow).toBeLessThanOrEqual(maxWidth)
    })
  })
})
