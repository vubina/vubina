import path from 'path';
import { it, describe, expect } from 'vitest';
import { readFileContent } from '../src/scanner';
import { parseVueFile } from '../src/parser';

describe('parser', () => {
    it('should parse SFC and return block info', async () => {
        const filePath = path.join(import.meta.dirname, 'mock/test1.vue');

        console.log(filePath);

        const content = await readFileContent(filePath);

        const result = await parseVueFile('test1', content);
        console.log(result);

        expect(result).toHaveProperty('template');
        expect(result).toHaveProperty('script');
        expect(result).toHaveProperty('styles');
        expect(result).toHaveProperty('loc');
        expect(result).toHaveProperty('customBlocks');
    });
});
