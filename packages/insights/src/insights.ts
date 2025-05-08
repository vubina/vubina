import type { VueFileInsights } from './types';
import process from 'node:process';
import { parseVueFile } from './parser';
import { loadVueFiles } from './scanner';

/**
 * load all Vue files under the given directory and return insights
 * @param rootDir project root to scan
 */
export async function getInsights(rootDir: string = process.cwd()): Promise<VueFileInsights[]> {
    const files = await loadVueFiles(rootDir);

    const insights = await Promise.all(
        files.map<Promise<VueFileInsights>>(async ({ path, content, meta, fileName }) => {
            const { customBlocks, loc, script, styles, template } = await parseVueFile(fileName, content);

            return {
                fileName,
                path,
                customBlocks,
                loc,
                script,
                styles,
                template,
                meta,
                content,
            } satisfies VueFileInsights;
        }),
    );

    return insights;
}
