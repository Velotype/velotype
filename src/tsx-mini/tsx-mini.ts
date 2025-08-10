// deno-lint-ignore-file no-unused-vars no-explicit-any

/** Basic primitives that are renderable directly */
export type BasicTypes = string | bigint | number | boolean

/** These are things that can be returned from Component.render() */
export type RenderableElements = HTMLElement | Component<any,any>

/** Type used to represent a constructor function for a Class */
export type TypeConstructor<T> = new (...args: any[]) => T

/** Type used to represent abstract Class passing */
export interface Type<T> extends TypeConstructor<T>{}

/** Valid child objects of an Element */
export type ChildTypes = BasicTypes | RenderableElements | null | undefined

/** Type used to represent children in createElement("",{}, children) */
export type ChildrenTypes = ChildTypes | ChildTypes[]

/** Type used to represent that no Attrs are accepted for a Component */
export type EmptyAttrs = Record<string | number | symbol, never>

/** Checks if somthing is an instanceof any of the BasicTypes (string, bigint, number, boolean) */
function instanceOfBasicTypes(something: any): something is BasicTypes {
    if (typeof something === 'string' || typeof something === 'bigint' || typeof something === 'number' || typeof something === 'boolean') {
        return true
    }
    return false
}

/** Map of DOM keys to Velotype Component references */
const domReferences: Map<string, Component<any,any>> = new Map<string, Component<any,any>>()

/** The next key to use for DOM bindings */
let domNextKey: bigint = 1n

/** Attribute name to use for DOM -> Component bindings */
const domKeyName = "vk"

/**
 * App Metadata
 * 
 * Stateful storage of various stuffs, this is a Velotype internal object
 * DO NOT USE OR MANPULATE, for debugging only
 */
export const __vtAppMetadata = {
    // ------- For Velotype Core -------
    /** Key name for DOM bindings */
    domKeyName: domKeyName,
    /** Map of DOM keys to Velotype Component references */
    domReferences: domReferences,
}

/**
 * Appends children to an HTMLElement (unwraps Arrays and wraps BasicTypes in TextNodes)
 * 
 * @param parent HTMLElement to append to
 * @param child Children to append
 */
function appendChild(parent: HTMLElement, child: ChildrenTypes[] | ChildrenTypes) {
    if (Array.isArray(child)) {
        // Recurse over arrays
        for (let i = 0; i < child.length; i++) {
            appendChild(parent, child[i])
        }
    } else {
        let element: any = undefined
        if (instanceOfBasicTypes(child)) {
            // BasicTypes get converted into TextNodes
            element = document.createTextNode(child.toString())
        } else if (child instanceof Component) {
            // Get Component reference from the vtKey
            const component = domReferences.get(child.vtKey)
            if (component) {
                element = component.element
            }
        } else if (child instanceof HTMLElement) {
            element = child
        }
        // If we ere able to resolve the element, then append it to the parent
        if (element) {
            parent.appendChild(element)
        }
    }
}

/**
 * A Velotype Function Component that can be used in .tsx files to render HTML Components.
 */
export type FunctionComponent<AttrsType> = (attrs: Readonly<AttrsType>, children: ChildrenTypes[]) => ChildrenTypes[] | RenderableElements | BasicTypes | null | undefined

/**
 * A Velotype Class Component that can be used in .tsx files to render HTML Components.
 */
export abstract class Component<AttrsType, RenderReturnType extends RenderableElements = HTMLElement> {

    /** constructor gets attrs and children */
    constructor(attrs: Readonly<AttrsType>, children: ChildrenTypes[]){}

    /**
     * Render is called when this Comonent needs to be materialized into Elements.
     * To be implemented by a specific Component that extends Component
     * @param {Readonly<AttrsType>} attrs The attrs for this Component
     * @param {ChildrenTypes[]} children Any children of this Component
     */
    abstract render(attrs: Readonly<AttrsType>, children: ChildrenTypes[]): RenderReturnType

    /**
     * Trigger re-rendering of this Comonent and all child Components.
     * This will unmount and delete all child Components, then call
     * this.render() and consequently new and mount a fresh set of child Components.
     * 
     * This is set by Velotype Core on Component construction and is not overridable
     */
    refresh(){}

    /**
     * A unique key per instance of each Component.
     * 
     * This is read-only and set by Velotype Core on Component construction and is not overridable
     */
    vtKey: string = ""

    /**
     * A reference to this Component's HTMLElement
     */
    element?: HTMLElement
}

/**
 * Replace an element with a newElement
 * 
 * Note: this will detect if the element hasFocus and will set newElement.focus() if needed
 */
function replaceElement(element: HTMLElement | undefined, newElement: HTMLElement) {
    if (element) {
        const isFocused = document.hasFocus() ? document.activeElement == element : false
        unmountComponentElementChildren(element)
        element.replaceWith(newElement)
        if (isFocused) {
            newElement.focus()
        }
    }
    return newElement
}

/**
 * Unount the children of this element
 */
