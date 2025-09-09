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

    // Core types
    type FunctionComponent,
    Component,
    type EmptyAttrs,
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

    // TSX integration
    setAttrsOnElement,
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

    // Core types
    type FunctionComponent,
    Component,
    type EmptyAttrs,
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

    // TSX integration
    setAttrsOnElement,
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
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function jsx(tag: any, attrs: any, key?: string | undefined): RenderableElements[] | AnchorElement | BasicTypes {
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
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 * 
 * Note: Velotype does not distinguish between static and dynamic children arrays so jsx and jsxs are identical
 */
export const jsxs: (tag: any, attrs: any, key?: string | undefined) => RenderableElements[] | AnchorElement | BasicTypes = jsx

/**
 * Create an fragment `<></>` (which just propagates an array of children[])
 */
export const Fragment: (_attrs: Readonly<any>, ...children: RenderableElements[]) => RenderableElements[] = createFragment

// Export the JSX namespace for JSX type checking
import type { JSXInternal } from "../jsx-types/jsx-types.d.ts"
export type { JSXInternal as JSX }

// Export all other jsx-types
export type * from "../jsx-types/dom-types.d.ts"
