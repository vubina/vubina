import { describe, expect, it } from 'vitest';
import { parseVueFile } from '../src/parser';
import { readFileContent } from '../src/scanner';

describe('parser', () => {
    it('should parse SFC and return block info', async () => {
        const content = await readFileContent(`${import.meta.dirname}/mocks/test1.vue`);

        const result = await parseVueFile('test1', content);

        expect(result).toHaveProperty('template');
        expect(result).toHaveProperty('script');
        expect(result).toHaveProperty('styles');
        expect(result).toHaveProperty('loc');
        expect(result).toHaveProperty('customBlocks');
    });
});
