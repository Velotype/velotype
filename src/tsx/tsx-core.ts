// deno-lint-ignore-file no-unused-vars no-explicit-any

/**
 * Implementation TODOs:
 * - Finish cleanup and symbol documentation of jsx-types.d.ts
 * - Set up deno publish CI https://jsr.io/docs/trust
 * - Add test framework
 * ---- Possibly by using https://jsr.io/@astral/astral
 * ---- See: https://deno-blog.com/End-to-end_test_a_Deno_webapp_using_deno-puppeteer.2022-08-21
 * - Consider making CSSProperties more specific
 * 
 * Categories of support TODOs:
 * - Support DevTools
 * - Support HMR
 * - Support SSR
 * - Support precompile transform
 * ---- See: https://deno.com/blog/v1.38#fastest-jsx-transform
 * ---- And: https://github.com/preactjs/preact/blob/main/jsx-runtime/src/index.js#L185-L187
 * ---- https://jsr.io/@mary/jsx@0.1.0
 * ---- https://jsr.io/@eser/jsx-runtime@0.7.20
 * ---- https://github.com/preactjs/preact/pull/4177/files
 * - Support react-jsx transform
 * ---- Use Source and this in jsxDEV in jsx-dev-runtime
 * 
 * Ecosystem TODOs:
 * - Pass web components tests:
 * ---- Similar to:https://preactjs.com/guide/v10/web-components/
 * ---- Test https://custom-elements-everywhere.com/
 * ---- Check event type case sensitivity (TODO marked below in the code)
 * ---- See: https://preactjs.com/guide/v10/web-components/#triggering-custom-events
 * ---- And: https://github.com/preactjs/preact/blob/main/src/diff/props.js#L71
 * - Pass performance tests:
 * ---- https://github.com/krausest/js-framework-benchmark
 * 
 */

/**
 * These are the types that can be used as a Component's anchor, they can
 * register a componentKey (aka a vtKey) and are mountable/unmountable
 */
export type AnchorElement = HTMLElement | SVGSVGElement | MathMLElement

/** Basic primitives that are renderable directly */
export type BasicTypes = string | bigint | number | boolean

/** These are things that can be returned from Component.render() */
export type RenderableElements = AnchorElement | Component<any, any> | RenderObject<any, any> | RenderObject<any, never>

/** Type used to represent a constructor function for a Class */
export type TypeConstructor<T> = new (...args: any[]) => T

/** Type used to represent abstract Class passing */
export interface Type<T> extends TypeConstructor<T>{}

/** Valid child objects of an Element */
export type ChildTypes = BasicTypes | RenderableElements | null | undefined

/** Type used to represent children in createElement("",{}, children) */
export type ChildrenTypes = ChildTypes | ChildTypes[]

/** Type for the style={} Attribute object */
export type CSSProperties = {
    [key: string]: string | number | null | undefined
}

/** Type used to represent that no Attrs are accepted for a Component */
export type EmptyAttrs = Record<string | number | symbol, never>

/** Type used to represent that children are accepted */
export type ChildrenAttr = { children?: ChildrenTypes[] | ChildrenTypes }

/** Regular console.log() - used for JS minification */
const consoleLog = console.log

/** Regular console.error() - used for JS minification */
const consoleError = console.error

/** Style display:contents; */
const displayContents = {style: 'display:contents;'}

/** Style display:none; */
const displayNone = {style: 'display:none;'}

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
function instanceOfRenderObject(something: any): something is RenderObject<any, any> | RenderObject<any, never>  {
    return something instanceof RenderObject
}
/** Checks if something is an instanceof Component */
function instanceOfComponent(something: any): something is Component<any, any> {
    return something instanceof Component
}
/** Checks if somthing is an instanceof any of the BasicTypes (string, bigint, number, boolean) */
function instanceOfBasicTypes(something: any): something is BasicTypes {
    if (typeof something === 'string' || typeof something === 'bigint' || typeof something === 'number' || typeof something === 'boolean') {
        return true
    }
    return false
}

function hasSetterInPrototypeChain(object: any, fieldName: string): boolean {
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
function setAttributeHelper(element: Element | SVGSVGElement | SVGPathElement, qualifiedName: string, value: any): void {
    if (hasSetterInPrototypeChain(element, qualifiedName)) {
        ;(element as any)[qualifiedName] = value
    } else {
        element.setAttribute(qualifiedName, value.toString())
    }
}
/** Call getAttribute() - used for JS minification */
function getAttributeHelper(element: Element, qualifiedName: string): string | null {
    return element.getAttribute(qualifiedName)
}

/** Call Object.defineProperty() to lock a property so that it cannot be modified later - used for JS minification */
function defineLockedProperty(object: any, key: string, value: any): void {
    Object.defineProperty(object, key, {
        value: value,
        writable: false,
        configurable: false,
        enumerable: false
    })
}

/** Convert from lowerCamelCase to hypen-case */
function lowerCamelToHypenCase(text: string): string {
    return text.replace(/[A-Z]/g, function(char) {return '-'+char.toLowerCase()})
}

/** Map of DOM keys to Velotype Component references */
const domReferences: Map<string, InternalComponent | MultiRenderable> = new Map<string, InternalComponent | MultiRenderable>()

/** The next key to use for DOM bindings */
let domNextKey: bigint = 1n

/** Attribute name to use for DOM -> Component bindings */
let domKeyName = "vk"

/** Velotype Event bus - Forward map listeningKey -> vtKey -> listener */
const listenersF: Map<string, Map<string, EventListener>> = new Map<string,Map<string,EventListener>>()
/** Velotype Event bus - Reverse map vtKey -> listeningKey -> listener */
const listenersR: Map<string, Map<string, EventListener>> = new Map<string,Map<string,EventListener>>()

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
 * App Metadata
 * 
 * Stateful storage of various stuffs, this is a Velotype internal object
 * DO NOT USE OR MANPULATE, for debugging only
 */
export const __vtAppMetadata = {
    // ------- For Velotype Core -------
    /** Key name for DOM bindings, only changeable prior to mounting any Components using `setDomKey()` */
    domKeyName: domKeyName,
    /** Map of DOM keys to Velotype Component references */
    domReferences: domReferences,

    // ------- For Event Bus -------
    /** Forward map listeningKey -> vtKey -> listener */
    listenersF: listenersF,
    /** Reverse map vtKey -> listeningKey -> listener */
    listenersR: listenersR,

    // ------- For Styles -------
    /** Map of style keys to ensure each style key is only mounted once */
    styleSectionMounted: styleSectionMounted,

}

/**
 * Change the attribute name used for DOM -> Component bindings
 * 
 * ADVANCED - Usage of this should be rare and must be done prior to construction of any Components
 */
export function setDomKey(newKeyName: string) {
    // Only accept new names when domReferences is empty
    if (domReferences.size == 0) {
        domKeyName = newKeyName
    } else {
        consoleError("Name not accepted", newKeyName, domReferences.size)
    }
}

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
    readonly vtKey: string
}
/**
 * `domReferences.get(key)` - used for JS minification
 */
