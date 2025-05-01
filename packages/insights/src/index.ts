
import { loadVueFiles } from './scanner';
import { parseVueFile } from './parser';
import { VueFileInsight } from './types';
import { statSync } from 'fs';
import { relative } from 'path';

/**
 * Analyze all Vue files under the given directory and return insights
 * @param rootDir project root to scan
 */
export const analyzeProject = async (rootDir: string = process.cwd()): Promise<VueFileInsight[]> => {
    const files = await loadVueFiles(rootDir);
    const insights: VueFileInsight[] = [];

    for (const { path: filePath, content } of files) {
        const fileName = filePath.split('/').pop() ?? ''
        const baseInsight = await parseVueFile(fileName, content);

        // gather metadata
        let stats;
        try {
            stats = statSync(filePath);
        } catch {
            stats = null;
        }

        const metadata = {
            fileSize: stats?.size,
            lastModified: stats ? stats.mtime : undefined
        };

        const insight: VueFileInsight = {
            fileName,
            path: relative(rootDir, filePath),
            loc: baseInsight.loc,
            template: baseInsight.template,
            styles: baseInsight.styles,
            script: baseInsight.script,
            customBlocks: baseInsight.customBlocks,
            metadata
        };

        insights.push(insight);
    }

    return insights;
}

/**
 * CLI entry point: print JSON to console
 */
// if (require.main === module) {
//     analyzeProject()
//         .then(results => {
//             console.log(JSON.stringify(results, null, 2));
//         })
//         .catch(err => {
//             console.error(err);
//             process.exit(1);
//         });
// }

