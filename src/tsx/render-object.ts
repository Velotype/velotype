// deno-lint-ignore-file no-explicit-any

// RenderObject and RenderBasic

import { setDomKeyOn, registerNewVtKey, releaseVtKey } from "./dom-references.ts"
import { VelotypeEvent, registerEventListener, isListenerRegistered, emitEvent, type VelotypeEventListener } from "./event-bus.ts"
import { consoleError, displayContentsSpan, domKeyProperty, listenersF } from "./globals.ts"
import { replaceElement, removeElement } from "./mounting.ts"
import { childToElement, wrapElementIfNeeded } from "./renderable.ts"
import type { AnchorElement, BasicTypes, RenderableElements, HasVtKey } from "./types.ts"
import { hiddenElement, vtSetImmediate, swapSiblings } from "./utils.ts"

/** Checks if something is an instanceof RenderObject */
export function instanceOfRenderObject(something: any): something is RenderObject<any,any>  {
    return something instanceof RenderObject
}

/**
 * The Velotype core view of an object that can render into multiple instance elements
 */
export interface MultiRenderable {
    /** Unmount an instance element of this object */
    uK: (key: number) => void
    /** Mount this object */
    mount: () => void
    /** Render a new instance element of this object */
    rD: () => AnchorElement
}
/** The Velotype core view of a RenderObject, including its protected members */
export type RenderObjectInternals = RenderObject<any, any> & MultiRenderable & {unmount: () => void, sw: (other: RenderObject<any, any>) => void}

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
