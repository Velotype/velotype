import {replaceElementWithRoot, Component, AsyncRenderObject, getComponent} from "@velotype/velotype"
import type {EmptyAttrs, AsyncState, RenderableElements} from "@velotype/velotype"

// Each scenario loads Promises into an AsyncRenderObject, settles them in a chosen order, and records what is shown into results

// deno-lint-ignore no-explicit-any
const results: {[name: string]: any} = {}

// Errors that Velotype reported with reportError()
let reported: string[] = []
globalThis.addEventListener("error", (event: ErrorEvent) => {
    reported.push(event.error && event.error.message)
    // Keeps the expected errors out of the console
    event.preventDefault()
})
function takeReported(): string[] {
    const taken = reported
    reported = []
    return taken
}

/** A Promise that the test settles */
type Deferred<T> = {promise: Promise<T>, resolve: (value: T) => void, reject: (reason: unknown) => void}
function deferred<T>(): Deferred<T> {
    let resolve!: (value: T) => void
    let reject!: (reason: unknown) => void
    const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej })
    return {promise, resolve, reject}
}
/** Wait until settled Promises have been handled */
function tick(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0))
}
/** A container on the page, and its text */
function host(): HTMLElement {
    const wrapper = document.createElement("div")
    const placeholder = document.createElement("div")
    wrapper.appendChild(placeholder)
    document.body.appendChild(wrapper)
    return placeholder
}
function show(content: RenderableElements): HTMLElement {
    return replaceElementWithRoot(<div>{content}</div>, host()) as HTMLElement
}
function options(prefix = "") {
    return {
        pending: () => <span>{prefix}pending</span>,
        render: (value: string) => <span>{prefix}{value}</span>,
        onFail: (reason: unknown) => <span>{prefix}failed {(reason as Error).message}</span>,
    }
}

