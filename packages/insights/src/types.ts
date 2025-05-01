
/**
 * Information about the <template> block
 */
export interface TemplateInfo {
    exists: boolean;
    lang?: string;
}

/**
 * Information about each <style> block
 */
export interface StyleInfo {
    scoped: boolean;
    lang: string;
}

/**
 * Information extracted from the <script> block
 */
export interface ScriptInfo {
    setup: boolean;
    lang: string;
    content?: string;
    imports: number;
    refs: number;
    computeds: number;
    watches: number;
    props: number;
    emits: number;
    models: number;
}

/**
 * Aggregated insight for one Vue file
 */
export interface VueFileInsight {
    path: string;
    loc: number;
    template: TemplateInfo;
    styles: StyleInfo[];
    fileName: string;
    script?: ScriptInfo;
    customBlocks: number;
    metadata: {
        fileSize?: number;        // in bytes
        lastModified?: Date;
    };
}
