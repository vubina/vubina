import glob from 'fast-glob'
import { normalize } from 'path'
import { readFile } from 'fs/promises'

/**
 * Scan for all .vue files under a given root directory, excluding node_modules and dist
 * @param rootDir project root or subfolder to scan
 * @returns absolute paths of found .vue files
 */
export const scanVueFiles = async (rootDir: string = process.cwd()): Promise<string[]> => {
    const entries = await glob(['**/*.vue'], {
        cwd: rootDir,
        ignore: ['node_modules', 'dist'],
        absolute: true,
    })
    return entries.map(path => normalize(path))
}

/**
 * Read file content as string
 * @param filePath absolute or relative path to file
 */
export const readFileContent = async (filePath: string): Promise<string> => {
    const content = await readFile(filePath, 'utf-8')
    return content
}

/**
 * Combined helper: scan and read all Vue files
 * @param rootDir directory to scan
 * @returns array of objects with path and content
 */
export const loadVueFiles = async (rootDir?: string) => {
    const files = await scanVueFiles(rootDir)
    const results = await Promise.all(
        files.map(async file => ({
            path: file,
            content: await readFileContent(file),
        }))
    )
    return results
}
