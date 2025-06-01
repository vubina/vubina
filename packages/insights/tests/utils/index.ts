/**
 * Returns a section of a string.
 *
 * @param {string} content
 * @param {T} data
 * the data has start and end property for slicing content
 * @return sliced content
 */
export function sliceContent<T extends { start: number; end: number }>(content: string, data: T): string {
    return content.slice(data.start, data.end);
}
