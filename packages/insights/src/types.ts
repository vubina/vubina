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
 * Information from Vue file
 */
export interface VueFile {
    path: string;
    content: string;
    fileName: string;
    meta: {
        size: number;
        modifiedAt: Date;
    };
}

/**
 * Aggregated insight for one Vue file
 */
export interface VueFileInfo {
    loc: number;
    template: TemplateInfo;
    styles: StyleInfo[];
    script?: ScriptInfo;
    customBlocks: number;
}

/**
 * Information extented from VueFileInfo and VueFile
 */
export interface VueFileInsights extends VueFileInfo, VueFile {}
