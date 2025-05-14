import type { ImportDeclaration, ImportDeclarationSpecifier, ImportOrExportKind } from 'oxc-parser';

export interface ImportInfo {
    content: string;
    start: number;
    source: {
        start: number;
        end: number;
    };
    specifiers: Array<{
        type: ImportDeclarationSpecifier['type'];
        start: number;
        end: number;
    }>;
    importKind: ImportOrExportKind | undefined;
}

/**
 * Analyzes an `ImportDeclaration`
 * including raw content, source positions, specifiers, and import kind.
 *
 * @param importNode - The `ImportDeclaration` node parsed from the AST.
 * @param content - The content string containing the import statement.
 * @returns An `ImportInfo` object containing metadata about the import.
 */
export function analyzeImport(importNode: ImportDeclaration, content: string): ImportInfo {
    const { start, end, importKind, source, specifiers } = importNode;
    console.log(content);

    return {
        content: content.slice(start, end),
        importKind,
        start,
        source: {
            start: source.start,
            end: source.end,
        },
        specifiers: specifiers.map(specifier => ({
            type: specifier.type,
            start: specifier.start,
            end: specifier.end,
        })),
    };
}
