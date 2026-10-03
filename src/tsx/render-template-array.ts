// deno-lint-ignore-file no-explicit-any

// RenderTemplateArray

import type { BubblingEventName } from "../jsx-types/dom-types.d.ts"
import { createArrayWrapper } from "./render-object-array.ts"
import { UpdateHandlerLink, RenderObject } from "./render-object.ts"
import type { AnchorElement } from "./types.ts"
import { swapSiblings } from "./utils.ts"

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
    r: UpdateRefsType
}
/** Clone the template and render data into it */
function newTemplateRow<DataType, UpdateRefsType, RowElementType extends Element>(options: RenderTemplateArrayOptions<DataType, UpdateRefsType, RowElementType>, data: DataType): TemplateRowType<UpdateRefsType, RowElementType> {
    const row = options.template.cloneNode(true) as RowElementType
    return {e: row, r: options.renderFunction(row, data)}
}
/** Render a row for each of data and append them to wrapper and rows */
function appendTemplateRows<DataType, UpdateRefsType, RowElementType extends Element>(options: RenderTemplateArrayOptions<DataType, UpdateRefsType, RowElementType>, wrapper: AnchorElement, rows: TemplateRowType<UpdateRefsType, RowElementType>[], data: DataType[]): void {
    for (let i = 0; i < data.length; i++) {
        const row = newTemplateRow(options, data[i])
        rows.push(row)
        wrapper.appendChild(row.e)
    }
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
    /**
     * Create a new RenderTemplateArray
     */
    constructor(options: RenderTemplateArrayOptions<DataType, UpdateRefsType, RowElementType>) {
        super([], (data: DataType[], thisArg: RenderObject<DataType[], TemplateRowType<UpdateRefsType, RowElementType>[]>) => {
            const wrapper = createArrayWrapper(options)
            // The rows of this wrapper, kept as its updateRefs
            const rows: TemplateRowType<UpdateRefsType, RowElementType>[] = []
            appendTemplateRows(options, wrapper, rows, data)
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
            // Rows have no Components to unmount, so they are removed all at once
            wrapper.textContent = ""
            rows.length = 0
            appendTemplateRows(options, wrapper, rows, newData)
        })
        this.#options = options
    }
    /**
     * Push one data point into the Array
     */
    push(newData: DataType): void {
        this.value.push(newData)
        this.es.forEach(instance => {
            const row = newTemplateRow(this.#options, newData)
            instance.uR!.push(row)
            instance.e.appendChild(row.e)
        })
    }
    /**
     * Push all of the data points of newData[] into the Array
     */
    pushAll(newData: DataType[]): void {
        const value = this.value
        for (let i = 0; i < newData.length; i++) {
            value.push(newData[i])
        }
        const options = this.#options
        this.es.forEach(instance => {
            appendTemplateRows(options, instance.e, instance.uR!, newData)
        })
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
        value[index] = newData
        const options = this.#options
        const handleUpdate = options.handleUpdate
        this.es.forEach(instance => {
            const rows = instance.uR!
            const row = rows[index]
            if (handleUpdate) {
                handleUpdate(row.e, row.r, oldData, newData)
            } else {
                const newRow = newTemplateRow(options, newData)
                row.e.replaceWith(newRow.e)
                rows[index] = newRow
            }
        })
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
            swapSiblings(instance.e, a.e, b.e)
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
