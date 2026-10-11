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

/** Throws unless indexes holds each of 0 to length - 1 exactly once */
export function checkPermutation(indexes: ArrayLike<number>, length: number): void {
    if (indexes.length !== length) {
        throw new RangeError(`reorder() needs ${length} indexes, it got ${indexes.length}`)
    }
    const seen = new Uint8Array(length)
    for (let i = 0; i < length; i++) {
        const index = indexes[i]
        if (!(index >= 0 && index < length && (index | 0) === index) || seen[index]) {
            throw new RangeError(`reorder() needs each index from 0 to ${length - 1} once, it got ${index} at ${i}`)
        }
        seen[index] = 1
    }
}

/**
 * Marks the positions of a longest increasing subsequence of values (with a 1)
 *
 * Elements whose old positions form an increasing subsequence of their new order are already in order,
 * so reordering moves only the others, the fewest moves possible
 */
export function longestIncreasingSubsequence(values: ArrayLike<number>): Uint8Array {
    const length = values.length
    const marks = new Uint8Array(length)
    if (length === 0) {
        return marks
    }
    // tails[k] is the position of the smallest value that ends an increasing subsequence of length k + 1
    const tails = new Int32Array(length)
    const previous = new Int32Array(length)
    let size = 0
    for (let i = 0; i < length; i++) {
        const value = values[i]
        if (size > 0 && values[tails[size - 1]] < value) {
            // Extends the longest subsequence, which is every step when the order is unchanged
            previous[i] = tails[size - 1]
            tails[size++] = i
            continue
        }
        let low = 0
        let high = size
        while (low < high) {
            const middle = (low + high) >>> 1
            if (values[tails[middle]] < value) {
                low = middle + 1
            } else {
                high = middle
            }
        }
        previous[i] = low > 0 ? tails[low - 1] : -1
        tails[low] = i
        if (low === size) {
            size++
        }
    }
    for (let i = tails[size - 1]; i >= 0; i = previous[i]) {
        marks[i] = 1
    }
    return marks
}

/**
 * Moves elements, which are the children of parent, into their new order with the fewest moves
 *
 * @elements the elements in their new order
 * @oldPositions the position of each one before (increasing in their current order in parent)
 */
export function moveIntoOrder(parent: Node, elements: readonly Element[], oldPositions: ArrayLike<number>): void {
    const stay = longestIncreasingSubsequence(oldPositions)
    // Placed from the end, so that the element each one goes before is already in place
    let next: Element | null = null
    for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i]
        if (!stay[i]) {
            parent.insertBefore(element, next)
        }
        next = element
    }
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
