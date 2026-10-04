// Every top-level variable of Velotype core, kept together so that the bundle declares them in one statement

import type { InternalComponent } from "./component.ts"
import type { VelotypeEventListener } from "./event-bus.ts"
import type { MultiRenderable } from "./render-object.ts"
import type { StyleSection } from "./stylesheet.ts"
import type { WithComponent } from "./with-component.ts"

// ------- Console -------

/** console.warn() with a "vt:" prefix - used for JS minification */
export const consoleWarn = console.warn.bind(console, "vt:")

/** console.error() with a "vt:" prefix - used for JS minification */
export const consoleError = console.error.bind(console, "vt:")

// ------- Element templates -------

/** Template for RenderBasic's <span style="display:contents;"> */
export const displayContentsSpan = styledTemplate('span', 'display:contents;')
/** Template for wrapper <div style="display:contents;"> elements */
export const displayContentsDiv = styledTemplate('div', 'display:contents;')
/** Template for hidden <div style="display:none;"> elements */
export const displayNoneDiv = styledTemplate('div', 'display:none;')

/** String "div" */
export const divTag = 'div'

/** Reused by defineLockedProperty() instead of allocating a descriptor per call */
export const lockedDescriptor: PropertyDescriptor = {
    value: undefined,
    writable: false,
    configurable: false,
    enumerable: false
}

// ------- Attributes -------

/** Cache of style setter checks by key, all style objects share one prototype */
export const styleSetterCache = new Map<string, boolean>()

/** Cache of hasSetterInPrototypeChain() results per prototype */
export const prototypeSetterCache = new Map<object, Map<string, boolean>>()

/** Matches uppercase letters, shared so the RegExp is not re-created per call */
export const upperCaseRegExp = /[A-Z]/g

// ------- DOM references -------

/** Map of DOM keys to Velotype Component references */
export const domReferences: Map<number, InternalComponent | MultiRenderable | WithComponent> = new Map<number, InternalComponent | MultiRenderable | WithComponent>()

/** Property that stores an element's domKey (DOM -> Component binding) */
export const domKeyProperty = Symbol()

/** The InternalComponent of each Component */
export const internalComponentProperty = Symbol()

// ------- Event bus -------

/** Velotype Event bus - Forward map listeningKey -> vtKey -> listeners */
export const listenersF: Map<string, Map<number, VelotypeEventListener[]>> = new Map<string,Map<number,VelotypeEventListener[]>>()
/** Velotype Event bus - Reverse map vtKey -> listeningKey -> listeners */
export const listenersR: Map<number, Map<string, VelotypeEventListener[]>> = new Map<number,Map<string,VelotypeEventListener[]>>()

// ------- Styles -------

/** Map of style keys to ensure each style key is only mounted once */
export const styleSectionMounted: Map<string, StyleSection> = new Map<string, StyleSection>()

// ------- Mutable state -------

/** Values that change after load, kept on one object since modules cannot assign to imported variables */
export const vtState: {
    /** The next key to use for DOM bindings */
    k: number
    /** Counts listener removals, so that emitEvent() only checks for removed listeners after one has been removed */
    r: number
    /** The most recent prototype looked up in prototypeSetterCache */
    p: object | undefined
    /** The prototypeSetterCache entry of the most recent prototype */
    s: Map<string, boolean> | undefined
} = {
    k: 1,
    r: 0,
    p: undefined,
    s: undefined,
}

// ------- Devtools -------

/**
 * Public, type-safe shape of `__vtAppMetadata`
 */
export type VtAppMetadata = {
    /** The version of this Velotype instance */
    readonly version: string
    /** Property on each bound element that holds its DOM key */
    readonly domKeyProperty: symbol
    /** Map of DOM keys to Velotype Component references */
    readonly domReferences: ReadonlyMap<number, unknown>
    /** Forward map listeningKey -> vtKey -> listeners */
    readonly listenersF: ReadonlyMap<string, ReadonlyMap<number, readonly VelotypeEventListener[]>>
    /** Reverse map vtKey -> listeningKey -> listeners */
    readonly listenersR: ReadonlyMap<number, ReadonlyMap<string, readonly VelotypeEventListener[]>>
    /** Map of style keys to ensure each style key is only mounted once */
    readonly styleSectionMounted: ReadonlyMap<string, StyleSection>
}

/**
 * App Metadata
 *
 * Read-only views of this Velotype instance's internal state, registered with the devtools hook
 *
 * Exported from `@velotype/velotype/devtools`, for debugging only
 */
export const __vtAppMetadata: VtAppMetadata = {
    /** The version of this Velotype instance */
    version: "0.2.3",

    // ------- For Velotype Core -------
    /** Property on each bound element that holds its DOM key */
    domKeyProperty: domKeyProperty,
    /** Map of DOM keys to Velotype Component references */
    domReferences: domReferences,

    // ------- For Event Bus -------
    /** Forward map listeningKey -> vtKey -> listeners */
    listenersF: listenersF,
    /** Reverse map vtKey -> listeningKey -> listeners */
    listenersR: listenersR,

    // ------- For Styles -------
    /** Map of style keys to ensure each style key is only mounted once */
    styleSectionMounted: styleSectionMounted,

}

/** An element with a style attribute, used as a template for cloneNode() - declared last so that it does not split the variables above */
function styledTemplate(tag: string, style: string): HTMLElement {
    const element = document.createElement(tag)
    element.style.cssText = style
    return element
}
