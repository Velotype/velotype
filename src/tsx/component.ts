// deno-lint-ignore-file no-explicit-any

// Class Components and Function Components

import { setDomKeyOn, registerNewVtKey, releaseVtKeysFrom } from "./dom-references.ts"
import { abortControllerProperty, domReferences, internalComponentProperty, vtState } from "./globals.ts"
import { replaceElement, appendElement, prependElement, insertElementBefore, replaceChildren, removeElement } from "./mounting.ts"
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
/** One of `childMethods`, called through the getters on Component, which give it its types */
type ChildMethod = (render: AnchorElement | undefined, child: any, newChild?: any) => any
/** refresh() ("f"), and the child methods, by the names in `childMethods` */
type ComponentHelperName = "f" | keyof typeof childMethods
/**
 * Get a Component's helper function, made for its InternalComponent on first use
 *
 * A child method is given the Component's element each time it is called, since `refresh()` can
 * replace it. In the Component's constructor there is no InternalComponent yet: the child methods
 * are then given no element, and act on the element they are given, as they do until the
 * Component has rendered; `refresh()` throws.
 */
function componentHelper(component: Component<any>, name: ComponentHelperName): any {
    const internal = internalComponentOf(component)
    if (!internal) {
        return name === "f" ? refreshBeforeRender : (child: any, newChild: any) => (childMethods[name] as ChildMethod)(undefined, child, newChild)
    }
    const helpers = internal.b || (internal.b = {})
    return helpers[name] || (helpers[name] = name === "f"
        ? internal.f.bind(internal)
        : (child: any, newChild: any) => (childMethods[name] as ChildMethod)(internal.e, child, newChild))
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
     * Mount is called just after this Component is inserted into the page through Velotype,
     * before the browser paints, so layout can be read. Child Components mount before their parent.
     * 
     * Called once. `refresh()` does not call it again, and an error thrown here is reported
     * with `reportError()` so that the other Components still mount.
     * 
     * May be overriden by a specific Component that extends Component
     */
    protected mount(): void {}

    /**
     * Unmount is called just before this Component is removed from the page by Velotype,
     * while it is still in the page. Afterwards the Component is released: its event bus
     * listeners are removed, `unmountSignal` is aborted, and it does not mount again.
     * 
     * Called once. An error thrown here is reported with `reportError()` so that the other
     * Components still unmount.
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
     * This Component stays mounted, its own `mount()` and `unmount()` are not called.
     * If render() throws, the current render is kept and the error is thrown.
     * 
     * Velotype Core creates this on first use, it is not overridable
     */
    get refresh(): () => void {
        return componentHelper(this, "f")
    }

    /**
     * An AbortSignal that is aborted just after this Component's `unmount()` returns, or when
     * the Component is released without being mounted (such as when its render throws)
     * 
     * Pass it to code started in `mount()` so that it is cleaned up on unmount, such as
     * `addEventListener(type, listener, {signal: this.unmountSignal})` or `fetch(url, {signal: this.unmountSignal})`
     * 
     * Velotype Core creates this on first use, it is not overridable
     */
    get unmountSignal(): AbortSignal {
        let controller: AbortController | undefined = (this as any)[abortControllerProperty]
        if (!controller) {
            controller = new AbortController()
            ;(this as any)[abortControllerProperty] = controller
            // A Component that was already released gets an aborted signal
            if (this.vtKey !== undefined && !domReferences.has(this.vtKey)) {
                controller.abort()
            }
        }
        return controller.signal
    }

    /**
     * A unique key per instance of each Component.
     * 
     * This is read-only and set by Velotype Core after the Component's constructor returns,
     * so it is undefined in the constructor and in field initializers
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
     * Insert a newly constructed element just before a child element
     * 
     * Velotype Core creates this on first use, it is not overridable
     * 
     * @param child a child element of this Component, other than its root element
     * @param toInsertChild the element to insert before it
     * @returns boolean for if insertion was accepted (will reject if the input child element is not a child of this Component, or is its root element)
     */
    get insertBeforeChild(): (child: AnchorElement, toInsertChild: RenderableElements) => boolean {
        return componentHelper(this, "i")
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
        if (this.e === undefined) {refreshBeforeRender()}
        const firstKey = vtState.k
        let render: AnchorElement
        try {
            render = componentRender(this, this.a, this.h)
        } catch (error) {
            // Keep the current render, and release what the failed render created
            releaseVtKeysFrom(firstKey)
            throw error
        }
        this.e = replaceElement(this.e, render)
    }
}

/**
 * Whether `child` is an element the child methods may change: one in `render`, the Component's
 * element - or, before the Component has rendered (in its constructor, or in render()), whatever
 * element they are given, since there is no render yet to check it against and nothing in it is
 * on the page
 */
function ownsChild(render: AnchorElement | undefined, child: Node): boolean {
    return render === undefined || render.contains(child)
}

/**
 * The child methods, each given the Component's element as `render` (`undefined` before it has
 * rendered). Each changes nothing, and returns `false` (or `child`, for replaceChild()), when
 * `child` is not one it may change.
 */
const childMethods = {
    /** replaceChild() */
    q(render: AnchorElement | undefined, child: AnchorElement, newChild: RenderableElements): AnchorElement {
        return ownsChild(render, child) ? replaceElement(child, renderableElementToElement(newChild), true) : child
    },
    /** appendToChild() */
    w(render: AnchorElement | undefined, child: HTMLElement, toAppend: RenderableElements): boolean {
        if (!ownsChild(render, child)) {return false}
        appendElement(child, renderableElementToElement(toAppend))
        return true
    },
    /** prependToChild() */
    t(render: AnchorElement | undefined, child: HTMLElement, toPrepend: RenderableElements): boolean {
        if (!ownsChild(render, child)) {return false}
        prependElement(child, renderableElementToElement(toPrepend))
        return true
    },
    /** insertBeforeChild() - not before the root element, which would put the new element outside the Component's render */
    i(render: AnchorElement | undefined, child: AnchorElement, toInsert: RenderableElements): boolean {
        const parent = child.parentNode
        if (child === render || !parent || !ownsChild(render, child)) {return false}
        insertElementBefore(parent as AnchorElement, renderableElementToElement(toInsert), child)
        return true
    },
    /** replaceChildrenOfChild() */
    y(render: AnchorElement | undefined, child: HTMLElement, newChildren: RenderableElements[]): boolean {
        if (!ownsChild(render, child)) {return false}
        replaceChildren(child, newChildren.map(c => renderableElementToElement(c)))
        return true
    },
    /** removeChild() */
    u(render: AnchorElement | undefined, child: AnchorElement): boolean {
        if (!ownsChild(render, child)) {return false}
        removeElement(child)
        return true
    },
}

/** refresh() before a Component has rendered: there is nothing yet to render again */
function refreshBeforeRender(): never {
    throw new Error("refresh() before the first render")
}

/**
 * Render a Component into an AnchorElement
 */
function componentRender(classComponent: InternalComponent, attrs: Readonly<any>, children: RenderableElements[]): AnchorElement {
    const render: AnchorElement = wrapElementIfNeeded((classComponent.c as ComponentInternals).render(attrs, children))
    setDomKeyOn(render, classComponent.k)
    return render
}

/** Abort a released Component's unmountSignal, if it has been used */
export function abortUnmountSignal(component: Component<any>): void {
    const controller: AbortController | undefined = (component as any)[abortControllerProperty]
    if (controller) {
        controller.abort()
    }
}
