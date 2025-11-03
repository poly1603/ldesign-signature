/**
 * Lit Web Component for Signature Pad
 */

import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { SignaturePad as SignaturePadCore, createSignaturePad } from '@ldesign/signature-core';
import type { SignatureConfig, SignatureData, ExportFormat } from '@ldesign/signature-core';
import { SmoothAlgorithm } from '@ldesign/signature-core';

@customElement('signature-pad')
export class SignaturePadElement extends LitElement {
  // Properties
  @property({ type: Number }) width = 600;
  @property({ type: Number }) height = 300;
  @property({ type: String, attribute: 'pen-color' }) penColor = '#000000';
  @property({ type: Number, attribute: 'min-width' }) minWidth = 0.5;
  @property({ type: Number, attribute: 'max-width' }) maxWidth = 2.5;
  @property({ type: String, attribute: 'smooth-algorithm' }) smoothAlgorithm: SmoothAlgorithm = SmoothAlgorithm.CATMULL_ROM;
  @property({ type: Boolean, attribute: 'pressure-sensitive' }) pressureSensitive = true;
  @property({ type: Boolean }) enabled = true;
  @property({ type: Boolean, attribute: 'show-controls' }) showControls = true;
  @property({ type: Boolean, attribute: 'show-clear-button' }) showClearButton = true;
  @property({ type: Boolean, attribute: 'show-undo-button' }) showUndoButton = true;
  @property({ type: Boolean, attribute: 'show-redo-button' }) showRedoButton = true;
  @property({ type: String, attribute: 'clear-button-text' }) clearButtonText = '清空';
  @property({ type: String, attribute: 'undo-button-text' }) undoButtonText = '撤销';
  @property({ type: String, attribute: 'redo-button-text' }) redoButtonText = '重做';

  // State
  @state() private isEmpty = true;
  @state() private canUndo = false;
  @state() private canRedo = false;

  // Elements
  @query('canvas') private canvas!: HTMLCanvasElement;

  // Instance
  private instance: SignaturePadCore | null = null;

  static styles = css`
    :host {
      display: inline-block;
    }
    
    .container {
      display: inline-block;
      position: relative;
    }
    
    .container.disabled {
      opacity: 0.6;
      pointer-events: none;
    }
    
    canvas {
      display: block;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }
    
    .controls {
      margin-top: 8px;
      display: flex;
      gap: 8px;
    }
    
    button {
      padding: 6px 16px;
      font-size: 14px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }
    
    button:hover:not(:disabled) {
      border-color: #409eff;
      color: #409eff;
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .btn-clear:hover:not(:disabled) {
      border-color: #f56c6c;
      color: #f56c6c;
    }
  `;

  protected firstUpdated(): void {
    this.initializeSignaturePad();
  }

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('enabled')) {
      this.instance?.setEnabled(this.enabled);
    }

    // Update config if properties changed
    if (this.instance && (
      changedProperties.has('penColor') ||
      changedProperties.has('minWidth') ||
      changedProperties.has('maxWidth') ||
      changedProperties.has('smoothAlgorithm') ||
      changedProperties.has('pressureSensitive')
    )) {
      this.instance.updateConfig(this.getConfig());
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.instance?.destroy();
    this.instance = null;
  }

  private initializeSignaturePad(): void {
    if (!this.canvas) return;

    const config = this.getConfig();
    this.instance = createSignaturePad(this.canvas, config);
    this.updateState();
  }

  private getConfig(): SignatureConfig {
    return {
      width: this.width,
      height: this.height,
      penColor: this.penColor,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth,
      smoothAlgorithm: this.smoothAlgorithm,
      pressureSensitive: this.pressureSensitive,
      onBegin: (e: PointerEvent) => this.dispatchEvent(new CustomEvent('begin', { detail: e })),
      onChange: (e: PointerEvent) => {
        this.updateState();
        this.dispatchEvent(new CustomEvent('change', { detail: e }));
      },
      onEnd: (e: PointerEvent) => {
        this.updateState();
        this.dispatchEvent(new CustomEvent('end', { detail: e }));
      },
    };
  }

  private updateState(): void {
    if (!this.instance) return;

    this.isEmpty = this.instance.isEmpty();
    this.canUndo = this.instance.canUndo();
    this.canRedo = this.instance.canRedo();
  }

  // Public methods
  public clear(): void {
    this.instance?.clear();
    this.updateState();
    this.dispatchEvent(new CustomEvent('clear'));
  }

  public undo(): void {
    this.instance?.undo();
    this.updateState();
    this.dispatchEvent(new CustomEvent('undo'));
  }

  public redo(): void {
    this.instance?.redo();
    this.updateState();
    this.dispatchEvent(new CustomEvent('redo'));
  }

  public toDataURL(format?: 'png' | 'jpeg', quality?: number): string {
    return this.instance?.toDataURL(format, quality) || '';
  }

  public toSVG(): string {
    return this.instance?.toSVG() || '';
  }

  public toJSON(): SignatureData | null {
    return this.instance?.toJSON() || null;
  }

  public fromJSON(data: SignatureData): void {
    this.instance?.fromJSON(data);
    this.updateState();
  }

  public download(fileName?: string, format?: ExportFormat, quality?: number): void {
    this.instance?.download(fileName, format, quality);
  }

  public getInstance(): SignaturePadCore | null {
    return this.instance;
  }

  protected render() {
    return html`
      <div class="container ${!this.enabled ? 'disabled' : ''}">
        <canvas width="${this.width}" height="${this.height}"></canvas>
        
        ${this.showControls ? html`
          <div class="controls">
            ${this.showClearButton ? html`
              <button
                class="btn-clear"
                ?disabled="${this.isEmpty}"
                @click="${this.clear}"
              >
                ${this.clearButtonText}
              </button>
            ` : ''}
            
            ${this.showUndoButton ? html`
              <button
                class="btn-undo"
                ?disabled="${!this.canUndo}"
                @click="${this.undo}"
              >
                ${this.undoButtonText}
              </button>
            ` : ''}
            
            ${this.showRedoButton ? html`
              <button
                class="btn-redo"
                ?disabled="${!this.canRedo}"
                @click="${this.redo}"
              >
                ${this.redoButtonText}
              </button>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'signature-pad': SignaturePadElement;
  }
}

