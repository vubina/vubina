import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { scanVueFiles } from '../src/scanner';

describe('scanner', () => {
    it('should find vue files in the given directory', async () => {
        const root = path.join(import.meta.dirname, 'mocks');
        const files = await scanVueFiles(root);

        expect(files).toBeInstanceOf(Array);
        expect(files.length).toBeGreaterThan(0);
    });
});
