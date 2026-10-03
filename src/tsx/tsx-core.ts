// deno-lint-ignore-file no-explicit-any

import type { BubblingEventName, HTMLAttributes, StyleAttrType } from "../jsx-types/dom-types.d.ts"

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
 * Convinence function to passthrough commonly passed attrs onto an element
 * 
 * Will set:
 * * `id`
 * * `class`
 * * `style`
 */
export function passthroughAttrsToElement<T extends HTMLElement>(element: T, attrs: IdAttr & StylePassthroughAttrs): T {
    if (attrs.id) {
        setAttributeHelper(element, "id", attrs.id)
    }
    if (attrs.class) {
        const elementClass = element.getAttribute("class")
        setAttributeHelper(element, "class", elementClass ? elementClass + " " + attrs.class : attrs.class)
    }
    if (attrs.style) {
        setAttrsOnElement(element, {style: attrs.style})
    }
    return element
}

/** console.warn() with a "vt:" prefix - used for JS minification */
const consoleWarn = console.warn.bind(console, "vt:")

/** console.error() with a "vt:" prefix - used for JS minification */
const consoleError = console.error.bind(console, "vt:")

/** An element with a style attribute, used as a template for cloneNode() */
function styledTemplate(tag: string, style: string): HTMLElement {
    const element = document.createElement(tag)
    element.style.cssText = style
    return element
}
/** Template for RenderBasic's <span style="display:contents;"> */
const displayContentsSpan = styledTemplate('span', 'display:contents;')
/** Template for wrapper <div style="display:contents;"> elements */
const displayContentsDiv = styledTemplate('div', 'display:contents;')
/** Template for hidden <div style="display:none;"> elements */
const displayNoneDiv = styledTemplate('div', 'display:none;')

/** String "div" */
const divTag = 'div'

/** Checks if something is an instanceof HTMLElement */
function instanceOfHTMLElement(something: any): something is HTMLElement {
    return something instanceof HTMLElement
}
/** Checks if something is an instanceof SVGSVGElement */
function instanceOfSVGSVGElement(something: any): something is SVGSVGElement {
    return something instanceof SVGSVGElement
}
/** Checks if something is an instanceof MathMLElement */
function instanceOfMathMLElement(something: any): something is MathMLElement {
    return something instanceof MathMLElement
}
/** Checks if something is an instanceof InternalComponent */
function instanceOfInternalComponent(something: any): something is InternalComponent {
    return something instanceof InternalComponent
}
/** Checks if something is an instanceof RenderObject */
function instanceOfRenderObject(something: any): something is RenderObject<any,any>  {
    return something instanceof RenderObject
}
/** Checks if something is an instanceof Component */
function instanceOfComponent(something: any): something is Component<any> {
    return something instanceof Component
}
/** Checks if something is an instanceof Text */
function instanceOfText(something: any): something is Text {
    return something instanceof Text
}
/** Checks if something is an instanceof WithComponent */
function instanceOfWithComponent(something: any): something is WithComponent {
    return something instanceof WithComponent
}

/** Checks if somthing is an instanceof any of the BasicTypes (string, bigint, number, boolean) */
function instanceOfBasicTypes(something: any): something is BasicTypes {
    if (typeof something === 'string' || typeof something === 'bigint' || typeof something === 'number' || typeof something === 'boolean') {
        return true
    }
    return false
}

/** Cache of style setter checks by key, all style objects share one prototype */
const styleSetterCache = new Map<string, boolean>()

/** Cache of hasSetterInPrototypeChain() results per prototype */
const prototypeSetterCache = new Map<object, Map<string, boolean>>()
/** The most recent prototype looked up in prototypeSetterCache, and its cache */
let lastSetterPrototype: object | undefined
let lastSetters: Map<string, boolean> | undefined

/** Determines if an `object` has a setter for `fieldName` in its prototype chain */
function hasSetterInPrototypeChain(object: any, fieldName: string): boolean {
    // Own properties are not cached
    if (Object.prototype.hasOwnProperty.call(object, fieldName)) {
        return hasSetterFrom(object, fieldName)
    }
    const prototype = Object.getPrototypeOf(object)
    // Consecutive calls are usually for the same element, so the last prototype's cache is kept at hand
    let setters = prototype === lastSetterPrototype ? lastSetters : prototypeSetterCache.get(prototype)
    if (!setters) {
        setters = new Map<string, boolean>()
        prototypeSetterCache.set(prototype, setters)
    }
    lastSetterPrototype = prototype
    lastSetters = setters
    let hasSetter = setters.get(fieldName)
    if (hasSetter === undefined) {
        hasSetter = hasSetterFrom(prototype, fieldName)
        setters.set(fieldName, hasSetter)
    }
    return hasSetter
}

/** Walks the prototype chain from `object` looking for a setter for `fieldName` */
function hasSetterFrom(object: any, fieldName: string): boolean {
    let currentObject = object
    while (currentObject) {
        const descriptor = Object.getOwnPropertyDescriptor(currentObject, fieldName)
        if (descriptor && (descriptor.set || descriptor.writable)) {
            return true // Setter found
        }
        currentObject = Object.getPrototypeOf(currentObject)
    }
    return false // No setter found in the prototype chain
}

/**
 * Call either setAttribute() of a setter on element (if defined)
 */
function setAttributeHelper(element: Element, name: string, value: any): void {
    if (hasSetterInPrototypeChain(element, name)) {
        // Detected property, set directly
        ;(element as any)[name] = value
    } else {
        // No property, set as an attribute
        element.setAttribute(name, value.toString())
    }
}

/**
 * Call either setAttribute() of a setter on element (if defined)
 * 
 * Specific to a boolean value to set as empty string when an attribute
 */
function setBooleanAttributeHelper(element: Element, name: string, value: boolean): void {
    if (hasSetterInPrototypeChain(element, name)) {
        // Detected property, set boolean type directly
        ;(element as any)[name] = value
    } else {
        // No property, set as an attribute
        if (name.startsWith('aria-') || name.startsWith('data-')) {
            // Always set the raw boolean attribute for aria- and data- attributes
            element.setAttribute(name, String(value))
        } else {
            // Boolean true gets set to empty string, boolean false does not get set
            if (value) {
                element.setAttribute(name, '')
            }
        }
    }
}


/** Call Object.defineProperty() to lock a property so that it cannot be modified later - used for JS minification */
function defineLockedProperty(object: any, key: string, value: any): void {
    lockedDescriptor.value = value
    Object.defineProperty(object, key, lockedDescriptor)
    lockedDescriptor.value = undefined
}
/** Reused by defineLockedProperty() instead of allocating a descriptor per call */
const lockedDescriptor: PropertyDescriptor = {
    value: undefined,
    writable: false,
    configurable: false,
    enumerable: false
}

/** Matches uppercase letters, shared so the RegExp is not re-created per call */
const upperCaseRegExp = /[A-Z]/g

/** Convert from lowerCamelCase to hypen-case */
function lowerCamelToHypenCase(text: string): string {
    return text.replace(upperCaseRegExp, char => '-' + char.toLowerCase())
}

/** Map of DOM keys to Velotype Component references */
const domReferences: Map<number, InternalComponent | MultiRenderable | WithComponent> = new Map<number, InternalComponent | MultiRenderable | WithComponent>()

/** The next key to use for DOM bindings */
let domNextKey: number = 1

/** Property that stores an element's domKey (DOM -> Component binding) */
const domKeyProperty = Symbol()

/** Set the domKey property on element */
function setDomKeyOn(element: Element, key: number): void {
    ;(element as any)[domKeyProperty] = key
}

/** Velotype Event bus - Forward map listeningKey -> vtKey -> listeners */
const listenersF: Map<string, Map<number, VelotypeEventListener[]>> = new Map<string,Map<number,VelotypeEventListener[]>>()
/** Velotype Event bus - Reverse map vtKey -> listeningKey -> listeners */
const listenersR: Map<number, Map<string, VelotypeEventListener[]>> = new Map<number,Map<string,VelotypeEventListener[]>>()

/** Represents a mounted CSS StyleSheet object */
export type StyleSection = {
    /** Created CSSStyleSheet object that got mounted */
    sheet: CSSStyleSheet
    /** Original CSS text used to create the sheet */
    text: string
    /** Unique key for this sheet */
    key: string
}

/** Map of style keys to ensure each style key is only mounted once */
const styleSectionMounted: Map<string, StyleSection> = new Map<string, StyleSection>()

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
    version: "0.2.1",

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

// ----------------------------------------------------------------------
//                DevTools hook (for the velodevtools extension)
// ----------------------------------------------------------------------

/** Per-instance metadata a Velotype instance exposes to the Velotype DevTools browser extension */
export type VelotypeDevtoolsInstanceMetadata = typeof __vtAppMetadata

/**
 * Shape of `globalThis.__VELOTYPE_DEVTOOLS_HOOK__`.
 *
 * Installed by whichever Velotype instance loads first on a page; every Velotype instance
 * (including that first one) then just calls `.register()` to add itself under its own id, so
 * multiple independently-bundled Velotype instances on the same page (e.g. micro-frontends, or
 * version skew across bundles) can coexist without colliding.
 */
