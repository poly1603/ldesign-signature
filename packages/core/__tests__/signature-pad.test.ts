/**
 * SignaturePad 单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SignaturePad, createSignaturePad } from '../src/core/signature-pad'

describe('SignaturePad', () => {
  let canvas: HTMLCanvasElement
  let signaturePad: SignaturePad

  beforeEach(() => {
    // 创建模拟 canvas
    canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 300
    document.body.appendChild(canvas)

    // 创建签名板实例
    signaturePad = new SignaturePad(canvas, {
      width: 600,
      height: 300,
      penColor: '#000000',
    })
  })

  describe('初始化', () => {
    it('应该成功创建实例', () => {
      expect(signaturePad).toBeInstanceOf(SignaturePad)
    })

    it('应该使用默认配置', () => {
      expect(signaturePad.isEmpty()).toBe(true)
      expect(signaturePad.canUndo()).toBe(false)
      expect(signaturePad.canRedo()).toBe(false)
    })

    it('应该正确设置 canvas 尺寸', () => {
      expect(canvas.style.width).toBe('600px')
      expect(canvas.style.height).toBe('300px')
    })
  })

  describe('状态管理', () => {
    it('isEmpty() 应该返回正确状态', () => {
      expect(signaturePad.isEmpty()).toBe(true)
      // TODO: 模拟绘制后检查状态
    })

    it('canUndo() 应该返回正确状态', () => {
      expect(signaturePad.canUndo()).toBe(false)
      // TODO: 绘制后应该可以撤销
    })

    it('canRedo() 应该返回正确状态', () => {
      expect(signaturePad.canRedo()).toBe(false)
      // TODO: 撤销后应该可以重做
    })
  })

  describe('操作方法', () => {
    it('clear() 应该清空画布', () => {
      signaturePad.clear()
      expect(signaturePad.isEmpty()).toBe(true)
    })

    it('undo() 不应该在空画布上报错', () => {
      expect(() => signaturePad.undo()).not.toThrow()
    })

    it('redo() 不应该在空画布上报错', () => {
      expect(() => signaturePad.redo()).not.toThrow()
    })
  })

  describe('导出功能', () => {
    it('toDataURL() 应该返回 data URL', () => {
      const dataUrl = signaturePad.toDataURL('png')
      expect(dataUrl).toMatch(/^data:image\/png/)
    })

    it('toSVG() 应该返回 SVG 字符串', () => {
      const svg = signaturePad.toSVG()
      expect(svg).toContain('<svg')
      expect(svg).toContain('</svg>')
    })

    it('toJSON() 应该返回签名数据', () => {
      const json = signaturePad.toJSON()
      expect(json).toHaveProperty('strokes')
      expect(json).toHaveProperty('width')
      expect(json).toHaveProperty('height')
      expect(json).toHaveProperty('version')
    })
  })

  describe('配置更新', () => {
    it('updateConfig() 应该更新配置', () => {
      signaturePad.updateConfig({ penColor: '#ff0000' })
      // TODO: 验证配置已更新
    })
  })

  describe('资源清理', () => {
    it('destroy() 应该清理所有资源', () => {
      expect(() => signaturePad.destroy()).not.toThrow()
      // TODO: 验证事件监听器已移除
    })
  })
})

describe('createSignaturePad 工厂函数', () => {
  it('应该创建签名板实例', () => {
    const canvas = document.createElement('canvas')
    const pad = createSignaturePad(canvas)
    expect(pad).toBeInstanceOf(SignaturePad)
  })

  it('应该接受配置参数', () => {
    const canvas = document.createElement('canvas')
    const pad = createSignaturePad(canvas, {
      penColor: '#ff0000',
      minWidth: 1,
      maxWidth: 3,
    })
    expect(pad).toBeInstanceOf(SignaturePad)
  })
})
