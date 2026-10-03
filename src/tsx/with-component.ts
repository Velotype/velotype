// deno-lint-ignore-file no-explicit-any

// vtwith: RenderObject lifecycles attached to an element

import { registerNewVtKey, releaseVtKeyObject } from "./dom-references.ts"
import type { RenderObject, RenderObjectInternals } from "./render-object.ts"

/** Checks if something is an instanceof WithComponent */
export function instanceOfWithComponent(something: any): something is WithComponent {
    return something instanceof WithComponent
}

/**
 * A Velotype internal class used to manage RenderObject lifecycles
 * by attaching them to AnchorElements for cleanup on unmount
 */
export class WithComponent {

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
