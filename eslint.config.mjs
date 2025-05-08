// eslint.config.js
import antfu from '@antfu/eslint-config';
import vitest from 'eslint-plugin-vitest';

export default antfu(
    {
        type: 'lib',

        stylistic: {
            indent: 4,
            quotes: 'single',
            semi: true,
        },

        // TypeScript and Vue are autodetected, you can also explicitly enable them:
        typescript: {
            tsconfigPath: 'tsconfig.base.json',
        },
        vue: true,

        // Disable jsonc and yaml support
        jsonc: false,
        yaml: false,
    },
    {
        files: ['tests/**'], // or any other pattern
        plugins: {
            vitest,
        },
        rules: {
            ...vitest.configs.all.rules, // you can also use vitest.configs.all.rules to enable all rules
            'vitest/max-nested-describe': ['error', { max: 3 }], // you can also modify rules' behavior using option like this
        },
        settings: {
            vitest: {
                typecheck: true,
            },
        },
        languageOptions: {
            globals: {
                ...vitest.environments.env.globals,
            },
        },
    },
);
