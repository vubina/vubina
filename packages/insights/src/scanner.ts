import { glob } from 'tinyglobby';
import { normalize } from 'path';
import { readFile, stat } from 'fs/promises';

/**
 * Scan for all .vue files under a given root directory, excluding node_modules and dist
 * @param rootDir project root or subfolder to scan
 * @returns absolute paths of found .vue files
 */
export const scanVueFiles = async (rootDir?: string): Promise<string[]> => {
    const entries = await glob(['**/*.vue'], {
        cwd: rootDir,
        ignore: ['node_modules', 'dist'],
        absolute: true
    });

    return entries.map(normalize);
};

/**
 * Read file content as string
 * @param filePath absolute or relative path to file
 */
export const readFileContent = async (filePath: string): Promise<string> => {
    const content = await readFile(filePath, 'utf-8');
    return content;
};

/**
 * Combined helper: scan and read all Vue files
 * @param rootDir directory to scan
 * @returns array of objects with path and content and stat
 */
export const loadVueFiles = async (rootDir?: string) => {
    const filePaths = await scanVueFiles(rootDir);

    const files = await Promise.all(
        filePaths.map(async filePath => ({
            path: filePath,
            content: await readFileContent(filePath),
            meta: await stat(filePath).then(({ size, mtime }) => ({ size, modifiedAt: mtime }))
        }))
    );
    return files;
};
