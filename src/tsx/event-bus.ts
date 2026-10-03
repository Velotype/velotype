// deno-lint-ignore-file no-explicit-any

// Velotype event bus

import type { Component } from "./component.ts"
import { consoleWarn, listenersF, listenersR, vtState } from "./globals.ts"
import type { RenderObject } from "./render-object.ts"
import type { HasVtKey } from "./types.ts"

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
export function isListenerRegistered(listeningKey: string, vtKey: number, listener: VelotypeEventListener): boolean {
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
                const removals = vtState.r
                listeners.forEach(listener => {
                    // Skip listeners removed by an earlier listener
                    if (removals !== vtState.r) {
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
