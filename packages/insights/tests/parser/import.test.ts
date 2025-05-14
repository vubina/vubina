import { parseSync } from 'oxc-parser';
import { analyzeImport } from 'packages/insights/src/analyzers/import';
import { sliceContent } from 'packages/insights/src/helpers/sliceContent';
import { parseVueFile } from 'packages/insights/src/parser';
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
            const { imports: parsedImports } = script;

            for (const [i, parsedImport] of parsedImports.entries()) {
                expect(parsedImport.content).toBe(imports[i]);
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

        for (const [i, importNode] of importNodes.entries()) {
            const { content, importKind, source, specifiers } = analyzeImport(importNode, imports[i]);

            const parsedSourceText = sliceContent(content, source);
            const parsedSpecifiers = specifiers.map(spec => sliceContent(content, spec));

            expect(parsedSourceText).toBe(expected[i].source);
            expect(parsedSpecifiers).toEqual(expected[i].specifiers);
            expect(importKind).toBe(expected[i].importKind);
        }
    });
});
