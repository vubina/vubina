import type { VueFileInfo } from './types';
import { parse } from '@vue/compiler-sfc';
import { parseAsync } from 'oxc-parser';

export async function parseVueFile(fileName: string, content: string): Promise<VueFileInfo> {
    const { descriptor, errors } = parse(content);

    if (errors.length) {
        throw new Error(`SFC parse errors: ${errors.map(e => e.message).join(', ')}`);
    }

    const scriptBlock = descriptor.scriptSetup || descriptor.script;

    const result: VueFileInfo = {
        template: {
            exists: !!descriptor.template,
            lang: descriptor.template?.lang ?? 'html',
        },
        script: {
            setup: !!descriptor.scriptSetup,
            lang: scriptBlock?.lang ?? 'js',
            content: scriptBlock?.content,
            refs: 0,
            computeds: 0,
            watches: 0,
            props: 0,
            emits: 0,
            models: 0,
            imports: 0,
        },
        styles: descriptor.styles.map(style => ({
            scoped: style.scoped ?? false,
            lang: style.lang ?? 'css',
        })),
        customBlocks: descriptor.customBlocks.length,
        loc: content.split(/\r?\n/).length,
    };

    if (result.script && result.script.content != null) {
        const { program } = await parseAsync(fileName, result.script.content, {
            lang: result.script?.lang as 'js' | 'ts' | 'tsx' | 'jsx' | undefined,
            sourceType: 'module',
        });

        for (const body of program.body) {
            switch (body.type) {
                case 'ImportDeclaration':
                    result.script.imports++;
                    break;

                case 'VariableDeclaration': {
                    const { declarations } = body;

                    for (const declaration of declarations) {
                        const { init } = declaration;

                        switch (init?.type) {
                            case 'CallExpression': {
                                const { callee } = init;
                                if (callee.type === 'Identifier') {
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
                            }

                            case undefined: {
                                throw new Error('Not implemented yet: undefined case');
                            }
                            case 'FunctionDeclaration': {
                                throw new Error('Not implemented yet: "FunctionDeclaration" case');
                            }
                            case 'FunctionExpression': {
                                throw new Error('Not implemented yet: "FunctionExpression" case');
                            }
                            case 'TSDeclareFunction': {
                                throw new Error('Not implemented yet: "TSDeclareFunction" case');
                            }
                            case 'TSEmptyBodyFunctionExpression': {
                                throw new Error('Not implemented yet: "TSEmptyBodyFunctionExpression" case');
                            }
                            case 'ClassDeclaration': {
                                throw new Error('Not implemented yet: "ClassDeclaration" case');
                            }
                            case 'ClassExpression': {
                                throw new Error('Not implemented yet: "ClassExpression" case');
                            }
                            case 'Literal': {
                                throw new Error('Not implemented yet: "Literal" case');
                            }
                            case 'TemplateLiteral': {
                                throw new Error('Not implemented yet: "TemplateLiteral" case');
                            }
                            case 'Identifier': {
                                throw new Error('Not implemented yet: "Identifier" case');
                            }
                            case 'MetaProperty': {
                                throw new Error('Not implemented yet: "MetaProperty" case');
                            }
                            case 'Super': {
                                throw new Error('Not implemented yet: "Super" case');
                            }
                            case 'ArrayExpression': {
                                throw new Error('Not implemented yet: "ArrayExpression" case');
                            }
                            case 'ArrowFunctionExpression': {
                                throw new Error('Not implemented yet: "ArrowFunctionExpression" case');
                            }
                            case 'AssignmentExpression': {
                                throw new Error('Not implemented yet: "AssignmentExpression" case');
                            }
                            case 'AwaitExpression': {
                                throw new Error('Not implemented yet: "AwaitExpression" case');
                            }
                            case 'BinaryExpression': {
                                throw new Error('Not implemented yet: "BinaryExpression" case');
                            }
                            case 'ChainExpression': {
                                throw new Error('Not implemented yet: "ChainExpression" case');
                            }
                            case 'ConditionalExpression': {
                                throw new Error('Not implemented yet: "ConditionalExpression" case');
                            }
                            case 'ImportExpression': {
                                throw new Error('Not implemented yet: "ImportExpression" case');
                            }
                            case 'LogicalExpression': {
                                throw new Error('Not implemented yet: "LogicalExpression" case');
                            }
                            case 'NewExpression': {
                                throw new Error('Not implemented yet: "NewExpression" case');
                            }
                            case 'ObjectExpression': {
                                throw new Error('Not implemented yet: "ObjectExpression" case');
                            }
                            case 'ParenthesizedExpression': {
                                throw new Error('Not implemented yet: "ParenthesizedExpression" case');
                            }
                            case 'SequenceExpression': {
                                throw new Error('Not implemented yet: "SequenceExpression" case');
                            }
                            case 'TaggedTemplateExpression': {
                                throw new Error('Not implemented yet: "TaggedTemplateExpression" case');
                            }
                            case 'ThisExpression': {
                                throw new Error('Not implemented yet: "ThisExpression" case');
                            }
                            case 'UnaryExpression': {
                                throw new Error('Not implemented yet: "UnaryExpression" case');
                            }
                            case 'UpdateExpression': {
                                throw new Error('Not implemented yet: "UpdateExpression" case');
                            }
                            case 'YieldExpression': {
                                throw new Error('Not implemented yet: "YieldExpression" case');
                            }
                            case 'JSXElement': {
                                throw new Error('Not implemented yet: "JSXElement" case');
                            }
                            case 'JSXFragment': {
                                throw new Error('Not implemented yet: "JSXFragment" case');
                            }
                            case 'TSAsExpression': {
                                throw new Error('Not implemented yet: "TSAsExpression" case');
                            }
                            case 'TSSatisfiesExpression': {
                                throw new Error('Not implemented yet: "TSSatisfiesExpression" case');
                            }
                            case 'TSTypeAssertion': {
                                throw new Error('Not implemented yet: "TSTypeAssertion" case');
                            }
                            case 'TSNonNullExpression': {
                                throw new Error('Not implemented yet: "TSNonNullExpression" case');
                            }
                            case 'TSInstantiationExpression': {
                                throw new Error('Not implemented yet: "TSInstantiationExpression" case');
                            }
                            case 'V8IntrinsicExpression': {
                                throw new Error('Not implemented yet: "V8IntrinsicExpression" case');
                            }
                            case 'MemberExpression': {
                                throw new Error('Not implemented yet: "MemberExpression" case');
                            }
                            default:
                                break;
                        }
                    }

                    break;
                }

                case 'ExpressionStatement': {
                    const { expression } = body;

                    switch (expression.type) {
                        case 'CallExpression': {
                            const { callee } = expression;

                            switch (callee.type) {
                                case 'Identifier':
                                    {
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

                                case 'FunctionDeclaration': {
                                    throw new Error('Not implemented yet: "FunctionDeclaration" case');
                                }
                                case 'FunctionExpression': {
                                    throw new Error('Not implemented yet: "FunctionExpression" case');
                                }
                                case 'TSDeclareFunction': {
                                    throw new Error('Not implemented yet: "TSDeclareFunction" case');
                                }
                                case 'TSEmptyBodyFunctionExpression': {
                                    throw new Error('Not implemented yet: "TSEmptyBodyFunctionExpression" case');
                                }
                                case 'ClassDeclaration': {
                                    throw new Error('Not implemented yet: "ClassDeclaration" case');
                                }
                                case 'ClassExpression': {
                                    throw new Error('Not implemented yet: "ClassExpression" case');
                                }
                                case 'Literal': {
                                    throw new Error('Not implemented yet: "Literal" case');
                                }
                                case 'TemplateLiteral': {
                                    throw new Error('Not implemented yet: "TemplateLiteral" case');
                                }
                                case 'MetaProperty': {
                                    throw new Error('Not implemented yet: "MetaProperty" case');
                                }
                                case 'Super': {
                                    throw new Error('Not implemented yet: "Super" case');
                                }
                                case 'ArrayExpression': {
                                    throw new Error('Not implemented yet: "ArrayExpression" case');
                                }
                                case 'ArrowFunctionExpression': {
                                    throw new Error('Not implemented yet: "ArrowFunctionExpression" case');
                                }
                                case 'AssignmentExpression': {
                                    throw new Error('Not implemented yet: "AssignmentExpression" case');
                                }
                                case 'AwaitExpression': {
                                    throw new Error('Not implemented yet: "AwaitExpression" case');
                                }
                                case 'BinaryExpression': {
                                    throw new Error('Not implemented yet: "BinaryExpression" case');
                                }
                                case 'CallExpression': {
                                    throw new Error('Not implemented yet: "CallExpression" case');
                                }
                                case 'ChainExpression': {
                                    throw new Error('Not implemented yet: "ChainExpression" case');
                                }
                                case 'ConditionalExpression': {
                                    throw new Error('Not implemented yet: "ConditionalExpression" case');
                                }
                                case 'ImportExpression': {
                                    throw new Error('Not implemented yet: "ImportExpression" case');
                                }
                                case 'LogicalExpression': {
                                    throw new Error('Not implemented yet: "LogicalExpression" case');
                                }
                                case 'NewExpression': {
                                    throw new Error('Not implemented yet: "NewExpression" case');
                                }
                                case 'ObjectExpression': {
                                    throw new Error('Not implemented yet: "ObjectExpression" case');
                                }
                                case 'ParenthesizedExpression': {
                                    throw new Error('Not implemented yet: "ParenthesizedExpression" case');
                                }
                                case 'SequenceExpression': {
                                    throw new Error('Not implemented yet: "SequenceExpression" case');
                                }
                                case 'TaggedTemplateExpression': {
                                    throw new Error('Not implemented yet: "TaggedTemplateExpression" case');
                                }
                                case 'ThisExpression': {
                                    throw new Error('Not implemented yet: "ThisExpression" case');
                                }
                                case 'UnaryExpression': {
                                    throw new Error('Not implemented yet: "UnaryExpression" case');
                                }
                                case 'UpdateExpression': {
                                    throw new Error('Not implemented yet: "UpdateExpression" case');
                                }
                                case 'YieldExpression': {
                                    throw new Error('Not implemented yet: "YieldExpression" case');
                                }
                                case 'JSXElement': {
                                    throw new Error('Not implemented yet: "JSXElement" case');
                                }
                                case 'JSXFragment': {
                                    throw new Error('Not implemented yet: "JSXFragment" case');
                                }
                                case 'TSAsExpression': {
                                    throw new Error('Not implemented yet: "TSAsExpression" case');
                                }
                                case 'TSSatisfiesExpression': {
                                    throw new Error('Not implemented yet: "TSSatisfiesExpression" case');
                                }
                                case 'TSTypeAssertion': {
                                    throw new Error('Not implemented yet: "TSTypeAssertion" case');
                                }
                                case 'TSNonNullExpression': {
                                    throw new Error('Not implemented yet: "TSNonNullExpression" case');
                                }
                                case 'TSInstantiationExpression': {
                                    throw new Error('Not implemented yet: "TSInstantiationExpression" case');
                                }
                                case 'V8IntrinsicExpression': {
                                    throw new Error('Not implemented yet: "V8IntrinsicExpression" case');
                                }
                                case 'MemberExpression': {
                                    throw new Error('Not implemented yet: "MemberExpression" case');
                                }
                            }
                            break;
                        }

                        case 'FunctionDeclaration': {
                            throw new Error('Not implemented yet: "FunctionDeclaration" case');
                        }
                        case 'FunctionExpression': {
                            throw new Error('Not implemented yet: "FunctionExpression" case');
                        }
                        case 'TSDeclareFunction': {
                            throw new Error('Not implemented yet: "TSDeclareFunction" case');
                        }
                        case 'TSEmptyBodyFunctionExpression': {
                            throw new Error('Not implemented yet: "TSEmptyBodyFunctionExpression" case');
                        }
                        case 'ClassDeclaration': {
                            throw new Error('Not implemented yet: "ClassDeclaration" case');
                        }
                        case 'ClassExpression': {
                            throw new Error('Not implemented yet: "ClassExpression" case');
                        }
                        case 'Literal': {
                            throw new Error('Not implemented yet: "Literal" case');
                        }
                        case 'TemplateLiteral': {
                            throw new Error('Not implemented yet: "TemplateLiteral" case');
                        }
                        case 'Identifier': {
                            throw new Error('Not implemented yet: "Identifier" case');
                        }
                        case 'MetaProperty': {
                            throw new Error('Not implemented yet: "MetaProperty" case');
                        }
                        case 'Super': {
                            throw new Error('Not implemented yet: "Super" case');
                        }
                        case 'ArrayExpression': {
                            throw new Error('Not implemented yet: "ArrayExpression" case');
                        }
                        case 'ArrowFunctionExpression': {
                            throw new Error('Not implemented yet: "ArrowFunctionExpression" case');
                        }
                        case 'AssignmentExpression': {
                            throw new Error('Not implemented yet: "AssignmentExpression" case');
                        }
                        case 'AwaitExpression': {
                            throw new Error('Not implemented yet: "AwaitExpression" case');
                        }
                        case 'BinaryExpression': {
                            throw new Error('Not implemented yet: "BinaryExpression" case');
                        }
                        case 'ChainExpression': {
                            throw new Error('Not implemented yet: "ChainExpression" case');
                        }
                        case 'ConditionalExpression': {
                            throw new Error('Not implemented yet: "ConditionalExpression" case');
                        }
                        case 'ImportExpression': {
                            throw new Error('Not implemented yet: "ImportExpression" case');
                        }
                        case 'LogicalExpression': {
                            throw new Error('Not implemented yet: "LogicalExpression" case');
                        }
                        case 'NewExpression': {
                            throw new Error('Not implemented yet: "NewExpression" case');
                        }
                        case 'ObjectExpression': {
                            throw new Error('Not implemented yet: "ObjectExpression" case');
                        }
                        case 'ParenthesizedExpression': {
                            throw new Error('Not implemented yet: "ParenthesizedExpression" case');
                        }
                        case 'SequenceExpression': {
                            throw new Error('Not implemented yet: "SequenceExpression" case');
                        }
                        case 'TaggedTemplateExpression': {
                            throw new Error('Not implemented yet: "TaggedTemplateExpression" case');
                        }
                        case 'ThisExpression': {
                            throw new Error('Not implemented yet: "ThisExpression" case');
                        }
                        case 'UnaryExpression': {
                            throw new Error('Not implemented yet: "UnaryExpression" case');
                        }
                        case 'UpdateExpression': {
                            throw new Error('Not implemented yet: "UpdateExpression" case');
                        }
                        case 'YieldExpression': {
                            throw new Error('Not implemented yet: "YieldExpression" case');
                        }
                        case 'JSXElement': {
                            throw new Error('Not implemented yet: "JSXElement" case');
                        }
                        case 'JSXFragment': {
                            throw new Error('Not implemented yet: "JSXFragment" case');
                        }
                        case 'TSAsExpression': {
                            throw new Error('Not implemented yet: "TSAsExpression" case');
                        }
                        case 'TSSatisfiesExpression': {
                            throw new Error('Not implemented yet: "TSSatisfiesExpression" case');
                        }
                        case 'TSTypeAssertion': {
                            throw new Error('Not implemented yet: "TSTypeAssertion" case');
                        }
                        case 'TSNonNullExpression': {
                            throw new Error('Not implemented yet: "TSNonNullExpression" case');
                        }
                        case 'TSInstantiationExpression': {
                            throw new Error('Not implemented yet: "TSInstantiationExpression" case');
                        }
                        case 'V8IntrinsicExpression': {
                            throw new Error('Not implemented yet: "V8IntrinsicExpression" case');
                        }
                        case 'MemberExpression': {
                            throw new Error('Not implemented yet: "MemberExpression" case');
                        }
                        default:
                            break;
                    }
                    break;
                }

                case 'BlockStatement': {
                    throw new Error('Not implemented yet: "BlockStatement" case');
                }
                case 'BreakStatement': {
                    throw new Error('Not implemented yet: "BreakStatement" case');
                }
                case 'ContinueStatement': {
                    throw new Error('Not implemented yet: "ContinueStatement" case');
                }
                case 'DebuggerStatement': {
                    throw new Error('Not implemented yet: "DebuggerStatement" case');
                }
                case 'DoWhileStatement': {
                    throw new Error('Not implemented yet: "DoWhileStatement" case');
                }
                case 'EmptyStatement': {
                    throw new Error('Not implemented yet: "EmptyStatement" case');
                }
                case 'ForInStatement': {
                    throw new Error('Not implemented yet: "ForInStatement" case');
                }
                case 'ForOfStatement': {
                    throw new Error('Not implemented yet: "ForOfStatement" case');
                }
                case 'ForStatement': {
                    throw new Error('Not implemented yet: "ForStatement" case');
                }
                case 'IfStatement': {
                    throw new Error('Not implemented yet: "IfStatement" case');
                }
                case 'LabeledStatement': {
                    throw new Error('Not implemented yet: "LabeledStatement" case');
                }
                case 'ReturnStatement': {
                    throw new Error('Not implemented yet: "ReturnStatement" case');
                }
                case 'SwitchStatement': {
                    throw new Error('Not implemented yet: "SwitchStatement" case');
                }
                case 'ThrowStatement': {
                    throw new Error('Not implemented yet: "ThrowStatement" case');
                }
                case 'TryStatement': {
                    throw new Error('Not implemented yet: "TryStatement" case');
                }
                case 'WhileStatement': {
                    throw new Error('Not implemented yet: "WhileStatement" case');
                }
                case 'WithStatement': {
                    throw new Error('Not implemented yet: "WithStatement" case');
                }
                case 'FunctionDeclaration': {
                    throw new Error('Not implemented yet: "FunctionDeclaration" case');
                }
                case 'FunctionExpression': {
                    throw new Error('Not implemented yet: "FunctionExpression" case');
                }
                case 'TSDeclareFunction': {
                    throw new Error('Not implemented yet: "TSDeclareFunction" case');
                }
                case 'TSEmptyBodyFunctionExpression': {
                    throw new Error('Not implemented yet: "TSEmptyBodyFunctionExpression" case');
                }
                case 'ClassDeclaration': {
                    throw new Error('Not implemented yet: "ClassDeclaration" case');
                }
                case 'ClassExpression': {
                    throw new Error('Not implemented yet: "ClassExpression" case');
                }
                case 'TSTypeAliasDeclaration': {
                    throw new Error('Not implemented yet: "TSTypeAliasDeclaration" case');
                }
                case 'TSInterfaceDeclaration': {
                    throw new Error('Not implemented yet: "TSInterfaceDeclaration" case');
                }
                case 'TSEnumDeclaration': {
                    throw new Error('Not implemented yet: "TSEnumDeclaration" case');
                }
                case 'TSModuleDeclaration': {
                    throw new Error('Not implemented yet: "TSModuleDeclaration" case');
                }
                case 'TSImportEqualsDeclaration': {
                    throw new Error('Not implemented yet: "TSImportEqualsDeclaration" case');
                }
                case 'ExportAllDeclaration': {
                    throw new Error('Not implemented yet: "ExportAllDeclaration" case');
                }
                case 'ExportDefaultDeclaration': {
                    throw new Error('Not implemented yet: "ExportDefaultDeclaration" case');
                }
                case 'ExportNamedDeclaration': {
                    throw new Error('Not implemented yet: "ExportNamedDeclaration" case');
                }
                case 'TSExportAssignment': {
                    throw new Error('Not implemented yet: "TSExportAssignment" case');
                }
                case 'TSNamespaceExportDeclaration': {
                    throw new Error('Not implemented yet: "TSNamespaceExportDeclaration" case');
                }
                default:
                    break;
            }
        }
    }

    return result;
}
