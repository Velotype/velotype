// deno-lint-ignore-file no-explicit-any

// RenderObjectArray

import { setAttrsOnElement } from "./attributes.ts"
import { createElement } from "./create-element.ts"
import { releaseVtKeyObject } from "./dom-references.ts"
import { displayContentsDiv } from "./globals.ts"
import { appendElement } from "./mounting.ts"
import { RenderObject, type RenderObjectHandleUpdateType, type RenderObjectInternals, type RenderObjectRenderFunctionType } from "./render-object.ts"
import { renderableElementToElement } from "./renderable.ts"

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
 * An optimized RenderObject that represents an Array of data points rendered into
 * a wrapperElement (by default a \<div> tag)
 * 
 * @template DataType The type of the underlying Data Object
 * @template UpdateRefsType An advanced capability of RenderObjectArray to more efficiently rerender instance elements
 */
export class RenderObjectArray<DataType, UpdateRefsType = any> extends RenderObject<RenderObject<DataType, UpdateRefsType>[]> {
    readonly #renderFunction: RenderObjectRenderFunctionType<DataType, UpdateRefsType>
    readonly #handleUpdate?: RenderObjectHandleUpdateType<DataType, UpdateRefsType>
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
        super([], (data: RenderObject<DataType, UpdateRefsType>[]) => {
            const mainElement = createArrayWrapper(options)
            data.forEach(d => {
                mainElement.appendChild(renderableElementToElement(d))
            })
            return mainElement
        })
        this.#renderFunction = options.renderFunction
        this.#handleUpdate = options.handleUpdate
    }
    /**
     * Push one data point into the Array
     */
    push(newData: DataType): void {
        const obj = new RenderObject<DataType, UpdateRefsType>(newData, this.#renderFunction, this.#handleUpdate)
        this.value.push(obj)
        this.es.forEach(element => {
            appendElement(element.e, renderableElementToElement(obj))
        })
    }
    /**
     * Push all of the data points of newData[] into the Array
     */
    pushAll(newData: DataType[]): void {
        newData.forEach(d => this.push(d))
    }
    /**
     * Delete one or more data points from the Array
     */
    deleteAt(startIndex: number, deleteCount?: number): void {
        const oldData = this.value.splice(startIndex, deleteCount! > 0 ? deleteCount! : 1)
        oldData.forEach(RenderObjectArray.#releaseOne)
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
        this.value[index].value = newData
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
        ;(a as RenderObjectInternals).sw(b)
    }
    /** Set the current value of this RenderObjectArray */
    override set(newData: RenderObject<DataType, UpdateRefsType>[]): void {
        this.#releaseAll()
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
