// deno-lint-ignore-file no-explicit-any

import { h, f } from "../tsx/tsx-core.ts"

import type { AnchorElement, BasicTypes, ChildrenTypes } from "../tsx/tsx-core.ts"

/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * \<tag attrOne={} attrTwo={}>{children}\</tag>
 */
export function jsx(tag: any, attrs: any, key?: string | undefined): ChildrenTypes[] | AnchorElement | BasicTypes {
    const children = attrs.children
    delete attrs.children
    if (key) {
        attrs.key = key
    }
    return h(tag, attrs, children)
}

// Velotype does not distinguish between static and dynamic children arrays
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * \<tag attrOne={} attrTwo={}>{children}\</tag>
 */
export const jsxs: (tag: any, attrs: any, key?: string | undefined) => ChildrenTypes[] | AnchorElement | BasicTypes = jsx

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
