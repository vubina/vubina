import { parseSync } from 'oxc-parser';
import { parseVueFile } from 'packages/insights/src/parser';
import { extractWatchers } from 'packages/insights/src/parser/vue/watch';
import { sliceContent } from 'packages/insights/tests/utils';
import { describe, expect, it } from 'vitest';

describe('analyzeWatch - Vue <script setup> watch parser', () => {
    const ref1 = 'ref1';
    const ref2 = 'ref2';

    const callback1 = '() => ref1.value++';
    const callback2 = `() => {ref1.value = ref2.value + 1}`;
    const callback3 = `(value) => {ref1.value = value;}`;
    const callback4 = `() => {ref2.value = 'navid';}`;

    const config1 = `{
            once: true,
            immediate: true,
        }`;

    const watchers = [
        `watch(${ref1},${callback1})`,
        `watch(${ref1},${callback2})`,
        `watch(${ref1}, ${callback3}, ${config1})`,
        `const { pause, resume, stop } = watch(${ref2},${callback4})`,
    ];

    const expected = [
        {
            source: ref1,
            callback: callback1,
        },
        {
            source: ref1,
            callback: callback2,
        },
        {
            source: ref1,
            callback: callback3,
            config: config1,
        },
        {
            source: ref2,
            callback: callback4,
        },
    ];

    it('should extract full watch lines from script block', async () => {
        const content = `<script setup lang="ts">\n${watchers.join('\n')}\n</script>`;
        const { script } = await parseVueFile('test.vue', content);

        expect(script?.watchers.length).toBe(watchers.length);

        if (script) {
            const { watchers: parsedWatchers } = script;

            for (const [i, watcher] of watchers.entries()) {
                const { start, end } = parsedWatchers[i].content;
                const watchContent = script.content.slice(start, end);
                expect(watcher).toContain(watchContent);
            }
        }
    });

    it('should extract type,content, source, callback and config accurately', () => {
        const parsedWatchers = watchers.map(watcher => extractWatchers(parseSync('test.js', watcher).program.body)[0]);

        expect(parsedWatchers.length).toBe(expected.length);

        for (const [i, parsedWatcher] of parsedWatchers.entries()) {
            const content = watchers[i];
            const { source, callback, config } = expected[i];

            const parsedSource = sliceContent(content, parsedWatcher.source);
            expect(parsedSource).toBe(source);

            const parsedCallback = sliceContent(content, parsedWatcher.callback);
            expect(parsedCallback).toEqual(callback);

            if (config) {
                expect(parsedWatcher.config).not.toBe(undefined);
                if (parsedWatcher.config) {
                    const parsedConfig = sliceContent(content, parsedWatcher.config);
                    expect(parsedConfig).toEqual(config);
                }
            }
        }
    });
});
