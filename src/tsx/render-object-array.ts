// deno-lint-ignore-file no-explicit-any

// RenderObjectArray

import { setAttrsOnElement } from "./attributes.ts"
import { createElement } from "./create-element.ts"
import { releaseVtKeyObject, releaseVtKeysFrom } from "./dom-references.ts"
import { displayContentsDiv, vtState } from "./globals.ts"
import { appendElement, insertElementBefore } from "./mounting.ts"
import { RenderObject, type RenderObjectHandleUpdateType, type RenderObjectInternals, type RenderObjectRenderFunctionType } from "./render-object.ts"
import { renderableElementToElement } from "./renderable.ts"
import type { AnchorElement } from "./types.ts"
import { checkPermutation, insertIndex, insertItems, moveIntoOrder } from "./utils.ts"

/** Create the wrapper element of a RenderObjectArray or RenderTemplateArray */
export function createArrayWrapper(options: {wrapperElementTag?: string, wrapperAttrs?: any}): HTMLElement {
    const tag = options.wrapperElementTag
    const wrapper: HTMLElement = (tag === undefined) ? displayContentsDiv.cloneNode() as HTMLDivElement : createElement(tag, null) as HTMLElement
    setAttrsOnElement(wrapper, options.wrapperAttrs)
    return wrapper
}

/**
 * Parameters used on RenderObjectArray construction
 * 
 * @wrapperElementTag the HTML tag to use for the wrapper element (defaults to a \<div style="display:contents;"/> tag, a named tag is created unstyled)
 * @wrapperAttrs attributes to set on the wrapper element
 * @renderFunction the renderFunction to pass to the underlying RenderObject instances on each data point
 * @handleUpdate advanced functionality used to more efficiently rerender instance elements
 */
export type RenderObjectArrayOptions<DataType, UpdateRefsType = any> = {
    wrapperElementTag?: string,
    wrapperAttrs?: any,
    renderFunction: RenderObjectRenderFunctionType<DataType, UpdateRefsType>,
    handleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
}
/**
 * What filter() keeps, held where the render function passed to super() can read it
 */
type FilterState<DataType, UpdateRefsType> = {
    /** the predicate */
    f?: (data: DataType) => boolean
    /** the data points it hides */
    h: Set<RenderObject<DataType, UpdateRefsType>>
    /** for each instance element, the detached element that holds its hidden elements */
    p: WeakMap<Node, HTMLElement>
}
/** The detached element that holds the hidden elements of wrapper */
function parkFor(state: FilterState<any, any>, wrapper: Node): HTMLElement {
    let park = state.p.get(wrapper)
    if (!park) {
        park = document.createElement("div")
        state.p.set(wrapper, park)
    }
    return park
}

/**
 * An optimized RenderObject that represents an Array of data points rendered into
 * a wrapperElement (by default a \<div> tag)
 * 
 * @template DataType The type of the underlying Data Object
 * @template UpdateRefsType An advanced capability of RenderObjectArray to more efficiently rerender instance elements
 */