export interface VelotypeDevtoolsHook {
    /** All Velotype instances registered on this page, keyed by a hook-assigned instance id */
    instances: Map<number, VelotypeDevtoolsInstanceMetadata>
    /** Register a Velotype instance with the hook, returns its assigned instance id */
    register: (metadata: VelotypeDevtoolsInstanceMetadata) => number
    /** Remove a previously registered instance */
    unregister: (instanceId: number) => void
}

/**
 * Type of `globalThis` augmented with the (possibly not-yet-installed) devtools hook.
 *
 * JSR does not support `declare global` augmentations in published packages (they can affect type
 * checking of other modules), so this is a local intersection type used only to type-check the
 * handful of reads/writes to `globalThis.__VELOTYPE_DEVTOOLS_HOOK__` below - it does not change
 * what any other module sees `globalThis`'s type as.
 */
type GlobalThisWithDevtoolsHook = typeof globalThis & {
    __VELOTYPE_DEVTOOLS_HOOK__?: VelotypeDevtoolsHook
}

/**
 * Get the current value of `globalThis.__VELOTYPE_DEVTOOLS_HOOK__`, typed.
 */
export function getDevtoolsHook(): VelotypeDevtoolsHook | undefined {
    return (globalThis as GlobalThisWithDevtoolsHook).__VELOTYPE_DEVTOOLS_HOOK__
}

/**
 * Install `globalThis.__VELOTYPE_DEVTOOLS_HOOK__` if no other Velotype instance has already
 * installed it on this page, then register this instance's `__vtAppMetadata` with it.
 *
 * Velotype only ever runs in a browser (see `@velotype/velossr` for server-side rendering), so
 * `globalThis` is always the `window` here - no environment check is needed.
 */
function installDevtoolsHook(): void {
    const g = globalThis as GlobalThisWithDevtoolsHook
    if (!g.__VELOTYPE_DEVTOOLS_HOOK__) {
        const instances = new Map<number, VelotypeDevtoolsInstanceMetadata>()
        let nextInstanceId = 1
        g.__VELOTYPE_DEVTOOLS_HOOK__ = {
            instances,
            register(metadata: VelotypeDevtoolsInstanceMetadata): number {
                instances.set(nextInstanceId, metadata)
                return nextInstanceId++
            },
            unregister(instanceId: number): void {
                instances.delete(instanceId)
            }
        }
    }
    g.__VELOTYPE_DEVTOOLS_HOOK__.register(__vtAppMetadata)
}
installDevtoolsHook()

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
//                             DOM handling
// ----------------------------------------------------------------------
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
/**
 * `domReferences.get(key)` - used for JS minification
 */
function getDOMreference(key: number): InternalComponent | MultiRenderable | WithComponent | undefined {
    return domReferences.get(key)
}
/**
 * Acquire a new componentKey to reference component and if (element) then set the domKey attribute
 */
function registerNewVtKey(component: InternalComponent | MultiRenderable | WithComponent, element?: AnchorElement): number {
    const componentKey = domNextKey++
    if (element) {
        setDomKeyOn(element, componentKey)
    }
    domReferences.set(componentKey, component)
    return componentKey
}
/**
 * Release the reference to this componentKey
 */
function releaseVtKey(vtKey: number): void {
    domReferences.delete(vtKey)
}
/**
 * Release the reference to this object's componentKey
 */
