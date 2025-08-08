// deno-lint-ignore-file no-explicit-any

import { h, f } from "../tsx/tsx-core.ts"

import type { AnchorElement, BasicTypes, ChildrenTypes } from "../tsx/tsx-core.ts"

/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * \<tag attrOne={} attrTwo={}>{children}\</tag>
 */
export function jsx(tag: any, attrs: any, key?: string | undefined): ChildrenTypes[] | AnchorElement | BasicTypes {
    // Pull children out of attrs
    const children = attrs.children
    delete attrs.children

    // Reattach key into attrs if defined
    if (key !== undefined) {
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

// Note: this is a test,.. not sure if this variation will work properly just yet
import type { JSXInternal } from "../tsx/jsx-types.d.ts"
export type { JSXInternal as JSX }

// Note: this variation does work
//export declare namespace JSX {
//    export interface IntrinsicElements {
//        [tag: string]: any
//    }
//}
