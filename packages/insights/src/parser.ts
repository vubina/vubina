import type { ScriptInfo } from './parsers/scripts';
import type { StyleInfo } from './parsers/styles';
import type { TemplateInfo } from './parsers/templates';
import { parse } from '@vue/compiler-sfc';
import { parseScript } from './parsers/scripts';
import { parseStyle } from './parsers/styles';
import { parseVueTemplate } from './parsers/templates';

/**
 * Aggregated insight for one Vue file
 */
export interface VueFileInfo {
    loc: number;
    template: TemplateInfo | null;
    styles: StyleInfo[];
    script: ScriptInfo | null;
}

export async function parseVueFile(fileName: string, content: string): Promise<VueFileInfo> {
    const { descriptor, errors } = parse(content);
    const { scriptSetup, styles, template } = descriptor;

    if (errors.length) {
        throw new Error(`SFC parse errors: ${errors.map(e => e.message).join(', ')}`);
    }

    const scriptInfo = await parseScript(fileName, scriptSetup);
    const templateInfo = parseVueTemplate(template);
    const stylesInfo = styles.map(parseStyle);

    return {
        template: templateInfo,
        script: scriptInfo,
        styles: stylesInfo,
        loc: content.split(/\r?\n/).length,
    };
}
