import type { Argument, CallExpression, Span, VariableDeclarator } from 'oxc-parser';
import { normalizeSpace } from '../helpers/normalizeSpace';
import { sliceContent } from '../helpers/sliceContent';

export interface WatchInfo {
    type: 'watch';
    content: string;
    config?: Span;
    callback: Span;
    source: Span;
}

export function AnalyzeWatch(content: string, args: Argument[], start: number): WatchInfo {
    const source = args[0];
    const callbackFn = args[1];
    const config: Argument | undefined = args[2];

    return {
        content,
        callback: normalizeSpace(callbackFn, start),
        config: config
            ? normalizeSpace(config, start)
            : undefined,
        source: normalizeSpace(source, start),
        type: 'watch',
    };
}

export function AnalyzeWatchExpression(expression: CallExpression, content: string): WatchInfo {
    const { arguments: args, start } = expression;
    const watchContent = sliceContent(content, expression);

    return AnalyzeWatch(watchContent, args, start);
}

export function AnalyzeWatchDecleration(declaration: VariableDeclarator, content: string): WatchInfo {
    const { init, start } = declaration;
    const watchContent = sliceContent(content, declaration);

    if (init?.type === 'CallExpression') {
        return AnalyzeWatch(watchContent, init.arguments, start);
    }
    else {
        throw new Error('Error');
    }
}
