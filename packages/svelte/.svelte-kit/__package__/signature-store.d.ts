import type { Readable } from 'svelte/store';
import type { SignatureConfig, SignatureData, ExportFormat } from '@ldesign/signature-core';
export interface SignatureStore {
    isEmpty: Readable<boolean>;
    canUndo: Readable<boolean>;
    canRedo: Readable<boolean>;
    init: (canvas: HTMLCanvasElement, config?: SignatureConfig) => void;
    clear: () => void;
    undo: () => void;
    redo: () => void;
    toDataURL: (format?: 'png' | 'jpeg', quality?: number) => string;
    toSVG: () => string;
    toJSON: () => SignatureData | null;
    fromJSON: (data: SignatureData) => void;
    download: (fileName?: string, format?: ExportFormat, quality?: number) => void;
    getCanvas: () => HTMLCanvasElement | null;
    destroy: () => void;
}
export declare function createSignatureStore(config?: SignatureConfig): SignatureStore;
//# sourceMappingURL=signature-store.d.ts.map