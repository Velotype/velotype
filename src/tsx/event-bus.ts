// deno-lint-ignore-file no-explicit-any

// Velotype event bus

import type { Component } from "./component.ts"
import { consoleWarn, listenersF, listenersR, vtState, type VelotypeEventTracer } from "./globals.ts"
import type { RenderObject } from "./render-object.ts"
import type { HasVtKey } from "./types.ts"
import { reportUserError } from "./utils.ts"

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
 * 
 * A Component's vtKey is set after its constructor returns, so register a Component's
 * listeners in `mount()`. Throws a TypeError when hasVtKey has no vtKey yet, such as
 * when called from a Component's constructor or field initializers.
 */
export function registerEventListener(hasVtKey: HasVtKey, listeningKey: string, listener: VelotypeEventListener): void {
    if (typeof hasVtKey.vtKey !== "number") {
        throw new TypeError("vt: registerEventListener() needs an object with a vtKey, a Component has none until its constructor returns (register listeners in mount())")
    }
    if (tracer) {
        listener = traceListener(listeningKey, listener)
    }
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
export function removeComponentListeners(hasVtKey: HasVtKey): void {
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
function removeListenerMap<FirstKeyType, SecondKeyType>(map: Map<FirstKeyType, Map<SecondKeyType, VelotypeEventListener[]>>, firstKey: FirstKeyType, secondKey: SecondKeyType, listener?: VelotypeEventListener): void {
    const keyListeners = map.get(firstKey)
    if (keyListeners) {
        let listeners = keyListeners.get(secondKey)
        if (listeners) {
            vtState.r++
            if (listener) {
                let index = listeners.indexOf(listener)
                if (index < 0 && tracer) {
                    index = listeners.findIndex(registered => (registered as TracedListener).o === listener)
                }
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
export function isListenerRegistered(listeningKey: string, vtKey: number, listener: VelotypeEventListener): boolean {
    const keyListeners = listenersF.get(listeningKey)
    const listeners = keyListeners && keyListeners.get(vtKey)
    return !!listeners && (listeners.includes(listener) || (!!tracer && listeners.some(registered => (registered as TracedListener).o === listener)))
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
                const removals = vtState.r
                listeners.forEach(listener => {
                    // Skip listeners removed by an earlier listener
                    if (removals !== vtState.r) {
                        const current = keyListeners.get(vtKey)
                        if (current !== listeners && !(current && current.includes(listener))) {
                            return
                        }
                    }
                    // An error is reported so that the other listeners still receive the event
                    try {
                        listener(event)
                    } catch (error) {
                        reportUserError(error)
                    }
                })
            }
        })
    } else {
        consoleWarn("No listeners for event", listeningKey, event)
    }
}

// ------- Tracing, for the devtools extension -------
//
// Tracing wraps the listeners instead of changing emitEvent(), so that emitting an event runs the
// same code whether or not anything traces it. A wrapper reports the event the first time one of
// its listeners receives it, and then calls the listener it wraps. The check for a wrapper in the
// code to find, remove, or test a registered listener only runs while tracing.

/** A listener wrapped for tracing keeps the listener it wraps in `o` */
type TracedListener = VelotypeEventListener & { o?: VelotypeEventListener }
let tracer: VelotypeEventTracer | undefined
/** The event that was last reported, because every listener of an event is wrapped but the event is reported once */
let tracedEvent: VelotypeEvent | undefined

function traceListener(listeningKey: string, listener: VelotypeEventListener): TracedListener {
    const traced: TracedListener = event => {
        if (tracer && tracedEvent !== event) {
            tracedEvent = event
            // Emitting the same event object again later is reported again
            queueMicrotask(() => { tracedEvent = undefined })
            try {
                tracer(listeningKey, event)
            } catch {
                // A failing tracer must not change what the app does
            }
        }
        listener(event)
    }
    traced.o = listener
    return traced
}

/** Replaces every listener in a double map, with new arrays so that an emit in progress keeps its own */
function replaceListeners<FirstKeyType, SecondKeyType>(map: Map<FirstKeyType, Map<SecondKeyType, VelotypeEventListener[]>>, replace: (firstKey: FirstKeyType, secondKey: SecondKeyType, listener: VelotypeEventListener) => VelotypeEventListener): void {
    map.forEach((keyListeners, firstKey) => {
        keyListeners.forEach((listeners, secondKey) => {
            keyListeners.set(secondKey, listeners.map(listener => replace(firstKey, secondKey, listener)))
        })
    })
}

/**
 * Start reporting every event to `next` as it reaches its listeners, or stop with `undefined`
 *
 * Wraps the listeners that are registered now, and the ones registered while tracing
 */
export function setEventTracer(next: VelotypeEventTracer | undefined): void {
    const wasTracing = !!tracer
    tracer = next
    tracedEvent = undefined
    if (next && !wasTracing) {
        replaceListeners(listenersF, (listeningKey, _vtKey, listener) => traceListener(listeningKey, listener))
        replaceListeners(listenersR, (_vtKey, listeningKey, listener) => traceListener(listeningKey, listener))
    } else if (!next && wasTracing) {
        const unwrap = (_first: unknown, _second: unknown, listener: VelotypeEventListener) => (listener as TracedListener).o ?? listener
        replaceListeners(listenersF, unwrap)
        replaceListeners(listenersR, unwrap)
    }
}
