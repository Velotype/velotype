// deno-lint-ignore-file no-explicit-any

import { h, f } from "../tsx/tsx-core.ts"

import type { AnchorElement, BasicTypes, ChildrenTypes } from "../tsx/tsx-core.ts"

type Source = {
    fileName: string,
    lineNumber: number,
    columnNumber: number
}

/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * \<tag attrOne={} attrTwo={}>{children}\</tag>
 */
export function jsxDEV(tag: any, attrs: any, key: string | undefined, _isStaticChildren: boolean, _source: Source, _this: any): ChildrenTypes[] | AnchorElement | BasicTypes {
    // Pull children out of attrs
    const children = attrs.children
    delete attrs.children

    // Reattach key into attrs if defined
    if (key !== undefined) {
        attrs.key = key
    }
    return h(tag, attrs, children)
}

/**
 * Create an fragment \<></> (which just propagates an array of children[])
 */
export const Fragment: (_attrs: Readonly<any>, ...children: ChildrenTypes[]) => ChildrenTypes[] = f

// Note: this is a test,.. don't think it works properly just yet
export declare namespace JSX {
    export interface IntrinsicElements {
        [tag: string]: any
    }
}