async function run() {
    // 1. Pending, then the resolved value
    const first = deferred<string>()
    const resolves = new AsyncRenderObject(first.promise, options())
    const resolvesElement = show(resolves)
    results.beforeResolve = resolvesElement.textContent
    results.loadingBeforeResolve = resolves.loading
    first.resolve("one")
    await tick()
    results.afterResolve = resolvesElement.textContent
    results.loadingAfterResolve = resolves.loading
    results.valueAfterResolve = resolves.value

    // 2. A rejection shows onFail()
    const failing = deferred<string>()
    const rejects = new AsyncRenderObject(failing.promise, options())
    const rejectsElement = show(rejects)
    failing.reject(new Error("offline"))
    await tick()
    results.afterReject = rejectsElement.textContent
    results.rejectedStatus = rejects.value.status
    results.reportedWithOnFail = takeReported()

    // 3. Without onFail() the rejection is reported and nothing is shown
    const unhandled = deferred<string>()
    const rejectsQuietly = new AsyncRenderObject(unhandled.promise, {render: (value: string) => <span>{value}</span>})
    const quietElement = show(rejectsQuietly)
    unhandled.reject(new Error("no onFail"))
    await tick()
    results.withoutOnFail = quietElement.textContent
    results.reportedWithoutOnFail = takeReported()

    // 4. Only the latest load is shown, and the earlier load's signal is aborted
    const slow = deferred<string>()
    const fast = deferred<string>()
    let slowSignal: AbortSignal | undefined
    const latest = new AsyncRenderObject<string>((signal) => { slowSignal = signal; return slow.promise }, options())
    const latestElement = show(latest)
    latest.load(fast.promise)
    results.slowAbortedOnLoad = slowSignal!.aborted
    fast.resolve("fast")
    await tick()
    slow.resolve("slow")
    await tick()
    results.latestWins = latestElement.textContent

    // 5. Loading again shows pending(), or keeps the resolved value with keepPrevious
    const reload = new AsyncRenderObject(Promise.resolve("old"), options())
    const reloadElement = show(reload)
    const kept = new AsyncRenderObject(Promise.resolve("old"), {...options(), keepPrevious: true})
    const keptElement = show(kept)
    await tick()
    const next = deferred<string>()
    reload.load(next.promise)
    kept.load(next.promise)
    results.reloading = reloadElement.textContent
    results.keptWhileLoading = keptElement.textContent
    results.keptLoading = kept.loading
    next.resolve("new")
    await tick()
    results.reloaded = reloadElement.textContent
    results.keptReloaded = keptElement.textContent

    // 6. set() shows a state directly and cancels the load in progress
    const replaced = deferred<string>()
    let replacedSignal: AbortSignal | undefined
    const direct = new AsyncRenderObject<string>((signal) => { replacedSignal = signal; return replaced.promise }, options())
    const directElement = show(direct)
    direct.set({status: "resolved", value: "known"})
    results.setAborts = replacedSignal!.aborted
    results.setLoading = direct.loading
    replaced.resolve("late")
    await tick()
    results.afterSet = directElement.textContent

    // 7. When the owning Component unmounts, the load is aborted and its result ignored
    const owned = deferred<string>()
    let ownedSignal: AbortSignal | undefined
    let ownedRenders = 0
    class Owner extends Component<EmptyAttrs> {
        user = new AsyncRenderObject<string>((signal) => { ownedSignal = signal; return owned.promise }, {
            render: (value) => { ownedRenders++; return <span>{value}</span> },
        })
        override render() { return <div>{this.user}</div> }
    }
    class Holder extends Component<EmptyAttrs> {
        slot: HTMLElement = <div></div>
        override render() { return <div>{this.slot}</div> }
    }
    const holder = getComponent<Holder>(replaceElementWithRoot(<Holder/>, host()))
    const ownerElement = <Owner/>
    holder.appendToChild(holder.slot, ownerElement)
    holder.removeChild(ownerElement)
    results.abortedOnUnmount = ownedSignal!.aborted
    owned.resolve("after unmount")
    await tick()
    results.rendersAfterUnmount = ownedRenders
    results.reportedAfterUnmount = takeReported()

    // 8. A render() that throws shows onFail() with its error, or is reported without onFail()
    const throwing = new AsyncRenderObject(Promise.resolve("value"), {
        ...options(),
        render: (_value: string): HTMLElement => { throw new Error("render failed") },
    })
    const throwingElement = show(throwing)
    const throwingQuietly = new AsyncRenderObject(Promise.resolve("value"), {
        render: (_value: string): HTMLElement => { throw new Error("render failed quietly") },
        pending: () => <span>still pending</span>,
    })
    const throwingQuietElement = show(throwingQuietly)
    await tick()
    results.renderThrows = throwingElement.textContent
    results.renderThrowsQuietly = throwingQuietElement.textContent
    results.renderThrowsQuietlyStatus = throwingQuietly.value.status
    results.reportedRenderThrows = takeReported()

    // 9. A source function that throws is a rejection
    const sourceThrows = new AsyncRenderObject<string>(() => { throw new Error("no source") }, options())
    const sourceThrowsElement = show(sourceThrows)
    await tick()
    results.sourceThrows = sourceThrowsElement.textContent

    // 10. Every instance element updates, and onChange listeners run when it settles
    const shared = deferred<string>()
    const several = new AsyncRenderObject(shared.promise, options())
    const statuses: string[] = []
    several.registerOnChangeListener((event) => {
        statuses.push((event.emittingObject as AsyncRenderObject<string>).value.status)
    })
    const severalElement = show(<>{several}{several.render((state: AsyncState<string>) => <b>{state.status}</b>)}</>)
    shared.resolve("both")
    await tick()
    results.severalInstances = severalElement.textContent
    results.onChangeStatuses = statuses
    results.reportedAtEnd = takeReported()
}

class AsyncRenderObjectTest extends Component<EmptyAttrs> {
    override render() {
        return <div id="async-render-object-tests">
            <pre id="async-render-object-results">{JSON.stringify(results)}</pre>
        </div>
    }
}

// Place on the page when every scenario has run
run().then(() => {
    replaceElementWithRoot(<AsyncRenderObjectTest/>, document.getElementById("main-page"))
}, (error) => {
    results.runThrew = String(error)
    replaceElementWithRoot(<AsyncRenderObjectTest/>, document.getElementById("main-page"))
})
