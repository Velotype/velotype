// deno-lint-ignore-file no-explicit-any

// Class Components and Function Components

import { setDomKeyOn, registerNewVtKey } from "./dom-references.ts"
import { internalComponentProperty } from "./globals.ts"
import { replaceElement, appendElement, prependElement, replaceChildren, removeElement } from "./mounting.ts"
import { renderableElementToElement, wrapElementIfNeeded } from "./renderable.ts"
import type { AnchorElement, RenderableElements, HasVtKey } from "./types.ts"
import { defineLockedProperty } from "./utils.ts"

/** Checks if something is an instanceof InternalComponent */
export function instanceOfInternalComponent(something: any): something is InternalComponent {
    return something instanceof InternalComponent
}

/** Checks if something is an instanceof Component */
export function instanceOfComponent(something: any): something is Component<any> {
    return something instanceof Component
}

/**
 * A Velotype Function Component that can be used in .tsx files to render HTML Components.
 * Does not support mount and unmount lifecycle events.
 */
export type FunctionComponent<AttrsType> = (attrs: Readonly<AttrsType>, children: RenderableElements[]) => RenderableElements

/**
 * The lifecycle methods that Velotype core calls on Components
 */
interface Mountable {
    /**
     * Mount is called just after a Component is attached to the DOM
     */
    mount: () => void

    /**
     * Unmount is called just before a Component is removed from the DOM
     */
    unmount: () => void
}
/** The Velotype core view of a Component, including its protected members */
export type ComponentInternals = Component<any> & Mountable & {render: (attrs: Readonly<any>, children: RenderableElements[]) => RenderableElements}

/** Get the InternalComponent of component */
function internalComponentOf(component: Component<any>): InternalComponent {
    return (component as any)[internalComponentProperty]
}
/** The InternalComponent methods that back a Component's refresh() and child helper functions */
type ComponentHelperName = "f" | "q" | "w" | "t" | "y" | "u"
/** Get a Component's helper function, bound to its InternalComponent on first use */
function componentHelper(component: Component<any>, name: ComponentHelperName): any {
    const internal = internalComponentOf(component)
    const helpers = internal.b || (internal.b = {})
    return helpers[name] || (helpers[name] = internal[name].bind(internal))
}

/**
 * A Velotype Class Component that can be used in .tsx files to render HTML Components.
 * Supports unmount, render, mount lifecycle events.
 */
export abstract class Component<AttrsType> implements HasVtKey {

    /** The attributes this Component was created with */
    declare readonly attrs: AttrsType

    /** The children this Component was created with */
    declare readonly children: RenderableElements[]

    /** constructor gets attrs and children */
    constructor(attrs: Readonly<AttrsType>, children: RenderableElements[]){
        this.attrs = attrs
        this.children = children
    }

    /**
     * Mount is called just after this Component is attached to the DOM.
     * 
     * May be overriden by a specific Component that extends Component
     */
    protected mount(): void {}

    /**
     * Unmount is called just before this Component is removed from the DOM.
     * 
     * May be overriden by a specific Component that extends Component
     */
    protected unmount(): void {}

    /**
     * Render is called when this Component needs to be materialized into Elements.
     * 
     * To be overriden by a specific Component that extends Component
     * @param {Readonly<AttrsType>} attrs The attrs for this Component
     * @param {RenderableElements[]} children Any children of this Component
     */
    protected abstract render(attrs: Readonly<AttrsType>, children: RenderableElements[]): RenderableElements

    /**
     * Trigger re-rendering of this Component and all child Components.
     * This will unmount and delete all child Components, then call
     * this.render() and consequently new and mount a fresh set of child Components.
     * 
     * Velotype Core creates this on first use, it is not overridable
     */
    get refresh(): () => void {
        return componentHelper(this, "f")
    }

    /**
     * A unique key per instance of each Component.
     * 
     * This is read-only and set by Velotype Core on Component construction
     */
    declare readonly vtKey: number

    /**
     * Replace a Child element with a newly constructed element
     * 
     * Velotype Core creates this on first use, it is not overridable
     * 
     * @param child a child element of this Component
     * @param newChild the element to replace with
     * @returns newElement when replacement is successful, otherwise returns child
     */
    get replaceChild(): (child: AnchorElement, newChild: RenderableElements) => AnchorElement {
        return componentHelper(this, "q")
    }

