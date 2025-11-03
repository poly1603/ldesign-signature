import { writable, derived } from 'svelte/store';
import { createSignaturePad } from '@ldesign/signature-core';
export function createSignatureStore(config) {
    let instance = null;
    // Internal state
    const state = writable({
        isEmpty: true,
        canUndo: false,
        canRedo: false,
    });
    const updateState = () => {
        if (instance) {
            state.set({
                isEmpty: instance.isEmpty(),
                canUndo: instance.canUndo(),
                canRedo: instance.canRedo(),
            });
        }
    };
    // Derived readable stores
    const isEmpty = derived(state, $state => $state.isEmpty);
    const canUndo = derived(state, $state => $state.canUndo);
    const canRedo = derived(state, $state => $state.canRedo);
    return {
        isEmpty,
        canUndo,
        canRedo,
        init: (canvas, userConfig) => {
            if (instance) {
                instance.destroy();
            }
            const finalConfig = { ...config, ...userConfig };
            instance = createSignaturePad(canvas, {
                ...finalConfig,
                onBegin: (e) => {
                    finalConfig.onBegin?.(e);
                    updateState();
                },
                onChange: (e) => {
                    finalConfig.onChange?.(e);
                    updateState();
                },
                onEnd: (e) => {
                    finalConfig.onEnd?.(e);
                    updateState();
                },
            });
            updateState();
        },
        clear: () => {
            instance?.clear();
            updateState();
        },
        undo: () => {
            instance?.undo();
            updateState();
        },
        redo: () => {
            instance?.redo();
            updateState();
        },
        toDataURL: (format = 'png', quality) => {
            return instance?.toDataURL(format, quality) ?? '';
        },
        toSVG: () => {
            return instance?.toSVG() ?? '';
        },
        toJSON: () => {
            return instance?.toJSON() ?? null;
        },
        fromJSON: (data) => {
            instance?.fromJSON(data);
            updateState();
        },
        download: (fileName = 'signature', format = 'png', quality) => {
            instance?.download(fileName, format, quality);
        },
        getCanvas: () => {
            return instance?.getCanvas() ?? null;
        },
        destroy: () => {
            if (instance) {
                instance.destroy();
                instance = null;
            }
            state.set({
                isEmpty: true,
                canUndo: false,
                canRedo: false,
            });
        },
    };
}
