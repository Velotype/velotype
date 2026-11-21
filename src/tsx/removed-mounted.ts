// warnOnRemovedMounted(): reports a Component taken off the page while still mounted

import { type InternalComponent, instanceOfInternalComponent } from "./component.ts"
import { getDOMreference } from "./dom-references.ts"
import { consoleWarn, domKeyProperty, keptOffPage } from "./globals.ts"

/**
 * The mounted Components whose element is `node` or inside it, and is off the page
 *
 * A Component counts by its current element (`refresh()` replaces it), so the element it rendered
 * before a refresh, taken out by the refresh, does not count it
 */
function mountedIn(node: Element): InternalComponent[] {
    const found: InternalComponent[] = []
    const check = (element: Element) => {
        const key: number | undefined = (element as any)[domKeyProperty]
        if (key) {
            const component = getDOMreference(key)
            if (component && instanceOfInternalComponent(component) && component.m && component.e === element && !element.isConnected) {
                found.push(component)
            }
        }
    }
    check(node)
    for (const element of node.querySelectorAll("*")) {
        check(element)
    }
    return found
}

/** The top of the detached tree that node is in */
function topOf(node: Node): Node {
    let top = node
    while (top.parentNode) {
        top = top.parentNode
    }
    return top
}

/**
 * Warns when an element leaves the page with a Component in it still mounted - taken out by a
 * DOM call of its own (`remove()`, `replaceChildren()`, `innerHTML`, a parent removed the same
 * way) rather than through Velotype, which unmounts what it takes out (`removeElementRoot()`, a
 * Component's `removeChild()` and `replaceChildrenOfChild()`, a RenderObject drawing again).
 *
 * A Component left mounted keeps what it set up in `mount()` - listeners on `document` or the
 * window, timers, event bus listeners - for as long as the page is open, though nothing on the page
 * can reach it, and nothing reports it. One left behind on every update of a list adds up quickly.
 *
 * For development: call it once at startup (where it costs a check of each element taken out of
 * the page), and leave it out of production builds. It watches `root` and everything in it, and
 * returns a function that stops watching. Each warning names the element and the Components
 * still mounted in it.
 *
 * Not reported:
 * - An element moved - taken out and put back in the same task - since by the time the check runs
 *   it is back on the page
 * - The rows that `filter()` on a RenderObjectArray hides, which are kept mounted on purpose
 * - The element a Component rendered before `refresh()`, since the Component's current element
 *   is the one on the page
 */
export function warnOnRemovedMounted(root: Node = document): () => void {
    const observer = new MutationObserver(records => {
        for (const record of records) {
            record.removedNodes.forEach(node => {
                if (node.isConnected || !(node instanceof Element) || keptOffPage.has(topOf(node))) {
                    return
                }
                const mounted = mountedIn(node)
                if (mounted.length > 0) {
                    consoleWarn("An element left the page with Components in it still mounted, so they keep their listeners. Take it out through Velotype (removeElementRoot(), or a Component's removeChild()), which unmounts it.", node, mounted.map(component => component.c))
                }
            })
        }
    })
    observer.observe(root, {childList: true, subtree: true})
    return () => observer.disconnect()
}
