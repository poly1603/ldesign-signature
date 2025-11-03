import type { AfterViewInit, ElementRef, OnDestroy } from '@angular/core'
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { ExportFormat, SignatureConfig, SignatureData, SignatureInstance } from '@ldesign/signature-core'
import { createSignaturePad, SmoothAlgorithm } from '@ldesign/signature-core'

@Component({
  selector: 'ldesign-signature-pad',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ldesign-signature-container" [style.width.px]="width" [style.height.px]="height">
      <canvas
        #canvas
        [attr.aria-label]="ariaLabel || 'Signature pad'"
        role="img"
      ></canvas>
      <div class="ldesign-signature-controls" *ngIf="showControls">
        <button
          type="button"
          (click)="clear()"
          [disabled]="isEmpty()"
          class="ldesign-signature-btn"
        >
          {{ clearText || 'Clear' }}
        </button>
        <button
          type="button"
          (click)="undo()"
          [disabled]="!canUndo()"
          class="ldesign-signature-btn"
        >
          {{ undoText || 'Undo' }}
        </button>
        <button
          type="button"
          (click)="redo()"
          [disabled]="!canRedo()"
          class="ldesign-signature-btn"
        >
          {{ redoText || 'Redo' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .ldesign-signature-container {
      display: inline-block;
      position: relative;
    }
    canvas {
      display: block;
      border: 1px solid #ccc;
      border-radius: 4px;
      touch-action: none;
    }
    .ldesign-signature-controls {
      margin-top: 8px;
      display: flex;
      gap: 8px;
    }
    .ldesign-signature-btn {
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-size: 14px;
    }
    .ldesign-signature-btn:hover:not(:disabled) {
      background: #f5f5f5;
    }
    .ldesign-signature-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
})
export class SignaturePadComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>

  @Input() width = 600
  @Input() height = 300
  @Input() penColor = '#000000'
  @Input() minWidth = 0.5
  @Input() maxWidth = 2.5
  @Input() velocityFilterWeight = 0.7
  @Input() smoothAlgorithm: SignatureConfig['smoothAlgorithm'] = SmoothAlgorithm.CATMULL_ROM
  @Input() smoothTension = 0.5
  @Input() throttle = 16
  @Input() minPointDistance = 5
  @Input() pressureSensitive = true
  @Input() dotSize = 2
  @Input() maxHistorySize = 50
  @Input() showControls = true
  @Input() clearText?: string
  @Input() undoText?: string
  @Input() redoText?: string
  @Input() ariaLabel?: string

  @Output() begin = new EventEmitter<PointerEvent>()
  @Output() change = new EventEmitter<PointerEvent>()
  @Output() end = new EventEmitter<PointerEvent>()

  private signatureInstance?: SignatureInstance

  ngAfterViewInit(): void {
    if (this.canvasRef?.nativeElement) {
      this.signatureInstance = createSignaturePad(this.canvasRef.nativeElement, {
        width: this.width,
        height: this.height,
        penColor: this.penColor,
        minWidth: this.minWidth,
        maxWidth: this.maxWidth,
        velocityFilterWeight: this.velocityFilterWeight,
        smoothAlgorithm: this.smoothAlgorithm,
        smoothTension: this.smoothTension,
        throttle: this.throttle,
        minPointDistance: this.minPointDistance,
        pressureSensitive: this.pressureSensitive,
        dotSize: this.dotSize,
        maxHistorySize: this.maxHistorySize,
        onBegin: (e: PointerEvent) => this.begin.emit(e),
        onChange: (e: PointerEvent) => this.change.emit(e),
        onEnd: (e: PointerEvent) => this.end.emit(e),
      })
    }
  }

  ngOnDestroy(): void {
    this.signatureInstance?.destroy()
  }

  clear(): void {
    this.signatureInstance?.clear()
  }

  undo(): void {
    this.signatureInstance?.undo()
  }

  redo(): void {
    this.signatureInstance?.redo()
  }

  isEmpty(): boolean {
    return this.signatureInstance?.isEmpty() ?? true
  }

  canUndo(): boolean {
    return this.signatureInstance?.canUndo() ?? false
  }

  canRedo(): boolean {
    return this.signatureInstance?.canRedo() ?? false
  }

  toDataURL(format: 'png' | 'jpeg' = 'png', quality?: number): string {
    return this.signatureInstance?.toDataURL(format, quality) ?? ''
  }

  toSVG(): string {
    return this.signatureInstance?.toSVG() ?? ''
  }

  toJSON(): SignatureData | null {
    return this.signatureInstance?.toJSON() ?? null
  }

  fromJSON(data: SignatureData): void {
    this.signatureInstance?.fromJSON(data)
  }

  download(fileName = 'signature', format: ExportFormat = 'png', quality?: number): void {
    this.signatureInstance?.download(fileName, format, quality)
  }

  getCanvas(): HTMLCanvasElement | null {
    return this.signatureInstance?.getCanvas() ?? null
  }
}
