import type { CallExpression, Directive, Span, Statement, VariableDeclarator } from 'oxc-parser';

export interface WatchInfo {
    type: 'watch';
    content: Span;
    config?: Span;
    callback: Span;
    source: Span;
}

export function extractWatchers(body: (Statement | Directive)[]): WatchInfo[] {
    const parsedWatchers: WatchInfo[] = [];

    for (const statement of body) {
        if (statement.type === 'VariableDeclaration') {
            for (const declaration of statement.declarations) {
                if (declaration.init?.type === 'CallExpression') {
                    const { callee } = declaration.init;

                    if (callee.type === 'Identifier' && callee.name === 'watch') {
                        parsedWatchers.push(parseWatchDecleration(declaration));
                    }
                }
            }
        }
        else if (statement.type === 'ExpressionStatement' && statement.expression.type === 'CallExpression') {
            const { callee } = statement.expression;

            if (callee.type === 'Identifier' && callee.name === 'watch') {
                parsedWatchers.push(parseWatchExpression(statement.expression));
            }
        }
    }

    return parsedWatchers;
}

export function parseWatchExpression(expression: CallExpression): WatchInfo {
    const { arguments: args, start, end } = expression;
    const [source, callback, config] = args;

    return {
        type: 'watch',
        content: { start, end },
        source: {
            start: source.start,
            end: source.end,
        },
        callback: {
            start: callback.start,
            end: callback.end,
        },
        config: config
            ? {
                    start: config.start,
                    end: config.end,
                }
            : undefined,
    };
}

export function parseWatchDecleration(declaration: VariableDeclarator): WatchInfo {
    const { init, start, end } = declaration;

    if (init?.type === 'CallExpression') {
        const { arguments: args } = init;
        const [source, callback, config] = args;

        return {
            type: 'watch',
            content: { start, end },
            source: {
                start: source.start,
                end: source.end,
            },
            callback: {
                start: callback.start,
                end: callback.end,
            },
            config: config
                ? {
                        start: config.start,
                        end: config.end,
                    }
                : undefined,
        };
    }
    else {
        throw new Error('Error');
    }
}
