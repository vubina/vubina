import { describe, expect, it } from 'vitest';
import { parseVueFile } from '../src/parser';

describe('parser', () => {
    it('should parse SFC and return block info', async () => {
        const content = `
            <script setup lang="ts">
            import { computed, ref } from 'vue';

            const props = defineProps<{
                prop1: string;
                prop2: number;
            }>();

            const ref1 = ref('test');
            const ref2 = ref<number>(0);
            const ref3 = ref(props.prop1);

            const computed1 = computed(() => ref2.value + 1);
            </script>

            <template>
                <div class="">
                    Test 1
                </div>
                <div class="">
                    {{ ref1 }}
                    {{ ref3 }}
                    {{ computed1 }}
                </div>
            </template>
        `;

        const result = await parseVueFile('test1', content);

        expect(result).toHaveProperty('template');
        expect(result).toHaveProperty('script');
        expect(result).toHaveProperty('styles');
        expect(result).toHaveProperty('loc');
        expect(result).toHaveProperty('customBlocks');
    });
});