function getDOMreference(key: string): InternalComponent | MultiRenderable | undefined {
    return domReferences.get(key)
}
/**
 * Acquire a new componentKey to reference component and if (element) then set the domKey attribute
 */
function registerNewVtKey(component: InternalComponent | MultiRenderable, element?: AnchorElement): string {
    const componentKey = String(domNextKey)
    domNextKey++
    if (element) {
        setAttributeHelper(element, domKeyName, componentKey)
    }
    domReferences.set(componentKey, component)
    return componentKey
}
/**
 * Release the reference to this componentKey
 */
function releaseVtKey(vtKey: string): void {
    domReferences.delete(vtKey)
}
/**
 * Release the reference to this object's componentKey
 */
function releaseVtKeyObject(hasVtKey: HasVtKey): void {
    domReferences.delete(hasVtKey.vtKey)
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
//                             Velotype Core
// ----------------------------------------------------------------------

/**
 * Convert any valid ChildType into a Node (or undefined)
 */
function childToNode(child: ChildTypes): AnchorElement | Text | undefined {
    if (instanceOfBasicTypes(child)) {
        return document.createTextNode(child.toString())
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
        return child.__renderNew()
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
    consoleError('Internal typescript error')
    return hiddenElement()
}
/**
 * Appends children to an HTMLElement (unwraps Arrays, generates new instance components for
 * RenderObjects, wraps BasicTypes in TextNodes)
 * 
 * @param parent HTMLElement to append to
 * @param child Children to append
 */
function appendChild(parent: HTMLElement | DocumentFragment, child: ChildrenTypes[] | ChildrenTypes): void {
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
    return createElement(divTag,displayNone) as HTMLDivElement
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
function wrapElementIfNeeded(element: Component<any, any>): HTMLElement
function wrapElementIfNeeded(element: RenderObject<any, any>): HTMLElement
function wrapElementIfNeeded(element: RenderObject<any, never>): HTMLElement
function wrapElementIfNeeded(element: Component<any, any> | RenderObject<any, any> | RenderObject<any, never>): HTMLElement
function wrapElementIfNeeded(element: HTMLElement | Component<any, any> | RenderObject<any, any> | RenderObject<any, never> | null | undefined): HTMLElement
function wrapElementIfNeeded(element: RenderableElements | null | undefined): AnchorElement {
    // Check for falsey
    if (!element) {
        return hiddenElement()
    }
    // If a Component returns a Component or RenderObject as a result of render
    // then it needs to be wrapped in another HTMLElement for rendering to work properly
    if (instanceOfComponent(element) || instanceOfRenderObject(element) || element.hasAttribute(domKeyName)) {
        return createElement(divTag,displayContents,element) as HTMLDivElement
    }
    return element
}

/**
 * Represents an object that can render into multiple instance elements
 * 
 * These are Velotype internal functions
 * 
 * DO NOT CALL these methods directly (will be called by Velotype core)
 */
export interface MultiRenderable {
    /**
     * Velotype internal function
     * 
     * DO NOT CALL directly (will be called by Velotype core)
     * 
     * Used to unmount an instance element of a MultiRenderable object
     */
    __unmountKey: (key: string) => void
    /**
     * Velotype internal function
     * 
     * DO NOT CALL directly (will be called by Velotype core)
     * 
     * Used to generate new instance elements of a MultiRenderable object
     */
    __renderNew: () => void
}
/**
 * Represents a Component that is mountable / unmountable
 */
export interface Mountable {
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
export class UpdateHandlerLink<UpdateRefsType> {
    /** Reference to the rendered AnchorElement */
    element: AnchorElement
    /** Stashed references to make selected updates more performant */
    updateRefs: UpdateRefsType
    /** Create a new UpdateHandlerLink */
    constructor(element: AnchorElement, updateRefs: UpdateRefsType) {
        this.element = element
        this.updateRefs = updateRefs
    }
}

/**
 * Advanced functionality used to more efficiently rerender instance elements in RenderObjects
 */
export type RenderObjectHandleUpdateType<DataType, UpdateRefsType> = (element: AnchorElement, updateRefs: UpdateRefsType, oldData: DataType, newData: DataType) => void

/**
 * Type for a renderFunction in a RenderObject
 * 
 * (currently only supports rendering to HTMLElements for RenderObjectArray)
 */
export type RenderObjectRenderFunctionType<DataType, UpdateRefsType> = (data: DataType, renderObject?: RenderObject<DataType, UpdateRefsType>) => HTMLElement | UpdateHandlerLink<UpdateRefsType>

/**
 * An RenderObject is an efficient way of rendering Objects to potentially multiple HTMLElements
 * changes to the value of the underlying Data Object will propogate to all attached elements.
 * 
 * @template DataType The type of the underlying Data Object
 * @template UpdateRefsType An advanced capability of RenderObject to more efficiently re-render instance elements
 */
export class RenderObject<DataType, UpdateRefsType = never> implements MultiRenderable, HasVtKey, Mountable {
    #data: DataType
    #renderFunction: RenderObjectRenderFunctionType<DataType, UpdateRefsType>
    readonly #elements = new Map<string, AnchorElement>()
    readonly #updateRefs = new Map<string, UpdateRefsType>()
    #handleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
    /** This RenderObject's vtKey */
    readonly vtKey: string = registerNewVtKey(this)
    #hasEventListeners = false
    readonly #onMounts: Array<()=>void> = []
    readonly #onUnmounts: Array<()=>void> = []
    #eventDispatchDelay: number = 0
    #eventDispatched: boolean = false
    #eventListeningKey() {
        return `vt-oc-${this.vtKey}`
    }
    #emitOnChangeEvent() {
        emitEvent(this.#eventListeningKey(), new VelotypeEvent(this,'onChange'))
    }
    /**
     * Create a new RenderObject
     * 
     * @param initialData the initial data to use to render this RenderObject with
     * @param renderFunction a function that renders a data value into an AnchorElement
     * @param handleUpdate advanced functionality used to highly optimize rendering on value updates
     */
    constructor(initialData: DataType,
        renderFunction: RenderObjectRenderFunctionType<DataType, UpdateRefsType>,
        handleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
    ) {
        this.#data = initialData
        this.#renderFunction = renderFunction
        this.#handleUpdate = handleUpdate
    }

    /**
     * Register an EventListener to receive an onChange event when the value of this RenderObject changes.
     * 
     * @param component the Component this RenderObject is created within or a child of the owning Component (has undefined behavior if registered to a non-child of the owning Component)
     * @param listener the EventListener to register
     * @param triggerOnRegistration should an onChange event be emitted immediately upon registration? (default: false)
     * @param eventDispatchDelay to delay (in ms) onChange event dispatch, will dispatch at most one change event per eventDispatchDelay (default: 0)
     * @returns this
     */
    registerOnChangeListener(component: Component<any,any>, listener: EventListener, triggerOnRegistration?: boolean, eventDispatchDelay?: number): RenderObject<DataType, UpdateRefsType> {
        this.#hasEventListeners = true
        this.#eventDispatchDelay = (eventDispatchDelay && eventDispatchDelay>0)?eventDispatchDelay:0
        registerEventListener(component, this.#eventListeningKey(), listener)
        if (triggerOnRegistration) {
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
    registerOnMount(onMount?: () => void | undefined, onUnmount?: () => void): RenderObject<DataType, UpdateRefsType> {
        if (onMount) {
            this.#onMounts.push(onMount)
        }
        if (onUnmount) {
            this.#onUnmounts.push(onUnmount)
        }
        return this
    }
    /**
     * Velotype internal function
     * 
     * DO NOT CALL directly (will be called by Velotype core)
     * 
     * Used to trigger set of registered onMounts
     */
    mount(): void {
        this.#onMounts.forEach(onMount => {onMount()})
    }
    /**
     * Velotype internal function
     * 
     * DO NOT CALL directly (will be called by Velotype core)
     * 
     * Used to trigger set of registered onUnmounts
     */
    unmount(): void {
        this.#onUnmounts.forEach(onUnmount => {onUnmount()})
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
        if (this.#data != newData) {
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
        Array.from(this.#elements.entries()).forEach(([key, element]) => {
            if (this.#handleUpdate && this.#updateRefs.has(key)) {
                this.#handleUpdate(element, this.#updateRefs.get(key) as UpdateRefsType, this.#data, newData)
            } else {
                const render = this.#renderFunction(newData, this)
                if (render instanceof UpdateHandlerLink) {
                    const newElement = wrapElementIfNeeded(render.element)
                    this.#updateRefs.set(key, render.updateRefs)
                    setAttributeHelper(newElement, domKeyName, key)
                    replaceElement(element, newElement)
                    this.#elements.set(key, newElement)
                } else {
                    const newElement = wrapElementIfNeeded(render)
                    setAttributeHelper(newElement, domKeyName, key)
                    replaceElement(element, newElement)
                    this.#elements.set(key, newElement)
                }
            }
        })
        // Set data
        this.#data = newData
        // Trigger EventListeners (if set)
        if (this.#hasEventListeners) {
            if (this.#eventDispatchDelay > 0) {
                // If a delay is set, then use setTimeout to delay the dispatch
                if (!this.#eventDispatched) {
                    this.#eventDispatched = true
                    setTimeout(() => {
                        this.#eventDispatched = false
                        this.#emitOnChangeEvent()
                    }, this.#eventDispatchDelay)
                }
            } else {
                // No delay is set, so emit the event right away
                this.#emitOnChangeEvent()
            }
        }
    }
    /**
     * Velotype internal function
     * 
     * DO NOT CALL directly (will be called by Velotype core)
     * 
     * Used to unmount an instance element of this RenderObject
     */
    __unmountKey(key: string): boolean {
        const element = this.#elements.get(key)
        if (element) {
            const componentKey = getAttributeHelper(element, domKeyName)
            if (key == componentKey) {
                this.#elements.delete(componentKey)
                this.#updateRefs.delete(componentKey)
                releaseVtKey(componentKey||'')
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
     * Velotype internal function
     * 
     * DO NOT CALL directly (will be called by Velotype core)
     * 
     * Used to generate new instance elements of this RenderObject
     */
    __renderNew(): AnchorElement {
        const render = this.#renderFunction(this.#data, this)
        const newElement = wrapElementIfNeeded((instanceOfHTMLElement(render) || instanceOfSVGSVGElement(render) || instanceOfMathMLElement(render))?render:render.element)
        const componentKey = registerNewVtKey(this, newElement)
        this.#elements.set(componentKey, newElement)
        if (!(instanceOfHTMLElement(render) || instanceOfSVGSVGElement(render) || instanceOfMathMLElement(render))) {
            this.#updateRefs.set(componentKey, render.updateRefs)
        }
        return newElement
    }
    /**
     * Get the rendered elements of this RenderObject
     * 
     * THIS IS ADVANCED FUNCTIONALITY - use carefully
     */
    getElements(): AnchorElement[] {
        return Array.from(this.#elements.values())
    }
    /**
     * Removes all instance elements that this RenderObject has generated
     */
    removeAll(): void {
        this.#elements.entries().forEach(([key, element]) => {
            removeElement(element)
            releaseVtKey(key)
        })
        this.#elements.clear()
        this.#updateRefs.clear()
    }
    /**
     * Releases all resources this RenderObject is attached to, this RenderObject
     * is not functional after this method is called!
     * 
     * @param removeElements If set to true then will remove instance elements from the DOM, if false will leave them orphaned (default true)
     */
    release(removeElements: boolean = true): void {
        this.unmount()
        this.#elements.entries().forEach(([key, element]) => {
            if (removeElements) {
                removeElement(element)
            }
            releaseVtKey(key)
        })
        this.#elements.clear()
        this.#updateRefs.clear()
        releaseVtKey(this.vtKey)
    }
}

/**
 * A specialization of an RenderObject when the DataType is a BasicType
 * 
 * The BasicTypes are string | number | bigint | boolean
 */
export class RenderBasic<DataType extends BasicTypes> extends RenderObject<DataType> implements MultiRenderable, HasVtKey, Mountable {
    /** Create a new BasicComponent */
    constructor(initialData: DataType) {
        super(initialData, function(data: DataType) {
            return createElement('span', null, data.toString()) as HTMLSpanElement
        })
    }
    /**
     * Register an EventListener to receive an onChange event when the value of
     * this RenderBasic changes.
     * 
     * @param component the Component this RenderBasic is created within or a child of the owning Component (has undefined behavior if registered to a non-child of the owning Component)
     * @param listener the EventListener to register
     * @param triggerOnRegistration should an onChange event be emitted immediately upon registration? (default: false)
     * @param eventDispatchDelay to delay (in ms) onChange event dispatch, will dispatch at most one change event per eventDispatchDelay (default: 0)
     * @returns this
     */
    override registerOnChangeListener(component: Component<any,any>, listener: EventListener, triggerOnRegistration?: boolean): RenderBasic<DataType> {
        super.registerOnChangeListener(component, listener, triggerOnRegistration)
        return this
    }
    /**
     * Register a mount/unmount pair to be triggered when the Component that this RenderBasic is created within gets mounted / unmounted
     * 
     * @param onMount callback to be triggered when the Component that this RenderBasic is created within gets mounted
     * @param onUnmount callback to be triggered when the Component that this RenderBasic is created within gets unmounted
     * @returns this
     */
    override registerOnMount(onMount: () => void, onUnmount: () => void): RenderBasic<DataType> {
        super.registerOnMount(onMount, onUnmount)
        return this
    }
    /**
     * Get the value of this BasicComponent as a String
     */
    getString(): string {
        return String(super.get())
    }
    /**
     * Set the value of this BasicComponent from a String
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
            this.set((Boolean(newDataString)) as DataType)
        }
    }
}

/**
 * A Velotype Function Component that can be used in .tsx files to render HTML Components.
 * Does not support mount and unmount lifecycle events.
 */
export type FunctionComponent<AttrsType> = (attrs: Readonly<AttrsType>, children: ChildrenTypes[]) => ChildrenTypes[] | RenderableElements | BasicTypes | null | undefined

/**
 * A Velotype Class Component that can be used in .tsx files to render HTML Components.
 * Supports unmount, render, mount lifecycle events.
 */
export abstract class Component<AttrsType, RenderReturnType extends RenderableElements = HTMLElement> implements HasVtKey, Mountable {

    /** The attributes this Component was created with */
    attrs: AttrsType

    /** The children this Component was created with */
    children: ChildrenTypes[]

    /** constructor gets attrs and children */
    constructor(attrs: Readonly<AttrsType>, children: ChildrenTypes[]){
        this.attrs = attrs
        this.children = children
    }

    /**
     * Mount is called just after this Component is attached to the DOM.
     * 
     * May be overriden by a specific Component that extends Component
     */
    mount(): void {}

    /**
     * Unmount is called just before this Component is removed from the DOM.
     * 
     * May be overriden by a specific Component that extends Component
     */
    unmount(): void {}

    /**
     * Render is called when this Component needs to be materialized into Elements.
     * 
     * To be overriden by a specific Component that extends Component
     * @param {Readonly<AttrsType>} attrs The attrs for this Component
     * @param {ChildrenTypes[]} children Any children of this Component
     */
    abstract render(attrs: Readonly<AttrsType>, children: ChildrenTypes[]): RenderReturnType

    /**
     * Trigger re-rendering of this Component and all child Components.
     * This will unmount and delete all child Components, then call
     * this.render() and consequently new and mount a fresh set of child Components.
     * 
     * This is set by Velotype Core on Component construction and is not overridable
     */
    refresh(): void {}

    /**
     * A unique key per instance of each Component.
     * 
     * This is read-only and set by Velotype Core on Component construction and is not overridable
     */
    readonly vtKey: string = ""

    /**
     * Replace a Child element with a newly constructed element
     * 
     * This is set by Velotype Core on Component construction and is not overridable
     * 
     * @param child a child element of this Component
     * @param newChild the element to replace with
     * @returns newElement when replacement is successful, otherwise returns child
     */
    replaceChild(child: AnchorElement, newChild: RenderableElements): AnchorElement {return child}

    /**
     * Append a newly constructed element to a child element
     * 
     * This is set by Velotype Core on Component construction and is not overridable
     * 
     * @param child a child element of this Component
     * @param toAppendChild the element to append
     * @returns boolean for if replacement was accepted (will reject if the input child element is not a child of this Component)
     */
    appendToChild(child: HTMLElement, toAppendChild: RenderableElements): boolean {return false}

    /**
     * Prepend a newly constructed element to a child element
     * 
     * This is set by Velotype Core on Component construction and is not overridable
     * 
     * @param child a child element of this Component
     * @param toPrependChild the element to prepend
     * @returns boolean for if replacement was accepted (will reject if the input child element is not a child of this Component)
     */
    prependToChild(child: HTMLElement, toPrependChild: RenderableElements): boolean {return false}

    /**
     * Replace the children of a child element
     * 
     * This is set by Velotype Core on Component construction and is not overridable
     * 
     * @param child a child element of this Component
     * @param toPrependElement the element to prepend
     * @returns boolean for if replacement was accepted (will reject if the input child element is not a child of this Component)
     */
    replaceChildrenOfChild(child: HTMLElement, newChildren: RenderableElements[]): boolean {return false}

    /**
     * Remove a child element
     * 
     * This is set by Velotype Core on Component construction and is not overridable
     * 
     * @param child a child element of this Component
     * @returns boolean for if removal was accepted (will reject if the input child element is not a child of this Component)
     */
    removeChild(child: HTMLElement): boolean {return false}
}

/**
 * Replace an element with a newElement
 * 
 * Note: this will detect if the element hasFocus and will set newElement.focus() if needed
 */
function replaceElement(element: AnchorElement, newElement: AnchorElement): AnchorElement {
    const isFocused = document.hasFocus() ? document.activeElement == element : false
    if (instanceOfHTMLElement(element)) {
        unmountComponentElementChildren(element)
    }
    element.replaceWith(newElement)
    if (instanceOfHTMLElement(newElement)) {
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
function appendElement(element: HTMLElement, toAppendElement: AnchorElement): void {
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

    constructor(component: Component<any,any>, attrs: Readonly<any>, children: ChildrenTypes[]) {
        this.c = component
        this.a = attrs
        this.h = children

        // Assign this Component's componentKey
        this.k = registerNewVtKey(this)

        // Set locked Component properties so that they cannot be modified later
        defineLockedProperty(component, "vtKey", this.k)
        defineLockedProperty(component, "refresh", this.f)
        defineLockedProperty(component, "replaceChild", this.q)
        defineLockedProperty(component, "appendToChild", this.w)
        defineLockedProperty(component, "prependToChild", this.t)
        defineLockedProperty(component, "replaceChildrenOfChild", this.y)
        defineLockedProperty(component, "removeChild", this.u)

        // Initial render of this component
        this.e = componentRender(this, this.a, this.h)
    }

    /**
     * Stashes the Velotype Component defined by the user
     */
    c: Component<any,any>

    /**
     * Stashes a reference to the root AnchorElement of this Component.
     */
    e: AnchorElement

    /**
     * Stashes the Component vtKey for this Component
     */
    readonly k: string

    /**
     * Stashes the attrs for this Component
     */
    a: Readonly<any>

    /**
     * Stashes the children for this Component
     */
    h: ChildrenTypes[]

    /**
     * Trigger unmount for this Component's children, then re-render
     * this Component and then mount new children.
     */
    f: () => void = (): void => {
        this.e = replaceElement(this.e, componentRender(this, this.a, this.h))
    }

    /**
     * Release this Component's ComponentKey
     */
    r: () => void = (): void => {
        releaseVtKey(this.k)
    }

    /**
     * replaceChild()
     */
    q: (child: AnchorElement, newChild: RenderableElements) => AnchorElement = (child: AnchorElement, newChild: RenderableElements): AnchorElement => {
        if (this.e.contains(child)) {
            return replaceElement(child, renderableElementToElement(newChild))
        } else {
            return child
        }
    }

    /**
     * appendToChild()
     */
    w: (child: HTMLElement, toAppend: RenderableElements) => boolean = (child: HTMLElement, toAppend: RenderableElements): boolean => {
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
    t: (child: HTMLElement, toPreppend: RenderableElements) => boolean = (child: HTMLElement, toPreppend: RenderableElements): boolean => {
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
    y: (child: HTMLElement, newChildren: RenderableElements[]) => boolean = (child: HTMLElement, newChildren: RenderableElements[]): boolean => {
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
    u: (child: AnchorElement) => boolean = (child: AnchorElement): boolean => {
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
function traverseElementChildren(element: Element, callback: (component: InternalComponent | MultiRenderable, key: string) => void): void {
    if (instanceOfHTMLElement(element) || instanceOfSVGSVGElement(element) || instanceOfMathMLElement(element)) {
        for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i]
            traverseElementChildren(child, callback)
            const key = getAttributeHelper(child,domKeyName)
            if (key) {
                const component = getDOMreference(key)
                if (component) {
                    callback(component, key)
                }
            }
        }
    }
}

/**
 * Call `.mount()` on linked Components
 */
function mountComponentElementHelper(component: InternalComponent | MultiRenderable, _key: string): void {
    if (instanceOfInternalComponent(component)) {
        const internalComponent = component as InternalComponent
        // Mount the main Component
        internalComponent.c.mount()
        // Iterate component fields and trigger their mounts
        Object.entries(internalComponent.c).forEach(array => {
            const enumberableValue = array[1]
            if (instanceOfRenderObject(enumberableValue)) {
                enumberableValue.mount()
            }
        })
    }
}
/**
 * Mount this element and all children
 */
function mountComponentElement(element: AnchorElement): void {
    if (instanceOfHTMLElement(element)) {
        mountComponentElementChildren(element)
    }
    const key = getAttributeHelper(element,domKeyName)
    if (key) {
        const component = getDOMreference(key)
        if (component) {
            mountComponentElementHelper(component, key)
        }
    }
}
/**
 * Mount the children of this element
 */
function mountComponentElementChildren(element: HTMLElement): void {
    traverseElementChildren(element, mountComponentElementHelper)
}
/**
 * Call `.unmount()` on linked Components and release vtKeys
 */
function unmountComponentElementHelper(component: InternalComponent | MultiRenderable, key: string): void {
    if (instanceOfInternalComponent(component)) {
        // component: InternalComponent
        removeComponentListeners(component.c)
        // Unmount the main Component
        component.c.unmount()
        // Iterate component fields and trigger their unmounts
        Object.entries(component.c).forEach(array => {
            const enumberableValue = array[1]
            if (instanceOfRenderObject(enumberableValue)) {
                enumberableValue.unmount()
                releaseVtKeyObject(enumberableValue)
            } else if (instanceOfComponent(enumberableValue)) {
                releaseVtKeyObject(enumberableValue)
            }
        })
        // Release the Component's vtKey
        component.r()
    } else {
        // component: MultiRenderable
        component.__unmountKey(key)
    }
}
/**
 * Unount the children of this element
 */
function unmountComponentElementChildren(element: HTMLElement): void {
    traverseElementChildren(element, unmountComponentElementHelper)
}
/**
 * Unount this element and all of its children
 */
function unmountComponentElement(element: AnchorElement): void {
    if (instanceOfHTMLElement(element)) {
        unmountComponentElementChildren(element)
    }
    const key = getAttributeHelper(element,domKeyName)
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
function componentRender(classComponent: InternalComponent, attrs: Readonly<any>, children: ChildrenTypes[]): AnchorElement {
    const render: AnchorElement = wrapElementIfNeeded(classComponent.c.render(attrs, children))
    setAttributeHelper(render, domKeyName, classComponent.k)
    return render
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
function setAttrsOnElement(element: AnchorElement, attrs?: Readonly<any> | null): void {
    if (!attrs) {
        return
    }
    for (const [name, value] of Object.entries(attrs || {})) {
        if (name.startsWith('on') && name.toLowerCase() in window) {
            // Special handling for event listener attributes
            // Example attrs:
            // {onClick: ()=>{} }
            // {onClick: {handler: ()=>{}, options: {once: true}}}

            if (value) { // Check for <div onClick={null}>
                let options: boolean | AddEventListenerOptions | undefined = undefined
                let handler: (this: HTMLElement, ev: Event | UIEvent | WheelEvent) => any = value
                if (typeof value !== 'function') {
                    handler = value.handler
                    options = value.options
                }
                // TODO the toLowerCase() may be incorrect here (or require more nuance)
                // See: https://github.com/preactjs/preact/blob/main/src/diff/props.js#L71
                // and: https://github.com/webcomponents/custom-elements-everywhere/blob/main/libraries/preact/src/components.js#L201
                element.addEventListener(name.toLowerCase().substring(2) as keyof HTMLElementEventMap, handler, options)
            }
        } else if (name == 'style' && value instanceof Object) {
            // Special handling for style object
            for (const key of Object.keys(value)) {
                const keyValue = value[key]
                if (keyValue && keyValue.endsWith('!important')) {
                    // Important requires setProperty() call
                    element.style.setProperty(lowerCamelToHypenCase(key), keyValue.substring(0,keyValue.length - 10), 'important')
                } else if (key[0] == '-') {
                    // Support CSS properties that start with dash
                    element.style.setProperty(key, keyValue == null ? '' : keyValue)
                } else if (keyValue == null) {
                    element.style[key as any] = ''
                } else {
                    // Note: any is used here because "keyof typeof element.style" clashes with "length" and "parentRule" being readonly
                    element.style[key as any] = keyValue
                }
            }
        } else if (typeof value == 'boolean') {
            if (name.startsWith('aria-') || name.startsWith('data-')) {
                // Always set the attribute for aria- and data- attributes
                setAttributeHelper(element, name, String(value))
            } else if (value) {
                // Boolean true gets set to empty string, boolean false does not get set
                setAttributeHelper(element, name, '')
            }
        } else if (typeof value == 'function') {
            // Avoid setting the attribute if the value is a function
        } else if (value) {
            // Regular attribute
            setAttributeHelper(element, name, value)
        }
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
export function createElement(tag: 'span', attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLSpanElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: 'div', attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLDivElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: string, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: Type<Component<any, Component<any, any>>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: Type<Component<any, RenderObject<any, any>>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: Type<Component<any, RenderObject<any, never>>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: Type<Component<any, HTMLElement>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: Type<Component<any, SVGSVGElement>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): SVGSVGElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: Type<Component<any, MathMLElement>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): MathMLElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: FunctionComponent<any>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): ChildrenTypes[] | AnchorElement | BasicTypes
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: Type<Component<any, any>> | FunctionComponent<any> | string, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): ChildrenTypes[] | AnchorElement | BasicTypes {
    const notNullAttrs = attrs || {}
    if (typeof tag === 'string') {
        // Base HTML Element
        const element = document.createElement(tag)
        setAttrsOnElement(element, notNullAttrs)
        if (tag == 'template') {
            // Template elements' children get attached to the DocumentFragment content
            appendChild((element as HTMLTemplateElement).content, children)
        } else {
            // Append children to the element
            appendChild(element, children)
        }
        return element
    } else if (instanceOfComponent(tag.prototype)) {
        // Create and register Component
        const internalComponent = new InternalComponent(
            new (tag as Type<Component<any,any>>)(notNullAttrs, children),
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
        } else if (instanceOfSVGSVGElement(output)) {
            return wrapElementIfNeeded(output)
        } else if (instanceOfMathMLElement(output)) {
            return wrapElementIfNeeded(output)
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
export function createFragment(_attrs: Readonly<any>, ...children:  ChildrenTypes[]): ChildrenTypes[] {
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
export function getComponent<T>(componentElement: ChildrenTypes[] | AnchorElement | BasicTypes | null): T {
    if (!componentElement || componentElement instanceof Text || instanceOfBasicTypes(componentElement) || Array.isArray(componentElement)) {
        // Invalid case
        consoleError("Invalid element", componentElement)
        return null as T
    }
    const component = getDOMreference(getAttributeHelper(componentElement,domKeyName)||"")
    if (component && instanceOfInternalComponent(component)) {
        return component.c as T
    } else {
        // Invalid case
        consoleError("Invalid element", componentElement)
        return null as T
    }
}

/**
 * Appends a Root Component to an element that is on the document based on an elementId
 */
export function appendRootComponentTo(rootComponent: AnchorElement, elementId: string): AnchorElement | null {
    const element = document.getElementById(elementId)
    if (element) {
        mountComponentElement(rootComponent)
        element.appendChild(rootComponent)
        return rootComponent
    } else {
        consoleError("Append to null", rootComponent, elementId)
        return null
    }
}

/**
 * Parameters used on RenderObjectArray construction
 * 
 * @wrapperElementTag the HTML tag to use for the wrapper element (defaults to a \<div/> tag)
 * @wrapperAttrs attributes to set on the wrapper element
 * @renderFunction the renderFunction to pass to the underlying RenderObject instances on each data point
 * @handleUpdate advanced functionality used to more efficiently rerender instance elements
 */
export type RenderObjectArrayOptions<DataType, UpdateRefsType> = {
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
export class RenderObjectArray<DataType, UpdateRefsType = never> extends RenderObject<RenderObject<DataType, UpdateRefsType>[]> {
    #renderFunction: RenderObjectRenderFunctionType<DataType, UpdateRefsType>
    #handleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
    /**
     * Create a new RenderObjectArray
     * 
     * Options parameters used on RenderObjectArray construction:
     * 
     * @wrapperElementTag the HTML tag to use for the wrapper element (defaults to a \<div/> tag)
     * @wrapperAttrs attributes to set on the wrapper element
     * @renderFunction the renderFunction to pass to the underlying RenderObject instances on each data point
     * @handleUpdate advanced functionality used to more efficiently rerender instance elements
     */
    constructor(options: RenderObjectArrayOptions<DataType, UpdateRefsType>) {
        super([], (data: RenderObject<DataType, UpdateRefsType>[]) => {
            const mainElement: HTMLElement = createElement(options.wrapperElementTag || divTag, displayContents) as HTMLElement
            setAttrsOnElement(mainElement, options.wrapperAttrs)
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
        this.getElements().forEach(element => {
            element.appendChild(renderableElementToElement(obj))
        })
    }
    /**
     * Push all of the data points of newData[] into the Array
     */
    pushAll(newData: DataType[]): void {
        this.value = this.value.concat(newData.map(d => {
            const obj = new RenderObject<DataType, UpdateRefsType>(d, this.#renderFunction)
            this.getElements().forEach(element => {
                element.appendChild(renderableElementToElement(obj))
            })
            return obj
        }))
    }
    /**
     * Delete one or more data points from the Array
     */
    deleteAt(startIndex: number, deleteCount?: number): void {
        const oldData = this.value.splice(startIndex, deleteCount)
        oldData.forEach(function(d){d.release(true)})
    }
    /**
     * Delete a data point from the Array by value
     * 
     * (note: uses Array.findIndex() so runs in linear time)
     */
    delete(data: DataType): void {
        const found = this.value.findIndex(x=>x.value==data)
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
    /** Set the current value of this RenderObjectArray */
    override get value(): RenderObject<DataType, UpdateRefsType>[] {
        return super.get()
    }
    /** Set the current value of this RenderObjectArray */
    override set value(newData: RenderObject<DataType, UpdateRefsType>[]) {
        this.set(newData)
    }
    /** Set the current value of this RenderObjectArray */
    override set(newData: RenderObject<DataType, UpdateRefsType>[]): void {
        this.#releaseAll()
        super.set(newData)
    }
    /** Will unmount and release all rendered instances of this RenderObjectArray */
    override unmount(): void {
        super.unmount()
        this.#releaseAll()
    }
    /** Release the old underlying RenderObjects */
    #releaseAll(): void {
        this.value.forEach(function(d){d.release(false)})
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
        this.#releaseAll()
        this.getElements().forEach(element => {
            element.textContent = ""
        })
        this.value = []
    }
}

/** Attributes type for the HTML Component */
export type HTMLAttrsType = {
    /** which html tag to use for this element (defaults to \<div>, does not support \<svg> or \<math>) */
    tag?: string
    /** content to use in innerHTML */
    html: string
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
export class HTML<AttrsType extends HTMLAttrsType = HTMLAttrsType> extends Component<AttrsType> {
    /**
     * Renders this into a generic HTML element
     */
    override render(attrs: AttrsType): HTMLElement {
        const html = attrs.html
        const tag = attrs.tag
        const tempAttrs: any = {...attrs}
        delete tempAttrs.html
        delete tempAttrs.tag
        const container = createElement(tag || divTag, tempAttrs) as HTMLElement
        container.innerHTML = html || ""
        return container
    }
}

/** Attributes type for the SVG Component */
export type SVGAttrsType = {
    /** content to use in innerHTML of the \<svg> element */
    svg: string
}

/**
 * Custom SVG element
 * 
 * One special attr:
 * 
 * svg:string - content to use in innerHTML of the \<svg> element
 */
export class SVG<AttrsType extends SVGAttrsType = SVGAttrsType> extends Component<AttrsType,SVGSVGElement> {
    /**
     * Renders this into a \<svg\> element
     */
    override render(attrs: Readonly<AttrsType>): SVGSVGElement {
        const svg = attrs.svg
        const tempAttrs: any = {...attrs}
        delete tempAttrs.svg
        const container = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGSVGElement
        setAttrsOnElement(container, tempAttrs)
        container.innerHTML = svg || ""
        return container
    }
}

/** Attributes type for the MATH Component */
export type MATHAttrsType = {
    /** content to use in innerHTML of the \<math> element */
    math: string
}
/**
 * Custom MathML element
 * 
 * One special attr:
 * 
 * svg:string - content to use in innerHTML of the svg element
 */
export class MATH<AttrsType extends MATHAttrsType = MATHAttrsType> extends Component<AttrsType,MathMLElement> {
    /**
     * Renders this into a \<math\> element
     */
    override render(attrs: Readonly<AttrsType>): MathMLElement {
        const math = attrs.math
        const tempAttrs: any = {...attrs}
        delete tempAttrs.math
        const container = document.createElementNS("http://www.w3.org/1998/Math/MathML", "math") as MathMLElement
        setAttrsOnElement(container, tempAttrs)
        container.innerHTML = math || ""
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
    emittingObject: Component<any,any> | RenderObject<any, any> | RenderObject<any, never>
    /**
     * A simple string representing the type of event
     */
    event: string
    /**
     * Generic metadata about the event
     */
    data: any | undefined
    /**
     * Create a new VelotypeEvent
     */
    constructor(emittingObject: Component<any,any> | RenderObject<any, any> | RenderObject<any, never>, event: string, data?: any) {
        this.emittingObject = emittingObject
        this.event = event
        this.data = data
    }
}

/**
 * An Event Listener
 */
export type EventListener = (event: VelotypeEvent) => void

/**
 * Register an Event listener
 * 
 * Will receive all events dispatched with the listeningKey
 * 
 * Will be automatically cleaned up when the hasVtKey Component is released
 */
export function registerEventListener(hasVtKey: HasVtKey, listeningKey: string, listener: EventListener): void {
    registerListenerMap(listenersF, listeningKey, hasVtKey.vtKey, listener)
    registerListenerMap(listenersR, hasVtKey.vtKey, listeningKey, listener)
}
/**
 * Optimization function to register listeners to double maps
 */
function registerListenerMap(map: Map<string,Map<string,EventListener>>, firstKey: string, secondKey: string, listener: EventListener): void {
    const keyListeners = map.get(firstKey)
    if (keyListeners !== undefined) {
        keyListeners.set(secondKey, listener)
    } else {
        const newKeyListeners = new Map<string,EventListener>()
        newKeyListeners.set(secondKey, listener)
        map.set(firstKey, newKeyListeners)
    }
}
/**
 * Manually remove and clean up all EventListeners that are listening to
 * a particular hasVtKey Component and listeningKey
 */
export function removeEventListeners(hasVtKey: HasVtKey, listeningKey: string): void {
    removeListenerMap(listenersF, listeningKey, hasVtKey.vtKey)
    removeListenerMap(listenersR, hasVtKey.vtKey, listeningKey)
}
/**
 * Cleanup all EventListeners that are registered with a hasVtKey Component
 */
function removeComponentListeners(hasVtKey: HasVtKey): void {
    const keyListeners = listenersR.get(hasVtKey.vtKey)
    if (keyListeners) {
        Array.from(keyListeners.keys()).forEach(listeningKey => {
            removeListenerMap(listenersF, listeningKey, hasVtKey.vtKey)
            removeListenerMap(listenersR, hasVtKey.vtKey, listeningKey)
        })
    }
}
/**
 * Optimization function to remove listeners from double maps
 */
function removeListenerMap(map: Map<string,Map<string,EventListener>>, firstKey: string, secondKey: string): void {
    const keyListeners = map.get(firstKey)
    if (keyListeners !== undefined) {
        const listener = keyListeners.get(secondKey)
        if (listener !== undefined) {
            keyListeners.delete(secondKey)
            if (keyListeners.size <= 0) {
                map.delete(firstKey)
            }
        } else {
            consoleLog("WARN removing event listener, secondKey is not present", firstKey, secondKey)
        }
    } else {
        consoleLog("WARN removing event listener, firstKey is not present", firstKey, secondKey)
    }
}
/**
 * Emit a VelotypeEvent on a listeningKey
 */
export function emitEvent(listeningKey: string, event: VelotypeEvent, hasVtKey?: HasVtKey): void {
    const keyListeners = listenersF.get(listeningKey)
    if (keyListeners !== undefined) {
        keyListeners.entries().forEach(([vtKey, listener]) => {
            // The Component that emitted the Event does not also receive it
            if (!hasVtKey || hasVtKey.vtKey != vtKey) {
                listener(event)
            }
        })
    } else {
        consoleLog("WARN, event emitted with no listeners", listeningKey, event)
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
    if (sheet) {
        // If we should not reset the style, then return
        if (!resetSheet) {
            return
        }
        // Remove old stylesheet, then continue
        const index = document.adoptedStyleSheets.findIndex(sh=>sh==sheet.sheet)
        document.adoptedStyleSheets.splice(index, 1)
    }
    const styleSheet = new CSSStyleSheet()
    styleSheet.replace(sheetText)
    document.adoptedStyleSheets.push(styleSheet)
    styleSectionMounted.set(sheetKey, {
        sheet: styleSheet,
        text: sheetText,
        key: sheetKey
    })
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
