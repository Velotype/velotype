// deno-lint-ignore-file no-explicit-any

import {
    // Interfaces
    type HasVtKey,
    type TypeConstructor,
    type Type,

    // Engine types
    type BasicTypes,
    type RenderableElements,
    type AnchorElement,

    // Core types
    type FunctionComponent,
    Component,
    type EmptyAttrs,
    type IdAttr,
    type ChildrenAttr,
    type StylePassthroughAttrs,

    // Specialized
    RenderObject,
    UpdateHandlerLink,
    type RenderObjectHandleUpdateType,
    type RenderObjectRenderFunctionType,
    RenderBasic,
    RenderObjectArray,
    type RenderObjectArrayOptions,
    RenderTemplateArray,
    type RenderTemplateArrayOptions,

    // TSX integration
    setAttrsOnElement,
    passthroughAttrsToElement,
    createElement,
    createFragment,
    getComponent,

    // Event system
    VelotypeEvent,
    type VelotypeEventListener,
    emitEvent,
    registerEventListener,
    removeEventListeners,

    // Style handling
    type StyleSection,

    // Raw HTML support helpers
    HTML,
    type HTMLAttrsType,
    MATH,
    type MATHAttrsType,
    SVG,
    type SVGAttrsType,
} from "../tsx/tsx-core.ts"
import { hotTag, replaceElementWithRoot, setStylesheet, trackFunctionOutput } from "../hmr/hmr.ts"

export {
    // Interfaces
    type HasVtKey,
    type TypeConstructor,
    type Type,

    // Engine types
    type BasicTypes,
    type RenderableElements,
    type AnchorElement,

    // Core types
    type FunctionComponent,
    Component,
    type EmptyAttrs,
    type IdAttr,
    type ChildrenAttr,
    type StylePassthroughAttrs,

    // Specialized
    RenderObject,
    UpdateHandlerLink,
    type RenderObjectHandleUpdateType,
    type RenderObjectRenderFunctionType,
    RenderBasic,
    RenderObjectArray,
    type RenderObjectArrayOptions,
    RenderTemplateArray,
    type RenderTemplateArrayOptions,

    // TSX integration
    setAttrsOnElement,
    passthroughAttrsToElement,
    createElement,
    createFragment,
    getComponent,

    // Event system
    VelotypeEvent,
    type VelotypeEventListener,
    replaceElementWithRoot,
    emitEvent,
    registerEventListener,
    removeEventListeners,

    // Style handling
    type StyleSection,
    setStylesheet,

    // Raw HTML support helpers
    HTML,
    type HTMLAttrsType,
    MATH,
    type MATHAttrsType,
    SVG,
    type SVGAttrsType,
}

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
export function jsxDEV(tag: any, attrs: any, key: string | undefined, _isStaticChildren: boolean, source: Source, _parent: any): RenderableElements[] | AnchorElement | BasicTypes {
    // Pull children out of attrs, copying attrs only when it has children
    let children
    if ('children' in attrs) {
        ({children, ...attrs} = attrs)
    }

    // Reattach key into attrs if defined
    if (key !== undefined) {
        attrs.key = key
    }

    // Stash source metadata into attrs
    attrs.__vt_source_fileName = source.fileName
    attrs.__vt_source_lineNumber = source.lineNumber
    attrs.__vt_source_columnNumber = source.columnNumber

    // In development, elements are created from the latest version of a component (see hmr.ts)
    const latestTag = hotTag(tag, source && source.fileName)
    const element = createElement(latestTag, attrs, children)
    // createElement() passes children to a function component as an array
    trackFunctionOutput(latestTag, element, attrs, [children])
    return element
}

/**
 * Create an fragment `<></>` (which just propagates an array of children[])
 */
export const Fragment: (_attrs: Readonly<any>, ...children: RenderableElements[]) => RenderableElements[] = createFragment

// Export the JSX namespace for JSX type checking
import type { JSXInternal } from "../jsx-types/jsx-types.d.ts"
export type { JSXInternal as JSX }

// Export all other jsx-types
export type * from "../jsx-types/dom-types.d.ts"
