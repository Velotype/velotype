// deno-lint-ignore-file no-explicit-any

// RenderTemplateArray

import type { BubblingEventName } from "../jsx-types/dom-types.d.ts"
import { createArrayWrapper } from "./render-object-array.ts"
import { UpdateHandlerLink, RenderObject } from "./render-object.ts"
import type { AnchorElement } from "./types.ts"
import { checkPermutation, insertIndex, insertItems, moveIntoOrder, swapSiblings } from "./utils.ts"

/**
 * Parameters used on RenderTemplateArray construction
 *
 * @wrapperElementTag the HTML tag to use for the wrapper element (defaults to a \<div style="display:contents;"/> tag, a named tag is created unstyled)
 * @wrapperAttrs attributes to set on the wrapper element
 * @template the element cloned for each row, it must not contain Components, RenderObjects, or event listeners
 * @renderFunction renders a data point into a new row clone, returns the updateRefs passed to handleUpdate
 * @handleUpdate updates a row in place, when not set the row is replaced with a new clone
 * @on event listeners on the wrapper element, called with the row, data, and index that the event occurred in (only events that bubble)
 */
export type RenderTemplateArrayOptions<DataType, UpdateRefsType = any, RowElementType extends Element = HTMLElement> = {
    wrapperElementTag?: string,
    wrapperAttrs?: any,
    template: RowElementType,
    renderFunction: (row: RowElementType, data: DataType) => UpdateRefsType,
    handleUpdate?: (row: RowElementType, updateRefs: UpdateRefsType, oldData: DataType, newData: DataType) => void,
    on?: {[EventName in BubblingEventName]?: (event: HTMLElementEventMap[EventName], row: RowElementType, data: DataType, index: number) => void}
}
/** A rendered row of a RenderTemplateArray */
type TemplateRowType<UpdateRefsType, RowElementType extends Element> = {
    /** element */
    e: RowElementType,
    /** updateRefs */
    r: UpdateRefsType,
    /** hidden by filter(), so not in the wrapper */
    h: boolean
}
/** The filter() predicate, held where the render functions passed to super() can read it */
type FilterHolder<DataType> = {f?: (data: DataType) => boolean}
/** Clone the template and render data into it */
function newTemplateRow<DataType, UpdateRefsType, RowElementType extends Element>(options: RenderTemplateArrayOptions<DataType, UpdateRefsType, RowElementType>, data: DataType, hidden: boolean): TemplateRowType<UpdateRefsType, RowElementType> {
    const row = options.template.cloneNode(true) as RowElementType
    return {e: row, r: options.renderFunction(row, data), h: hidden}
}
/** Render a row for each of data and add them to rows, appending to wrapper the ones that filter shows */
function appendTemplateRows<DataType, UpdateRefsType, RowElementType extends Element>(options: RenderTemplateArrayOptions<DataType, UpdateRefsType, RowElementType>, wrapper: Node, rows: TemplateRowType<UpdateRefsType, RowElementType>[], data: DataType[], filter: ((data: DataType) => boolean) | undefined): void {
    for (let i = 0; i < data.length; i++) {
        const row = newTemplateRow(options, data[i], filter !== undefined && !filter(data[i]))
        rows.push(row)
        if (!row.h) {
            wrapper.appendChild(row.e)
        }
    }
}
/** The element of the first shown row at or after index, which a row placed just before index goes before */
function nextShownRow<UpdateRefsType, RowElementType extends Element>(rows: TemplateRowType<UpdateRefsType, RowElementType>[], index: number): RowElementType | null {
    for (let i = index; i < rows.length; i++) {
        if (!rows[i].h) {
            return rows[i].e
        }
    }
    return null
}
/** Move the shown row at index into its place in the wrapper, before the next shown row */
function placeRow<UpdateRefsType, RowElementType extends Element>(wrapper: Node, rows: TemplateRowType<UpdateRefsType, RowElementType>[], index: number): void {
    wrapper.insertBefore(rows[index].e, nextShownRow(rows, index + 1))
}

