// AsyncRenderObject: a RenderObject that renders a Promise's result once it settles

import { domReferences } from "./globals.ts"
import { RenderObject } from "./render-object.ts"
import type { RenderableElements } from "./types.ts"
import { hiddenElement, reportUserError } from "./utils.ts"

/** The state of an AsyncRenderObject, its value */
export type AsyncState<DataType> =
    | { readonly status: "pending" }
    | { readonly status: "resolved", readonly value: DataType }
    | { readonly status: "rejected", readonly reason: unknown }

/**
 * What an AsyncRenderObject loads: a Promise, or a function that starts the work and returns a Promise
 *
 * The function gets an AbortSignal that is aborted when its result would no longer be shown, so pass it on,
 * such as `(signal) => fetch(url, {signal})`
 */
export type AsyncSource<DataType> = Promise<DataType> | ((signal: AbortSignal) => Promise<DataType>)

/** Options for an AsyncRenderObject */
export type AsyncRenderObjectOptions<DataType> = {
    /** Render the resolved value */
    render: (value: DataType) => RenderableElements
    /** Render the content shown while loading (default: a hidden element) */
    pending?: () => RenderableElements
    /**
     * Render the content shown when loading rejects, or when `render()` throws
     * (default: the error is reported with `reportError()` and a hidden element is shown)
     */
    onFail?: (reason: unknown) => RenderableElements
    /** When `load()` replaces a resolved value, keep showing it until the new one settles instead of showing `pending()` (default: false) */
    keepPrevious?: boolean
}

/**
 * A RenderObject that shows `pending()` while a Promise is loading, then `render()` with its result, or `onFail()` when it rejects
 *
 * Only the latest `load()` is shown, so an earlier Promise that settles later is ignored. A load is cancelled,
 * its AbortSignal aborted and its result ignored, when a newer `load()` or `set()` replaces it, and when this
 * AsyncRenderObject unmounts: as a public field of a Component, when that Component unmounts. The result of a
 * load that settles after this AsyncRenderObject is released is also ignored.
 *
 * `value` is the current AsyncState. `set()` replaces the state directly, such as to show a value that is
 * already known, and cancels a load in progress.
 *
 * ```tsx
 * class UserCard extends Component<{id: string}> {
 *     user = new AsyncRenderObject((signal) => fetch(`/users/${this.attrs.id}`, {signal}).then(r => r.json()), {
 *         pending: () => <p>Loading</p>,
 *         render: (user: User) => <p>{user.name}</p>,
 *         onFail: () => <p>Could not load the user</p>,
 *     })
 *     override render() {
 *         return <div>{this.user}</div>
 *     }
 * }
 * ```
 *
 * A `lazy()` Component is an AsyncRenderObject of a dynamic import:
 * `new AsyncRenderObject(import("./chart.tsx"), {render: (module) => <module.Chart/>})`
 */
export class AsyncRenderObject<DataType> extends RenderObject<AsyncState<DataType>> {
    readonly #keepPrevious: boolean
    readonly #onFail?: (reason: unknown) => RenderableElements
    /** The load in progress, compared when it settles so that only the latest one is shown */
    #loading?: object
    #controller?: AbortController

    /**
     * Create a new AsyncRenderObject and start loading source
     *
     * @param source the Promise, or the function that returns the Promise, to load
     * @param options how to render each state
     */
    constructor(source: AsyncSource<DataType>, options: AsyncRenderObjectOptions<DataType>) {
        const {render, pending, onFail} = options
        super({status: "pending"}, (state: AsyncState<DataType>) => {
            if (state.status === "resolved") {
                return render(state.value)
            } else if (state.status === "rejected") {
                return onFail ? onFail(state.reason) : hiddenElement()
            }
            return pending ? pending() : hiddenElement()
        })
        this.#keepPrevious = !!options.keepPrevious
        this.#onFail = onFail
        this.load(source)
    }

    /** Is a load in progress? */
    get loading(): boolean {
        return this.#loading !== undefined
    }

    /**
     * Load source and show its result, replacing the load in progress
     *
     * Shows `pending()` until it settles, unless `keepPrevious` is set and a resolved value is shown
     */
    load(source: AsyncSource<DataType>): void {
        this.#cancel()
        const loading = {}
        this.#loading = loading
        let promise: Promise<DataType>
        if (typeof source === "function") {
            const controller = new AbortController()
            this.#controller = controller
            try {
                promise = source(controller.signal)
            } catch (error) {
                promise = Promise.reject(error)
            }
        } else {
            promise = source
        }
        if (this.value.status !== "pending" && !(this.#keepPrevious && this.value.status === "resolved")) {
            super.set({status: "pending"})
        }
        promise.then(
            (value) => this.#settle(loading, {status: "resolved", value}),
            (reason) => this.#settle(loading, {status: "rejected", reason})
        )
    }

    /** Replace the state, and cancel a load in progress */
    override set(state: AsyncState<DataType>): void {
        this.#cancel()
        super.set(state)
    }

    /** Show the state a load settled with, if it is still the latest load and this AsyncRenderObject is not released */
    #settle(loading: object, state: AsyncState<DataType>): void {
        if (loading !== this.#loading) {
            return
        }
        this.#loading = undefined
        this.#controller = undefined
        if (!domReferences.has(this.vtKey)) {
            return
        }
        if (state.status === "rejected" && !this.#onFail) {
            reportUserError(state.reason)
        }
        try {
            this.rerenderElements(state)
        } catch (error) {
            // render() threw, show onFail() instead (the state is unchanged when rendering throws)
            if (state.status === "resolved" && this.#onFail) {
                try {
                    this.rerenderElements({status: "rejected", reason: error})
                } catch (failError) {
                    reportUserError(failError)
                }
            } else {
                reportUserError(error)
            }
        }
    }

    /** Ignore the load in progress, and abort its signal */
    #cancel(): void {
        this.#loading = undefined
        if (this.#controller) {
            this.#controller.abort()
            this.#controller = undefined
        }
    }

    /**
     * Velotype internal function, called by Velotype core
     *
     * Cancels a load in progress and calls the registered onUnmounts
     */
    protected override unmount(): void {
        this.#cancel()
        super.unmount()
    }
}
