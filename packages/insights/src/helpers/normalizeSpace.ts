import type { Span } from 'oxc-parser';

export function normalizeSpace<T extends Span>(content: T, offset: number): Span {
    return {
        start: content.start - offset,
        end: content.end - offset,
    };
}
