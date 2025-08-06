// deno-lint-ignore-file no-unused-vars no-explicit-any

/**
 * Implementation TODOs:
 * 
 * - Support web components similar to: https://preactjs.com/guide/v10/web-components/
 * - Allow BasicComponent<string|number> to be set as attribute values
 * - Set up types for AddEventListenerOptions
 * - Create a DebugMode flag to enable a few optimizations (like not keeping styleSheetText up to date)
 * - Figure out a pattern for user-specified custom attributes
 * ---- https://www.typescriptlang.org/docs/handbook/jsx.html
 * ---- Note: If an attribute name is not a valid JS identifier (like a data-* attribute), it is not considered to be an error if it is not found in the element attributes type.
 * - Better understand https://jsr.io/go/banned-triple-slash-directives
 * - Test readonly on HasVtKey.vtKey
 * - Make attrs a more specific type than any
 * - Test code similar to https://github.com/preactjs/preact/issues/3927
 * - Test https://custom-elements-everywhere.com/
 * - Figure out how to get JSX.IntrinsicElements moved to a different file
 */

/**
 * These are the types that can be used as a Component's anchor, they can
 * register a componentKey (aka a vtKey) and are mountable/unmountable
 */
export type AnchorElement = HTMLElement | SVGSVGElement | MathMLElement

/** Basic primitives that are renderable directly */
export type BasicTypes = string | bigint | number | boolean

/** These are things that can be returned from Component.render() */
export type RenderableElements = AnchorElement | Component<any,any> | RenderObject<any, any>

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


/** Regular console.log() - used for JS minification */
const consoleLog = console.log
/** Regular console.error() - used for JS minification */
const consoleError = console.error

/** Style display:contents; */
const displayContents = {style: "display:contents;"}

/** Style display:none; */
const displayNone = {style: "display:none;"}

