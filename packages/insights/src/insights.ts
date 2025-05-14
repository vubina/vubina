import type { VueFileInfo } from './parser';
import type { VueFile } from './scanner';
import process from 'node:process';
import { parseVueFile } from './parser';
import { loadVueFiles } from './scanner';

export interface VueFileInsights extends VueFileInfo, VueFile {}

/**
 * load all Vue files under the given directory and return insights
 * @param rootDir project root to scan
 */
export async function getInsights(rootDir: string = process.cwd()): Promise<VueFileInsights[]> {
    const files = await loadVueFiles(rootDir);

    const insights = await Promise.all(
        files.map<Promise<VueFileInsights>>(async ({ path, content, meta, fileName }) => {
            const { loc, script, styles, template } = await parseVueFile(fileName, content);

            return {
                fileName,
                path,
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
