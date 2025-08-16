// deno-lint-ignore-file no-explicit-any

import {
    // Debugging access
    __vtAppMetadata,
    setDomKey,

    // Interfaces
    type MultiRenderable,
    type Mountable,
    type HasVtKey,
    type TypeConstructor,
    type Type,

    // Engine types
    type BasicTypes,
    type RenderableElements,
    type AnchorElement,
    type ChildTypes,
    type ChildrenTypes,
    type CSSProperties,

    // Core types
    type FunctionComponent,
    Component,
    type EmptyAttrs,
    type ChildrenAttr,
    UpdateHandlerLink,

    // Specialized
    RenderObject,
    type RenderObjectHandleUpdateType,
    type RenderObjectRenderFunctionType,
    RenderBasic,
    RenderObjectArray,
    type RenderObjectArrayOptions,

    // TSX integration
    createElement,
    createFragment,
    getComponent,

    // Event system
    VelotypeEvent,
    type VelotypeEventListener,
    appendRootComponentTo,
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
} from "../tsx/tsx-core.ts"

export {
    // Debugging access
    __vtAppMetadata,
    setDomKey,

    // Interfaces
    type MultiRenderable,
    type Mountable,
    type HasVtKey,
    type TypeConstructor,
    type Type,

    // Engine types
    type BasicTypes,
    type RenderableElements,
    type AnchorElement,
    type ChildTypes,
    type ChildrenTypes,
    type CSSProperties,

    // Core types
    type FunctionComponent,
    Component,
    type EmptyAttrs,
    type ChildrenAttr,
    UpdateHandlerLink,

    // Specialized
    RenderObject,
    type RenderObjectHandleUpdateType,
    type RenderObjectRenderFunctionType,
    RenderBasic,
    RenderObjectArray,
    type RenderObjectArrayOptions,

    // TSX integration
    createElement,
    createFragment,
    getComponent,

    // Event system
    VelotypeEvent,
    type VelotypeEventListener,
    appendRootComponentTo,
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
export function jsxDEV(tag: any, attrs: any, key: string | undefined, _isStaticChildren: boolean, source: Source, parentThis: any): ChildrenTypes[] | AnchorElement | BasicTypes {
    // Pull children out of attrs
    const children = attrs.children
    delete attrs.children

    // Reattach key into attrs if defined
    if (key !== undefined) {
        attrs.key = key
    }

    // Stash dev metadata
    attrs.__vt_source = source
    attrs.__vt_parentThis = parentThis

    return createElement(tag, attrs, children)
}

/**
 * Create an fragment `<></>` (which just propagates an array of children[])
 */
export const Fragment: (_attrs: Readonly<any>, ...children: ChildrenTypes[]) => ChildrenTypes[] = createFragment

// Export the JSX namespace for JSX type checking
import type { JSXInternal } from "../jsx-types/jsx-types.d.ts"
export type { JSXInternal as JSX }
