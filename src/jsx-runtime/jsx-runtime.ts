// deno-lint-ignore-file no-explicit-any

import { createElement, createFragment } from "../tsx/tsx-core.ts"

import type { AnchorElement, BasicTypes, ChildrenTypes, ChildTypes } from "../tsx/tsx-core.ts"
export type { AnchorElement, BasicTypes, ChildrenTypes, ChildTypes }

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
    return createElement(tag, attrs, children)
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
export const Fragment: (_attrs: Readonly<any>, ...children: ChildrenTypes[]) => ChildrenTypes[] = createFragment

// Export the JSX namespace for JSX type checking
import type { JSXInternal } from "../jsx-types/jsx-types.d.ts"
export type { JSXInternal as JSX }
