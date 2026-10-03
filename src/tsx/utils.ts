// deno-lint-ignore-file no-explicit-any

// Small helpers shared across Velotype

import { displayNoneDiv, lockedDescriptor } from "./globals.ts"
import type { BasicTypes } from "./types.ts"

/** Checks if something is an instanceof HTMLElement */
export function instanceOfHTMLElement(something: any): something is HTMLElement {
    return something instanceof HTMLElement
}
/** Checks if something is an instanceof SVGSVGElement */
export function instanceOfSVGSVGElement(something: any): something is SVGSVGElement {
    return something instanceof SVGSVGElement
}
/** Checks if something is an instanceof MathMLElement */
export function instanceOfMathMLElement(something: any): something is MathMLElement {
    return something instanceof MathMLElement
}

/** Checks if something is an instanceof Text */
export function instanceOfText(something: any): something is Text {
    return something instanceof Text
}

/** Checks if somthing is an instanceof any of the BasicTypes (string, bigint, number, boolean) */
export function instanceOfBasicTypes(something: any): something is BasicTypes {
    if (typeof something === 'string' || typeof something === 'bigint' || typeof something === 'number' || typeof something === 'boolean') {
        return true
    }
    return false
}

/** Call Object.defineProperty() to lock a property so that it cannot be modified later - used for JS minification */
export function defineLockedProperty(object: any, key: string, value: any): void {
    lockedDescriptor.value = value
    Object.defineProperty(object, key, lockedDescriptor)
    lockedDescriptor.value = undefined
}

/**
 * Generates a new \<div> element that is hidden from the page
 * 
 * @returns `<div style="display:none;"/>`
 */
export function hiddenElement(): HTMLElement {
    return displayNoneDiv.cloneNode() as HTMLDivElement
}

/**
 * Trigger a callback immediately (though after the event loop clears)
 * 
 * @param callback The function to trigger
 */
export function vtSetImmediate(callback: () => void): void {
    // Promise.resolve() is faster than setTimeout(x,0) (uses a Microtask instead of a Task)
    // Also, per spec setTimeout may have a min of 4ms delay depending on the current nesting level
    // See:
    // -: https://www.youtube.com/watch?v=u1kqx6AenYw
    // -: https://www.trevorlasn.com/blog/setimmediate-vs-settimeout-in-javascript
    // -: https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
    Promise.resolve().then(callback)
}

/** Swap the positions of two sibling elements */
export function swapSiblings(parent: Node, a: Element, b: Element): void {
    const aNext = a.nextSibling
    if (aNext === b) {
        parent.insertBefore(b, a)
    } else {
        parent.insertBefore(a, b)
        parent.insertBefore(b, aNext)
    }
}
