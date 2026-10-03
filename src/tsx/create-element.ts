// deno-lint-ignore-file no-explicit-any

// TSX element creation

import { setAttrsOnElement } from "./attributes.ts"
import { instanceOfInternalComponent, instanceOfComponent, type Component, InternalComponent, type FunctionComponent } from "./component.ts"
import { getDOMreference } from "./dom-references.ts"
import { consoleError, domKeyProperty } from "./globals.ts"
import { appendChild, wrapElementIfNeeded } from "./renderable.ts"
import type { AnchorElement, BasicTypes, RenderableElements, Type } from "./types.ts"
import { instanceOfBasicTypes, hiddenElement } from "./utils.ts"

// Note: the react-jsx transform can in an edge case call createElement()
// so this must be exported
// See: https://github.com/facebook/react/issues/20031#issuecomment-710346866
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: 'span', attrs: Readonly<any> | null, ...children: RenderableElements[]): HTMLSpanElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: 'div', attrs: Readonly<any> | null, ...children: RenderableElements[]): HTMLDivElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: string, attrs: Readonly<any> | null, ...children: RenderableElements[]): HTMLElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: Type<Component<any>>, attrs: Readonly<any> | null, ...children: RenderableElements[]): HTMLElement
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: FunctionComponent<any>, attrs: Readonly<any> | null, ...children: RenderableElements[]): RenderableElements[] | AnchorElement | BasicTypes
/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function createElement(tag: Type<Component<any>> | FunctionComponent<any> | string, attrs: Readonly<any> | null, ...children: RenderableElements[]): RenderableElements[] | AnchorElement | BasicTypes {
    if (typeof tag === 'string') {
        // Base HTML Element
        const element = document.createElement(tag)
        // Template elements' children get attached to the DocumentFragment content
        appendChild(tag == 'template' ? (element as HTMLTemplateElement).content : element, children)
        // Set after children so that attributes like <select value> apply to the appended children
        setAttrsOnElement(element, attrs)
        return element
    }
    const notNullAttrs = attrs || {}
    if (instanceOfComponent(tag.prototype)) {
        // Create and register Component
        const internalComponent = new InternalComponent(
            new (tag as Type<Component<any>>)(notNullAttrs, children),
            notNullAttrs,
            children
        )
        return internalComponent.e
    } else if (typeof tag === 'function') {
        // Function Component
        const output = (tag as FunctionComponent<any>)(notNullAttrs, children)
        // Note: These if-clauses are set this way for TypeScript type inference
        if (instanceOfBasicTypes(output)) {
            return output
        } else if (Array.isArray(output)) {
            return output
        } else {
            return wrapElementIfNeeded(output)
        }
    }

    // Fallback case
    consoleError('Invalid tag', tag, notNullAttrs, children)
    return hiddenElement()
}

/**
 * Create an fragment \<></> (which just propagates an array of children[])
 */
export function createFragment(_attrs: Readonly<any>, ...children:  RenderableElements[]): RenderableElements[] {
    return children
}

/**
 * Get the js class object of a constructed Component
 * 
 * Usage:
 * 
 * ```tsx
 * class ComplexComponent extends Component<EmptyAttrs> {
 *     override render() {
 *         return <div>This is a complex Component</div>
 *     }
 *     someMethod() {
 *         console.log("ComplexComponent method called")
 *     }
 * }
 * 
 * //Somewhere else
 * const foo = getComponent(<ComplexComponent/>)
 * foo.someMethod()
 * 
 * //Can then be used in tsx directly:
 * return <div>{foo}</div>
 * ```
 */
export function getComponent<T>(componentElement: RenderableElements[] | AnchorElement | BasicTypes | null): T {
    if (!componentElement || componentElement instanceof Text || instanceOfBasicTypes(componentElement) || Array.isArray(componentElement)) {
        // Invalid case
        consoleError("Invalid element", componentElement)
        return null as T
    }
    const component = getDOMreference((componentElement as any)[domKeyProperty])
    if (component && instanceOfInternalComponent(component)) {
        return component.c as T
    } else {
        // Invalid case
        consoleError("Invalid element", componentElement)
        return null as T
    }
}
