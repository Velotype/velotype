// deno-lint-ignore-file no-explicit-any

// vtKeys: the registry that links DOM elements to Velotype objects

import { type InternalComponent, instanceOfInternalComponent } from "./component.ts"
import { removeComponentListeners } from "./event-bus.ts"
import { domKeyProperty, domReferences, vtState } from "./globals.ts"
import type { MultiRenderable } from "./render-object.ts"
import type { AnchorElement, HasVtKey } from "./types.ts"
import type { WithComponent } from "./with-component.ts"

/** Set the domKey property on element */
export function setDomKeyOn(element: Element, key: number): void {
    ;(element as any)[domKeyProperty] = key
}

/**
 * `domReferences.get(key)` - used for JS minification
 */
export function getDOMreference(key: number): InternalComponent | MultiRenderable | WithComponent | undefined {
    return domReferences.get(key)
}
/**
 * Acquire a new componentKey to reference component and if (element) then set the domKey attribute
 */
export function registerNewVtKey(component: InternalComponent | MultiRenderable | WithComponent, element?: AnchorElement): number {
    const componentKey = vtState.k++
    if (element) {
        setDomKeyOn(element, componentKey)
    }
    domReferences.set(componentKey, component)
    return componentKey
}
/**
 * Release the reference to this componentKey
 */
export function releaseVtKey(vtKey: number): void {
    domReferences.delete(vtKey)
}
/**
 * Release the reference to this object's componentKey
 */
export function releaseVtKeyObject(hasVtKey: HasVtKey): void {
    domReferences.delete(hasVtKey.vtKey)
    removeComponentListeners(hasVtKey)
}
/**
 * Release every vtKey acquired since firstKey, for the objects created by user code that threw
 */
export function releaseVtKeysFrom(firstKey: number): void {
    for (let key = firstKey; key < vtState.k; key++) {
        const reference: any = domReferences.get(key)
        if (reference) {
            if (instanceOfInternalComponent(reference)) {
                removeComponentListeners(reference.c)
                domReferences.delete(key)
            } else if (reference.vtKey === key || !reference.uK) {
                // A RenderObject's own vtKey, or a WithComponent
                releaseVtKeyObject(reference)
                domReferences.delete(key)
            } else {
                // An instance element of a RenderObject
                reference.uK(key)
            }
        }
    }
}
