import type { SignatureConfig } from '@ldesign/signature-core';
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const SignaturePad: $$__sveltets_2_IsomorphicComponent<{
    width?: number;
    height?: number;
    penColor?: string;
    minWidth?: number;
    maxWidth?: number;
    showControls?: boolean;
    clearText?: string;
    undoText?: string;
    redoText?: string;
    velocityFilterWeight?: number | undefined;
    smoothAlgorithm?: SignatureConfig["smoothAlgorithm"] | undefined;
    smoothTension?: number | undefined;
    throttle?: number | undefined;
    minPointDistance?: number | undefined;
    pressureSensitive?: boolean | undefined;
    dotSize?: number | undefined;
    maxHistorySize?: number | undefined;
    background?: SignatureConfig["background"] | undefined;
    watermark?: SignatureConfig["watermark"] | undefined;
    onBegin?: ((event: PointerEvent) => void) | undefined;
    onChange?: ((event: PointerEvent) => void) | undefined;
    onEnd?: ((event: PointerEvent) => void) | undefined;
    clear?: () => void;
    undo?: () => void;
    redo?: () => void;
    toDataURL?: (format?: "png" | "jpeg", quality?: number) => string;
    toSVG?: () => string;
    toJSON?: () => import("@ldesign/signature-core").SignatureData | null;
    fromJSON?: (data: any) => void;
    download?: (fileName?: string, format?: any, quality?: number) => void;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {
    clear: () => void;
    undo: () => void;
    redo: () => void;
    toDataURL: (format?: "png" | "jpeg", quality?: number) => string;
    toSVG: () => string;
    toJSON: () => import("@ldesign/signature-core").SignatureData | null;
    fromJSON: (data: any) => void;
    download: (fileName?: string, format?: any, quality?: number) => void;
}, string>;
type SignaturePad = InstanceType<typeof SignaturePad>;
export default SignaturePad;
//# sourceMappingURL=SignaturePad.svelte.d.ts.map