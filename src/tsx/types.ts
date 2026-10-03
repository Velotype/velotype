// deno-lint-ignore-file no-explicit-any

// Public types shared across Velotype

import type { StyleAttrType } from "../jsx-types/dom-types.d.ts"
import type { Component } from "./component.ts"
import type { RenderObject } from "./render-object.ts"

/**
 * These are the types that can be used as a Component's anchor, they can
 * register a componentKey (aka a vtKey) and are mountable/unmountable
 */
export type AnchorElement = HTMLElement | SVGSVGElement | MathMLElement

/** Basic primitives that are renderable directly */
export type BasicTypes = string | bigint | number | boolean

/** Types that can be returned from Component.render() and FunctionComponent() */
export type RenderableElements = AnchorElement | Component<any> | RenderObject<any,any> | RenderableElements[] | BasicTypes | Text | null | undefined | void

/** Type used to represent a constructor function for a Class */
export type TypeConstructor<T> = new (...args: any[]) => T

/** Type used to represent abstract Class passing */
export interface Type<T> extends TypeConstructor<T>{}

/** Type used to represent that no Attrs are accepted for a Component */
export type EmptyAttrs = Record<string | number | symbol, never>

/** Type used to represent pass-through id to an underlying Element of a Component */
export type IdAttr = {
    /** An id to pass-through to the underlying Element of this Component */
    id?: string
}

/** Type used to represent that children are accepted by a Component */
export type ChildrenAttr = {
    /** A collection of RenderableElements to place as children of this Component */
    children?: RenderableElements
}

/** Type used to represent pass-through style controls by a Component to an underlying Element */
export type StylePassthroughAttrs = {
    /** A string of CSS class names to pass-through to the underlying Element of this Component */
    class?: string
    /** CSS styles to pass-through to the underlying Element of this Component */
    style?: StyleAttrType
}

/**
 * An interface for objects that can hold componentKeys
 */
export interface HasVtKey {
    /**
     * A unique key per instance of each Velotype renderable object
     * 
     * These keys are read-only and set by Velotype Core on object construction and are not overridable
     */
    readonly vtKey: number
}