function releaseVtKeyObject(hasVtKey: HasVtKey): void {
    domReferences.delete(hasVtKey.vtKey)
    removeComponentListeners(hasVtKey)
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
//                             Velotype Core
// ----------------------------------------------------------------------

/**
 * Convert any valid ChildType into an AnchorElement (or undefined)
 */
function childToElement(child: RenderableElements): AnchorElement | undefined {
    if ((instanceOfBasicTypes(child) && child !== false) || instanceOfText(child)) {
        return createElement("span",null,child)
    } else if (child) {
        return renderableElementToElement(child)
    }
}
/**
 * Convert any valid ChildType into a Node (or undefined)
 */
function childToNode(child: RenderableElements): AnchorElement | Text | undefined {
    if (instanceOfBasicTypes(child) && child !== false) {
        return document.createTextNode(child.toString())
    } else if (instanceOfHTMLElement(child)) {
        return child
    } else if (instanceOfText(child)) {
        return child
    } else if (child) {
        return renderableElementToElement(child)
    }
}
/**
 * Convert a RenderableElement into an AnchorElement
 */
function renderableElementToElement(child: RenderableElements): AnchorElement {
    if (instanceOfHTMLElement(child) || instanceOfSVGSVGElement(child) || instanceOfMathMLElement(child)) {
        return child
    } else if (instanceOfRenderObject(child)) {
        return (child as RenderObjectInternals).rD()
    } else if (instanceOfComponent(child)) {
        // Get InternalComponent reference from Component's vtKey
        const component = getDOMreference(child.vtKey)
        if (component) {
            if (instanceOfInternalComponent(component)) {
                return component.e
            }
        }
    }
    // If TypeScript is working properly this case should never be hit since
    // we checked all of the case types above
    consoleError('Invalid child')
    return hiddenElement()
}
/**
 * Appends children to an HTMLElement (unwraps Arrays, generates new instance components for
 * RenderObjects, wraps BasicTypes in TextNodes)
 * 
 * @param parent HTMLElement to append to
 * @param child Children to append
 */
function appendChild(parent: HTMLElement | DocumentFragment, child: RenderableElements): void {
    if (Array.isArray(child)) {
        for (let i = 0; i < child.length; i++) {
            appendChild(parent, child[i])
        }
    } else {
        const element = childToNode(child)
        if (element) {
            parent.appendChild(element)
        }
    }
}

/**
 * Generates a new \<div> element that is hidden from the page
 * 
 * @returns `<div style="display:none;"/>`
 */
function hiddenElement(): HTMLElement {
    return displayNoneDiv.cloneNode() as HTMLDivElement
}

/**
 * Trigger a callback immediately (though after the event loop clears)
 * 
 * @param callback The function to trigger
 */
function vtSetImmediate(callback: () => void): void {
    // Promise.resolve() is faster than setTimeout(x,0) (uses a Microtask instead of a Task)
    // Also, per spec setTimeout may have a min of 4ms delay depending on the current nesting level
    // See:
    // -: https://www.youtube.com/watch?v=u1kqx6AenYw
    // -: https://www.trevorlasn.com/blog/setimmediate-vs-settimeout-in-javascript
    // -: https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
    Promise.resolve().then(callback)
}

/**
 * If a render operation returns a Component, RenderObject, or RenderBasic as a result of
 * render then it needs to be wrapped in another HTMLElement for rendering to work properly
 * 
 * @param element The raw rendered element
 * @returns The original element or a wrapped element (or a hidden element if element is falsey)
 */
function wrapElementIfNeeded(element: null | undefined): HTMLElement
function wrapElementIfNeeded(element: SVGSVGElement): AnchorElement
function wrapElementIfNeeded(element: MathMLElement): AnchorElement
function wrapElementIfNeeded(element: HTMLElement): HTMLElement
function wrapElementIfNeeded(element: AnchorElement): AnchorElement
function wrapElementIfNeeded(element: Component<any>): HTMLElement
function wrapElementIfNeeded(element: RenderObject<any,any>): HTMLElement
function wrapElementIfNeeded(element: Component<any> | RenderObject<any,any>): HTMLElement
function wrapElementIfNeeded(element: HTMLElement | Component<any> | RenderObject<any,any> | null | undefined): HTMLElement
function wrapElementIfNeeded(element: RenderableElements | null | undefined): AnchorElement
function wrapElementIfNeeded(element: RenderableElements | null | undefined): AnchorElement {
    if (element == null || element === false || element === "") {
        return hiddenElement()
    }
    // If a Component returns a Component or RenderObject as a result of render
    // then it needs to be wrapped in another HTMLElement for rendering to work properly
    if (instanceOfBasicTypes(element) || instanceOfComponent(element) || instanceOfRenderObject(element) || instanceOfText(element) || Array.isArray(element) || (element as any)[domKeyProperty] !== undefined) {
        const wrapper = displayContentsDiv.cloneNode() as HTMLDivElement
        appendChild(wrapper, element)
        return wrapper
    }
    return element
}

/**
 * The Velotype core view of an object that can render into multiple instance elements
 */
interface MultiRenderable {
    /** Unmount an instance element of this object */
    uK: (key: number) => void
    /** Mount this object */
    mount: () => void
    /** Render a new instance element of this object */
    rD: () => AnchorElement
}
/** The Velotype core view of a Component, including its protected members */
type ComponentInternals = Component<any> & Mountable & {render: (attrs: Readonly<any>, children: RenderableElements[]) => RenderableElements}
/** The Velotype core view of a RenderObject, including its protected members */
type RenderObjectInternals = RenderObject<any, any> & MultiRenderable & {unmount: () => void, sw: (other: RenderObject<any, any>) => void}
/**
 * The lifecycle methods that Velotype core calls on Components
 */
interface Mountable {
    /**
     * Mount is called just after a Component is attached to the DOM
     */
    mount: () => void

    /**
     * Unmount is called just before a Component is removed from the DOM
     */
    unmount: () => void
}

/**
 * Generic object to stash metadata when using a handleUpdate method in RenderObject
 */
export class UpdateHandlerLink<UpdateRefsType = any> {
    /** Reference to the rendered object */
    declare readonly result: RenderableElements
    /** Stashed references to make selected updates more performant */
    declare readonly updateRefs: UpdateRefsType
    /** Create a new UpdateHandlerLink */
    constructor(result: RenderableElements, updateRefs: UpdateRefsType) {
        this.result = result
        this.updateRefs = updateRefs
    }
}

/**
 * Advanced functionality used to more efficiently rerender instance elements in RenderObjects
 */
export type RenderObjectHandleUpdateType<DataType, UpdateRefsType = any> = (element: AnchorElement, updateRefs: UpdateRefsType, oldData: DataType, newData: DataType) => void

/**
 * Type for a renderFunction in a RenderObject
 * 
 * (currently only supports rendering to HTMLElements for RenderObjectArray)
 */
export type RenderObjectRenderFunctionType<DataType, UpdateRefsType = any> = (data: DataType, thisArg: RenderObject<DataType, UpdateRefsType>) => RenderableElements | UpdateHandlerLink<UpdateRefsType>

type RenderObjectElementsType<DataType, UpdateRefsType> = {
    /** element */
    e: AnchorElement
    /** renderFunction */
    rF: RenderObjectRenderFunctionType<DataType, UpdateRefsType>
    /** handleUpdate */
    hU?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
    /** updateRefs */
    uR?: UpdateRefsType
}

/**
 * An RenderObject is an efficient way of rendering Objects to potentially multiple HTMLElements
 * changes to the value of the underlying Data Object will propogate to all attached elements.
 * 
 * @template DataType The type of the underlying Data Object
 * @template UpdateRefsType An advanced capability of RenderObject to more efficiently re-render instance elements
 */
export class RenderObject<DataType, UpdateRefsType = any> implements HasVtKey {
    #data: DataType
    readonly #defaultRenderFunction: RenderObjectRenderFunctionType<DataType, UpdateRefsType>
    readonly #defaultHandleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
    /** The instance elements of this RenderObject, mapped by their vtKey */
    protected readonly es: Map<number, RenderObjectElementsType<DataType, UpdateRefsType>> = new Map<number, RenderObjectElementsType<DataType, UpdateRefsType>>()
    /** This RenderObject's vtKey */
    readonly vtKey: number = registerNewVtKey(this as unknown as RenderObjectInternals)
    /** VeloType - Render Object - {key} */
    readonly #listeningKey: string = `vt-ro-${this.vtKey}`
    // Created on first registerOnMount(), most RenderObjects never register any
    #onMounts?: Array<()=>void>
    #onUnmounts?: Array<()=>void>
    #mounted: boolean = false
    #emitOnChangeEvent() {
        emitEvent(this.#listeningKey, new VelotypeEvent(this,'onChange'))
    }
    /**
     * Create a new RenderObject
     * 
     * @param initialData the initial data to use to render this RenderObject with
     * @param defaultRenderFunction a function that renders a data value into an AnchorElement
     * @param defaultHandleUpdate advanced functionality used to highly optimize rendering on value updates
     */
    constructor(initialData: DataType,
        defaultRenderFunction?: RenderObjectRenderFunctionType<DataType, UpdateRefsType>,
        defaultHandleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
    ) {
        this.#data = initialData
        this.#defaultRenderFunction = defaultRenderFunction || hiddenElement
        this.#defaultHandleUpdate = defaultHandleUpdate
    }

    /**
     * Register an EventListener to receive an onChange event when the value of this RenderObject changes.
     * 
     * A RenderObject in a public field of a Component is released, with the listeners it owns, when that
     * Component unmounts. To share a RenderObject, pass it in attrs or keep it in a #private field.
     * 
     * @param listener the EventListener to register
     * @param options optional set of options
     * @returns this
     */
    registerOnChangeListener(listener: VelotypeEventListener, options?: {
        /** If specified then this eventListener will get removed on the lifecycle of the HasVtKey (defaults to the RenderObject's lifecycle) */
        hasVtKey?: HasVtKey,
        /** should an onChange event be emitted immediately upon registration? (default: false) */
        triggerOnRegistration?: boolean,
        /** delay (in ms) before this listener receives onChange, at most one per eventDispatchDelay (default: 0) */
        eventDispatchDelay?: number
    }): this {
        const owner: HasVtKey = (options && options.hasVtKey) || this
        const listeningKey: string = this.#listeningKey
        const delay: number = (options && options.eventDispatchDelay) || 0
        let timer: number = 0
        const listenerToRegister: VelotypeEventListener = delay > 0 ? (event) => {
            if (!timer) {
                timer = setTimeout(() => {
                    timer = 0
                    // Skip if removed or unmounted during the delay
                    if (isListenerRegistered(listeningKey, owner.vtKey, listenerToRegister)) {
                        listener(event)
                    }
                }, delay)
            }
        } : listener
        registerEventListener(owner, listeningKey, listenerToRegister)
        if (options && options.triggerOnRegistration) {
            vtSetImmediate(() => {this.#emitOnChangeEvent()})
        }
        return this
    }
    /**
     * Register a mount/unmount pair to be triggered when the Component that this RenderObject is created within gets mounted / unmounted
     * 
     * @param onMount callback to be triggered when the Component that this RenderObject is created within gets mounted
     * @param onUnmount callback to be triggered when the Component that this RenderObject is created within gets unmounted
     * @returns this
     */
    registerOnMount(onMount?: () => void | undefined, onUnmount?: () => void): this {
        if (onMount) {
            if (!this.#onMounts) {
                this.#onMounts = []
            }
            this.#onMounts.push(onMount)
        }
        if (onUnmount) {
            if (!this.#onUnmounts) {
                this.#onUnmounts = []
            }
            this.#onUnmounts.push(onUnmount)
        }
        return this
    }
    /**
     * Velotype internal function, called by Velotype core
     * 
     * Calls the registered onMounts
     */
    protected mount(): void {
        if (this.#mounted) {
            return
        }
        this.#mounted = true
        if (this.#onMounts) {
            this.#onMounts.forEach(onMount => {onMount()})
        }
    }
    /**
     * Velotype internal function, called by Velotype core
     * 
     * Calls the registered onUnmounts
     */
    protected unmount(): void {
        if (!this.#mounted) {
            return
        }
        this.#mounted = false
        if (this.#onUnmounts) {
            this.#onUnmounts.forEach(onUnmount => {onUnmount()})
        }
    }
    /** Get the current value of this RenderObject */
    get value(): DataType {
        return this.#data
    }
    /**
     * Set the current value of this RenderObject
     * 
     * Will trigger a rerender if (this.value != newData)
     */
    set value(newData: DataType) {
        this.set(newData)
    }
    /** Get the current value of this RenderObject */
    get(): DataType {
        return this.#data
    }
    /**
     * Set the current value of this RenderObject
     * 
     * Will trigger rerenderElements if (this.value != newData)
     */
    set(newData: DataType): void {
        if (this.#data !== newData) {
            this.rerenderElements(newData)
        }
    }
    /**
     * Force a rerender of existing elements and set value to newData
     * 
     * This method may need to be used in cases where this.value is a complex object
     * or other data structure that is manipulated in-place rather than reassigned.
     */
    rerenderElements(newData: DataType): void {
        // Rerender Elements
        this.es.forEach((element, key) => {
            if (element.hU && element.uR) {
                element.hU(element.e, element.uR, this.#data, newData)
            } else {
                const render = element.rF(newData, this)
                const isLink = render instanceof UpdateHandlerLink
                const newElement = wrapElementIfNeeded(childToElement(isLink ? render.result : render))
                setDomKeyOn(newElement, key)
                replaceElement(element.e, newElement)
                element.e = newElement
                element.uR = isLink ? render.updateRefs : undefined
            }
        })
        // Set data
        this.#data = newData
        // Trigger EventListeners (if set)
        if (listenersF.has(this.#listeningKey)) {
            this.#emitOnChangeEvent()
        }
    }
    /**
     * Velotype internal function, called by Velotype core
     * 
     * Unmounts the instance element of this RenderObject with key
     */
    protected uK(key: number): boolean {
        const element = this.es.get(key)
        if (element) {
            const componentKey: number | undefined = (element.e as any)[domKeyProperty]
            if (key === componentKey) {
                this.es.delete(key)
                releaseVtKey(key)
                return true
            } else {
                consoleError('Invalid state', key, componentKey, element)
                return false
            }
        } else {
            consoleError('Invalid unmountKey', key)
            return false
        }
    }
    /**
     * Velotype internal function, called by Velotype core
     * 
     * Renders a new instance element of this RenderObject using the
     * default renderFunction and default handleUpdate function
     */
    protected rD(): AnchorElement {
        return this.render(this.#defaultRenderFunction, this.#defaultHandleUpdate)
    }
    /**
     * Trigger rendering of this RenderObject and bind the created element to
     * the passed renderFunction and handleUpdate function
     */
    render(renderFunction: RenderObjectRenderFunctionType<DataType, UpdateRefsType>, handleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>): AnchorElement {
        const render = renderFunction(this.#data, this)
        const isLink = render instanceof UpdateHandlerLink
        const newElement = wrapElementIfNeeded(childToElement(isLink ? render.result : render))
        const componentKey = registerNewVtKey(this as unknown as RenderObjectInternals, newElement)
        this.es.set(componentKey, {
            e: newElement,
            rF: renderFunction,
            hU: handleUpdate,
            uR: isLink ? render.updateRefs : render as UpdateRefsType
        })
        return newElement
    }
    /**
     * Get the rendered elements of this RenderObject
     * 
     * THIS IS ADVANCED FUNCTIONALITY - use carefully
     */
    getElements(): AnchorElement[] {
        return Array.from(this.es.values(), e => e.e)
    }
    /**
     * Velotype internal function, called by RenderObjectArray
     * 
     * Swaps the positions of the instance elements of this RenderObject and other that share a parent
     */
    protected sw(other: RenderObject<any, any>): void {
        this.es.forEach(aInstance => {
            const aElement = aInstance.e
            const parent = aElement.parentNode
            if (parent) {
                other.es.forEach(bInstance => {
                    if (bInstance.e.parentNode === parent) {
                        swapSiblings(parent, aElement, bInstance.e)
                    }
                })
            }
        })
    }
    /**
     * Removes all instance elements that this RenderObject has generated
     */
    removeAll(): void {
        this.es.forEach((element, key) => {
            removeElement(element.e)
            releaseVtKey(key)
        })
        this.es.clear()
    }
}

/**
 * A specialization of an RenderObject when the DataType is a BasicType
 * 
 * The BasicTypes are string | number | bigint | boolean
 */
export class RenderBasic<DataType extends BasicTypes> extends RenderObject<DataType, Text> implements HasVtKey {
    /** Create a new RenderBasic */
    constructor(initialData: DataType) {
        super(initialData, (data: DataType) => {
            const text = document.createTextNode(data.toString())
            const span = displayContentsSpan.cloneNode() as HTMLSpanElement
            span.appendChild(text)
            return new UpdateHandlerLink(span, text)
        }, (_element: AnchorElement, text: Text, _oldData: DataType, newData: DataType) => {
            text.data = newData.toString()
        })
    }
    /**
     * Get the value of this RenderBasic as a String
     */
    getString(): string {
        return String(super.get())
    }
    /**
     * Set the value of this RenderBasic from a String
     */
    setString(newDataString: string): void {
        const data: DataType = super.get()
        if (typeof data === 'string') {
            this.set(newDataString as DataType)
        } else if (typeof data === 'bigint') {
            this.set((BigInt(newDataString)) as DataType)
        } else if (typeof data === 'number') {
            this.set((Number(newDataString)) as DataType)
        } else if (typeof data === 'boolean') {
            this.set((newDataString === "true") as DataType)
        }
    }
}

/**
 * A Velotype Function Component that can be used in .tsx files to render HTML Components.
 * Does not support mount and unmount lifecycle events.
 */
export type FunctionComponent<AttrsType> = (attrs: Readonly<AttrsType>, children: RenderableElements[]) => RenderableElements

/**
 * A Velotype Class Component that can be used in .tsx files to render HTML Components.
 * Supports unmount, render, mount lifecycle events.
 */
/** The InternalComponent of each Component */
const internalComponentProperty = Symbol()
/** Get the InternalComponent of component */
function internalComponentOf(component: Component<any>): InternalComponent {
    return (component as any)[internalComponentProperty]
}
/** The InternalComponent methods that back a Component's refresh() and child helper functions */
type ComponentHelperName = "f" | "q" | "w" | "t" | "y" | "u"
/** Get a Component's helper function, bound to its InternalComponent on first use */
function componentHelper(component: Component<any>, name: ComponentHelperName): any {
    const internal = internalComponentOf(component)
    const helpers = internal.b || (internal.b = {})
    return helpers[name] || (helpers[name] = internal[name].bind(internal))
}
export abstract class Component<AttrsType> implements HasVtKey {

    /** The attributes this Component was created with */
    declare readonly attrs: AttrsType

    /** The children this Component was created with */
    declare readonly children: RenderableElements[]

    /** constructor gets attrs and children */
    constructor(attrs: Readonly<AttrsType>, children: RenderableElements[]){
        this.attrs = attrs
        this.children = children
    }

    /**
     * Mount is called just after this Component is attached to the DOM.
     * 
     * May be overriden by a specific Component that extends Component
     */
    protected mount(): void {}

    /**
     * Unmount is called just before this Component is removed from the DOM.
     * 
     * May be overriden by a specific Component that extends Component
     */
    protected unmount(): void {}

    /**
     * Render is called when this Component needs to be materialized into Elements.
     * 
     * To be overriden by a specific Component that extends Component
     * @param {Readonly<AttrsType>} attrs The attrs for this Component
     * @param {RenderableElements[]} children Any children of this Component
     */
    protected abstract render(attrs: Readonly<AttrsType>, children: RenderableElements[]): RenderableElements

    /**
     * Trigger re-rendering of this Component and all child Components.
     * This will unmount and delete all child Components, then call
     * this.render() and consequently new and mount a fresh set of child Components.
     * 
     * Velotype Core creates this on first use, it is not overridable
     */
    get refresh(): () => void {
        return componentHelper(this, "f")
    }

    /**
     * A unique key per instance of each Component.
     * 
     * This is read-only and set by Velotype Core on Component construction
     */
    declare readonly vtKey: number

    /**
     * Replace a Child element with a newly constructed element
     * 
     * Velotype Core creates this on first use, it is not overridable
     * 
     * @param child a child element of this Component
     * @param newChild the element to replace with
     * @returns newElement when replacement is successful, otherwise returns child
     */
    get replaceChild(): (child: AnchorElement, newChild: RenderableElements) => AnchorElement {
        return componentHelper(this, "q")
    }

    /**
     * Append a newly constructed element to a child element
     * 
     * Velotype Core creates this on first use, it is not overridable
     * 
     * @param child a child element of this Component
     * @param toAppendChild the element to append
     * @returns boolean for if replacement was accepted (will reject if the input child element is not a child of this Component)
     */
    get appendToChild(): (child: HTMLElement, toAppendChild: RenderableElements) => boolean {
        return componentHelper(this, "w")
    }

    /**
     * Prepend a newly constructed element to a child element
     * 
     * Velotype Core creates this on first use, it is not overridable
     * 
     * @param child a child element of this Component
     * @param toPrependChild the element to prepend
     * @returns boolean for if replacement was accepted (will reject if the input child element is not a child of this Component)
     */
    get prependToChild(): (child: HTMLElement, toPrependChild: RenderableElements) => boolean {
        return componentHelper(this, "t")
    }

    /**
     * Replace the children of a child element
     * 
     * Velotype Core creates this on first use, it is not overridable
     * 
     * @param child a child element of this Component
     * @param toPrependElement the element to prepend
     * @returns boolean for if replacement was accepted (will reject if the input child element is not a child of this Component)
     */
    get replaceChildrenOfChild(): (child: HTMLElement, newChildren: RenderableElements[]) => boolean {
        return componentHelper(this, "y")
    }

    /**
     * Remove a child element
     * 
     * Velotype Core creates this on first use, it is not overridable
     * 
     * @param child a child element of this Component
     * @returns boolean for if removal was accepted (will reject if the input child element is not a child of this Component)
     */
    get removeChild(): (child: HTMLElement) => boolean {
        return componentHelper(this, "u")
    }
}

/**
 * Replace an element with a newElement
 * 
 * Note: this will detect if the element hasFocus and will set newElement.focus() if needed
 * 
 * @param includeRoot also unmount element and mount newElement, not only their children
 */
function replaceElement(element: AnchorElement, newElement: AnchorElement, includeRoot?: boolean): AnchorElement {
    const isFocused = document.activeElement == element && document.hasFocus()
    if (includeRoot) {
        unmountComponentElement(element)
    } else if (instanceOfHTMLElement(element)) {
        unmountComponentElementChildren(element)
    }
    element.replaceWith(newElement)
    if (includeRoot) {
        mountComponentElement(newElement)
    } else if (instanceOfHTMLElement(newElement)) {
        mountComponentElementChildren(newElement)
    }
    if (isFocused) {
        newElement.focus()
    }
    return newElement
}
/**
 * Appends a toAppendElement to an element and will mount the appended toAppendElement
 */
function appendElement(element: AnchorElement, toAppendElement: AnchorElement): void {
    element.appendChild(toAppendElement)
    mountComponentElement(toAppendElement)
}
/**
 * Prepends a toPrependElement to an element and will mount the prepended toPrependElement
 */
function prependElement(element: HTMLElement, toPrependElement: AnchorElement): void {
    element.prepend(toPrependElement)
    mountComponentElement(toPrependElement)
}
/**
 * Replaces all children of a given element
 * 
 * Will unmount the old children, replaceChildren(...newChildren), then mount the newChildren
 */
function replaceChildren(element: HTMLElement, newChildren: AnchorElement[]): void {
    unmountComponentElementChildren(element)
    element.replaceChildren(...newChildren)
    mountComponentElementChildren(element)
}
/**
 * Will unmount an element and then `.remove()` it
 */
function removeElement(element: AnchorElement): void {
    unmountComponentElement(element)
    element.remove()
}

/**
 * Internal Velotype Component object
 */
class InternalComponent {

    constructor(component: Component<any>, attrs: Readonly<any>, children: RenderableElements[]) {
        this.c = component
        this.a = attrs
        this.h = children

        // Assign this Component's componentKey
        this.k = registerNewVtKey(this)

        // Set locked Component properties so that they cannot be modified later
        defineLockedProperty(component, "vtKey", this.k)
        ;(component as any)[internalComponentProperty] = this

        // Initial render of this component
        this.e = componentRender(this, this.a, this.h)
    }

    /**
     * Stashes the Velotype Component defined by the user
     */
    declare readonly c: Component<any>

    /**
     * Stashes a reference to the root AnchorElement of this Component.
     */
    declare e: AnchorElement

    /**
     * Stashes the Component vtKey for this Component
     */
    declare readonly k: number

    /** The Component's refresh() and child helper functions, created on first use */
    declare b?: {[name: string]: any}

    /**
     * If this Component is currently mounted
     */
    m: boolean = false

    /**
     * Stashes the attrs for this Component
     */
    declare readonly a: Readonly<any>

    /**
     * Stashes the children for this Component
     */
    declare readonly h: RenderableElements[]

    /**
     * Trigger unmount for this Component's children, then re-render
     * this Component and then mount new children.
     */
    f(): void {
        this.e = replaceElement(this.e, componentRender(this, this.a, this.h))
    }

    /**
     * replaceChild()
     */
    q(child: AnchorElement, newChild: RenderableElements): AnchorElement {
        if (this.e.contains(child)) {
            return replaceElement(child, renderableElementToElement(newChild), true)
        } else {
            return child
        }
    }

    /**
     * appendToChild()
     */
    w(child: HTMLElement, toAppend: RenderableElements): boolean {
        if (this.e.contains(child)) {
            appendElement(child, renderableElementToElement(toAppend))
            return true
        } else {
            return false
        }
    }
    /**
     * prependToChild()
     */
    t(child: HTMLElement, toPreppend: RenderableElements): boolean {
        if (this.e.contains(child)) {
            prependElement(child, renderableElementToElement(toPreppend))
            return true
        } else {
            return false
        }
    }
    /**
     * replaceChildrenOfChild()
     */
    y(child: HTMLElement, newChildren: RenderableElements[]): boolean {
        if (this.e.contains(child)) {
            replaceChildren(child, newChildren.map(c=>renderableElementToElement(c)))
            return true
        } else {
            return false
        }
    }
    /**
     * removeChild()
     */
    u(child: AnchorElement): boolean {
        if (this.e.contains(child)) {
            removeElement(child)
            return true
        } else {
            return false
        }
    }
    
}

/**
 * Traverse the children of element and call callback for any element that has a componentKey
 * with the linked InternalComponent | MultiRenderable
 * 
 * @param element the element to search through
 * @param callback the callback to trigger
 */
function traverseElementChildren(element: Element, callback: (component: InternalComponent | MultiRenderable | WithComponent, key: number) => void): void {
    if (instanceOfHTMLElement(element) || instanceOfSVGSVGElement(element) || instanceOfMathMLElement(element)) {
        let child = element.firstElementChild
        while (child) {
            traverseElementChildren(child, callback)
            const key: number | undefined = (child as any)[domKeyProperty]
            if (key) {
                const component = getDOMreference(key)
                if (component) {
                    callback(component, key)
                }
            }
            child = child.nextElementSibling
        }
    }
}

/**
 * Call `.mount()` on linked Components
 */
function mountComponentElementHelper(component: InternalComponent | MultiRenderable | WithComponent, _key: number): void {
    if (instanceOfInternalComponent(component)) {
        // component: InternalComponent
        if (component.m) {
            return
        }
        component.m = true
        // Mount the main Component
        ;(component.c as ComponentInternals).mount()
        // Iterate component fields and trigger their mounts
        Object.values(component.c).forEach(enumberableValue => {
            if (instanceOfRenderObject(enumberableValue)) {
                (enumberableValue as RenderObjectInternals).mount()
            }
        })
    } else if (instanceOfWithComponent(component)) {
        // component: WithComponent
        component.mount()
    } else {
        // component: MultiRenderable
        component.mount()
    }
}
/**
 * Mount this element and all children (if element is connected to the DOM)
 */
function mountComponentElement(element: AnchorElement): void {
    if (!element.isConnected) {
        return
    }
    if (instanceOfHTMLElement(element)) {
        mountComponentElementChildren(element)
    }
    const key: number | undefined = (element as any)[domKeyProperty]
    if (key) {
        const component = getDOMreference(key)
        if (component) {
            mountComponentElementHelper(component, key)
        }
    }
}
/**
 * Mount the children of this element (if element is connected to the DOM)
 */
function mountComponentElementChildren(element: HTMLElement): void {
    if (!element.isConnected) {
        return
    }
    traverseElementChildren(element, mountComponentElementHelper)
}
/**
 * Call `.unmount()` on linked Components (if mounted) and release vtKeys
 */
function unmountComponentElementHelper(component: InternalComponent | MultiRenderable | WithComponent, key: number): void {
    if (instanceOfInternalComponent(component)) {
        // component: InternalComponent
        removeComponentListeners(component.c)
        // Unmount the main Component, only if it was mounted
        if (component.m) {
            component.m = false
            ;(component.c as ComponentInternals).unmount()
        }
        // Iterate component fields and trigger their unmounts
        Object.values(component.c).forEach(enumberableValue => {
            if (instanceOfRenderObject(enumberableValue)) {
                (enumberableValue as RenderObjectInternals).unmount()
                releaseVtKeyObject(enumberableValue)
            } else if (instanceOfComponent(enumberableValue)) {
                releaseVtKeyObject(enumberableValue)
            }
        })
        // Release the Component's vtKey
        releaseVtKey(component.k)
    } else if (instanceOfWithComponent(component)) {
        // component: WithComponent
        component.unmount()
        releaseVtKey(component.k)
    } else {
        // component: MultiRenderable
        component.uK(key)
    }
}
/**
 * Unmount the children of this element
 */
function unmountComponentElementChildren(element: HTMLElement): void {
    traverseElementChildren(element, unmountComponentElementHelper)
}
/**
 * Unmount this element and all of its children
 */
function unmountComponentElement(element: AnchorElement): void {
    if (instanceOfHTMLElement(element)) {
        unmountComponentElementChildren(element)
    }
    const key: number | undefined = (element as any)[domKeyProperty]
    if (key) {
        const component = getDOMreference(key)
        if (component) {
            unmountComponentElementHelper(component, key)
        }
    }
}
/**
 * Render a Component into an AnchorElement
 */
function componentRender(classComponent: InternalComponent, attrs: Readonly<any>, children: RenderableElements[]): AnchorElement {
    const render: AnchorElement = wrapElementIfNeeded((classComponent.c as ComponentInternals).render(attrs, children))
    setDomKeyOn(render, classComponent.k)
    return render
}

/**
 * A Velotype internal class used to manage RenderObject lifecycles
 * by attaching them to AnchorElements for cleanup on unmount
 */
class WithComponent {

    /**
     * Array of RenderObjects to manage
     */
    declare readonly w: RenderObject<any,any>[]

    /**
     * Stashes the Component vtKey for this Component
     */
    declare readonly k: number

    constructor(withObjects: RenderObject<any,any>[]) {
        this.w = withObjects
        this.k = registerNewVtKey(this)
    }
    mount(): void {
        this.w.forEach(obj => (obj as RenderObjectInternals).mount())
    }
    unmount(): void {
        this.w.forEach(obj => {
            (obj as RenderObjectInternals).unmount()
            releaseVtKeyObject(obj)
        })
    }
}

/**
 * Sets attributes on an element
 * 
 * Resolves: eventListeners, style object, and processes boolean values
 * 
 * eventListeners support `<div onClick:{()=>{alert()}} />`
 * 
 * and eventListeners support `<div onClick:{{handler: ()=>{alert()}, options: AddEventListenerOptions | boolean}} />`
 * 
 * Boolean values are set as empty attributes when true and unset when false
 */
export function setAttrsOnElement(element: AnchorElement, attrs?: Readonly<any> | null): void {
    if (!attrs) {
        return
    }
    // A range input clamps value to min/max when set, so its value is set last
    const valueLast = attrs.type == 'range'
    const names = Object.keys(attrs)
    for (let i = 0; i < names.length; i++) {
        const name = names[i]
        if (!valueLast || name != 'value') {
            setAttrOnElement(element, name, attrs[name])
        }
    }
    if (valueLast) {
        setAttrOnElement(element, 'value', attrs.value)
    }
}

/** Set a single attribute on an element, see setAttrsOnElement() */
function setAttrOnElement(element: AnchorElement, name: string, value: any): void {
    if (name.startsWith('on') && name.length > 4) {
        // Special handling for event listener attributes
        //
        // Example attrs:
        //   <div onClick={()=>{}} >
        //   <div onClick={{handler: ()=>{}, options: {once: true}}} >
        //
        // The length check of 4 is to allow the name[2] test below and to guarantee that
        // eventName will be at least one char in length. Works because all standard browser
        // events have at least 2 chars in their name.

        if (value) { // Check for <div onClick={null}>
            let options: boolean | AddEventListenerOptions | undefined = undefined
            let handler: (this: HTMLElement, ev: Event | UIEvent | WheelEvent) => any = value
            if (typeof value !== 'function' && value.handler) {
                handler = value.handler
                options = value.options
            }
            // Extract the event name:
            // If the name has a dash after "on" like: <div on-custom-eventNAME={()=>{}} > then the name is extracted exactly as-is
            // If the name does not have a dash after "on" then the name is lower cased
            const eventName = (name[2] == '-') ? name.slice(3) : name.slice(2).toLowerCase()
            element.addEventListener(eventName, handler, options)
        }
    } else if (name == 'style' && value instanceof Object) {
        // Special handling for style object
        for (const key of Object.keys(value)) {
            const keyValue: string | number = value[key] == null ? '' : value[key]
            const stringKeyValue = (typeof keyValue == 'number') ? keyValue.toString() : keyValue
            const style = element.style
            if (stringKeyValue.endsWith('!important')) {
                // Important requires setProperty() call
                style.setProperty(lowerCamelToHypenCase(key), stringKeyValue.slice(0, -10), 'important')
            } else {
                let hasSetter = styleSetterCache.get(key)
                if (hasSetter === undefined) {
                    hasSetter = hasSetterFrom(style, key)
                    styleSetterCache.set(key, hasSetter)
                }
                if (hasSetter) {
                    // Note: any is used here because "keyof typeof element.style" clashes with "length" and "parentRule" being readonly
                    style[key as any] = stringKeyValue
                } else {
                    style.setProperty(key, stringKeyValue)
                }
            }
        }
    } else if (typeof value == 'boolean') {
        setBooleanAttributeHelper(element, name, value)
    } else if (typeof value == 'function') {
        // Avoid setting the attribute if the value is a function
    } else if (name == "vtwith") {
        const key: number | undefined = (element as any)[domKeyProperty]
        if (key) {
            consoleError("vtwith on a keyed element", key)
        } else {
            const withComponent = new WithComponent(value)
            setDomKeyOn(element, withComponent.k)
        }
    } else if (value || value == "") {
        // Regular attribute
        setAttributeHelper(element, name, value)
    }
}

// Note: the react-jsx transform can in an edge case call createElement()
// so this must be exported
// See: https://github.com/facebook/react/issues/20031#issuecomment-710346866
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: 'span', attrs: Readonly<any> | null, ...children: RenderableElements[]): HTMLSpanElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: 'div', attrs: Readonly<any> | null, ...children: RenderableElements[]): HTMLDivElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: string, attrs: Readonly<any> | null, ...children: RenderableElements[]): HTMLElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: Type<Component<any>>, attrs: Readonly<any> | null, ...children: RenderableElements[]): HTMLElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: FunctionComponent<any>, attrs: Readonly<any> | null, ...children: RenderableElements[]): RenderableElements[] | AnchorElement | BasicTypes
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: Type<Component<any>> | FunctionComponent<any> | string, attrs: Readonly<any> | null, ...children: RenderableElements[]): RenderableElements[] | AnchorElement | BasicTypes {
    if (typeof tag === 'string') {
        // Base HTML Element
        const element = document.createElement(tag)
        // Template elements' children get attached to the DocumentFragment content
        appendChild(tag == 'template' ? (element as HTMLTemplateElement).content : element, children)
        // Set after children so that attributes like <select value> apply to the appended children
        setAttrsOnElement(element, attrs)
        return element
    }
    const notNullAttrs = attrs || {}
    if (instanceOfComponent(tag.prototype)) {
        // Create and register Component
        const internalComponent = new InternalComponent(
            new (tag as Type<Component<any>>)(notNullAttrs, children),
            notNullAttrs,
            children
        )
        return internalComponent.e
    } else if (typeof tag === 'function') {
        // Function Component
        const output = (tag as FunctionComponent<any>)(notNullAttrs, children)
        // Note: These if-clauses are set this way for TypeScript type inference
        if (instanceOfBasicTypes(output)) {
            return output
        } else if (Array.isArray(output)) {
            return output
        } else {
            return wrapElementIfNeeded(output)
        }
    }

    // Fallback case
    consoleError('Invalid tag', tag, notNullAttrs, children)
    return hiddenElement()
}

/**
 * Create an fragment \<></> (which just propagates an array of children[])
 */
export function createFragment(_attrs: Readonly<any>, ...children:  RenderableElements[]): RenderableElements[] {
    return children
}

/**
 * Get the js class object of a constructed Component
 * 
 * Usage:
 * 
 * ```tsx
 * class ComplexComponent extends Component<EmptyAttrs> {
 *     override render() {
 *         return <div>This is a complex Component</div>
 *     }
 *     someMethod() {
 *         console.log("ComplexComponent method called")
 *     }
 * }
 * 
 * //Somewhere else
 * const foo = getComponent(<ComplexComponent/>)
 * foo.someMethod()
 * 
 * //Can then be used in tsx directly:
 * return <div>{foo}</div>
 * ```
 */
export function getComponent<T>(componentElement: RenderableElements[] | AnchorElement | BasicTypes | null): T {
    if (!componentElement || componentElement instanceof Text || instanceOfBasicTypes(componentElement) || Array.isArray(componentElement)) {
        // Invalid case
        consoleError("Invalid element", componentElement)
        return null as T
    }
    const component = getDOMreference((componentElement as any)[domKeyProperty])
    if (component && instanceOfInternalComponent(component)) {
        return component.c as T
    } else {
        // Invalid case
        consoleError("Invalid element", componentElement)
        return null as T
    }
}

/**
 * Replaces an element that is on the document with a rootComponent
 * 
 * Returns `rootComponent` if successful (and returns `null` if `element` is `null`)
 */
export function replaceElementWithRoot(rootComponent: AnchorElement, element: HTMLElement | null): AnchorElement | null {
    if (element === null) { return null }
    element.replaceWith(rootComponent)
    mountComponentElement(rootComponent)
    return rootComponent
}

/** Create the wrapper element of a RenderObjectArray or RenderTemplateArray */
function createArrayWrapper(options: {wrapperElementTag?: string, wrapperAttrs?: any}): HTMLElement {
    const tag = options.wrapperElementTag
    const wrapper: HTMLElement = (tag === undefined) ? displayContentsDiv.cloneNode() as HTMLDivElement : createElement(tag, null) as HTMLElement
    setAttrsOnElement(wrapper, options.wrapperAttrs)
    return wrapper
}
/** Swap the positions of two sibling elements */
function swapSiblings(parent: Node, a: Element, b: Element): void {
    const aNext = a.nextSibling
    if (aNext === b) {
        parent.insertBefore(b, a)
    } else {
        parent.insertBefore(a, b)
        parent.insertBefore(b, aNext)
    }
}
/**
 * Parameters used on RenderObjectArray construction
 * 
 * @wrapperElementTag the HTML tag to use for the wrapper element (defaults to a \<div style="display:contents;"/> tag, a named tag is created unstyled)
 * @wrapperAttrs attributes to set on the wrapper element
 * @renderFunction the renderFunction to pass to the underlying RenderObject instances on each data point
 * @handleUpdate advanced functionality used to more efficiently rerender instance elements
 */
export type RenderObjectArrayOptions<DataType, UpdateRefsType = any> = {
    wrapperElementTag?: string,
    wrapperAttrs?: any,
    renderFunction: RenderObjectRenderFunctionType<DataType, UpdateRefsType>,
    handleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
}
/**
 * An optimized RenderObject that represents an Array of data points rendered into
 * a wrapperElement (by default a \<div> tag)
 * 
 * @template DataType The type of the underlying Data Object
 * @template UpdateRefsType An advanced capability of RenderObjectArray to more efficiently rerender instance elements
 */
export class RenderObjectArray<DataType, UpdateRefsType = any> extends RenderObject<RenderObject<DataType, UpdateRefsType>[]> {
    readonly #renderFunction: RenderObjectRenderFunctionType<DataType, UpdateRefsType>
    readonly #handleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
    /**
     * Create a new RenderObjectArray
     * 
     * Options parameters used on RenderObjectArray construction:
     * 
     * @wrapperElementTag the HTML tag to use for the wrapper element (defaults to a \<div/> tag styled display:contents; a named tag is created unstyled)
     * @wrapperAttrs attributes to set on the wrapper element
     * @renderFunction the renderFunction to pass to the underlying RenderObject instances on each data point
     * @handleUpdate advanced functionality used to more efficiently rerender instance elements
     */
    constructor(options: RenderObjectArrayOptions<DataType, UpdateRefsType>) {
        super([], (data: RenderObject<DataType, UpdateRefsType>[]) => {
            const mainElement = createArrayWrapper(options)
            data.forEach(d => {
                mainElement.appendChild(renderableElementToElement(d))
            })
            return mainElement
        })
        this.#renderFunction = options.renderFunction
        this.#handleUpdate = options.handleUpdate
    }
    /**
     * Push one data point into the Array
     */
    push(newData: DataType): void {
        const obj = new RenderObject<DataType, UpdateRefsType>(newData, this.#renderFunction, this.#handleUpdate)
        this.value.push(obj)
        this.es.forEach(element => {
            appendElement(element.e, renderableElementToElement(obj))
        })
    }
    /**
     * Push all of the data points of newData[] into the Array
     */
    pushAll(newData: DataType[]): void {
        newData.forEach(d => this.push(d))
    }
    /**
     * Delete one or more data points from the Array
     */
    deleteAt(startIndex: number, deleteCount?: number): void {
        const oldData = this.value.splice(startIndex, deleteCount! > 0 ? deleteCount! : 1)
        oldData.forEach(RenderObjectArray.#releaseOne)
    }
    /**
     * Delete a data point from the Array by value
     * 
     * (note: uses Array.findIndex() so runs in linear time)
     */
    delete(data: DataType): void {
        const found = this.value.findIndex(x=>x.value===data)
        if (found >= 0) {
            this.deleteAt(found, 1)
        }
    }
    /**
     * Get the Data value at index
     */
    getAt(index: number): DataType {
        return this.value[index].value
    }
    /**
     * Set the value at index to newData
     */
    setAt(index: number, newData: DataType): void {
        this.value[index].value = newData
    }
    /**
     * Swap the data points at indexA and indexB, moving their rendered elements
     */
    swap(indexA: number, indexB: number): void {
        const value = this.value
        const a = value[indexA]
        const b = value[indexB]
        if (!a || !b || a === b) {
            return
        }
        value[indexA] = b
        value[indexB] = a
        ;(a as RenderObjectInternals).sw(b)
    }
    /** Set the current value of this RenderObjectArray */
    override set(newData: RenderObject<DataType, UpdateRefsType>[]): void {
        this.#releaseAll()
        super.set(newData)
    }
    /** Will unmount and release all rendered instances of this RenderObjectArray */
    protected override unmount(): void {
        super.unmount()
        this.value = []
    }
    /** Release the old underlying RenderObjects */
    #releaseAll(): void {
        this.value.forEach(RenderObjectArray.#releaseOne)
    }
    /** Unmount, remove all rendered instances of, and release the vtKey of a single underlying RenderObject */
    static #releaseOne(d: RenderObject<any,any>): void {
        (d as RenderObjectInternals).unmount()
        d.removeAll()
        releaseVtKeyObject(d)
    }
    /**
     * Gets the length of the Array
     */
    get length(): number {
        return this.value.length
    }
    /**
     * Clears the Array of all data
     */
    clear(): void {
        this.value = []
    }
}

/**
 * Parameters used on RenderTemplateArray construction
 *
 * @wrapperElementTag the HTML tag to use for the wrapper element (defaults to a \<div style="display:contents;"/> tag, a named tag is created unstyled)
 * @wrapperAttrs attributes to set on the wrapper element
 * @template the element cloned for each row, it must not contain Components, RenderObjects, or event listeners
 * @renderFunction renders a data point into a new row clone, returns the updateRefs passed to handleUpdate
 * @handleUpdate updates a row in place, when not set the row is replaced with a new clone
 * @on event listeners on the wrapper element, called with the row, data, and index that the event occurred in (only events that bubble)
 */
export type RenderTemplateArrayOptions<DataType, UpdateRefsType = any, RowElementType extends Element = HTMLElement> = {
    wrapperElementTag?: string,
    wrapperAttrs?: any,
    template: RowElementType,
    renderFunction: (row: RowElementType, data: DataType) => UpdateRefsType,
    handleUpdate?: (row: RowElementType, updateRefs: UpdateRefsType, oldData: DataType, newData: DataType) => void,
    on?: {[EventName in BubblingEventName]?: (event: HTMLElementEventMap[EventName], row: RowElementType, data: DataType, index: number) => void}
}
/** A rendered row of a RenderTemplateArray */
type TemplateRowType<UpdateRefsType, RowElementType extends Element> = {
    /** element */
    e: RowElementType,
    /** updateRefs */
    r: UpdateRefsType
}
/** Clone the template and render data into it */
function newTemplateRow<DataType, UpdateRefsType, RowElementType extends Element>(options: RenderTemplateArrayOptions<DataType, UpdateRefsType, RowElementType>, data: DataType): TemplateRowType<UpdateRefsType, RowElementType> {
    const row = options.template.cloneNode(true) as RowElementType
    return {e: row, r: options.renderFunction(row, data)}
}
/** Render a row for each of data and append them to wrapper and rows */
function appendTemplateRows<DataType, UpdateRefsType, RowElementType extends Element>(options: RenderTemplateArrayOptions<DataType, UpdateRefsType, RowElementType>, wrapper: AnchorElement, rows: TemplateRowType<UpdateRefsType, RowElementType>[], data: DataType[]): void {
    for (let i = 0; i < data.length; i++) {
        const row = newTemplateRow(options, data[i])
        rows.push(row)
        wrapper.appendChild(row.e)
    }
}

/**
 * An Array of data points rendered by cloning a template element for each row
 *
 * Rows cannot contain Components or RenderObjects, which lets rows be created, updated,
 * and removed without Component bookkeeping (use RenderObjectArray for those cases)
 *
 * @template DataType The type of the underlying Data Object
 * @template UpdateRefsType The type of the updateRefs returned by renderFunction and passed to handleUpdate
 * @template RowElementType The element type of the template
 */
export class RenderTemplateArray<DataType, UpdateRefsType = any, RowElementType extends Element = HTMLElement> extends RenderObject<DataType[], TemplateRowType<UpdateRefsType, RowElementType>[]> {
    readonly #options: RenderTemplateArrayOptions<DataType, UpdateRefsType, RowElementType>
    /**
     * Create a new RenderTemplateArray
     */
    constructor(options: RenderTemplateArrayOptions<DataType, UpdateRefsType, RowElementType>) {
        super([], (data: DataType[], thisArg: RenderObject<DataType[], TemplateRowType<UpdateRefsType, RowElementType>[]>) => {
            const wrapper = createArrayWrapper(options)
            // The rows of this wrapper, kept as its updateRefs
            const rows: TemplateRowType<UpdateRefsType, RowElementType>[] = []
            appendTemplateRows(options, wrapper, rows, data)
            const on = options.on
            if (on) {
                Object.keys(on).forEach(eventName => {
                    const listener = on[eventName as BubblingEventName] as ((event: Event, row: RowElementType, data: DataType, index: number) => void) | undefined
                    if (listener) {
                        wrapper.addEventListener(eventName, event => {
                            // Find the row that contains the event target
                            let target = event.target as Node | null
                            while (target && target.parentNode !== wrapper) {
                                target = target.parentNode
                            }
                            for (let i = 0; i < rows.length; i++) {
                                if (rows[i].e === target) {
                                    listener(event, rows[i].e, thisArg.value[i], i)
                                    return
                                }
                            }
                        })
                    }
                })
            }
            return new UpdateHandlerLink(wrapper, rows)
        }, (wrapper: AnchorElement, rows: TemplateRowType<UpdateRefsType, RowElementType>[], _oldData: DataType[], newData: DataType[]) => {
            // Rows have no Components to unmount, so they are removed all at once
            wrapper.textContent = ""
            rows.length = 0
            appendTemplateRows(options, wrapper, rows, newData)
        })
        this.#options = options
    }
    /**
     * Push one data point into the Array
     */
    push(newData: DataType): void {
        this.value.push(newData)
        this.es.forEach(instance => {
            const row = newTemplateRow(this.#options, newData)
            instance.uR!.push(row)
            instance.e.appendChild(row.e)
        })
    }
    /**
     * Push all of the data points of newData[] into the Array
     */
    pushAll(newData: DataType[]): void {
        const value = this.value
        for (let i = 0; i < newData.length; i++) {
            value.push(newData[i])
        }
        const options = this.#options
        this.es.forEach(instance => {
            appendTemplateRows(options, instance.e, instance.uR!, newData)
        })
    }
    /**
     * Delete one or more data points from the Array
     */
    deleteAt(startIndex: number, deleteCount?: number): void {
        const count = deleteCount! > 0 ? deleteCount! : 1
        this.value.splice(startIndex, count)
        this.es.forEach(instance => {
            instance.uR!.splice(startIndex, count).forEach(row => {
                row.e.remove()
            })
        })
    }
    /**
     * Delete a data point from the Array by value
     *
     * (note: uses Array.indexOf() so runs in linear time)
     */
    delete(data: DataType): void {
        const found = this.value.indexOf(data)
        if (found >= 0) {
            this.deleteAt(found, 1)
        }
    }
    /**
     * Get the Data value at index
     */
    getAt(index: number): DataType {
        return this.value[index]
    }
    /**
     * Set the value at index to newData
     */
    setAt(index: number, newData: DataType): void {
        const value = this.value
        const oldData = value[index]
        value[index] = newData
        const options = this.#options
        const handleUpdate = options.handleUpdate
        this.es.forEach(instance => {
            const rows = instance.uR!
            const row = rows[index]
            if (handleUpdate) {
                handleUpdate(row.e, row.r, oldData, newData)
            } else {
                const newRow = newTemplateRow(options, newData)
                row.e.replaceWith(newRow.e)
                rows[index] = newRow
            }
        })
    }
    /**
     * Swap the data points at indexA and indexB, moving their rendered rows
     */
    swap(indexA: number, indexB: number): void {
        const value = this.value
        if (indexA === indexB || !(indexA in value && indexB in value)) {
            return
        }
        const data = value[indexA]
        value[indexA] = value[indexB]
        value[indexB] = data
        this.es.forEach(instance => {
            const rows = instance.uR!
            const a = rows[indexA]
            const b = rows[indexB]
            rows[indexA] = b
            rows[indexB] = a
            swapSiblings(instance.e, a.e, b.e)
        })
    }
    /**
     * Gets the length of the Array
     */
    get length(): number {
        return this.value.length
    }
    /**
     * Clears the Array of all data
     */
    clear(): void {
        this.value = []
    }
}

/** Attributes type for the HTML Component */
export type HTMLAttrsType<ElementAttrsType> = {
    /** which html tag to use for this element (defaults to `<div>`, does not support `<svg>` or `<math>`) */
    tag?: string
    /** content to use in innerHTML */
    innerHTML: string
    /** attributes to set on the created element */
    elementAttrs?: ElementAttrsType
}
/**
 * Fully custom HTML
 * 
 * Two special attrs:
 * 
 * tag:string - which html tag to use for this element (defaults to \<div>, does not support \<svg> or \<math>)
 * 
 * html:string - content to use in innerHTML
 */
export class HTML<AttrsType = HTMLAttributes> extends Component<HTMLAttrsType<AttrsType>> {
    /**
     * Renders this into a generic HTML element
     */
    override render(attrs: Readonly<HTMLAttrsType<AttrsType>>): HTMLElement {
        const container = createElement(attrs.tag || divTag, attrs.elementAttrs || null) as HTMLElement
        container.innerHTML = attrs.innerHTML
        return container
    }
}

/** Attributes type for the SVG Component */
export type SVGAttrsType = {
    /** content to use in innerHTML of the \<svg> element */
    innerHTML: string
    /** attributes to set on the created element */
    elementAttrs?: any
}

/**
 * Custom SVG element
 * 
 * One special attr:
 * 
 * svg:string - content to use in innerHTML of the \<svg> element
 */
export class SVG extends Component<SVGAttrsType> {
    /**
     * Renders this into a \<svg\> element
     */
    override render(attrs: Readonly<SVGAttrsType>): SVGSVGElement {
        const container = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGSVGElement
        setAttrsOnElement(container, attrs.elementAttrs || null)
        container.innerHTML = attrs.innerHTML || ""
        return container
    }
}

/** Attributes type for the MATH Component */
export type MATHAttrsType = {
    /** content to use in innerHTML of the \<math> element */
    innerHTML: string
    /** attributes to set on the created element */
    elementAttrs?: any
}
/**
 * Custom MathML element
 * 
 * One special attr:
 * 
 * svg:string - content to use in innerHTML of the svg element
 */
export class MATH extends Component<MATHAttrsType> {
    /**
     * Renders this into a \<math\> element
     */
    override render(attrs: Readonly<MATHAttrsType>): MathMLElement {
        const container = document.createElementNS("http://www.w3.org/1998/Math/MathML", "math") as MathMLElement
        setAttrsOnElement(container, attrs.elementAttrs || null)
        container.innerHTML = attrs.innerHTML || ""
        return container
    }
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------



// ----------------------------------------------------------------------
//                             Event bus
// ----------------------------------------------------------------------

/**
 * An Event object
 */
export class VelotypeEvent {
    /**
     * Link to the emitting object
     */
    declare readonly emittingObject: Component<any> | RenderObject<any,any>
    /**
     * A simple string representing the type of event
     */
    declare readonly event: string
    /**
     * Generic metadata about the event
     */
    declare readonly data: any | undefined
    /**
     * Create a new VelotypeEvent
     */
    constructor(emittingObject: Component<any> | RenderObject<any,any>, event: string, data?: any) {
        this.emittingObject = emittingObject
        this.event = event
        this.data = data
    }
}

/**
 * A Velotype Event Listener
 */
export type VelotypeEventListener = (event: VelotypeEvent) => void

/**
 * Register an Event listener
 * 
 * Will receive all events dispatched with the listeningKey
 * 
 * Will be automatically cleaned up when the hasVtKey Component is released
 */
export function registerEventListener(hasVtKey: HasVtKey, listeningKey: string, listener: VelotypeEventListener): void {
    registerListenerMap(listenersF, listeningKey, hasVtKey.vtKey, listener)
    registerListenerMap(listenersR, hasVtKey.vtKey, listeningKey, listener)
}
/**
 * Optimization function to register listeners to double maps
 */
function registerListenerMap<FirstKeyType, SecondKeyType>(map: Map<FirstKeyType, Map<SecondKeyType, VelotypeEventListener[]>>, firstKey: FirstKeyType, secondKey: SecondKeyType, listener: VelotypeEventListener): void {
    let keyListeners = map.get(firstKey)
    if (!keyListeners) {
        keyListeners = new Map<SecondKeyType, VelotypeEventListener[]>()
        map.set(firstKey, keyListeners)
    }
    const listeners = keyListeners.get(secondKey)
    if (listeners) {
        listeners.push(listener)
    } else {
        keyListeners.set(secondKey, [listener])
    }
}
/**
 * Manually remove and clean up all EventListeners that are listening to
 * a particular hasVtKey Component and listeningKey
 * 
 * @param listener if specified, remove only this EventListener
 */
export function removeEventListeners(hasVtKey: HasVtKey, listeningKey: string, listener?: VelotypeEventListener): void {
    removeListenerMap(listenersF, listeningKey, hasVtKey.vtKey, listener)
    removeListenerMap(listenersR, hasVtKey.vtKey, listeningKey, listener)
}
/**
 * Cleanup all EventListeners that are registered with a hasVtKey Component
 */
function removeComponentListeners(hasVtKey: HasVtKey): void {
    const keyListeners = listenersR.get(hasVtKey.vtKey)
    if (keyListeners) {
        keyListeners.forEach((_listeners, listeningKey) => {
            removeListenerMap(listenersF, listeningKey, hasVtKey.vtKey)
            removeListenerMap(listenersR, hasVtKey.vtKey, listeningKey)
        })
    }
}
/**
 * Optimization function to remove listeners from double maps
 */
/** Counts listener removals, so that emitEvent() only checks for removed listeners after one */
let listenerRemovals = 0
function removeListenerMap<FirstKeyType, SecondKeyType>(map: Map<FirstKeyType, Map<SecondKeyType, VelotypeEventListener[]>>, firstKey: FirstKeyType, secondKey: SecondKeyType, listener?: VelotypeEventListener): void {
    const keyListeners = map.get(firstKey)
    if (keyListeners) {
        let listeners = keyListeners.get(secondKey)
        if (listeners) {
            listenerRemovals++
            if (listener) {
                const index = listeners.indexOf(listener)
                if (index < 0) {
                    consoleWarn("Listener not registered", firstKey, secondKey)
                    return
                }
                // Replaced, not spliced, so that an in-progress emitEvent() keeps its array
                listeners = listeners.slice()
                listeners.splice(index, 1)
                keyListeners.set(secondKey, listeners)
            }
            if (!listener || listeners.length <= 0) {
                keyListeners.delete(secondKey)
                if (keyListeners.size <= 0) {
                    map.delete(firstKey)
                }
            }
        } else {
            consoleWarn("No listeners to remove", firstKey, secondKey)
        }
    } else {
        consoleWarn("No listeners to remove", firstKey, secondKey)
    }
}
/**
 * Is this EventListener still registered
 */
function isListenerRegistered(listeningKey: string, vtKey: number, listener: VelotypeEventListener): boolean {
    const keyListeners = listenersF.get(listeningKey)
    const listeners = keyListeners && keyListeners.get(vtKey)
    return !!listeners && listeners.includes(listener)
}
/**
 * Emit a VelotypeEvent on a listeningKey
 */
export function emitEvent(listeningKey: string, event: VelotypeEvent, hasVtKey?: HasVtKey): void {
    const keyListeners = listenersF.get(listeningKey)
    if (keyListeners) {
        keyListeners.forEach((listeners, vtKey) => {
            // The Component that emitted the Event does not also receive it
            if (!hasVtKey || hasVtKey.vtKey != vtKey) {
                const removals = listenerRemovals
                listeners.forEach(listener => {
                    // Skip listeners removed by an earlier listener
                    if (removals !== listenerRemovals) {
                        const current = keyListeners.get(vtKey)
                        if (current !== listeners && !(current && current.includes(listener))) {
                            return
                        }
                    }
                    listener(event)
                })
            }
        })
    } else {
        consoleWarn("No listeners for event", listeningKey, event)
    }
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------



// ----------------------------------------------------------------------
//                             CSS Style Handling
// ----------------------------------------------------------------------

/**
 * Append a section of CSS Styles to the page.
 * 
 * @param sheetText The CSS text to inject onto the page.
 * @param sheetKey A unique header, used to detect if this style is already added.
 * @param resetSheet If the Stylesheet should be reset if already set (default: false)
 */
export function setStylesheet(sheetText: string, sheetKey: string, resetSheet: boolean = false): void {
    const sheet = styleSectionMounted.get(sheetKey)
    const sheets = document.adoptedStyleSheets
    if (sheet) {
        // If we should not reset the style, then return
        if (!resetSheet) {
            return
        }
        // Remove old stylesheet, then continue
        const index = sheets.indexOf(sheet.sheet)
        if (index >= 0) {
            sheets.splice(index, 1)
        }
    }
    const styleSheet = new CSSStyleSheet()
    styleSheet.replace(sheetText)
    sheets.push(styleSheet)
    styleSectionMounted.set(sheetKey, {
        sheet: styleSheet,
        text: sheetText,
        key: sheetKey
    })
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
