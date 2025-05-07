import { parse } from '@vue/compiler-sfc';
import { parseAsync } from 'oxc-parser';

export const parseVueFile = async (fileName: string, content: string) => {
    const { descriptor, errors } = parse(content);

    if (errors.length) {
        throw new Error(`SFC parse errors: ${errors.map(e => e.message).join(', ')}`);
    }

    const scriptBlock = descriptor.scriptSetup || descriptor.script;

    const result = {
        template: {
            exists: !!descriptor.template,
            lang: descriptor.template?.lang || 'html'
        },
        script: {
            setup: !!descriptor.scriptSetup,
            lang: scriptBlock?.lang || 'js',
            content: scriptBlock?.content,
            refs: 0,
            computeds: 0,
            watches: 0,
            props: 0,
            emits: 0,
            models: 0,
            imports: 0
        },
        styles: descriptor.styles.map(style => ({
            scoped: style.scoped ?? false,
            lang: style.lang || 'css'
        })),
        customBlocks: descriptor.customBlocks.length,
        loc: content.split(/\r?\n/).length
    };

    // script info
    if (scriptBlock) {
        const { program } = await parseAsync(fileName, scriptBlock.content, {
            lang: result.script.lang as any,
            sourceType: 'module'
        });

        program.body.forEach(body => {
            switch (body.type) {
                case 'ImportDeclaration':
                    result.script.imports++;
                    break;

                case 'VariableDeclaration':
                    const { declarations } = body;

                    declarations.forEach(declaration => {
                        const { init } = declaration;

                        switch (init?.type) {
                            case 'CallExpression':
                                const { callee } = init;
                                if (callee.type == 'Identifier') {
                                    switch (callee.name) {
                                        case 'defineModel':
                                            result.script.models++;
                                            break;
                                        case 'defineEmits':
                                            result.script.emits++;

                                            break;
                                        case 'defineProps':
                                            result.script.props++;

                                            break;

                                        case 'ref':
                                            result.script.refs++;
                                            break;
                                        case 'computed':
                                            result.script.computeds++;

                                            break;

                                        default:
                                            break;
                                    }
                                }
                                break;

                            default:
                                break;
                        }
                    });
                    break;

                case 'ExpressionStatement':
                    const { expression } = body;

                    switch (expression.type) {
                        case 'CallExpression':
                            const { callee } = expression;

                            switch (callee.type) {
                                case 'Identifier':
                                    const { name } = callee;

                                    switch (name) {
                                        case 'watch':
                                            result.script.watches++;
                                            break;

                                        default:
                                            break;
                                    }
                            }
                            break;

                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }
        });
    }

    return result;
};
