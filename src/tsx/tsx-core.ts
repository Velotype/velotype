// The public API of Velotype core, re-exported by the jsx-runtime entry points

// Registers this Velotype instance with the devtools hook
import "./devtools-hook.ts"

export type {
    AnchorElement,
    BasicTypes,
    ChildrenAttr,
    EmptyAttrs,
    HasVtKey,
    IdAttr,
    RenderableElements,
    StylePassthroughAttrs,
    Type,
    TypeConstructor,
} from "./types.ts"
export { Component, type FunctionComponent } from "./component.ts"
export {
    RenderBasic,
    RenderObject,
    type RenderObjectHandleUpdateType,
    type RenderObjectRenderFunctionType,
    UpdateHandlerLink,
} from "./render-object.ts"
export { RenderObjectArray, type RenderObjectArrayOptions } from "./render-object-array.ts"
export { RenderTemplateArray, type RenderTemplateArrayOptions } from "./render-template-array.ts"
export { passthroughAttrsToElement, setAttrsOnElement } from "./attributes.ts"
export { createElement, createFragment, getComponent } from "./create-element.ts"
export { replaceElementWithRoot } from "./mounting.ts"
export {
    emitEvent,
    registerEventListener,
    removeEventListeners,
    VelotypeEvent,
    type VelotypeEventListener,
} from "./event-bus.ts"
export { setStylesheet, type StyleSection } from "./stylesheet.ts"
export {
    HTML,
    type HTMLAttrsType,
    MATH,
    type MATHAttrsType,
    SVG,
    type SVGAttrsType,
} from "./raw-components.ts"