/**
 * An Array of data points rendered by cloning a template element for each row
 *
 * Rows cannot contain Components or RenderObjects, which lets rows be created, updated,
 * and removed without Component bookkeeping (use RenderObjectArray for those cases)
 *
 * @template DataType The type of the underlying Data Object
 * @template UpdateRefsType The type of the updateRefs returned by renderFunction and passed to handleUpdate
 * @template RowElementType The element type of the template
 */
export class RenderTemplateArray<DataType, UpdateRefsType = any, RowElementType extends Element = HTMLElement> extends RenderObject<DataType[], TemplateRowType<UpdateRefsType, RowElementType>[]> {
    readonly #options: RenderTemplateArrayOptions<DataType, UpdateRefsType, RowElementType>
    readonly #filter: FilterHolder<DataType>
    /**
     * Create a new RenderTemplateArray
     */
    constructor(options: RenderTemplateArrayOptions<DataType, UpdateRefsType, RowElementType>) {
        const filter: FilterHolder<DataType> = {}
        super([], (data: DataType[], thisArg: RenderObject<DataType[], TemplateRowType<UpdateRefsType, RowElementType>[]>) => {
            const wrapper = createArrayWrapper(options)
            // The rows of this wrapper, kept as its updateRefs
            const rows: TemplateRowType<UpdateRefsType, RowElementType>[] = []
            appendTemplateRows(options, wrapper, rows, data, filter.f)
            const on = options.on
            if (on) {
                Object.keys(on).forEach(eventName => {
                    const listener = on[eventName as BubblingEventName] as ((event: Event, row: RowElementType, data: DataType, index: number) => void) | undefined
                    if (listener) {
                        wrapper.addEventListener(eventName, event => {
                            // Find the row that contains the event target
                            let target = event.target as Node | null
                            while (target && target.parentNode !== wrapper) {
                                target = target.parentNode
                            }
                            for (let i = 0; i < rows.length; i++) {
                                if (rows[i].e === target) {
                                    listener(event, rows[i].e, thisArg.value[i], i)
                                    return
                                }
                            }
                        })
                    }
                })
            }
            return new UpdateHandlerLink(wrapper, rows)
        }, (wrapper: AnchorElement, rows: TemplateRowType<UpdateRefsType, RowElementType>[], _oldData: DataType[], newData: DataType[]) => {
            // The new rows are rendered before the current ones are removed, so that nothing changes when renderFunction throws
            const fragment = document.createDocumentFragment()
            const newRows: TemplateRowType<UpdateRefsType, RowElementType>[] = []
            appendTemplateRows(options, fragment, newRows, newData, filter.f)
            // Rows have no Components to unmount, so they are removed all at once
            wrapper.textContent = ""
            wrapper.appendChild(fragment)
            rows.length = 0
            for (let i = 0; i < newRows.length; i++) {
                rows.push(newRows[i])
            }
        })
        this.#options = options
        this.#filter = filter
    }
    /**
     * Push one data point into the Array
     */
    push(newData: DataType): void {
        this.#appendAll([newData])
    }
    /**
     * Push all of the data points of newData[] into the Array
     */
    pushAll(newData: DataType[]): void {
        this.#appendAll(newData)
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
        // Every instance element has one row per data point
        const length = value.length
        const start = insertIndex(index, length)
        const count = newData.length
        const options = this.#options
        try {
            this.es.forEach(instance => {
                const rows = instance.uR!
                // The rows are rendered before any is inserted, so that nothing changes in this instance element when renderFunction throws
                const fragment = document.createDocumentFragment()
                const newRows: TemplateRowType<UpdateRefsType, RowElementType>[] = []
                appendTemplateRows(options, fragment, newRows, newData, this.#filter.f)
                instance.e.insertBefore(fragment, nextShownRow(rows, start))
                insertItems(rows, start, newRows)
            })
        } catch (error) {
            // Remove the rows inserted into the other instance elements, so that the rows still match the data
            this.es.forEach(instance => {
                const rows = instance.uR!
                if (rows.length > length) {
                    rows.splice(start, count).forEach(row => {
                        row.e.remove()
                    })
                }
            })
            throw error
        }
        insertItems(value, start, newData)
    }
    /** Render rows for newData in each instance element, then add newData to the Array */
    #appendAll(newData: DataType[]): void {
        const value = this.value
        // Every instance element has one row per data point
        const length = value.length
        const count = newData.length
        const options = this.#options
        try {
            this.es.forEach(instance => {
                appendTemplateRows(options, instance.e, instance.uR!, newData, this.#filter.f)
            })
        } catch (error) {
            // Remove the rows rendered for newData, so that the rows still match the data
            this.es.forEach(instance => {
                instance.uR!.splice(length).forEach(row => {
                    row.e.remove()
                })
            })
            throw error
        }
        for (let i = 0; i < count; i++) {
            value.push(newData[i])
        }
    }
    /**
     * Delete one or more data points from the Array
     */
    deleteAt(startIndex: number, deleteCount?: number): void {
        const count = deleteCount! > 0 ? deleteCount! : 1
        this.value.splice(startIndex, count)
        this.es.forEach(instance => {
            instance.uR!.splice(startIndex, count).forEach(row => {
                row.e.remove()
            })
        })
    }
    /**
     * Delete a data point from the Array by value
     *
     * (note: uses Array.indexOf() so runs in linear time)
     */
    delete(data: DataType): void {
        const found = this.value.indexOf(data)
        if (found >= 0) {
            this.deleteAt(found, 1)
        }
    }
    /**
     * Get the Data value at index
     */
    getAt(index: number): DataType {
        return this.value[index]
    }
    /**
     * Set the value at index to newData
     */
    setAt(index: number, newData: DataType): void {
        const value = this.value
        const oldData = value[index]
        const options = this.#options
        const handleUpdate = options.handleUpdate
        const filter = this.#filter.f
        // Checked first, so that nothing changes when the filter throws
        const hidden = filter !== undefined && !filter(newData)
        if (handleUpdate) {
            this.es.forEach(instance => {
                const rows = instance.uR!
                const row = rows[index]
                handleUpdate(row.e, row.r, oldData, newData)
                if (row.h !== hidden) {
                    row.h = hidden
                    if (hidden) {
                        row.e.remove()
                    } else {
                        placeRow(instance.e, rows, index)
                    }
                }
            })
        } else {
            // The new rows are rendered before any is replaced, so that nothing changes when renderFunction throws
            const newRows: TemplateRowType<UpdateRefsType, RowElementType>[] = []
            this.es.forEach(() => {
                newRows.push(newTemplateRow(options, newData, hidden))
            })
            let i = 0
            this.es.forEach(instance => {
                const rows = instance.uR!
                const oldRow = rows[index]
                rows[index] = newRows[i++]
                if (!oldRow.h && !hidden) {
                    oldRow.e.replaceWith(rows[index].e)
                } else {
                    oldRow.e.remove()
                    if (!hidden) {
                        placeRow(instance.e, rows, index)
                    }
                }
            })
        }
        // Set after the rows are updated, so that the data is unchanged when user code throws
        value[index] = newData
    }
    /**
     * Swap the data points at indexA and indexB, moving their rendered rows
     */
    swap(indexA: number, indexB: number): void {
        const value = this.value
        if (indexA === indexB || !(indexA in value && indexB in value)) {
            return
        }
        const data = value[indexA]
        value[indexA] = value[indexB]
        value[indexB] = data
        this.es.forEach(instance => {
            const rows = instance.uR!
            const a = rows[indexA]
            const b = rows[indexB]
            rows[indexA] = b
            rows[indexB] = a
            if (!a.h && !b.h) {
                swapSiblings(instance.e, a.e, b.e)
            } else {
                // At most one of them is in the wrapper, it moves to its new place
                if (!a.h) {
                    placeRow(instance.e, rows, indexB)
                }
                if (!b.h) {
                    placeRow(instance.e, rows, indexA)
                }
            }
        })
    }
    /**
     * Move the data point at from to index to, moving its rendered rows
     *
     * Both are indexes from 0 to length - 1, and to is the index in the Array after the move (as when
     * the data point is removed with `splice(from, 1)` and inserted with `splice(to, 0, data)`)
     */
    move(from: number, to: number): void {
        const value = this.value
        if (from === to || !(from in value && to in value)) {
            return
        }
        const data = value.splice(from, 1)[0]
        value.splice(to, 0, data)
        this.es.forEach(instance => {
            const rows = instance.uR!
            const row = rows.splice(from, 1)[0]
            rows.splice(to, 0, row)
            if (!row.h) {
                placeRow(instance.e, rows, to)
            }
        })
    }
    /**
     * Sort the Array with compareFn (as `Array.sort()` does, and stable), moving the rendered rows
     *
     * Only the rows that change places are moved: re-sorting an Array that is nearly in order
     * (after a few setAt() calls, say) moves only those rows
     */
    sort(compareFn: (a: DataType, b: DataType) => number): void {
        const value = this.value
        const length = value.length
        const indexes: number[] = new Array(length)
        for (let i = 0; i < length; i++) {
            indexes[i] = i
        }
        indexes.sort((a, b) => compareFn(value[a], value[b]))
        this.#reorder(indexes)
    }
    /**
     * Put the data points in a new order, moving the rendered rows
     *
     * indexes holds each index from 0 to length - 1 once: the data point at index i moves to the index
     * where i appears, so after the reorder `value[k]` is the data point that was at `indexes[k]`
     *
     * Only the rows that change places are moved
     */
    reorder(indexes: ArrayLike<number>): void {
        checkPermutation(indexes, this.value.length)
        this.#reorder(indexes)
    }
    #reorder(indexes: ArrayLike<number>): void {
        const value = this.value
        const length = value.length
        const oldValue = value.slice()
        for (let i = 0; i < length; i++) {
            value[i] = oldValue[indexes[i]]
        }
        this.es.forEach(instance => {
            const rows = instance.uR!
            const oldRows = rows.slice()
            // The shown rows in their new order, and their positions before
            const elements: RowElementType[] = []
            const oldPositions: number[] = []
            for (let i = 0; i < length; i++) {
                const row = oldRows[indexes[i]]
                rows[i] = row
                if (!row.h) {
                    elements.push(row.e)
                    oldPositions.push(indexes[i])
                }
            }
            moveIntoOrder(instance.e, elements, oldPositions)
        })
    }
    /**
     * Show only the data points that predicate returns true for, or every data point when it is undefined
     *
     * The data points that are not shown stay in the Array, with their rows kept out of the page, so
     * showing them again moves those rows back rather than rendering them again. Indexes (in getAt(),
     * setAt(), swap(), the `on` listeners, and the rest) still count every data point
     *
     * The predicate is applied to data added later, and again to a data point changed with setAt().
     * Call filter() again to apply it to every data point, when what it tests for has changed
     */
    filter(predicate?: (data: DataType) => boolean): void {
        const value = this.value
        const length = value.length
        // Checked for every data point first, so that nothing changes when predicate throws
        const hidden = new Uint8Array(length)
        if (predicate) {
            for (let i = 0; i < length; i++) {
                hidden[i] = predicate(value[i]) ? 0 : 1
            }
        }
        this.#filter.f = predicate
        this.es.forEach(instance => {
            const wrapper = instance.e
            const rows = instance.uR!
            // Rows to show are gathered, then inserted before the next shown row together
            let fragment: DocumentFragment | null = null
            for (let i = 0; i < length; i++) {
                const row = rows[i]
                if (hidden[i]) {
                    if (!row.h) {
                        row.h = true
                        row.e.remove()
                    }
                } else if (row.h) {
                    row.h = false
                    if (!fragment) {
                        fragment = document.createDocumentFragment()
                    }
                    fragment.appendChild(row.e)
                } else if (fragment) {
                    wrapper.insertBefore(fragment, row.e)
                    fragment = null
                }
            }
            if (fragment) {
                wrapper.appendChild(fragment)
            }
        })
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
