import type { ImportDeclaration, ImportDeclarationSpecifier, Span } from 'oxc-parser';
import { normalizeSpace } from '../helpers/normalizeSpace';

export interface ImportInfo {
    content: string;
    start: number;
    source: Span;
    specifiers: Array<Pick<ImportDeclarationSpecifier, 'type'> & Span>;
    importKind: ImportDeclaration['importKind'];
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

    return {
        content: content.slice(start, end),
        importKind,
        start,
        source: normalizeSpace(source, start),
        specifiers: specifiers.map(specifier => ({
            type: specifier.type,
            ...normalizeSpace(specifier, start),
        })),
    };
}
