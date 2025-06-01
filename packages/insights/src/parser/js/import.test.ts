import { parseSync } from 'oxc-parser';
import { parseVueFile } from 'packages/insights/src/parser';
import { analyzeImport } from 'packages/insights/src/parser/js/import';
import { describe, expect, it } from 'vitest';

describe('analyzeImport - Vue <script setup> import parser', () => {
    it('should extract full import lines from script block', async () => {
        const imports = [
            `import { computed, ref, watch } from 'vue';`,
            `import { computed } from 'vue';`,
        ];

        const content = `<script setup lang="ts">\n${imports.join('\n')}\n</script>`;
        const { script } = await parseVueFile('test.vue', content);

        if (script) {
            const { imports: parsedImports, content } = script;

            expect(parsedImports.length).toBe(imports.length);

            for (const [i, parsedImport] of parsedImports.entries()) {
                const { start, end } = parsedImport.content;
                const importContent = content.slice(start, end);
                expect(importContent).toBe(imports[i]);
            }
        }
    });

    it('should extract importKind, source and specifiers accurately', async () => {
        const imports = [
            `import {ref} from 'vue'`,
            `import { computed, ref, watch } from 'vue';`,
        ];

        const expected = [
            {
                importKind: 'value',
                source: `'vue'`,
                specifiers: ['ref'],
            },
            {
                importKind: 'value',
                source: `'vue'`,
                specifiers: ['computed', 'ref', 'watch'],
            },
        ];

        const importNodes = imports.flatMap(importStatement =>
            parseSync('', importStatement, {
                sourceType: 'module',
                lang: 'ts',
            }).program.body.filter(node => node.type === 'ImportDeclaration'),
        );

        expect(importNodes.length).toBe(expected.length);

        for (const [i, importNode] of importNodes.entries()) {
            const { content, importKind, source, specifiers } = analyzeImport(importNode);

            const parsedSourceText = imports[i].slice(source.start, source.end);
            const parsedSpecifiers = specifiers.map(spec => imports[i].slice(spec.start, spec.end));

            expect(imports[i]).toBe(imports[i].slice(content.start, content.end));
            expect(parsedSourceText).toBe(expected[i].source);
            expect(parsedSpecifiers).toEqual(expected[i].specifiers);
            expect(importKind).toBe(expected[i].importKind);
        }
    });
});
