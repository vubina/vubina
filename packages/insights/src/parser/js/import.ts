import type { ImportDeclaration, ImportDeclarationSpecifier, Span, Statement } from 'oxc-parser';

export interface ImportInfo {
    content: Span;
    source: Span;
    specifiers: Array<Pick<ImportDeclarationSpecifier, 'type'> & Span>;
    importKind: ImportDeclaration['importKind'];
}

/**
 * extract imports from script block
 *
 * @param body
 * @returns list of import `ImportInfo` object
 */
export function extractImports(body: Statement[]): ImportInfo[] {
    const parsedImports: ImportInfo[] = [];
    for (const statement of body) {
        if (statement.type === 'ImportDeclaration')
            parsedImports.push(parseImport(statement));
    }
    return parsedImports;
}

/**
 * parses an `ImportDeclaration`
 * including raw content, source positions, specifiers, and import kind.
 *
 * @param importNode - The `ImportDeclaration` node parsed from the AST.
 * @returns An `ImportInfo` object containing metadata about the import.
 */
export function parseImport(importNode: ImportDeclaration): ImportInfo {
    const { start, end, importKind, source, specifiers } = importNode;

    return {
        importKind,
        content: {
            start,
            end,
        },
        source,
        specifiers: specifiers.map(({ type, start, end }) => ({
            type,
            start,
            end,
        })),
    };
}
