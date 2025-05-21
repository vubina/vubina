import { parseVueFile } from 'packages/insights/src/parser';
import { describe, expect, it } from 'vitest';

describe('analyzeWatch - Vue <script setup> watch parser', () => {
    const watchers = [
        `watch(ref1,() => ref1.value++)`,
        `watch(ref1,() => {
            ref1.value = ref2.value + 1
        })`,
        `watch(ref1, (value) => {
            ref1.value = value;
        }, {
            once: true,
            immediate: true,
        })`,
        `const { pause, resume, stop } = watch(ref2, () => {
            ref2.value = 'navid';
        })`,
    ];

    it('should extract full watch lines from script block', async () => {
        const content = `<script setup lang="ts">\n${watchers.join('\n')}\n</script>`;
        const { script } = await parseVueFile('test.vue', content);

        expect(script?.watchers.length).toBe(4);

        if (script) {
            const { watchers: parsedWatchers } = script;

            for (const [i, watcher] of watchers.entries()) {
                expect(watcher).toContain(parsedWatchers[i].content);
            }
        }
    });
});