export class RenderObjectArray<DataType, UpdateRefsType = any> extends RenderObject<RenderObject<DataType, UpdateRefsType>[]> {
    readonly #renderFunction: RenderObjectRenderFunctionType<DataType, UpdateRefsType>
    readonly #handleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
    readonly #filter: FilterState<DataType, UpdateRefsType>
    /**
     * Create a new RenderObjectArray
     * 
     * Options parameters used on RenderObjectArray construction:
     * 
     * @wrapperElementTag the HTML tag to use for the wrapper element (defaults to a \<div/> tag styled display:contents; a named tag is created unstyled)
     * @wrapperAttrs attributes to set on the wrapper element
     * @renderFunction the renderFunction to pass to the underlying RenderObject instances on each data point
     * @handleUpdate advanced functionality used to more efficiently rerender instance elements
     */
    constructor(options: RenderObjectArrayOptions<DataType, UpdateRefsType>) {
        const filter: FilterState<DataType, UpdateRefsType> = {h: new Set(), p: new WeakMap()}
        super([], (data: RenderObject<DataType, UpdateRefsType>[]) => {
            const mainElement = createArrayWrapper(options)
            data.forEach(d => {
                const element = renderableElementToElement(d)
                if (filter.h.has(d)) {
                    parkFor(filter, mainElement).appendChild(element)
                } else {
                    mainElement.appendChild(element)
                }
            })
            return mainElement
        })
        this.#renderFunction = options.renderFunction
        this.#handleUpdate = options.handleUpdate
        this.#filter = filter
    }
    /** Is the data point hidden by filter()? */
    #hides(data: DataType): boolean {
        const predicate = this.#filter.f
        return predicate !== undefined && !predicate(data)
    }
    /** The element in wrapper of the first shown data point at or after index, which an element placed just before index goes before */
    #nextShown(wrapper: Node, index: number): AnchorElement | null {
        const value = this.value
        const hidden = this.#filter.h
        for (let i = index; i < value.length; i++) {
            if (!hidden.has(value[i])) {
                return (value[i] as RenderObjectInternals).ei(wrapper)
            }
        }
        return null
    }
    /** Move the element of the shown data point at index into its place in every instance element */
    #place(index: number): void {
        const obj = this.value[index] as RenderObjectInternals
        this.es.forEach(instance => {
            const wrapper = instance.e
            const element = obj.ei(wrapper)
            if (element) {
                wrapper.insertBefore(element, this.#nextShown(wrapper, index + 1))
            }
        })
    }
    /**
     * Push one data point into the Array
     */
    push(newData: DataType): void {
        const firstKey = vtState.k
        const hidden = this.#hides(newData)
        const obj = new RenderObject<DataType, UpdateRefsType>(newData, this.#renderFunction, this.#handleUpdate)
        const value = this.value
        const filter = this.#filter
        value.push(obj)
        if (hidden) {
            filter.h.add(obj)
        }
        try {
            this.es.forEach(element => {
                const objElement = renderableElementToElement(obj)
                if (hidden) {
                    parkFor(filter, element.e).appendChild(objElement)
                } else {
                    appendElement(element.e, objElement)
                }
            })
        } catch (error) {
            // Remove the data point and its rows, and release what its render created
            filter.h.delete(obj)
            value.splice(value.lastIndexOf(obj), 1)
            RenderObjectArray.#releaseOne(obj)
            releaseVtKeysFrom(firstKey)
            throw error
        }
    }
    /**
     * Push all of the data points of newData[] into the Array
     */
    pushAll(newData: DataType[]): void {
        newData.forEach(d => this.push(d))
    }
    /**
     * Insert one data point into the Array at index
     *
     * An index from 0 to length, or counting from the end when negative (as `Array.splice()` does)
     */
    insertAt(index: number, newData: DataType): void {
        this.insertAllAt(index, [newData])
    }
    /**
     * Insert all of the data points of newData[] into the Array at index, in order
     *
     * An index from 0 to length, or counting from the end when negative (as `Array.splice()` does)
     */
    insertAllAt(index: number, newData: DataType[]): void {
        const value = this.value
        const start = insertIndex(index, value.length)
        const filter = this.#filter
        // Checked first, so that nothing changes when the filter throws
        const hidden = newData.map(d => this.#hides(d))
        const firstKey = vtState.k
        const objs = newData.map(d => new RenderObject<DataType, UpdateRefsType>(d, this.#renderFunction, this.#handleUpdate))
        insertItems(value, start, objs)
        objs.forEach((obj, i) => {
            if (hidden[i]) {
                filter.h.add(obj)
            }
        })
        try {
            this.es.forEach(element => {
                const wrapper = element.e
                const before = this.#nextShown(wrapper, start + objs.length)
                objs.forEach((obj, i) => {
                    const objElement = renderableElementToElement(obj)
                    if (hidden[i]) {
                        parkFor(filter, wrapper).appendChild(objElement)
                    } else {
                        insertElementBefore(wrapper, objElement, before)
                    }
                })
            })
        } catch (error) {
            // Remove the data points and their rows, and release what their render created
            objs.forEach(obj => {
                filter.h.delete(obj)
                const objIndex = value.indexOf(obj)
                if (objIndex >= 0) {
                    value.splice(objIndex, 1)
                }
                RenderObjectArray.#releaseOne(obj)
            })
            releaseVtKeysFrom(firstKey)
            throw error
        }
    }
    /**
     * Delete one or more data points from the Array
     */
    deleteAt(startIndex: number, deleteCount?: number): void {
        const oldData = this.value.splice(startIndex, deleteCount! > 0 ? deleteCount! : 1)
        const hidden = this.#filter.h
        oldData.forEach(obj => {
            hidden.delete(obj)
            RenderObjectArray.#releaseOne(obj)
        })
    }
    /**
     * Delete a data point from the Array by value
     * 
     * (note: uses Array.findIndex() so runs in linear time)
     */
    delete(data: DataType): void {
        const found = this.value.findIndex(x=>x.value===data)
        if (found >= 0) {
            this.deleteAt(found, 1)
        }
    }
    /**
     * Get the Data value at index
     */
    getAt(index: number): DataType {
        return this.value[index].value
    }
    /**
     * Set the value at index to newData
     */
    setAt(index: number, newData: DataType): void {
        const obj = this.value[index]
        const filter = this.#filter
        // Checked first, so that nothing changes when the filter throws
        const hidden = this.#hides(newData)
        obj.value = newData
        if (hidden !== filter.h.has(obj)) {
            this.es.forEach(instance => {
                const wrapper = instance.e
                const park = parkFor(filter, wrapper)
                const element = (obj as RenderObjectInternals).ei(hidden ? wrapper : park)
                if (element) {
                    if (hidden) {
                        // Kept, not unmounted, so that it can be shown again
                        park.appendChild(element)
                    } else {
                        insertElementBefore(wrapper, element, this.#nextShown(wrapper, index + 1))
                    }
                }
            })
            if (hidden) {
                filter.h.add(obj)
            } else {
                filter.h.delete(obj)
            }
        }
    }
    /**
     * Swap the data points at indexA and indexB, moving their rendered elements
     */
    swap(indexA: number, indexB: number): void {
        const value = this.value
        const a = value[indexA]
        const b = value[indexB]
        if (!a || !b || a === b) {
            return
        }
        value[indexA] = b
        value[indexB] = a
        const hidden = this.#filter.h
        if (!hidden.has(a) && !hidden.has(b)) {
            ;(a as RenderObjectInternals).sw(b)
        } else {
            // At most one of them is shown, it moves to its new place
            if (!hidden.has(a)) {
                this.#place(indexB)
            }
            if (!hidden.has(b)) {
                this.#place(indexA)
            }
        }
    }
    /**
     * Move the data point at from to index to, moving its rendered elements
     *
     * Both are indexes from 0 to length - 1, and to is the index in the Array after the move (as when
     * the data point is removed with `splice(from, 1)` and inserted with `splice(to, 0, data)`)
     */
    move(from: number, to: number): void {
        const value = this.value
        if (from === to || !(from in value && to in value)) {
            return
        }
        const obj = value.splice(from, 1)[0]
        value.splice(to, 0, obj)
        if (!this.#filter.h.has(obj)) {
            this.#place(to)
        }
    }
    /**
     * Sort the Array with compareFn (as `Array.sort()` does, and stable), moving the rendered elements
     *
     * Only the elements that change places are moved: re-sorting an Array that is nearly in order
     * (after a few setAt() calls, say) moves only those elements
     */
    sort(compareFn: (a: DataType, b: DataType) => number): void {
        const value = this.value
        const length = value.length
        const indexes: number[] = new Array(length)
        for (let i = 0; i < length; i++) {
            indexes[i] = i
        }
        indexes.sort((a, b) => compareFn(value[a].value, value[b].value))
        this.#reorder(indexes)
    }
    /**
     * Put the data points in a new order, moving the rendered elements
     *
     * indexes holds each index from 0 to length - 1 once: the data point at index i moves to the index
     * where i appears, so after the reorder `getAt(k)` is the data point that was at `indexes[k]`
     *
     * Only the elements that change places are moved
     */
    reorder(indexes: ArrayLike<number>): void {
        checkPermutation(indexes, this.value.length)
        this.#reorder(indexes)
    }
    #reorder(indexes: ArrayLike<number>): void {
        const value = this.value
        const length = value.length
        const oldValue = value.slice()
        const hidden = this.#filter.h
        // The shown data points in their new order, and their positions before
        const shown: RenderObjectInternals[] = []
        const oldPositions: number[] = []
        for (let i = 0; i < length; i++) {
            const obj = oldValue[indexes[i]]
            value[i] = obj
            if (!hidden.has(obj)) {
                shown.push(obj as RenderObjectInternals)
                oldPositions.push(indexes[i])
            }
        }
        this.es.forEach(instance => {
            const wrapper = instance.e
            const elements: AnchorElement[] = []
            for (let i = 0; i < shown.length; i++) {
                elements.push(shown[i].ei(wrapper)!)
            }
            moveIntoOrder(wrapper, elements, oldPositions)
        })
    }
    /**
     * Show only the data points that predicate returns true for, or every data point when it is undefined
     *
     * The data points that are not shown stay in the Array, with their elements kept out of the page
     * (their Components are not unmounted), so showing them again moves those elements back rather than
     * rendering them again. Indexes (in getAt(), setAt(), swap(), and the rest) still count every data point
     *
     * The predicate is applied to data added later, and again to a data point changed with setAt().
     * Call filter() again to apply it to every data point, when what it tests for has changed
     */
    filter(predicate?: (data: DataType) => boolean): void {
        const value = this.value
        const length = value.length
        // Checked for every data point first, so that nothing changes when predicate throws
        const hide = new Uint8Array(length)
        if (predicate) {
            for (let i = 0; i < length; i++) {
                hide[i] = predicate(value[i].value) ? 0 : 1
            }
        }
        const filter = this.#filter
        filter.f = predicate
        const hidden = filter.h
        this.es.forEach(instance => {
            const wrapper = instance.e
            const park = parkFor(filter, wrapper)
            // The element after the last shown one looked at, which an element being shown goes before
            let next: Node | null = wrapper.firstChild
            for (let i = 0; i < length; i++) {
                const obj = value[i] as RenderObjectInternals
                if (!hidden.has(obj)) {
                    const element = obj.ei(wrapper)
                    if (element) {
                        next = element.nextSibling
                        if (hide[i]) {
                            // Kept, not unmounted, so that it can be shown again
                            park.appendChild(element)
                        }
                    }
                } else if (!hide[i]) {
                    const element = obj.ei(park)
                    if (element) {
                        insertElementBefore(wrapper, element, next)
                    }
                }
            }
        })
        for (let i = 0; i < length; i++) {
            if (hide[i]) {
                hidden.add(value[i])
            } else {
                hidden.delete(value[i])
            }
        }
    }
    /** Set the current value of this RenderObjectArray */
    override set(newData: RenderObject<DataType, UpdateRefsType>[]): void {
        // Checked first, so that nothing changes when the filter throws
        const hidden = newData.filter(obj => this.#hides(obj.value))
        this.#releaseAll()
        const filter = this.#filter
        filter.h.clear()
        hidden.forEach(obj => filter.h.add(obj))
        super.set(newData)
    }
    /** Will unmount and release all rendered instances of this RenderObjectArray */
    protected override unmount(): void {
        super.unmount()
        this.value = []
    }
    /** Release the old underlying RenderObjects */
    #releaseAll(): void {
        this.value.forEach(RenderObjectArray.#releaseOne)
    }
    /** Unmount, remove all rendered instances of, and release the vtKey of a single underlying RenderObject */
    static #releaseOne(d: RenderObject<any,any>): void {
        (d as RenderObjectInternals).unmount()
        d.removeAll()
        releaseVtKeyObject(d)
    }
    /**
     * Gets the length of the Array
     */
    get length(): number {
        return this.value.length
    }
    /**
     * Clears the Array of all data
     */
    clear(): void {
        this.value = []
    }
}
