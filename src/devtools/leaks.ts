// deno-lint-ignore-file no-explicit-any

// findLeaks(): what Velotype still holds that the page no longer shows

import { getDevtoolsHook } from "../tsx/devtools-hook.ts"
import type { Component } from "../tsx/component.ts"
import type { RenderObject } from "../tsx/render-object.ts"

/** What `findLeaks()` found, each an object Velotype holds that the page no longer shows */
export type VelotypeLeaks = {
    /**
     * Components still mounted while their element is off the page: taken out with a DOM call
     * (`remove()`, `replaceChildren()`, `innerHTML`) rather than through Velotype, so what their
     * `mount()` started keeps running
     */
    mountedOffPage: Component<any>[]
    /** Components created and never placed on the page, which Velotype holds until they are */
    neverPlaced: Component<any>[]
    /**
     * RenderObjects Velotype holds while nothing drawn from them is on the page: one Velotype
     * can't see (in a `#private` field, a Map or a variable) that wasn't given `release()` or `vtwith`
     */
    heldOffPage: RenderObject<any, any>[]
}

type ComponentShape = {c?: Component<any>, k?: unknown, m?: unknown, e?: unknown}
type RenderObjectShape = RenderObject<any, any> & {vtKey?: unknown, es?: Map<number, {e: Element}>}

/** Is element on the page, or parked by a RenderObjectArray's filter() (mounted on purpose) */
function shownOrParked(element: unknown): boolean {
    if (!(element instanceof Element)) {return false}
    if (element.isConnected) {return true}
    let top: Element = element
    while (top.parentElement) {top = top.parentElement}
    return top.hasAttribute("data-vt-park")
}

/**
 * Lists what every Velotype instance on the page still holds that the page no longer shows: for
 * tests and development, run once the page has settled. Each is a leak - it stays in memory, with
 * whatever it refers to, for as long as the page is open - except an object kept on purpose to be
 * placed later. A RenderObject kept for the page's whole life and placed nowhere right now is
 * listed too.
 */
export function findLeaks(): VelotypeLeaks {
    const leaks: VelotypeLeaks = {mountedOffPage: [], neverPlaced: [], heldOffPage: []}
    const hook = getDevtoolsHook()
    if (!hook) {return leaks}
    for (const instance of hook.instances.values()) {
        instance.domReferences.forEach((reference, key) => {
            const component = reference as ComponentShape
            const object = reference as unknown as RenderObjectShape
            if (component.k === key && component.c) {
                if (!shownOrParked(component.e)) {
                    (component.m ? leaks.mountedOffPage : leaks.neverPlaced).push(component.c)
                }
            } else if (object.vtKey === key && object.es instanceof Map) {
                if (![...object.es.values()].some(drawn => shownOrParked(drawn.e))) {
                    leaks.heldOffPage.push(object)
                }
            }
        })
    }
    return leaks
}