/** String "div" */
const divTag = "div"

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
function instanceOfRenderObject(something: any): something is RenderObject<any, any> {
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

/** Call setAttribute() - used for JS minification */
function setAttributeHelper(element: Element | SVGSVGElement | SVGPathElement, qualifiedName: string, value: string): void {
    element.setAttribute(qualifiedName, value)
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
    return text.replace(/[A-Z]/g, function(char) {return "-"+char.toLowerCase()})
}

/** Map of DOM keys to Velotype Component references */
const domReferences: Map<string, InternalComponent | MultiRenderable> = new Map<string, InternalComponent | MultiRenderable>()

/** The next key to use for DOM bindings */
let domNextKey: bigint = 1n

// deno-lint-ignore prefer-const
let domKeyName = "vk"

/** Velotype Event bus - Forward map listeningKey -> vtKey -> listener */
const listenersF: Map<string, Map<string, EventListener>> = new Map<string,Map<string,EventListener>>()
/** Velotype Event bus - Reverse map vtKey -> listeningKey -> listener */
const listenersR: Map<string, Map<string, EventListener>> = new Map<string,Map<string,EventListener>>()

/** String representing mounted CSS style content */
let styleSheetText = ""

type StyleSection = {
    index: number
    sheet: CSSStyleSheet
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
    /** Key name for DOM bindings, only changeable prior to mounting any Components */
    domKeyName: domKeyName,
    /** Map of DOM keys to Velotype Component references */
    domReferences: domReferences,

    // ------- For Event Bus -------
    /** Forward map listeningKey -> vtKey -> listener */
    listenersF: listenersF,
    /** Reverse map vtKey -> listeningKey -> listener */
    listenersR: listenersR,

    // ------- For Styles -------
    /** String representing mounted CSS style content */
    styleSheetText: styleSheetText,
    /** Map of style keys to ensure each style key is only mounted once */
    styleSectionMounted: styleSectionMounted,

}

// ----------------------------------------------------------------------
//                             DOM handling
// ----------------------------------------------------------------------
/**
 * An interface for objects that can hold componentKeys
 */
export interface HasVtKey {
    /**
     * A unique key per instance of each Velotype renderable object.
     * 
     * These keys are read-only and set by Velotype Core on object construction and are not overridable
     */
    vtKey: string
}
/**
 * domReferences.get(key) - used for JS minification
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
        return child.renderNew()
    } else if (instanceOfComponent(child)) {
        // Get InternalComponent reference from Component's vtKey
        const component = getDOMreference(child.vtKey)
        if (component) {
            if (instanceOfInternalComponent(component)) {
                return component.e
            }
        }
    }
    consoleError("Internal typescript error")
    return hiddenElement()
}
/**
 * Appends children to an HTMLElement (unwraps Arrays, generates new instance components for
 * RenderObjects, wraps BasicTypes in TextNodes)
 * 
 * @param parent HTMLElement to append to
 * @param child Children to append
 */
function appendChild(parent: HTMLElement, child: ChildrenTypes[] | ChildrenTypes): void {
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
 * @returns \<div style="display:none;"/>
 */
function hiddenElement(): HTMLElement {
    return createElement(divTag,displayNone)
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
 * If a render operation returns a Component or RenderObject as a result of render then
 * it needs to be wrapped in another HTMLElement for rendering to work properly
 * 
 * @param element The raw rendered element
 * @returns The original element or a wrapped element (or a hidden element if element is falsey)
 */
function wrapElementIfNeeded(element: null | undefined): HTMLElement
function wrapElementIfNeeded(element: SVGSVGElement): AnchorElement
function wrapElementIfNeeded(element: MathMLElement): AnchorElement
function wrapElementIfNeeded(element: HTMLElement): HTMLElement
function wrapElementIfNeeded(element: AnchorElement): AnchorElement
function wrapElementIfNeeded(element: Component<any,any>): HTMLElement
function wrapElementIfNeeded(element: RenderObject<any,any>): HTMLElement
function wrapElementIfNeeded(element: Component<any,any> | RenderObject<any,any>): HTMLElement
function wrapElementIfNeeded(element: HTMLElement | Component<any,any> | RenderObject<any,any> | null | undefined): HTMLElement
function wrapElementIfNeeded(element: RenderableElements | null | undefined): AnchorElement {
    // Check for falsey
    if (!element) {
        return hiddenElement()
    }
    // If a Component returns a Component or RenderObject as a result of render
    // then it needs to be wrapped in another HTMLElement for rendering to work properly
    if (instanceOfComponent(element) || instanceOfRenderObject(element) || element.hasAttribute(domKeyName)) {
        return createElement(divTag,displayContents,element)
    }
    return element
}

/**
 * Represents an object that can render into multiple instance elements
 * 
 * These are Velotype internal functions
 * 
 * DO NOT CALL directly (will be called by Velotype core)
 */
export interface MultiRenderable {
    /**
     * Velotype internal function
     * 
     * DO NOT CALL directly (will be called by Velotype core)
     * 
     * Used to unmount an instance element of a MultiRenderable object
     */
    unmountKey: (key: string) => void
    /**
     * Velotype internal function
     * 
     * DO NOT CALL directly (will be called by Velotype core)
     * 
     * Used to generate new instance elements of a MultiRenderable object
     */
    renderNew: () => void
}
/**
 * Represents a Component that is mountable / unmountable
 */
export interface Mountable {
    /**
     * Mount is called just after a Component is attached to the DOM.
     */
    mount: () => void

    /**
     * Unmount is called just before a Component is removed from the DOM.
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
 * An RenderObject is an efficient way of rendering Objects to potentially multiple HTMLElements
 * changes to the value of the underlying Data Object will propogate to all attached elements.
 * 
 * @template DataType The type of the underlying Data Object
 * @template UpdateRefsType An advanced capability of RenderObject to more efficiently re-render instance elements
 */
export class RenderObject<DataType, UpdateRefsType = never> implements MultiRenderable, HasVtKey, Mountable {
    #data: DataType
    #renderFunction: ((data: DataType) => AnchorElement | UpdateHandlerLink<UpdateRefsType>) | ((data: DataType, renderObject: RenderObject<DataType, UpdateRefsType>) => AnchorElement | UpdateHandlerLink<UpdateRefsType>)
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
        emitEvent(this.#eventListeningKey(), new VelotypeEvent(this,"onChange"))
    }
    /**
     * Create a new RenderObject
     * 
     * @param initialData the initial data to use to render this RenderObject with
     * @param renderFunction a function that renders a data value into an AnchorElement
     * @param handleUpdate advanced functionality used to highly optimize rendering on value updates
     */
    constructor(initialData: DataType,
        renderFunction: ((data: DataType) => AnchorElement | UpdateHandlerLink<UpdateRefsType>) | ((data: DataType, renderObject: RenderObject<DataType, UpdateRefsType>) => AnchorElement | UpdateHandlerLink<UpdateRefsType>),
        handleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
    ) {
        this.#data = initialData
        this.#renderFunction = renderFunction
        this.#handleUpdate = handleUpdate
    }

    /**
     * Register an EventListener to receive an onChange event when the value of
     * this RenderObject changes.
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
    registerOnMount(onMount?: () => void, onUnmount?: () => void): RenderObject<DataType, UpdateRefsType> {
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
    unmountKey(key: string): boolean {
        const element = this.#elements.get(key)
        if (element) {
            const componentKey = getAttributeHelper(element, domKeyName)
            if (key == componentKey) {
                this.#elements.delete(componentKey)
                this.#updateRefs.delete(componentKey)
                releaseVtKey(componentKey||"")
                return true
            } else {
                consoleError("Invalid state", key, componentKey)
                return false
            }
        } else {
            consoleError("Invalid unmountKey", key)
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
    renderNew(): AnchorElement {
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
        Array.from(this.#elements.entries()).forEach(([key, element]) => {
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
        // TODO Check if Array.from() is really needed here (and in a few other places in this class)
        Array.from(this.#elements.entries()).forEach(([key, element]) => {
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
            return createElement("span", null, data.toString())
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
 * Will unmount an element and then .remove() it
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
    k: string

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
 * Call .mount() on linked Components
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
 * Call .unmount() on linked Components and release vtKeys
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
        component.unmountKey(key)
    }
}
/**
 * Unount the children of this element
 */
function unmountComponentElementChildren(element: HTMLElement): void {
    traverseElementChildren(element, unmountComponentElementHelper)
}
/**
 * Unount this element and all children
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
 * eventListeners support \<div onClick:{()=>{alert()}}, onClickOptions: {<AddEventListenerOptions>} />
 * 
 * The attrs.style object will unfurl keys(style) into a .join(";") string converting lowerCamelCase to hypen-case
 * 
 * Boolean values are set as empty attributes when true and unset when false
 */
function setAttrsOnElement(element: Element, attrs?: Readonly<any> | null): void {
    if (!attrs) {
        return
    }
    for (const [name, value] of Object.entries(attrs || {})) {
        if (name.startsWith('on') && (name.toLowerCase() in window || name.endsWith("Options"))) {
            // Special handling for event listener attributes
            // Example attrs: {onClick: ()=>{}, onClickOptions: {<AddEventListenerOptions>}}

            // TODO change this to accept an object on the same key
            // Skip Options objects (those are used on the EventListener pass)
            if (!name.endsWith("Options")) {
                if (value) { // Check for <div onClick={null}>
                    let options: boolean | AddEventListenerOptions | undefined = undefined
                    if (attrs[name+"Options"]) {
                        options = attrs[name+"Options"]
                    }
                    element.addEventListener(name.toLowerCase().substring(2) as keyof HTMLElementEventMap, value as (this: HTMLElement, ev: Event | UIEvent | WheelEvent) => any, options)
                }
            }
        } else if (name == "style" && value instanceof Object) {
            // Special handling for style object
            // TODO learn from: https://github.com/preactjs/preact/blob/main/src/diff/props.js#L4 and remove string-based handling
            const styleAttributes = []
            for (const key of Object.keys(value)) {
                styleAttributes.push(lowerCamelToHypenCase(key)+":"+value[key as keyof typeof value])
            }
            const styleValue = styleAttributes.join(";")
            setAttributeHelper(element, name, styleValue)
        } else if (typeof value == "boolean") {
            // Boolean true gets set to empty string, boolean false does not get set
            // TODO check for aria- and data- and allow boolen false
            if (value) {
                setAttributeHelper(element, name, "")
            }
        } else if (value) {
            // TODO check for typeof = 'function' and avoid setting the attribute
            // Regular string-based attribute
            setAttributeHelper(element, name, value.toString())
        }
    }
}

/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * \<tag attrOne={} attrTwo={}>{children}\</tag>
 */
function createElement(tag: "span", attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLSpanElement
function createElement(tag: "div", attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLDivElement
function createElement(tag: string, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLElement
function createElement(tag: Type<Component<any,Component<any,any>>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLElement
function createElement(tag: Type<Component<any,RenderObject<any,any>>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLElement
function createElement(tag: Type<Component<any,HTMLElement>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): HTMLElement
function createElement(tag: Type<Component<any,SVGSVGElement>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): SVGSVGElement
function createElement(tag: Type<Component<any,MathMLElement>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): MathMLElement
function createElement(tag: FunctionComponent<any>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): ChildrenTypes[] | AnchorElement | BasicTypes
function createElement(tag: Type<Component<any,any>> | FunctionComponent<any> | string, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): ChildrenTypes[] | AnchorElement | BasicTypes {
    const notNullAttrs = attrs || {}
    if (typeof tag === 'string') {
        // Base HTML Element
        const element = document.createElement(tag)
        setAttrsOnElement(element, notNullAttrs)
        // Append children
        appendChild(element, children)
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
    consoleError("Invalid tag", tag, notNullAttrs, children)
    return hiddenElement()
}

/** Short style tsx createElement */
export const h:
    ((tag: "span", attrs: Readonly<any> | null, ...children: ChildrenTypes[]) => HTMLSpanElement)
    | ((tag: "div", attrs: Readonly<any> | null, ...children: ChildrenTypes[]) => HTMLDivElement)
    | ((tag: string, attrs: Readonly<any> | null, ...children: ChildrenTypes[]) => HTMLElement)
    | ((tag: Type<Component<any,Component<any,any>>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]) => HTMLElement)
    | ((tag: Type<Component<any,RenderObject<any,any>>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]) => HTMLElement)
    | ((tag: Type<Component<any,HTMLElement>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]) => HTMLElement)
    | ((tag: Type<Component<any,SVGSVGElement>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]) => SVGSVGElement)
    | ((tag: Type<Component<any,MathMLElement>>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]) => MathMLElement)
    | ((tag: FunctionComponent<any>, attrs: Readonly<any> | null, ...children: ChildrenTypes[]) => ChildrenTypes[] | AnchorElement | BasicTypes)
    | ((tag: Type<Component<any,any>> | FunctionComponent<any> | string, attrs: Readonly<any> | null, ...children: ChildrenTypes[]) => ChildrenTypes[] | AnchorElement | BasicTypes)
    = createElement

/**
 * Create an fragment \<></> (which just propagates an array of children[])
 */
function createFragment(_attrs: Readonly<any>, ...children:  ChildrenTypes[]): ChildrenTypes[] {
    return children
}

/** Short style tsx createFragment */
export const f: (_attrs: Readonly<any>, ...children: ChildrenTypes[]) => ChildrenTypes[] = createFragment

/**
 * Get the js class object of a constructed Component
 * 
 * Usage:
 * 
 *     class ComplexComponent extends Component<EmptyAttrs> {
 *         override render() {
 *             return <div>This is a complex Component</div>
 *         }
 *         someMethod() {
 *             console.log("ComplexComponent method called")
 *         }
 *     }
 * 
 *     //Somewhere else
 *     const foo = getComponent<ComplexComponent>(<ComplexComponent/>)
 *     foo.someMethod()
 * 
 *     //Can then be used in tsx directly:
 *     return <div>{foo}</div>
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
 * Type for a renderFunction in a RenderObjectArray
 * 
 * (currently only supports rendering to HTMLElements for RenderObjectArray)
 */
export type RenderObjectArrayRenderFunctionType<DataType, UpdateRefsType> = ((data: DataType) => HTMLElement | UpdateHandlerLink<UpdateRefsType>) | ((data: DataType, renderObject: RenderObject<DataType, UpdateRefsType>) => HTMLElement | UpdateHandlerLink<UpdateRefsType>)
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
    renderFunction: RenderObjectArrayRenderFunctionType<DataType, UpdateRefsType>,
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
    #renderFunction: RenderObjectArrayRenderFunctionType<DataType, UpdateRefsType>
    #handleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
    /** Create a new RenderObjectArray */
    constructor(options: RenderObjectArrayOptions<DataType, UpdateRefsType>) {
        super([], (data: RenderObject<DataType, UpdateRefsType>[]) => {
            const mainElement = createElement(options.wrapperElementTag || divTag, displayContents)
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
        const container = createElement(tag || divTag, tempAttrs)
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
    emittingObject: Component<any,any> | RenderObject<any,any>
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
    constructor(emittingObject: Component<any,any> | RenderObject<any,any>, event: string, data?: any) {
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
        document.adoptedStyleSheets.splice(sheet.index, 1)
    }
    const styleSheet = new CSSStyleSheet()
    styleSheet.replace(sheetText)
    document.adoptedStyleSheets.push(styleSheet)
    styleSectionMounted.set(sheetKey, {index: document.adoptedStyleSheets.length, sheet: styleSheet, key: sheetKey})

    //Update a running copy of all StyleSheet text for debugging
    styleSheetText = Array.from(styleSectionMounted.values().map(sheet=>{return `
/* ${sheet.key} */
${sheet.sheet}`
    })).join("")
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------


















// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
//                             JSX types
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// This is a horrible solution, but the only thing I could get working
// JSX.IntrinsicElements needs to be exported under h.JSX{} and
// to be published to JSR cannot use `declare global {}`
//
// From here down should be moved to a different file,
// just need to figure out how to do so
//



/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent) */
interface CommandEvent extends Event {
	/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/source) */
	readonly source: Element | null
	/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/command) */
	readonly command: string
}

declare const CommandEvent: {
	prototype: CommandEvent
	new (type: string, eventInitDict?: CommandEventInit): CommandEvent
}

interface CommandEventInit extends EventInit {
	source: Element | null;
	command: string
}

type Booleanish = boolean | 'true' | 'false'

export declare namespace h {

export namespace JSX {
    type TargetedEvent<Target extends EventTarget = EventTarget, TypedEvent extends Event = Event> = Omit<TypedEvent, 'currentTarget'> & {readonly currentTarget: Target}

    type TargetedAnimationEvent<Target extends EventTarget> = TargetedEvent<Target, AnimationEvent>
    type TargetedClipboardEvent<Target extends EventTarget> = TargetedEvent<Target, ClipboardEvent>
    type TargetedCommandEvent<Target extends EventTarget> = TargetedEvent<Target, CommandEvent>
    type TargetedCompositionEvent<Target extends EventTarget> = TargetedEvent<Target, CompositionEvent>
    type TargetedDragEvent<Target extends EventTarget> = TargetedEvent<Target, DragEvent>
    type TargetedFocusEvent<Target extends EventTarget> = TargetedEvent<Target, FocusEvent>
    type TargetedInputEvent<Target extends EventTarget> = TargetedEvent<Target, InputEvent>
    type TargetedKeyboardEvent<Target extends EventTarget> = TargetedEvent<Target, KeyboardEvent>
    type TargetedMouseEvent<Target extends EventTarget> = TargetedEvent<Target, MouseEvent>
    type TargetedPointerEvent<Target extends EventTarget> = TargetedEvent<Target, PointerEvent>
    type TargetedSubmitEvent<Target extends EventTarget> = TargetedEvent<Target, SubmitEvent>
    type TargetedTouchEvent<Target extends EventTarget> = TargetedEvent<Target, TouchEvent>
    type TargetedToggleEvent<Target extends EventTarget> = TargetedEvent<Target, ToggleEvent>
    type TargetedTransitionEvent<Target extends EventTarget> = TargetedEvent<Target, TransitionEvent>
    type TargetedUIEvent<Target extends EventTarget> = TargetedEvent<Target, UIEvent>
    type TargetedWheelEvent<Target extends EventTarget> = TargetedEvent<Target, WheelEvent>
    type TargetedPictureInPictureEvent<Target extends EventTarget> = TargetedEvent<Target, PictureInPictureEvent>

    // XXX TODO - figure out what this bivariance hack is
    /*export type EventHandler<E extends TargetedEvent> = {
        bivarianceHack(event: E): void
    }['bivarianceHack']*/
    type EventHandler<E extends TargetedEvent> = (event: E) => void

    type AnimationEventHandler<Target extends EventTarget> = EventHandler<TargetedAnimationEvent<Target>>
    type ClipboardEventHandler<Target extends EventTarget> = EventHandler<TargetedClipboardEvent<Target>>
    type CommandEventHandler<Target extends EventTarget> = EventHandler<TargetedCommandEvent<Target>>
    type CompositionEventHandler<Target extends EventTarget> = EventHandler<TargetedCompositionEvent<Target>>
    type DragEventHandler<Target extends EventTarget> = EventHandler<TargetedDragEvent<Target>>
    type ToggleEventHandler<Target extends EventTarget> = EventHandler<TargetedToggleEvent<Target>>
    type FocusEventHandler<Target extends EventTarget> = EventHandler<TargetedFocusEvent<Target>>
    type GenericEventHandler<Target extends EventTarget> = EventHandler<TargetedEvent<Target>>
    type InputEventHandler<Target extends EventTarget> = EventHandler<TargetedInputEvent<Target>>
    type KeyboardEventHandler<Target extends EventTarget> = EventHandler<TargetedKeyboardEvent<Target>>
    type MouseEventHandler<Target extends EventTarget> = EventHandler<TargetedMouseEvent<Target>>
    type PointerEventHandler<Target extends EventTarget> = EventHandler<TargetedPointerEvent<Target>>
    type SubmitEventHandler<Target extends EventTarget> = EventHandler<TargetedSubmitEvent<Target>>
    type TouchEventHandler<Target extends EventTarget> = EventHandler<TargetedTouchEvent<Target>>
    type TransitionEventHandler<Target extends EventTarget> = EventHandler<TargetedTransitionEvent<Target>>
    type UIEventHandler<Target extends EventTarget> = EventHandler<TargetedUIEvent<Target>>
    type WheelEventHandler<Target extends EventTarget> = EventHandler<TargetedWheelEvent<Target>>
    type PictureInPictureEventHandler<Target extends EventTarget> = EventHandler<TargetedPictureInPictureEvent<Target>>

    interface DOMAttributes<Target extends EventTarget> {
        // Image Events
        onLoad?: GenericEventHandler<Target>
        onLoadCapture?: GenericEventHandler<Target>
        onError?: GenericEventHandler<Target>
        onErrorCapture?: GenericEventHandler<Target>

        // Clipboard Events
        onCopy?: ClipboardEventHandler<Target>
        onCopyCapture?: ClipboardEventHandler<Target>
        onCut?: ClipboardEventHandler<Target>
        onCutCapture?: ClipboardEventHandler<Target>
        onPaste?: ClipboardEventHandler<Target>
        onPasteCapture?: ClipboardEventHandler<Target>

        // Composition Events
        onCompositionEnd?: CompositionEventHandler<Target>
        onCompositionEndCapture?: CompositionEventHandler<Target>
        onCompositionStart?: CompositionEventHandler<Target>
        onCompositionStartCapture?: CompositionEventHandler<Target>
        onCompositionUpdate?: CompositionEventHandler<Target>
        onCompositionUpdateCapture?: CompositionEventHandler<Target>

        // Popover Events
        onBeforeToggle?: ToggleEventHandler<Target>
        onToggle?: ToggleEventHandler<Target>

        // Dialog Events
        onClose?: GenericEventHandler<Target>
        onCancel?: GenericEventHandler<Target>

        // Focus Events
        onFocus?: FocusEventHandler<Target>
        onFocusCapture?: FocusEventHandler<Target>
        onFocusIn?: FocusEventHandler<Target>
        onFocusInCapture?: FocusEventHandler<Target>
        onFocusOut?: FocusEventHandler<Target>
        onFocusOutCapture?: FocusEventHandler<Target>
        onBlur?: FocusEventHandler<Target>
        onBlurCapture?: FocusEventHandler<Target>

        // Form Events
        onChange?: GenericEventHandler<Target>
        onChangeCapture?: GenericEventHandler<Target>
        onInput?: InputEventHandler<Target>
        onInputCapture?: InputEventHandler<Target>
        onBeforeInput?: InputEventHandler<Target>
        onBeforeInputCapture?: InputEventHandler<Target>
        onSearch?: GenericEventHandler<Target>
        onSearchCapture?: GenericEventHandler<Target>
        onSubmit?: SubmitEventHandler<Target>
        onSubmitCapture?: SubmitEventHandler<Target>
        onInvalid?: GenericEventHandler<Target>
        onInvalidCapture?: GenericEventHandler<Target>
        onReset?: GenericEventHandler<Target>
        onResetCapture?: GenericEventHandler<Target>
        onFormData?: GenericEventHandler<Target>
        onFormDataCapture?: GenericEventHandler<Target>

        // Keyboard Events
        onKeyDown?: KeyboardEventHandler<Target>
        onKeyDownCapture?: KeyboardEventHandler<Target>
        onKeyPress?: KeyboardEventHandler<Target>
        onKeyPressCapture?: KeyboardEventHandler<Target>
        onKeyUp?: KeyboardEventHandler<Target>
        onKeyUpCapture?: KeyboardEventHandler<Target>

        // Media Events
        onAbort?: GenericEventHandler<Target>
        onAbortCapture?: GenericEventHandler<Target>
        onCanPlay?: GenericEventHandler<Target>
        onCanPlayCapture?: GenericEventHandler<Target>
        onCanPlayThrough?: GenericEventHandler<Target>
        onCanPlayThroughCapture?: GenericEventHandler<Target>
        onDurationChange?: GenericEventHandler<Target>
        onDurationChangeCapture?: GenericEventHandler<Target>
        onEmptied?: GenericEventHandler<Target>
        onEmptiedCapture?: GenericEventHandler<Target>
        onEncrypted?: GenericEventHandler<Target>
        onEncryptedCapture?: GenericEventHandler<Target>
        onEnded?: GenericEventHandler<Target>
        onEndedCapture?: GenericEventHandler<Target>
        onLoadedData?: GenericEventHandler<Target>
        onLoadedDataCapture?: GenericEventHandler<Target>
        onLoadedMetadata?: GenericEventHandler<Target>
        onLoadedMetadataCapture?: GenericEventHandler<Target>
        onLoadStart?: GenericEventHandler<Target>
        onLoadStartCapture?: GenericEventHandler<Target>
        onPause?: GenericEventHandler<Target>
        onPauseCapture?: GenericEventHandler<Target>
        onPlay?: GenericEventHandler<Target>
        onPlayCapture?: GenericEventHandler<Target>
        onPlaying?: GenericEventHandler<Target>
        onPlayingCapture?: GenericEventHandler<Target>
        onProgress?: GenericEventHandler<Target>
        onProgressCapture?: GenericEventHandler<Target>
        onRateChange?: GenericEventHandler<Target>
        onRateChangeCapture?: GenericEventHandler<Target>
        onSeeked?: GenericEventHandler<Target>
        onSeekedCapture?: GenericEventHandler<Target>
        onSeeking?: GenericEventHandler<Target>
        onSeekingCapture?: GenericEventHandler<Target>
        onStalled?: GenericEventHandler<Target>
        onStalledCapture?: GenericEventHandler<Target>
        onSuspend?: GenericEventHandler<Target>
        onSuspendCapture?: GenericEventHandler<Target>
        onTimeUpdate?: GenericEventHandler<Target>
        onTimeUpdateCapture?: GenericEventHandler<Target>
        onVolumeChange?: GenericEventHandler<Target>
        onVolumeChangeCapture?: GenericEventHandler<Target>
        onWaiting?: GenericEventHandler<Target>
        onWaitingCapture?: GenericEventHandler<Target>

        // MouseEvents
        onClick?: MouseEventHandler<Target>
        onClickOptions?: boolean | AddEventListenerOptions //TODO add Options to all other on*
        onClickCapture?: MouseEventHandler<Target>
        onContextMenu?: MouseEventHandler<Target>
        onContextMenuCapture?: MouseEventHandler<Target>
        onDblClick?: MouseEventHandler<Target>
        onDblClickCapture?: MouseEventHandler<Target>
        onDrag?: DragEventHandler<Target>
        onDragCapture?: DragEventHandler<Target>
        onDragEnd?: DragEventHandler<Target>
        onDragEndCapture?: DragEventHandler<Target>
        onDragEnter?: DragEventHandler<Target>
        onDragEnterCapture?: DragEventHandler<Target>
        onDragExit?: DragEventHandler<Target>
        onDragExitCapture?: DragEventHandler<Target>
        onDragLeave?: DragEventHandler<Target>
        onDragLeaveCapture?: DragEventHandler<Target>
        onDragOver?: DragEventHandler<Target>
        onDragOverCapture?: DragEventHandler<Target>
        onDragStart?: DragEventHandler<Target>
        onDragStartCapture?: DragEventHandler<Target>
        onDrop?: DragEventHandler<Target>
        onDropCapture?: DragEventHandler<Target>
        onMouseDown?: MouseEventHandler<Target>
        onMouseDownCapture?: MouseEventHandler<Target>
        onMouseEnter?: MouseEventHandler<Target>
        onMouseEnterCapture?: MouseEventHandler<Target>
        onMouseLeave?: MouseEventHandler<Target>
        onMouseLeaveCapture?: MouseEventHandler<Target>
        onMouseMove?: MouseEventHandler<Target>
        onMouseMoveCapture?: MouseEventHandler<Target>
        onMouseOut?: MouseEventHandler<Target>
        onMouseOutCapture?: MouseEventHandler<Target>
        onMouseOver?: MouseEventHandler<Target>
        onMouseOverCapture?: MouseEventHandler<Target>
        onMouseUp?: MouseEventHandler<Target>
        onMouseUpCapture?: MouseEventHandler<Target>
        // TODO: Spec for `auxclick` events was changed to make it a PointerEvent but only
        // Chrome has support for it yet. When more browsers align we should change this.
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event#browser_compatibility
        onAuxClick?: MouseEventHandler<Target>
        onAuxClickCapture?: MouseEventHandler<Target>

        // Selection Events
        onSelect?: GenericEventHandler<Target>
        onSelectCapture?: GenericEventHandler<Target>

        // Touch Events
        onTouchCancel?: TouchEventHandler<Target>
        onTouchCancelCapture?: TouchEventHandler<Target>
        onTouchEnd?: TouchEventHandler<Target>
        onTouchEndCapture?: TouchEventHandler<Target>
        onTouchMove?: TouchEventHandler<Target>
        onTouchMoveCapture?: TouchEventHandler<Target>
        onTouchStart?: TouchEventHandler<Target>
        onTouchStartCapture?: TouchEventHandler<Target>

        // Pointer Events
        onPointerOver?: PointerEventHandler<Target>
        onPointerOverCapture?: PointerEventHandler<Target>
        onPointerEnter?: PointerEventHandler<Target>
        onPointerEnterCapture?: PointerEventHandler<Target>
        onPointerDown?: PointerEventHandler<Target>
        onPointerDownCapture?: PointerEventHandler<Target>
        onPointerMove?: PointerEventHandler<Target>
        onPointerMoveCapture?: PointerEventHandler<Target>
        onPointerUp?: PointerEventHandler<Target>
        onPointerUpCapture?: PointerEventHandler<Target>
        onPointerCancel?: PointerEventHandler<Target>
        onPointerCancelCapture?: PointerEventHandler<Target>
        onPointerOut?: PointerEventHandler<Target>
        onPointerOutCapture?: PointerEventHandler<Target>
        onPointerLeave?: PointerEventHandler<Target>
        onPointerLeaveCapture?: PointerEventHandler<Target>
        onGotPointerCapture?: PointerEventHandler<Target>
        onGotPointerCaptureCapture?: PointerEventHandler<Target>
        onLostPointerCapture?: PointerEventHandler<Target>
        onLostPointerCaptureCapture?: PointerEventHandler<Target>

        // UI Events
        onScroll?: UIEventHandler<Target>
        onScrollEnd?: UIEventHandler<Target>
        onScrollCapture?: UIEventHandler<Target>

        // Wheel Events
        onWheel?: WheelEventHandler<Target>
        onWheelCapture?: WheelEventHandler<Target>

        // Animation Events
        onAnimationStart?: AnimationEventHandler<Target>
        onAnimationStartCapture?: AnimationEventHandler<Target>
        onAnimationEnd?: AnimationEventHandler<Target>
        onAnimationEndCapture?: AnimationEventHandler<Target>
        onAnimationIteration?: AnimationEventHandler<Target>
        onAnimationIterationCapture?: AnimationEventHandler<Target>

        // Transition Events
        onTransitionCancel?: TransitionEventHandler<Target>
        onTransitionCancelCapture?: TransitionEventHandler<Target>
        onTransitionEnd?: TransitionEventHandler<Target>
        onTransitionEndCapture?: TransitionEventHandler<Target>
        onTransitionRun?: TransitionEventHandler<Target>
        onTransitionRunCapture?: TransitionEventHandler<Target>
        onTransitionStart?: TransitionEventHandler<Target>
        onTransitionStartCapture?: TransitionEventHandler<Target>

        // PictureInPicture Events
        onEnterPictureInPicture?: PictureInPictureEventHandler<Target>
        onEnterPictureInPictureCapture?: PictureInPictureEventHandler<Target>
        onLeavePictureInPicture?: PictureInPictureEventHandler<Target>
        onLeavePictureInPictureCapture?: PictureInPictureEventHandler<Target>
        onResize?: PictureInPictureEventHandler<Target>
        onResizeCapture?: PictureInPictureEventHandler<Target>

        onCommand?: CommandEventHandler<Target>
    }

    // All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
    interface AriaAttributes {
        /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
        'aria-activedescendant'?: string
        /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
        'aria-atomic'?: Booleanish
        /**
         * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
         * presented if they are made.
         */
        'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'
        /**
         * Defines a string value that labels the current element, which is intended to be converted into Braille.
         * @see aria-label.
         */
        'aria-braillelabel'?: string
        /**
         * Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille.
         * @see aria-roledescription.
         */
        'aria-brailleroledescription'?: string
        /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
        'aria-busy'?: Booleanish
        /**
         * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
         * @see aria-pressed
         * @see aria-selected.
         */
        'aria-checked'?: Booleanish | 'mixed'
        /**
         * Defines the total number of columns in a table, grid, or treegrid.
         * @see aria-colindex.
         */
        'aria-colcount'?: number
        /**
         * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
         * @see aria-colcount
         * @see aria-colspan.
         */
        'aria-colindex'?: number
        /**
         * Defines a human readable text alternative of aria-colindex.
         * @see aria-rowindextext.
         */
        'aria-colindextext'?: string
        /**
         * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-colindex
         * @see aria-rowspan.
         */
        'aria-colspan'?: number
        /**
         * Identifies the element (or elements) whose contents or presence are controlled by the current element.
         * @see aria-owns.
         */
        'aria-controls'?: string
        /** Indicates the element that represents the current item within a container or set of related elements. */
        'aria-current'?: Booleanish | 'page' | 'step' | 'location' | 'date' | 'time'
        /**
         * Identifies the element (or elements) that describes the object.
         * @see aria-labelledby
         */
        'aria-describedby'?: string
        /**
         * Defines a string value that describes or annotates the current element.
         * @see related aria-describedby.
         */
        'aria-description'?: string
        /**
         * Identifies the element that provides a detailed, extended description for the object.
         * @see aria-describedby.
         */
        'aria-details'?: string
        /**
         * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
         * @see aria-hidden
         * @see aria-readonly.
         */
        'aria-disabled'?: Booleanish
        /**
         * Identifies the element that provides an error message for the object.
         * @see aria-invalid
         * @see aria-describedby.
         */
        'aria-errormessage'?: string
        /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
        'aria-expanded'?: Booleanish
        /**
         * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
         * allows assistive technology to override the general default of reading in document source order.
         */
        'aria-flowto'?: string
        /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
        'aria-haspopup'?: Booleanish | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
        /**
         * Indicates whether the element is exposed to an accessibility API.
         * @see aria-disabled.
         */
        'aria-hidden'?: Booleanish
        /**
         * Indicates the entered value does not conform to the format expected by the application.
         * @see aria-errormessage.
         */
        'aria-invalid'?: Booleanish | 'grammar' | 'spelling'
        /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
        'aria-keyshortcuts'?: string
        /**
         * Defines a string value that labels the current element.
         * @see aria-labelledby.
         */
        'aria-label'?: string
        /**
         * Identifies the element (or elements) that labels the current element.
         * @see aria-describedby.
         */
        'aria-labelledby'?: string
        /** Defines the hierarchical level of an element within a structure. */
        'aria-level'?: number
        /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
        'aria-live'?: 'off' | 'assertive' | 'polite'
        /** Indicates whether an element is modal when displayed. */
        'aria-modal'?: Booleanish
        /** Indicates whether a text box accepts multiple lines of input or only a single line. */
        'aria-multiline'?: Booleanish
        /** Indicates that the user may select more than one item from the current selectable descendants. */
        'aria-multiselectable'?: Booleanish
        /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
        'aria-orientation'?: 'horizontal' | 'vertical'
        /**
         * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
         * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
         * @see aria-controls.
         */
        'aria-owns'?: string
        /**
         * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
         * A hint could be a sample value or a brief description of the expected format.
         */
        'aria-placeholder'?: string
        /**
         * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-setsize.
         */
        'aria-posinset'?: number
        /**
         * Indicates the current "pressed" state of toggle buttons.
         * @see aria-checked
         * @see aria-selected.
         */
        'aria-pressed'?: Booleanish | 'mixed'
        /**
         * Indicates that the element is not editable, but is otherwise operable.
         * @see aria-disabled.
         */
        'aria-readonly'?: Booleanish
        /**
         * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
         * @see aria-atomic.
         */
        'aria-relevant'?: 'additions' | 'additions removals' | 'additions text' | 'all' | 'removals'
            | 'removals additions' | 'removals text' | 'text' | 'text additions' | 'text removals'
        /** Indicates that user input is required on the element before a form may be submitted. */
        'aria-required'?: Booleanish
        /** Defines a human-readable, author-localized description for the role of an element. */
        'aria-roledescription'?: string
        /**
         * Defines the total number of rows in a table, grid, or treegrid.
         * @see aria-rowindex.
         */
        'aria-rowcount'?: number
        /**
         * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
         * @see aria-rowcount
         * @see aria-rowspan.
         */
        'aria-rowindex'?: number
        /**
         * Defines a human readable text alternative of aria-rowindex.
         * @see aria-colindextext.
         */
        'aria-rowindextext'?: string
        /**
         * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-rowindex
         * @see aria-colspan.
         */
        'aria-rowspan'?: number
        /**
         * Indicates the current "selected" state of various widgets.
         * @see aria-checked
         * @see aria-pressed.
         */
        'aria-selected'?: Booleanish
        /**
         * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-posinset.
         */
        'aria-setsize'?: number
        /** Indicates if items in a table or grid are sorted in ascending or descending order. */
        'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other'
        /** Defines the maximum allowed value for a range widget. */
        'aria-valuemax'?: number
        /** Defines the minimum allowed value for a range widget. */
        'aria-valuemin'?: number
        /**
         * Defines the current value for a range widget.
         * @see aria-valuetext.
         */
        'aria-valuenow'?: number
        /** Defines the human readable text alternative of aria-valuenow for a range widget. */
        'aria-valuetext'?: string
    }

    // All the WAI-ARIA 1.2 role attribute values from https://www.w3.org/TR/wai-aria-1.2/#role_definitions
    type WAIAriaRole =
        | 'alert' | 'alertdialog' | 'application' | 'article' | 'banner'
        | 'blockquote' | 'button' | 'caption' | 'cell' | 'checkbox' | 'code'
        | 'columnheader' | 'combobox' | 'command' | 'complementary' | 'composite'
        | 'contentinfo' | 'definition' | 'deletion' | 'dialog' | 'directory' | 'document'
        | 'emphasis' | 'feed' | 'figure' | 'form' | 'grid' | 'gridcell'
        | 'group' | 'heading' | 'img' | 'input' | 'insertion' | 'landmark'
        | 'link' | 'list' | 'listbox' | 'listitem' | 'log' | 'main' | 'marquee' | 'math'
        | 'meter' | 'menu' | 'menubar' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio'
        | 'navigation' | 'none' | 'note' | 'option' | 'paragraph' | 'presentation'
        | 'progressbar' | 'radio' | 'radiogroup' | 'range' | 'region' | 'roletype'
        | 'row' | 'rowgroup' | 'rowheader' | 'scrollbar' | 'search' | 'searchbox'
        | 'section' | 'sectionhead' | 'select' | 'separator' | 'slider' | 'spinbutton'
        | 'status' | 'strong' | 'structure' | 'subscript' | 'superscript' | 'switch'
        | 'tab' | 'table' | 'tablist' | 'tabpanel' | 'term' | 'textbox' | 'time'
        | 'timer' | 'toolbar' | 'tooltip' | 'tree' | 'treegrid' | 'treeitem'
        | 'widget' | 'window' | 'none presentation';

    // All the Digital Publishing WAI-ARIA 1.0 role attribute values from https://www.w3.org/TR/dpub-aria-1.0/#role_definitions
    type DPubAriaRole =
        | 'doc-abstract' | 'doc-acknowledgments' | 'doc-afterword'
        | 'doc-appendix' | 'doc-backlink' | 'doc-biblioentry' | 'doc-bibliography' | 'doc-biblioref' | 'doc-chapter'
        | 'doc-colophon' | 'doc-conclusion' | 'doc-cover' | 'doc-credit' | 'doc-credits' | 'doc-dedication'
        | 'doc-endnote' | 'doc-endnotes' | 'doc-epigraph' | 'doc-epilogue' | 'doc-errata' | 'doc-example'
        | 'doc-footnote' | 'doc-foreword' | 'doc-glossary' | 'doc-glossref' | 'doc-index' | 'doc-introduction'
        | 'doc-noteref' | 'doc-notice' | 'doc-pagebreak' | 'doc-pagelist' | 'doc-part' | 'doc-preface'
        | 'doc-prologue' | 'doc-pullquote' | 'doc-qna' | 'doc-subtitle' | 'doc-tip' | 'doc-toc'

    type AriaRole = WAIAriaRole | DPubAriaRole

    type HTMLAttributeReferrerPolicy =
        | '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin'
        | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'

    // TODO resolve the "deno-lint(ban-types)" error on this line
    // deno-lint-ignore ban-types
    type HTMLAttributeAnchorTarget = '_self' | '_blank' | '_parent' | '_top' | (string & {})

    interface PartialAnchorHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        download?: any
        hreflang?: string
        hrefLang?: string
        media?: string
        ping?: string
        rel?: string
        target?: HTMLAttributeAnchorTarget
        type?: string
        referrerpolicy?: HTMLAttributeReferrerPolicy
        referrerPolicy?: HTMLAttributeReferrerPolicy
    }

    type AnchorAriaRoles =
        | { href: string
            role?: 'link' | 'button' | 'checkbox' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio'
                | 'option' | 'radio' | 'switch' | 'tab' | 'treeitem' | 'doc-backlink'
                | 'doc-biblioref' | 'doc-glossref' | 'doc-noteref' }
        | { href?: never, role?: AriaRole }

    type AnchorHTMLAttributes<T extends EventTarget = HTMLAnchorElement> = Omit<PartialAnchorHTMLAttributes<T>, 'role'> & AnchorAriaRoles

    interface PartialAreaHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        alt?: string
        coords?: string
        download?: any
        hreflang?: string
        hrefLang?: string
        media?: string
        referrerpolicy?: HTMLAttributeReferrerPolicy
        referrerPolicy?: HTMLAttributeReferrerPolicy
        rel?: string
        shape?: string
        target?: HTMLAttributeAnchorTarget
    }

    type AreaAriaRoles =
        | { href: string, role?: 'link' }
        | { href?: never, role?: 'button' | 'link' }

    type AreaHTMLAttributes<T extends EventTarget = HTMLAreaElement> = Omit<PartialAreaHTMLAttributes<T>, 'role'> & AreaAriaRoles;

    interface ArticleHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'article' | 'application' | 'document' | 'feed' | 'main' | 'none' | 'presentation' | 'region'
    }

    interface AsideHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'complementary' | 'feed' | 'none' | 'note' | 'presentation' | 'region' | 'search' | 'doc-dedication'
            | 'doc-example' | 'doc-footnote' | 'doc-glossary' | 'doc-pullquote' | 'doc-tip'
    }

    interface AudioHTMLAttributes<T extends EventTarget = HTMLAudioElement> extends MediaHTMLAttributes<T> {
        role?: 'application'
    }

    interface BaseHTMLAttributes<T extends EventTarget = HTMLBaseElement> extends HTMLAttributes<T> {
        href?: string
        role?: never;
        target?: HTMLAttributeAnchorTarget
    }

    interface BlockquoteHTMLAttributes<T extends EventTarget = HTMLQuoteElement> extends HTMLAttributes<T> {
        cite?: string
    }

    interface BrHTMLAttributes<T extends EventTarget = HTMLBRElement> extends HTMLAttributes<T> {
        role?: 'none' | 'presentation'
    }

    interface ButtonHTMLAttributes<T extends EventTarget = HTMLButtonElement>
        extends HTMLAttributes<T> {
        command?: string
        commandfor?: string
        commandFor?: string
        disabled?: boolean
        form?: string
        formaction?: string
        formAction?: string
        formenctype?: string
        formEncType?: string
        formmethod?: string
        formMethod?: string
        formnovalidate?: boolean
        formNoValidate?: boolean
        formtarget?: string
        formTarget?: string
        name?: string
        popovertarget?: string
        popoverTarget?: string
        popovertargetaction?: 'hide' | 'show' | 'toggle'
        popoverTargetAction?: 'hide' | 'show' | 'toggle'
        role?: 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link' | 'menuitem'
            | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio' | 'separator'
            | 'slider' | 'switch' | 'tab' | 'treeitem'
        type?: 'submit' | 'reset' | 'button'
        value?: string | number
    }

    interface CanvasHTMLAttributes<T extends EventTarget = HTMLCanvasElement> extends HTMLAttributes<T> {
        height?: number | string
        width?: number | string
    }

    interface CaptionHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'caption'
    }

    interface ColHTMLAttributes<T extends EventTarget = HTMLTableColElement> extends HTMLAttributes<T> {
        role?: never
        span?: number
        width?: number | string
    }

    interface ColgroupHTMLAttributes<T extends EventTarget = HTMLTableColElement> extends HTMLAttributes<T> {
        role?: never
        span?: number
    }

    interface DataHTMLAttributes<T extends EventTarget = HTMLDataElement> extends HTMLAttributes<T> {
        value?: string | number
    }

    interface DataListHTMLAttributes<T extends EventTarget = HTMLDataListElement> extends HTMLAttributes<T> {
        role?: 'listbox'
    }

    interface DdHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface DelHTMLAttributes<T extends EventTarget = HTMLModElement> extends HTMLAttributes<T> {
        cite?: string
        datetime?: string
        dateTime?: string
    }

    interface DetailsHTMLAttributes<T extends EventTarget = HTMLDetailsElement> extends HTMLAttributes<T> {
        name?: string
        open?: boolean
        role?: 'group'
    }

    interface DialogHTMLAttributes<T extends EventTarget = HTMLDialogElement> extends HTMLAttributes<T> {
        onCancel?: GenericEventHandler<T>
        onClose?: GenericEventHandler<T>
        open?: boolean
        closedby?: 'none' | 'closerequest' | 'any'
        closedBy?: 'none' | 'closerequest' | 'any'
        role?: 'dialog' | 'alertdialog'
    }

    interface DlHTMLAttributes<T extends EventTarget = HTMLDListElement> extends HTMLAttributes<T> {
        role?: 'group' | 'list' | 'none' | 'presentation'
    }

    interface DtHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'listitem'
    }

    interface EmbedHTMLAttributes<T extends EventTarget = HTMLEmbedElement> extends HTMLAttributes<T> {
        height?: number | string
        role?: 'application' | 'document' | 'img' | 'none' | 'presentation'
        src?: string
        type?: string
        width?: number | string
    }

    interface FieldsetHTMLAttributes<T extends EventTarget = HTMLFieldSetElement> extends HTMLAttributes<T> {
        disabled?: boolean
        form?: string
        name?: string
        role?: 'group' | 'none' | 'presentation' | 'radiogroup'
    }

    interface FigcaptionHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'group' | 'none' | 'presentation'
    }

    interface FooterHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'contentinfo' | 'group' | 'none' | 'presentation' | 'doc-footnote'
    }

    interface FormHTMLAttributes<T extends EventTarget = HTMLFormElement> extends HTMLAttributes<T> {
        'accept-charset'?: string
        acceptCharset?: string
        action?: string
        autocomplete?: string
        autoComplete?: string
        enctype?: string
        encType?: string
        method?: string
        name?: string
        novalidate?: boolean
        noValidate?: boolean
        rel?: string
        role?: 'form' | 'none' | 'presentation' | 'search'
        target?: string
    }

    interface HeadingHTMLAttributes<T extends EventTarget = HTMLHeadingElement> extends HTMLAttributes<T> {
        role?: 'heading' | 'none' | 'presentation' | 'tab' | 'doc-subtitle'
    }

    interface HeadHTMLAttributes<T extends EventTarget = HTMLHeadElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface HeaderHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'banner' | 'group' | 'none' | 'presentation'
    }

    interface HrHTMLAttributes<T extends EventTarget = HTMLHRElement> extends HTMLAttributes<T> {
        role?: 'separator' | 'none' | 'presentation' | 'doc-pagebreak'
    }

    interface HtmlHTMLAttributes<T extends EventTarget = HTMLHtmlElement> extends HTMLAttributes<T> {
        role?: 'document'
    }

    interface IframeHTMLAttributes<T extends EventTarget = HTMLIFrameElement> extends HTMLAttributes<T> {
        allow?: string
        allowFullScreen?: boolean
        allowTransparency?: boolean
        height?: number | string
        loading?: 'eager' | 'lazy'
        name?: string
        referrerpolicy?: HTMLAttributeReferrerPolicy
        referrerPolicy?: HTMLAttributeReferrerPolicy
        role?: 'application' | 'document' | 'img' | 'none' | 'presentation'
        sandbox?: string
        seamless?: boolean
        src?: string
        srcdoc?: string
        srcDoc?: string
        width?: number | string
    }

    type HTMLAttributeCrossOrigin = 'anonymous' | 'use-credentials'

    interface PartialImgHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        crossorigin?: HTMLAttributeCrossOrigin
        crossOrigin?: HTMLAttributeCrossOrigin
        decoding?: 'async' | 'auto' | 'sync'
        fetchpriority?: 'high' | 'auto' | 'low'
        fetchPriority?: 'high' | 'auto' | 'low'
        height?: number | string
        loading?: 'eager' | 'lazy'
        referrerpolicy?: HTMLAttributeReferrerPolicy
        referrerPolicy?: HTMLAttributeReferrerPolicy
        sizes?: string
        src?: string
        srcset?: string
        srcSet?: string
        usemap?: string
        useMap?: string
        width?: number | string
    }

    type ImgAriaRolesAccessibleName = 
        | 'img' | 'button' | 'checkbox' | 'link' | 'menuitem' | 'menuitemcheckbox'
        | 'menuitemradio' | 'meter' | 'option' | 'progressbar' | 'radio' | 'scrollbar'
        | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem' | 'doc-cover'

    type ImgAriaRoles =
        | { 'aria-label': string, role?: ImgAriaRolesAccessibleName }
        | { 'aria-labelledby': string, role?: ImgAriaRolesAccessibleName }
        | { alt: string, role?: ImgAriaRolesAccessibleName }
        | { title: string, role?: ImgAriaRolesAccessibleName }
        | { 'aria-label'?: never, 'aria-labelledby'?: never, alt?: never, title?: never, role?: 'img' | 'none' | 'presentation' }

    type ImgHTMLAttributes<T extends EventTarget = HTMLImageElement> = Omit<
        PartialImgHTMLAttributes<T>,
        'role' | 'aria-label' | 'aria-labelledby' | 'title'
    > & ImgAriaRoles

    type HTMLInputTypeAttribute = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file'
        | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range'
        | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week'

    interface PartialInputHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        accept?: string
        alt?: string
        autocomplete?: string
        autoComplete?: string
        capture?: 'user' | 'environment' // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
        checked?: boolean
        defaultChecked?: boolean
        defaultValue?: string | number
        disabled?: boolean
        enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
        form?: string
        formaction?: string
        formAction?: string
        formenctype?: string
        formEncType?: string
        formmethod?: string
        formMethod?: string
        formnovalidate?: boolean
        formNoValidate?: boolean
        formtarget?: string
        formTarget?: string
        height?: number | string
        indeterminate?: boolean
        max?: number | string
        maxlength?: number
        maxLength?: number
        min?: number | string
        minlength?: number
        minLength?: number
        multiple?: boolean
        name?: string
        pattern?: string
        placeholder?: string
        readonly?: boolean
        readOnly?: boolean
        required?: boolean
        size?: number
        src?: string
        step?: number | string
        value?: string | number
        width?: number | string
        onChange?: GenericEventHandler<T>
    }

    type InputAriaRoles =
        | { type: 'button', role?: 
            | 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link'
            | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio'
            | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem' }
        | { type: 'checkbox', role?: 'checkbox' | 'button' | 'menuitemcheckbox' | 'option' | 'switch' }
        | { type: 'email', list?: never, role?: 'textbox' }
        | { type: 'image', role?: 
            | 'button' | 'checkbox' | 'gridcell' | 'link' | 'menuitem'
            | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'separator' | 'slider'
            | 'switch' | 'tab' | 'treeitem' }
        | { type: 'number', role?: 'spinbutton' }
        | { type: 'radio', role?: 'radio' | 'menuitemradio' }
        | { type: 'range', role?: 'slider' }
        | { type: 'reset', role?: 
            | 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link'
            | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio'
            | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem' }
        | { type: 'search', list?: never, role?: 'searchbox' }
        | { type: 'submit', role?: 
            | 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link'
            | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio'
            | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem' }
        | { type: 'tel', list?: never, role?: 'textbox' }
        | { type?: 'text', list?: never, role?: 'textbox' | 'combobox' | 'searchbox' | 'spinbutton' }
        | { type?: 'text' | 'search' | 'tel' | 'url' | 'email', list?: string, role?: 'combobox' }
        | { type: 'url', list?: never, role?: 'textbox' }
        | { type: 'color' | 'date' | 'datetime-local' | 'file' | 'hidden' | 'month' | 'password' | 'time' | 'week', role?: never }

    type InputHTMLAttributes<T extends EventTarget = HTMLInputElement> = Omit<PartialInputHTMLAttributes<T>, 'role'> & InputAriaRoles

    interface InsHTMLAttributes<T extends EventTarget = HTMLModElement> extends HTMLAttributes<T> {
        cite?: string
        datetime?: string
        dateTime?: string
    }

    interface KeygenHTMLAttributes<T extends EventTarget = HTMLUnknownElement> extends HTMLAttributes<T> {
        challenge?: string
        disabled?: boolean
        form?: string
        keyType?: string
        keyParams?: string
        name?: string
    }

    interface LabelHTMLAttributes<T extends EventTarget = HTMLLabelElement> extends HTMLAttributes<T> {
        for?: string
        form?: string
        htmlFor?: string
        role?: never
    }

    interface LegendHTMLAttributes<T extends EventTarget = HTMLLegendElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface LiHTMLAttributes<T extends EventTarget = HTMLLIElement> extends HTMLAttributes<T> {
        value?: string | number
    }

    interface LinkHTMLAttributes<T extends EventTarget = HTMLLinkElement> extends HTMLAttributes<T> {
        as?: string
        crossorigin?: HTMLAttributeCrossOrigin //XXX TODO check casing here
        crossOrigin?: HTMLAttributeCrossOrigin
        fetchpriority?: 'high' | 'low' | 'auto'
        fetchPriority?: 'high' | 'low' | 'auto'
        href?: string
        hreflang?: string
        hrefLang?: string
        integrity?: string
        media?: string
        imageSrcSet?: string
        referrerpolicy?: HTMLAttributeReferrerPolicy
        referrerPolicy?: HTMLAttributeReferrerPolicy
        rel?: string
        role?: never;
        sizes?: string
        type?: string
        charset?: string
        charSet?: string
    }

    interface MainHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'main'
    }

    interface MapHTMLAttributes<T extends EventTarget = HTMLMapElement> extends HTMLAttributes<T> {
        name?: string
        role?: never
    }

    interface MediaHTMLAttributes<T extends EventTarget = HTMLMediaElement> extends HTMLAttributes<T> {
        autoplay?: boolean
        autoPlay?: boolean //XXX TODO Check casing here
        controls?: boolean
        controlslist?: string
        controlsList?: string
        crossorigin?: HTMLAttributeCrossOrigin
        crossOrigin?: HTMLAttributeCrossOrigin
        currentTime?: number
        defaultMuted?: boolean
        defaultPlaybackRate?: number
        disableremoteplayback?: boolean
        disableRemotePlayback?: boolean
        loop?: boolean
        mediaGroup?: string
        muted?: boolean
        playbackRate?: number
        preload?: 'auto' | 'metadata' | 'none'
        preservesPitch?: boolean
        src?: string
        srcObject?: MediaStream | MediaSource | Blob | File | null
        volume?: string | number
    }

    interface MenuHTMLAttributes<T extends EventTarget = HTMLMenuElement> extends HTMLAttributes<T> {
        role: 'list' | 'group' | 'listbox' | 'menu' | 'menubar' | 'none'
            | 'presentation' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'
        type?: string
    }

    interface MetaHTMLAttributes<T extends EventTarget = HTMLMetaElement> extends HTMLAttributes<T> {
        charset?: string
        charSet?: string
        content?: string
        'http-equiv'?: string
        httpEquiv?: string
        name?: string
        media?: string
        role?: never
    }

    interface MeterHTMLAttributes<T extends EventTarget = HTMLMeterElement> extends HTMLAttributes<T> {
        form?: string
        high?: number
        low?: number
        max?: number | string
        min?: number | string
        optimum?: number
        role?: 'meter'
        value?: string | number
    }

    interface NavHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'navigation' | 'menu' | 'menubar' | 'none' | 'presentation' | 'tablist'
    }

    interface NoScriptHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface ObjectHTMLAttributes<T extends EventTarget = HTMLObjectElement> extends HTMLAttributes<T> {
        classID?: string
        data?: string
        form?: string
        height?: number | string
        name?: string
        role?: 'application' | 'document' | 'img'
        type?: string
        usemap?: string
        useMap?: string
        width?: number | string
        wmode?: string
    }

    interface OlHTMLAttributes<T extends EventTarget = HTMLOListElement> extends HTMLAttributes<T> {
        reversed?: boolean
        role?: 'list' | 'group' | 'listbox' | 'menu' | 'menubar' | 'none'
            | 'presentation' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'
        start?: number
        type?: '1' | 'a' | 'A' | 'i' | 'I'
    }

    interface OptgroupHTMLAttributes<T extends EventTarget = HTMLOptGroupElement> extends HTMLAttributes<T> {
        disabled?: boolean
        label?: string
        role?: 'group'
    }

    interface OptionHTMLAttributes<T extends EventTarget = HTMLOptionElement> extends HTMLAttributes<T> {
        disabled?: boolean
        label?: string
        role?: 'option'
        selected?: boolean
        value?: string | number
    }

    interface OutputHTMLAttributes<T extends EventTarget = HTMLOutputElement> extends HTMLAttributes<T> {
        for?: string
        form?: string
        htmlFor?: string
        name?: string
    }

    interface PictureHTMLAttributes<T extends EventTarget = HTMLPictureElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface ProgressHTMLAttributes<T extends EventTarget = HTMLProgressElement> extends HTMLAttributes<T> {
        max?: number | string
        role?: 'progressbar'
        value?: string | number
    }

    interface QuoteHTMLAttributes<T extends EventTarget = HTMLQuoteElement> extends HTMLAttributes<T> {
        cite?: string
    }

    interface ScriptHTMLAttributes<T extends EventTarget = HTMLScriptElement> extends HTMLAttributes<T> {
        async?: boolean
        crossorigin?: HTMLAttributeCrossOrigin //XXX TODO Check casing here
        crossOrigin?: HTMLAttributeCrossOrigin
        defer?: boolean
        integrity?: string
        nomodule?: boolean
        noModule?: boolean
        referrerpolicy?: HTMLAttributeReferrerPolicy
        referrerPolicy?: HTMLAttributeReferrerPolicy
        role?: never;
        src?: string
        type?: string
    }

    interface SearchHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'search' | 'form' | 'group' | 'none' | 'presentation' | 'region'
    }

    interface PartialSelectHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        autocomplete?: string
        autoComplete?: string // XXX TODO Check casing here
        defaultValue?: string | number
        disabled?: boolean
        form?: string
        name?: string
        required?: boolean
        size?: number
        value?: string | number
        onChange?: GenericEventHandler<T>
    }

    type SelectAriaRoles =
        | {
            multiple?: never;
            // Spec states this branch is limited to "no `multiple` attribute AND no `size` attribute greater than 1".
            // `1` as a default, however, caused some web compat issues and forced Firefox to default to `0` instead.
            size?: 0 | 1 | never
            role?: 'combobox' | 'menu'
        }
        | {
            multiple?: boolean
            size?: number
            role?: 'listbox'
        }

    type SelectHTMLAttributes<T extends EventTarget = HTMLSelectElement> = Omit<PartialSelectHTMLAttributes<T>, 'role'> & SelectAriaRoles

    interface SlotHTMLAttributes<T extends EventTarget = HTMLSlotElement> extends HTMLAttributes<T> {
        name?: string
        role?: never
    }

    interface SourceHTMLAttributes<T extends EventTarget = HTMLSourceElement> extends HTMLAttributes<T> {
        height?: number | string
        media?: string
        role?: never
        sizes?: string
        src?: string
        srcset?: string // XXX TODO Check casing here
        srcSet?: string
        type?: string
        width?: number | string
    }

    interface StyleHTMLAttributes<T extends EventTarget = HTMLStyleElement> extends HTMLAttributes<T> {
        media?: string
        role?: never;
        scoped?: boolean
        type?: string
    }

    interface TableHTMLAttributes<T extends EventTarget = HTMLTableElement> extends HTMLAttributes<T> {
        cellPadding?: string // XXX TODO Check casing here
        cellSpacing?: string
        summary?: string
        width?: number | string
    }

    interface TdHTMLAttributes<T extends EventTarget = HTMLTableCellElement> extends HTMLAttributes<T> {
        align?:  'left' | 'center' | 'right' | 'justify' | 'char'
        colspan?: number // XXX TODO Check casing here
        colSpan?: number
        headers?: string
        rowspan?: number
        rowSpan?: number
        scope?: string
        abbr?: string
        height?: number | string
        width?: number | string
        valign?: 'top' | 'middle' | 'bottom' | 'baseline'
    }

    interface TemplateHTMLAttributes<T extends EventTarget = HTMLTemplateElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface TextareaHTMLAttributes<T extends EventTarget = HTMLTextAreaElement> extends HTMLAttributes<T> {
        autocomplete?: string // XXX TODO Check casing here
        autoComplete?: string
        cols?: number
        defaultValue?: string | number
        dirName?: string
        disabled?: boolean
        form?: string
        maxlength?: number
        maxLength?: number
        minlength?: number
        minLength?: number
        name?: string
        placeholder?: string
        readOnly?: boolean
        required?: boolean
        role?: 'textbox'
        rows?: number
        value?: string | number
        wrap?: string
        onChange?: GenericEventHandler<T>
    }

    interface ThHTMLAttributes<T extends EventTarget = HTMLTableCellElement> extends HTMLAttributes<T> {
        align?:  'left' | 'center' | 'right' | 'justify' | 'char'
        colspan?: number // XXX TODO Check casing here
        colSpan?: number
        headers?: string
        rowspan?: number
        rowSpan?: number
        scope?: string
        abbr?: string
    }

    interface TimeHTMLAttributes<T extends EventTarget = HTMLTimeElement> extends HTMLAttributes<T> {
        datetime?: string // XXX TODO Check casing here
        dateTime?: string
    }

    interface TitleHTMLAttributes<T extends EventTarget = HTMLTitleElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface TrackHTMLAttributes<T extends EventTarget = HTMLTrackElement> extends MediaHTMLAttributes<T> {
        default?: boolean
        kind?: string
        label?: string
        role?: never;
        srclang?: string // XXX TODO Check casing here
        srcLang?: string
    }

    interface UlHTMLAttributes<T extends EventTarget = HTMLUListElement> extends HTMLAttributes<T> {
        role?: 'list' | 'group' | 'listbox' | 'menu' | 'menubar' | 'none'
            | 'presentation' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'
    }

    interface VideoHTMLAttributes<T extends EventTarget = HTMLVideoElement> extends MediaHTMLAttributes<T> {
        disablePictureInPicture?: boolean
        height?: number | string
        playsinline?: boolean // XXX TODO Check casing here
        playsInline?: boolean
        poster?: string
        width?: number | string
        role?: 'application'
    }

    interface WbrHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'none' | 'presentation'
    }

    interface HTMLAttributes<RefType extends EventTarget = EventTarget> extends DOMAttributes<RefType>, AriaAttributes {
        // XXX TODO Check casing here
        // TODO determine the correct capitalization of each of all attributes
        // Standard HTML Attributes
        accesskey?: string
        //accessKey?: string
        autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
        //autoCapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
        autocorrect?: string
        //autoCorrect?: string
        autofocus?: boolean
        //autoFocus?: boolean
        class?: string
        contenteditable?: Booleanish | '' | 'plaintext-only' | 'inherit'
        //contentEditable?: Booleanish | '' | 'plaintext-only' | 'inherit'
        dir?: 'auto' | 'rtl' | 'ltr'
        draggable?: boolean
        enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
        exportparts?: string
        hidden?: boolean | 'hidden' | 'until-found'
        id?: string
        inert?: boolean
        inputmode?: string
        //inputMode?: string
        is?: string
        lang?: string
        nonce?: string
        part?: string
        popover?: 'auto' | 'hint' | 'manual' | boolean
        slot?: string
        spellcheck?: boolean
        style?: CSSProperties | string
        tabindex?: number
        //tabIndex?: number
        title?: string
        translate?: boolean

        // WAI-ARIA Attributes
        // Most elements only allow a subset of roles and so this
        // is overwritten in many of the per-element interfaces
        role?: AriaRole
    }

    /** Types that are allowed as a \<tag/> */
    export type ElementType<C extends Component<any,any>> = keyof IntrinsicElements
        | FunctionComponent<any>
        | C

    /**
     * JSX Return type
     * 
     * Note: This is far from optimal, ideally there would be a way of specifying the return type per \<tag/>
     */
    export type Element = any

    /**
     * IntrinsicElements defines the set of allowed
     * string tags and maps their Attributes' types
     * \<tag {attrs}/>
     */
    export interface IntrinsicElements {
        a: AnchorHTMLAttributes<HTMLAnchorElement>
        abbr: HTMLAttributes<HTMLElement>
        address: HTMLAttributes<HTMLElement>
        area: AreaHTMLAttributes<HTMLAreaElement>
        article: ArticleHTMLAttributes<HTMLElement>
        aside: AsideHTMLAttributes<HTMLElement>
        audio: AudioHTMLAttributes<HTMLAudioElement>
        b: HTMLAttributes<HTMLElement>
        base: BaseHTMLAttributes<HTMLBaseElement>
        bdi: HTMLAttributes<HTMLElement>
        bdo: HTMLAttributes<HTMLElement>
        big: HTMLAttributes<HTMLElement>
        blockquote: BlockquoteHTMLAttributes<HTMLQuoteElement>
        body: HTMLAttributes<HTMLBodyElement>
        br: BrHTMLAttributes<HTMLBRElement>
        button: ButtonHTMLAttributes<HTMLButtonElement>
        canvas: CanvasHTMLAttributes<HTMLCanvasElement>
        caption: CaptionHTMLAttributes<HTMLTableCaptionElement>
        cite: HTMLAttributes<HTMLElement>
        code: HTMLAttributes<HTMLElement>
        col: ColHTMLAttributes<HTMLTableColElement>
        colgroup: ColgroupHTMLAttributes<HTMLTableColElement>
        data: DataHTMLAttributes<HTMLDataElement>
        datalist: DataListHTMLAttributes<HTMLDataListElement>
        dd: DdHTMLAttributes<HTMLElement>
        del: DelHTMLAttributes<HTMLModElement>
        details: DetailsHTMLAttributes<HTMLDetailsElement>
        dfn: HTMLAttributes<HTMLElement>
        dialog: DialogHTMLAttributes<HTMLDialogElement>
        div: HTMLAttributes<HTMLDivElement>
        dl: DlHTMLAttributes<HTMLDListElement>
        dt: DtHTMLAttributes<HTMLElement>
        em: HTMLAttributes<HTMLElement>
        embed: EmbedHTMLAttributes<HTMLEmbedElement>
        fieldset: FieldsetHTMLAttributes<HTMLFieldSetElement>
        figcaption: FigcaptionHTMLAttributes<HTMLElement>
        figure: HTMLAttributes<HTMLElement>
        footer: FooterHTMLAttributes<HTMLElement>
        form: FormHTMLAttributes<HTMLFormElement>
        h1: HeadingHTMLAttributes<HTMLHeadingElement>
        h2: HeadingHTMLAttributes<HTMLHeadingElement>
        h3: HeadingHTMLAttributes<HTMLHeadingElement>
        h4: HeadingHTMLAttributes<HTMLHeadingElement>
        h5: HeadingHTMLAttributes<HTMLHeadingElement>
        h6: HeadingHTMLAttributes<HTMLHeadingElement>
        head: HeadHTMLAttributes<HTMLHeadElement>
        header: HeaderHTMLAttributes<HTMLElement>
        hgroup: HTMLAttributes<HTMLElement>
        hr: HrHTMLAttributes<HTMLHRElement>
        html: HtmlHTMLAttributes<HTMLHtmlElement>
        i: HTMLAttributes<HTMLElement>
        iframe: IframeHTMLAttributes<HTMLIFrameElement>
        img: ImgHTMLAttributes<HTMLImageElement>
        input: InputHTMLAttributes<HTMLInputElement>
        ins: InsHTMLAttributes<HTMLModElement>
        kbd: HTMLAttributes<HTMLElement>
        keygen: KeygenHTMLAttributes<HTMLUnknownElement>
        label: LabelHTMLAttributes<HTMLLabelElement>
        legend: LegendHTMLAttributes<HTMLLegendElement>
        li: LiHTMLAttributes<HTMLLIElement>
        link: LinkHTMLAttributes<HTMLLinkElement>
        main: MainHTMLAttributes<HTMLElement>
        map: MapHTMLAttributes<HTMLMapElement>
        mark: HTMLAttributes<HTMLElement>
        menu: MenuHTMLAttributes<HTMLMenuElement>
        menuitem: HTMLAttributes<HTMLUnknownElement>
        meta: MetaHTMLAttributes<HTMLMetaElement>
        meter: MeterHTMLAttributes<HTMLMeterElement>
        nav: NavHTMLAttributes<HTMLElement>
        noscript: NoScriptHTMLAttributes<HTMLElement>
        object: ObjectHTMLAttributes<HTMLObjectElement>
        ol: OlHTMLAttributes<HTMLOListElement>
        optgroup: OptgroupHTMLAttributes<HTMLOptGroupElement>
        option: OptionHTMLAttributes<HTMLOptionElement>
        output: OutputHTMLAttributes<HTMLOutputElement>
        p: HTMLAttributes<HTMLParagraphElement>
        picture: PictureHTMLAttributes<HTMLPictureElement>
        pre: HTMLAttributes<HTMLPreElement>
        progress: ProgressHTMLAttributes<HTMLProgressElement>
        q: QuoteHTMLAttributes<HTMLQuoteElement>
        rp: HTMLAttributes<HTMLElement>
        rt: HTMLAttributes<HTMLElement>
        ruby: HTMLAttributes<HTMLElement> // XXX TODO ?
        s: HTMLAttributes<HTMLElement>
        samp: HTMLAttributes<HTMLElement>
        script: ScriptHTMLAttributes<HTMLScriptElement>
        search: SearchHTMLAttributes<HTMLElement>
        section: HTMLAttributes<HTMLElement>
        select: SelectHTMLAttributes<HTMLSelectElement>
        slot: SlotHTMLAttributes<HTMLSlotElement>
        small: HTMLAttributes<HTMLElement>
        source: SourceHTMLAttributes<HTMLSourceElement>
        span: HTMLAttributes<HTMLSpanElement>
        strong: HTMLAttributes<HTMLElement>
        style: StyleHTMLAttributes<HTMLStyleElement>
        sub: HTMLAttributes<HTMLElement>
        summary: HTMLAttributes<HTMLElement>
        sup: HTMLAttributes<HTMLElement>
        table: TableHTMLAttributes<HTMLTableElement>
        tbody: HTMLAttributes<HTMLTableSectionElement>
        td: TdHTMLAttributes<HTMLTableCellElement>
        template: TemplateHTMLAttributes<HTMLTemplateElement>
        textarea: TextareaHTMLAttributes<HTMLTextAreaElement>
        tfoot: HTMLAttributes<HTMLTableSectionElement>
        th: ThHTMLAttributes<HTMLTableCellElement>
        thead: HTMLAttributes<HTMLTableSectionElement>
        time: TimeHTMLAttributes<HTMLTimeElement>
        title: TitleHTMLAttributes<HTMLTitleElement>
        tr: HTMLAttributes<HTMLTableRowElement>
        track: TrackHTMLAttributes<HTMLTrackElement>
        u: UlHTMLAttributes<HTMLElement>
        ul: HTMLAttributes<HTMLUListElement>
        var: HTMLAttributes<HTMLElement>
        video: VideoHTMLAttributes<HTMLVideoElement>
        wbr: WbrHTMLAttributes<HTMLElement>
    }
}

}
