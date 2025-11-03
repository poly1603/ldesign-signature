/**
 * PointCapture Unit Tests
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { PointCapture } from '../src/core/point-capture'

describe('PointCapture', () => {
  let canvas: HTMLCanvasElement
  let pointCapture: PointCapture

  beforeEach(() => {
    canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 300
    document.body.appendChild(canvas)

    pointCapture = new PointCapture(canvas)
  })

  describe('Initialization', () => {
    it('should create instance successfully', () => {
      expect(pointCapture).toBeInstanceOf(PointCapture)
    })
  })

  describe('Point creation', () => {
    it('should create point from pointer event', () => {
      const event = {
        clientX: 100,
        clientY: 100,
        pressure: 0.5,
      } as PointerEvent

      const point = pointCapture.createPoint(event)
      
      expect(point).toBeDefined()
      if (point) {
        expect(point).toHaveProperty('x')
        expect(point).toHaveProperty('y')
        expect(point).toHaveProperty('pressure')
        expect(point).toHaveProperty('timestamp')
      }
    })

    it('should handle default pressure for mouse events', () => {
      const event = {
        clientX: 100,
        clientY: 100,
      } as PointerEvent

      const point = pointCapture.createPoint(event)
      expect(point).toBeDefined()
      if (point) {
        expect(point.pressure).toBeTypeOf('number')
        expect(point.pressure).toBeGreaterThanOrEqual(0)
        expect(point.pressure).toBeLessThanOrEqual(1)
      }
    })

    it('should capture pressure from pointer events', () => {
      const event = {
        clientX: 100,
        clientY: 100,
        pressure: 0.8,
      } as PointerEvent

      const point = pointCapture.createPoint(event)
      if (point) {
        expect(point.pressure).toBe(0.8)
      }
    })
  })

  describe('Reset functionality', () => {
    it('should reset internal state', () => {
      const event = {
        clientX: 100,
        clientY: 100,
        pressure: 0.5,
      } as PointerEvent

      pointCapture.createPoint(event)
      pointCapture.reset()

      // After reset, next point should be treated as first point
      const newEvent = {
        clientX: 110,
        clientY: 110,
        pressure: 0.5,
      } as PointerEvent

      const point = pointCapture.createPoint(newEvent)
      expect(point).toBeDefined()
      if (point) {
        expect(point.velocity).toBe(0)
      }
    })
  })

  describe('Configuration update', () => {
    it('should update configuration', () => {
      expect(() => {
        pointCapture.updateConfig({
          minPointDistance: 10,
          velocityFilterWeight: 0.5,
          pressureSensitive: false,
        })
      }).not.toThrow()
    })
  })
})
