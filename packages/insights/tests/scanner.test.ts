import { describe, it, expect } from 'vitest';
import { scanVueFiles } from '../src/scanner';
import path from 'path';

describe('scanner', () => {
    it('should find vue files in the given directory', async () => {
        const root = path.join(import.meta.dirname, 'mock');
        const files = await scanVueFiles(root);

        expect(files).toBeInstanceOf(Array);
        expect(files.length).toBeGreaterThan(0);
    });
});