    /**
     * Append a newly constructed element to a child element
     * 
     * Velotype Core creates this on first use, it is not overridable
     * 
     * @param child a child element of this Component
     * @param toAppendChild the element to append
     * @returns boolean for if replacement was accepted (will reject if the input child element is not a child of this Component)
     */
    get appendToChild(): (child: HTMLElement, toAppendChild: RenderableElements) => boolean {
        return componentHelper(this, "w")
    }

    /**
     * Prepend a newly constructed element to a child element
     * 
     * Velotype Core creates this on first use, it is not overridable
     * 
     * @param child a child element of this Component
     * @param toPrependChild the element to prepend
     * @returns boolean for if replacement was accepted (will reject if the input child element is not a child of this Component)
     */
    get prependToChild(): (child: HTMLElement, toPrependChild: RenderableElements) => boolean {
        return componentHelper(this, "t")
    }

    /**
     * Replace the children of a child element
     * 
     * Velotype Core creates this on first use, it is not overridable
     * 
     * @param child a child element of this Component
     * @param toPrependElement the element to prepend
     * @returns boolean for if replacement was accepted (will reject if the input child element is not a child of this Component)
     */
    get replaceChildrenOfChild(): (child: HTMLElement, newChildren: RenderableElements[]) => boolean {
        return componentHelper(this, "y")
    }

    /**
     * Remove a child element
     * 
     * Velotype Core creates this on first use, it is not overridable
     * 
     * @param child a child element of this Component
     * @returns boolean for if removal was accepted (will reject if the input child element is not a child of this Component)
     */
    get removeChild(): (child: HTMLElement) => boolean {
        return componentHelper(this, "u")
    }
}

/**
 * Internal Velotype Component object
 */
export class InternalComponent {

    constructor(component: Component<any>, attrs: Readonly<any>, children: RenderableElements[]) {
        this.c = component
        this.a = attrs
        this.h = children

        // Assign this Component's componentKey
        this.k = registerNewVtKey(this)

        // Set locked Component properties so that they cannot be modified later
        defineLockedProperty(component, "vtKey", this.k)
        ;(component as any)[internalComponentProperty] = this

        // Initial render of this component
        this.e = componentRender(this, this.a, this.h)
    }

    /**
     * Stashes the Velotype Component defined by the user
     */
    declare readonly c: Component<any>

    /**
     * Stashes a reference to the root AnchorElement of this Component.
     */
    declare e: AnchorElement

    /**
     * Stashes the Component vtKey for this Component
     */
    declare readonly k: number

    /** The Component's refresh() and child helper functions, created on first use */
    declare b?: {[name: string]: any}

    /**
     * If this Component is currently mounted
     */
    m: boolean = false

    /**
     * Stashes the attrs for this Component
     */
    declare readonly a: Readonly<any>

    /**
     * Stashes the children for this Component
     */
    declare readonly h: RenderableElements[]

    /**
     * Trigger unmount for this Component's children, then re-render
     * this Component and then mount new children.
     */
    f(): void {
        this.e = replaceElement(this.e, componentRender(this, this.a, this.h))
    }

    /**
     * replaceChild()
     */
    q(child: AnchorElement, newChild: RenderableElements): AnchorElement {
        if (this.e.contains(child)) {
            return replaceElement(child, renderableElementToElement(newChild), true)
        } else {
            return child
        }
    }

    /**
     * appendToChild()
     */
    w(child: HTMLElement, toAppend: RenderableElements): boolean {
        if (this.e.contains(child)) {
            appendElement(child, renderableElementToElement(toAppend))
            return true
        } else {
            return false
        }
    }
    /**
     * prependToChild()
     */
    t(child: HTMLElement, toPreppend: RenderableElements): boolean {
        if (this.e.contains(child)) {
            prependElement(child, renderableElementToElement(toPreppend))
            return true
        } else {
            return false
        }
    }
    /**
     * replaceChildrenOfChild()
     */
    y(child: HTMLElement, newChildren: RenderableElements[]): boolean {
        if (this.e.contains(child)) {
            replaceChildren(child, newChildren.map(c=>renderableElementToElement(c)))
            return true
        } else {
            return false
        }
    }
    /**
     * removeChild()
     */
    u(child: AnchorElement): boolean {
        if (this.e.contains(child)) {
            removeElement(child)
            return true
        } else {
            return false
        }
    }
    
}

/**
 * Render a Component into an AnchorElement
 */
function componentRender(classComponent: InternalComponent, attrs: Readonly<any>, children: RenderableElements[]): AnchorElement {
    const render: AnchorElement = wrapElementIfNeeded((classComponent.c as ComponentInternals).render(attrs, children))
    setDomKeyOn(render, classComponent.k)
    return render
}
