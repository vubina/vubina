import { loadVueFiles } from './scanner';
import { parseVueFile } from './parser';
import { VueFileInsight } from './types';

/**
 * load all Vue files under the given directory and return insights
 * @param rootDir project root to scan
 */
export const getInsights = async (rootDir: string = process.cwd()): Promise<VueFileInsight[]> => {
    const files = await loadVueFiles(rootDir);

    const insights: VueFileInsight[] = await Promise.all(
        files.map<Promise<VueFileInsight>>(async ({ path, content, meta }) => {
            const fileName = path.split('/').pop() ?? '';

            const { customBlocks, loc, script, styles, template } = await parseVueFile(fileName, content);
            return {
                fileName,
                path,
                customBlocks,
                loc,
                script,
                styles,
                template,
                meta
            };
        })
    );
    return insights;
};
