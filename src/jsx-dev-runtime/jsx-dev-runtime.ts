// deno-lint-ignore-file no-explicit-any

import { createElement, createFragment } from "../tsx/tsx-core.ts"

import type { AnchorElement, BasicTypes, ChildrenTypes, ChildTypes } from "../tsx/tsx-core.ts"
export type { AnchorElement, BasicTypes, ChildrenTypes, ChildTypes }

/**
 * Represents the Source passed to jsxDEV on element creation
 */
export type Source = {
    /** The originating file name */
    fileName: string,
    /** The originating line number */
    lineNumber: number,
    /** The originating column number */
    columnNumber: number
}

/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function jsxDEV(tag: any, attrs: any, key: string | undefined, _isStaticChildren: boolean, _source: Source, _parentThis: any): ChildrenTypes[] | AnchorElement | BasicTypes {
    // Pull children out of attrs
    const children = attrs.children
    delete attrs.children

    // Reattach key into attrs if defined
    if (key !== undefined) {
        attrs.key = key
    }
    return createElement(tag, attrs, children)
}

/**
 * Create an fragment `<></>` (which just propagates an array of children[])
 */
export const Fragment: (_attrs: Readonly<any>, ...children: ChildrenTypes[]) => ChildrenTypes[] = createFragment

// Export the JSX namespace for JSX type checking
import type { JSXInternal } from "../jsx-types/jsx-types.d.ts"
export type { JSXInternal as JSX }