function unmountComponentElementChildren(element: Element) {
    if (element instanceof HTMLElement) {
        for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i]
            unmountComponentElementChildren(child)
            const key = child.getAttribute(domKeyName)
            if (key) {
                const component = domReferences.get(key)
                if (component) {
                    // Release the Component's vtKey
                    domReferences.delete(component.vtKey)
                }
            }
        }
    }
}

/**
 * Render a Component into an HTMLElement
 */
function componentRender(component: Component<any,any>, attrs: Readonly<any>, children: ChildrenTypes[]) {
    const element: HTMLElement = component.render(attrs, children)
    element.setAttribute(domKeyName, component.vtKey)
    return element
}

/**
 * Sets attributes on an element
 * 
 * Resolves: eventListeners, style object, and processes boolean values
 * 
 * eventListeners support `<div onClick:{()=>{alert()}} />`
 * 
 * Boolean values are set as empty attributes when true and unset when false
 */
function setAttrsOnElement(element: HTMLElement, attrs: Readonly<any>) {
    for (const [name, value] of Object.entries(attrs || {})) {
        if (name.startsWith('on') && name.toLowerCase() in window) {
            // Special handling for event listener attributes
            // Example attrs: {onClick: ()=>{}}
            element.addEventListener(name.toLowerCase().substring(2) as keyof HTMLElementEventMap, value as (this: HTMLElement, ev: Event | UIEvent | WheelEvent) => any)
        } else if (name == "style" && value instanceof Object) {
            // Special handling for style object
            for (const key of Object.keys(value)) {
                const keyValue = value[key]
                if (keyValue == null) {
                    element.style[key as any] = ""
                } else {
                    // Note: any is used here because "keyof typeof element.style" clashes with "length" and "parentRule" being readonly
                    element.style[key as any] = keyValue
                }
            }
        } else if (typeof value == "boolean") {
            // Boolean true gets set to empty string, boolean false does not get set
            if (value) {
                element.setAttribute(name, "")
            }
        } else if (value) {
            // Regular string-based attribute
            element.setAttribute(name, value.toString())
        }
    }
}

/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
function createElement(tag: Type<Component<any,any>> | FunctionComponent<any> | string, attrs: Readonly<any> | null, ...children: ChildrenTypes[]): any {
    const notNullAttrs = attrs || {}
    if (typeof tag === 'string') {
        // Base HTML Element
        const element = document.createElement(tag)
        setAttrsOnElement(element, notNullAttrs)
        // Append children
        appendChild(element, children)
        return element
    } else if (tag.prototype instanceof Component) {
        const component = new (tag as Type<Component<any,any>>)(notNullAttrs, children)
        
        // Assign this Component's componentKey
        const componentKey = String(domNextKey)
        domNextKey++
        domReferences.set(componentKey, component)
        component.vtKey = componentKey

        component.element = componentRender(component, notNullAttrs, children)
        component.refresh = () => {
            component.element = replaceElement(component.element, componentRender(component, notNullAttrs, children))
        }
        return component.element
    } else if (typeof tag === 'function') {
        // Function Component
        return (tag as FunctionComponent<any>)(notNullAttrs, children)
    }

    // Fallback case
    console.error("Invalid tag", tag, notNullAttrs, children)
    return createElement("div",{style:"display:none;"})
}

/**
 * Short style tsx createElement
 * 
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export const h: (tag: Type<Component<any,any>> | FunctionComponent<any> | string, attrs: Readonly<any> | null, ...children: ChildrenTypes[]) => any = createElement

/**
 * Create a fragment `<></>` (which just propagates an array of `children[]`)
 */
function createFragment(_attrs: null, ...children:  ChildrenTypes[]): ChildrenTypes[] {
    return children
}

/**
 * Short style tsx createFragment
 * 
 * Create a fragment `<></>` (which just propagates an array of `children[]`)
 */
export const f: (_attrs: null, ...children:  ChildrenTypes[]) => ChildrenTypes[] = createFragment

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
export function getComponent<T>(componentElement: ChildrenTypes[] | HTMLElement | BasicTypes | null): T {
    if (!componentElement || componentElement instanceof Text || instanceOfBasicTypes(componentElement) || Array.isArray(componentElement)) {
        // Invalid case
        console.error("Invalid element", componentElement)
        return null as T
    }
    const component = domReferences.get(componentElement.getAttribute(domKeyName)||"")
    if (component) {
        return component as T
    } else {
        // Invalid case
        console.error("Invalid element", componentElement)
        return null as T
    }
}

/**
 * Appends a Root Component to an element that is on the document based on an elementId
 */
export function appendRootComponentTo(rootComponent: HTMLElement, elementId: string): HTMLElement | null {
    const element = document.getElementById(elementId)
    if (element) {
        element.appendChild(rootComponent)
        return rootComponent
    } else {
        console.error("Append to null", rootComponent, elementId)
        return null
    }
}

/** Basic JSX types */
export declare namespace h {
    /** JSX namespace */
    export namespace JSX {
        /** JSX types for elements and their accepted attributes, in Micro just set to any */
        interface IntrinsicElements {
            /** Allow all attributes for all elements */
            [elemName: string]: any
        }
    }
}
