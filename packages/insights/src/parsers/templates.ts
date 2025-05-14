import type { SFCTemplateBlock } from '@vue/compiler-sfc';

/**
 * Information about the <template> block
 */
export interface TemplateInfo {
    lang?: string;
}

export function parseVueTemplate(template: SFCTemplateBlock | null): TemplateInfo | null {
    if (!template)
        return null;

    return {
        lang: template?.lang ?? 'html',
    };
}
