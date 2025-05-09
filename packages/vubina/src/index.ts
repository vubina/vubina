import type { Plugin } from 'vite';
import process from 'node:process';
import { getInsights } from '@vubina/insights';

export default (rootDir = process.cwd()): Plugin => {
    return {
        name: 'vubina',
        apply: 'serve',

        buildStart: async () => {
            const result = await getInsights(rootDir);
            // eslint-disable-next-line no-console
            console.log(result);
        },
    };
};
