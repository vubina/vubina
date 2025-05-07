import { getInsights } from '@vubina/insights';
import { Plugin } from 'vite';

export default (rootDir = process.cwd()): Plugin => {
    return {
        name: 'vubina',
        apply: 'serve',

        buildStart: async () => {
            const result = await getInsights(rootDir);
            console.log(result);
        }
    };
};
