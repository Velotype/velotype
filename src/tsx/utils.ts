// deno-lint-ignore-file no-explicit-any

// Small helpers shared across Velotype

import { consoleError, displayNoneDiv, lockedDescriptor } from "./globals.ts"
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

/**
 * Report an error thrown by user code that Velotype called, and continue
 *
 * Reported the same way as an uncaught error: logged, and dispatched as an "error" event on the window
 */
export function reportUserError(error: unknown): void {
    if (typeof reportError === "function") {
        reportError(error)
    } else {
        consoleError(error)
    }
}

/** Convert an index for inserting into an Array to an index from 0 to length, counting from the end when negative (as `Array.splice()` does) */
export function insertIndex(index: number, length: number): number {
    if (index < 0) {
        return Math.max(length + index, 0)
    }
    return Math.min(index, length)
}

/** Insert items into array at start, without spreading items into arguments (which fails for long Arrays) */
export function insertItems<T>(array: T[], start: number, items: readonly T[]): void {
    const source = (items as T[]) === array ? array.slice() : items
    const count = source.length
    const tail = array.splice(start)
    for (let i = 0; i < count; i++) {
        array.push(source[i])
    }
    for (let i = 0; i < tail.length; i++) {
        array.push(tail[i])
    }
}
