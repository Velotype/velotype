// deno-lint-ignore-file no-explicit-any

// Converting RenderableElements into DOM nodes

import { instanceOfInternalComponent, instanceOfComponent, type Component } from "./component.ts"
import { createElement } from "./create-element.ts"
import { getDOMreference } from "./dom-references.ts"
import { consoleError, displayContentsDiv, domKeyProperty } from "./globals.ts"
import { type RenderObject, type RenderObjectInternals, instanceOfRenderObject } from "./render-object.ts"
import type { AnchorElement, RenderableElements } from "./types.ts"
import { instanceOfHTMLElement, instanceOfSVGSVGElement, instanceOfMathMLElement, instanceOfText, instanceOfBasicTypes, hiddenElement } from "./utils.ts"

/**
 * Convert any valid ChildType into an AnchorElement (or undefined)
 */
export function childToElement(child: RenderableElements): AnchorElement | undefined {
    if ((instanceOfBasicTypes(child) && child !== false) || instanceOfText(child)) {
        return createElement("span",null,child)
    } else if (child) {
        return renderableElementToElement(child)
    }
}
/**
 * Convert any valid ChildType into a Node (or undefined)
 */
function childToNode(child: RenderableElements): AnchorElement | Text | undefined {
    if (instanceOfBasicTypes(child) && child !== false) {
        return document.createTextNode(child.toString())
    } else if (instanceOfHTMLElement(child)) {
        return child
    } else if (instanceOfText(child)) {
        return child
    } else if (child) {
        return renderableElementToElement(child)
    }
}
/**
 * Convert a RenderableElement into an AnchorElement
 */
export function renderableElementToElement(child: RenderableElements): AnchorElement {
    if (instanceOfHTMLElement(child) || instanceOfSVGSVGElement(child) || instanceOfMathMLElement(child)) {
        return child
    } else if (instanceOfRenderObject(child)) {
        return (child as RenderObjectInternals).rD()
    } else if (instanceOfComponent(child)) {
        // Get InternalComponent reference from Component's vtKey
        const component = getDOMreference(child.vtKey)
        if (component) {
            if (instanceOfInternalComponent(component)) {
                return component.e
            }
        }
    }
    // If TypeScript is working properly this case should never be hit since
    // we checked all of the case types above
    consoleError('Invalid child')
    return hiddenElement()
}
/**
 * Appends children to an HTMLElement (unwraps Arrays, generates new instance components for
 * RenderObjects, wraps BasicTypes in TextNodes)
 * 
 * @param parent HTMLElement to append to
 * @param child Children to append
 */
export function appendChild(parent: HTMLElement | DocumentFragment, child: RenderableElements): void {
    if (Array.isArray(child)) {
        for (let i = 0; i < child.length; i++) {
            appendChild(parent, child[i])
        }
    } else {
        const element = childToNode(child)
        if (element) {
            parent.appendChild(element)
        }
    }
}

/**
 * If a render operation returns a Component, RenderObject, or RenderBasic as a result of
 * render then it needs to be wrapped in another HTMLElement for rendering to work properly
 * 
 * @param element The raw rendered element
 * @returns The original element or a wrapped element (or a hidden element if element is falsey)
 */
export function wrapElementIfNeeded(element: null | undefined): HTMLElement
export function wrapElementIfNeeded(element: SVGSVGElement): AnchorElement
export function wrapElementIfNeeded(element: MathMLElement): AnchorElement
export function wrapElementIfNeeded(element: HTMLElement): HTMLElement
export function wrapElementIfNeeded(element: AnchorElement): AnchorElement
export function wrapElementIfNeeded(element: Component<any>): HTMLElement
export function wrapElementIfNeeded(element: RenderObject<any,any>): HTMLElement
export function wrapElementIfNeeded(element: Component<any> | RenderObject<any,any>): HTMLElement
export function wrapElementIfNeeded(element: HTMLElement | Component<any> | RenderObject<any,any> | null | undefined): HTMLElement
export function wrapElementIfNeeded(element: RenderableElements | null | undefined): AnchorElement
export function wrapElementIfNeeded(element: RenderableElements | null | undefined): AnchorElement {
    if (element == null || element === false || element === "") {
        return hiddenElement()
    }
    // If a Component returns a Component or RenderObject as a result of render
    // then it needs to be wrapped in another HTMLElement for rendering to work properly
    if (instanceOfBasicTypes(element) || instanceOfComponent(element) || instanceOfRenderObject(element) || instanceOfText(element) || Array.isArray(element) || (element as any)[domKeyProperty] !== undefined) {
        const wrapper = displayContentsDiv.cloneNode() as HTMLDivElement
        appendChild(wrapper, element)
        return wrapper
    }
    return element
}
