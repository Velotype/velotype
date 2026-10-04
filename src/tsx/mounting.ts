// deno-lint-ignore-file no-explicit-any

// Inserting and removing elements, and mounting and unmounting the Velotype objects in them

import { type ComponentInternals, type InternalComponent, instanceOfComponent, instanceOfInternalComponent } from "./component.ts"
import { getDOMreference, releaseVtKey, releaseVtKeyObject } from "./dom-references.ts"
import { removeComponentListeners } from "./event-bus.ts"
import { domKeyProperty } from "./globals.ts"
import { type MultiRenderable, type RenderObjectInternals, instanceOfRenderObject } from "./render-object.ts"
import type { AnchorElement } from "./types.ts"
import { instanceOfHTMLElement, instanceOfSVGSVGElement, instanceOfMathMLElement } from "./utils.ts"
import { instanceOfWithComponent, type WithComponent } from "./with-component.ts"

/**
 * Replace an element with a newElement
 * 
 * Note: this will detect if the element hasFocus and will set newElement.focus() if needed
 * 
 * @param includeRoot also unmount element and mount newElement, not only their children
 */
export function replaceElement(element: AnchorElement, newElement: AnchorElement, includeRoot?: boolean): AnchorElement {
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
export function appendElement(element: AnchorElement, toAppendElement: AnchorElement): void {
    element.appendChild(toAppendElement)
    mountComponentElement(toAppendElement)
}
/**
 * Prepends a toPrependElement to an element and will mount the prepended toPrependElement
 */
export function prependElement(element: HTMLElement, toPrependElement: AnchorElement): void {
    element.prepend(toPrependElement)
    mountComponentElement(toPrependElement)
}
/**
 * Replaces all children of a given element
 * 
 * Will unmount the old children, replaceChildren(...newChildren), then mount the newChildren
 */
export function replaceChildren(element: HTMLElement, newChildren: AnchorElement[]): void {
    unmountComponentElementChildren(element)
    element.replaceChildren(...newChildren)
    mountComponentElementChildren(element)
}
/**
 * Will unmount an element and then `.remove()` it
 */
export function removeElement(element: AnchorElement): void {
    unmountComponentElement(element)
    element.remove()
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
export function unmountComponentElement(element: AnchorElement): void {
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
