import type { SFCStyleBlock } from '@vue/compiler-sfc';

export interface StyleInfo {
    scoped: boolean;
    lang: string;
}

export function parseStyle(style: SFCStyleBlock): StyleInfo {
    return {
        lang: style.lang ?? 'css',
        scoped: style.scoped ?? false,
    };
}
