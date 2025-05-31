import type { SFCScriptBlock } from '@vue/compiler-sfc';
import type { ImportInfo } from '../js/import';
import type { WatchInfo } from '../vue/watch';
import { parseAsync } from 'oxc-parser';
import { extractImports } from '../js/import';
import { extractWatchers } from '../vue/watch';

export interface ScriptInfo {
    content: string;
    setup: string | boolean | undefined;
    lang: string;
    imports: ImportInfo[];
    watchers: WatchInfo[];
}

export async function parseScript(fileName: string, scriptBlock: SFCScriptBlock | null): Promise<ScriptInfo | null> {
    if (!scriptBlock)
        return null;

    const { content, lang = 'js', setup } = scriptBlock;

    const { program } = await parseAsync(fileName, content, {
        lang: lang as 'js' | 'ts' | 'tsx' | 'jsx',
        sourceType: 'module',
    });

    const { body } = program;

    const imports: ImportInfo[] = extractImports(body);
    const watchers: WatchInfo[] = extractWatchers(body);

    return {
        content,
        imports,
        watchers,
        lang,
        setup,
    };
}
