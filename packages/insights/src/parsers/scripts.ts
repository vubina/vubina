import type { SFCScriptBlock } from '@vue/compiler-sfc';
import type { ImportInfo } from '../analyzers/import';
import type { WatchInfo } from '../analyzers/watch';
import { parseAsync } from 'oxc-parser';
import { extractImports } from '../analyzers/import';
import { extractWatchers } from '../analyzers/watch';

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
