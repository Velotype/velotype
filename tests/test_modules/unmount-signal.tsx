import {replaceElementWithRoot, removeElementRoot, Component, getComponent, RenderBasic, RenderObject, RenderObjectArray, registerEventListener} from "@velotype/velotype"
import {__vtAppMetadata} from "@velotype/velotype/devtools"
import type {EmptyAttrs} from "@velotype/velotype"

// Each scenario checks a Component's unmountSignal, or the warning for inserting a released element, and records the outcome into results

// deno-lint-ignore no-explicit-any
const results: {[name: string]: any} = {}

/** console.warn() calls, recorded by a script that runs before this module (see base_server.ts) */
function takeWarnings(): string[] {
    // deno-lint-ignore no-explicit-any
    const warnings: string[] = (globalThis as any).__warnings
    return warnings.splice(0).map(warning => warning.includes("released") ? "released" : warning)
}
function host(): HTMLElement {
    const wrapper = document.createElement("div")
    const placeholder = document.createElement("div")
    wrapper.appendChild(placeholder)
    document.body.appendChild(wrapper)
    return placeholder
}

// 1. The signal is aborted just after unmount(), which cleans up a window listener added in mount()
let resizeCalls = 0
class Listening extends Component<EmptyAttrs> {
    abortedInMount: boolean | undefined
    abortedInUnmount: boolean | undefined
    override mount() {
        this.abortedInMount = this.unmountSignal.aborted
        globalThis.addEventListener("unmount-signal-test", () => { resizeCalls++ }, {signal: this.unmountSignal})
    }
    override unmount() {
        this.abortedInUnmount = this.unmountSignal.aborted
    }
    override render() { return <p>listening</p> }
}
let listening: Listening | undefined
class Parent extends Component<EmptyAttrs> {
    showChild = true
    override render() {
        if (this.showChild) {
            const element = <Listening/>
            listening = getComponent<Listening>(element)
            return <div>{element}</div>
        }
        return <div></div>
    }
}
const parent = getComponent<Parent>(replaceElementWithRoot(<Parent/>, host()))
globalThis.dispatchEvent(new Event("unmount-signal-test"))
results.callsWhileMounted = resizeCalls
results.sameSignal = listening!.unmountSignal === listening!.unmountSignal
results.abortedWhileMounted = listening!.unmountSignal.aborted
parent.showChild = false
parent.refresh()
globalThis.dispatchEvent(new Event("unmount-signal-test"))
results.callsAfterUnmount = resizeCalls
results.abortedInMount = listening!.abortedInMount
results.abortedInUnmount = listening!.abortedInUnmount
results.abortedAfterUnmount = listening!.unmountSignal.aborted
results.abortReason = (listening!.unmountSignal.reason as DOMException).name

// 2. A signal used in the constructor is aborted when the Component's render throws
let renderThrower: Component<EmptyAttrs> | undefined
class RenderThrower extends Component<EmptyAttrs> {
    constructor(attrs: EmptyAttrs, children: never[]) {
        super(attrs, children)
        renderThrower = this
        void this.unmountSignal
    }
    override render(): HTMLElement { throw new Error("render failed") }
}
// The element is kept in results so that the bundler does not drop the JSX call, which it treats as free of side effects
try {
    results.renderThrowerElement = <RenderThrower/>
} catch (_error) {
    results.renderThrowerElement = "threw"
}
results.abortedAfterFailedRender = renderThrower!.unmountSignal.aborted

// 3. A signal first used after the Component was released is already aborted
class Plain extends Component<EmptyAttrs> {
    override render() { return <span>plain</span> }
}
class Holder extends Component<EmptyAttrs> {
    slot: HTMLElement = <div></div>
    override render() { return <div>{this.slot}</div> }
}
const holder = getComponent<Holder>(replaceElementWithRoot(<Holder/>, host()))
const plainElement = <Plain/>
const plain = getComponent<Plain>(plainElement)
holder.appendToChild(holder.slot, plainElement)
holder.removeChild(plainElement)
results.abortedWhenFirstUsedAfterRelease = plain.unmountSignal.aborted

// 4. A Component that was created but never inserted is not aborted
const detached = getComponent<Plain>(<Plain/>)
results.abortedWhileDetached = detached.unmountSignal.aborted

// 5. A Component kept in a field of another Component, and not rendered, is aborted when that Component unmounts
class FieldOwner extends Component<EmptyAttrs> {
    fieldChild = getComponent<Plain>(<Plain/>)
    override render() { return <div></div> }
}
const fieldHolder = getComponent<Holder>(replaceElementWithRoot(<Holder/>, host()))
const ownerElement = <FieldOwner/>
const fieldChild = getComponent<FieldOwner>(ownerElement).fieldChild
fieldHolder.appendToChild(fieldHolder.slot, ownerElement)
const fieldSignal = fieldChild.unmountSignal
fieldHolder.removeChild(ownerElement)
results.abortedFieldChild = fieldSignal.aborted

// 5b. A Component in a public field is shown only inside its holder: it unmounts with it, quietly.
// Shown somewhere else, it warns, and is unmounted there. Mounted but off the page (taken out with a
// plain DOM call), it isn't shown anywhere, so it doesn't warn, and is unmounted all the same.
let fieldUnmounts = 0
class CountsUnmount extends Component<EmptyAttrs> {
    override unmount() { fieldUnmounts++ }
    override render() { return <span></span> }
}
class ShowsFieldChild extends Component<EmptyAttrs> {
    fieldChild = getComponent<CountsUnmount>(<CountsUnmount/>)
    override render() { return <div>{this.fieldChild}</div> }
}
class LendsFieldChild extends Component<EmptyAttrs> {
    fieldChild = getComponent<CountsUnmount>(<CountsUnmount/>)
    override render() { return <div></div> }
}
const fieldHost = getComponent<Holder>(replaceElementWithRoot(<Holder/>, host()))
/** Unmounts the holder, and says what that warned and how many field Components unmounted */
function unmountHolder(holderElement: HTMLElement): {warnings: string[], unmounts: number} {
    takeWarnings()
    fieldUnmounts = 0
    fieldHost.removeChild(holderElement)
    return {warnings: takeWarnings().map(warning => warning.includes("Field Component shown outside its holder") ? "outside" : warning), unmounts: fieldUnmounts}
}
const showsElement = <ShowsFieldChild/>
fieldHost.appendToChild(fieldHost.slot, showsElement)
results.fieldChildInside = unmountHolder(showsElement)
const lendsElement = <LendsFieldChild/>
const lent = getComponent<LendsFieldChild>(lendsElement).fieldChild
fieldHost.appendToChild(fieldHost.slot, lendsElement)
fieldHost.appendToChild(fieldHost.slot, lent)
results.fieldChildElsewhere = unmountHolder(lendsElement)
const strandsElement = <ShowsFieldChild/>
fieldHost.appendToChild(fieldHost.slot, strandsElement)
;(strandsElement.firstElementChild as HTMLElement).remove()
results.fieldChildOffPage = unmountHolder(strandsElement)

// 6. Inserting the element of a released Component warns, inserting a new one does not
takeWarnings()
const warnHolder = getComponent<Holder>(replaceElementWithRoot(<Holder/>, host()))
const reused = <Plain/>
warnHolder.appendToChild(warnHolder.slot, reused)
results.warningsOnFirstInsert = takeWarnings()
warnHolder.removeChild(reused)
warnHolder.appendToChild(warnHolder.slot, reused)
results.warningsOnReinsert = takeWarnings()
// Nested inside a new element
warnHolder.removeChild(reused)
warnHolder.appendToChild(warnHolder.slot, <div>{reused}</div>)
results.warningsOnNestedReinsert = takeWarnings()
results.reinsertedGetComponent = getComponent(reused) === null ? "released" : "alive"
takeWarnings()

// 7. removeElementRoot() unmounts and releases content added with replaceElementWithRoot() to a part of the page other code manages
function registered(): number {
    return __vtAppMetadata.domReferences.size
}
const removedLog: string[] = []
class Widget extends Component<EmptyAttrs> {
    count = new RenderBasic<number>(1)
    override mount() {
        registerEventListener(this, "unmount-signal-widget", () => {})
        this.unmountSignal.addEventListener("abort", () => { removedLog.push("aborted") })
        removedLog.push("mount")
    }
    override unmount() { removedLog.push("unmount") }
    override render() { return <div id="widget">{this.count}</div> }
}
// A container that is not part of any Component's render, as a third-party dialog would be
const container = document.createElement("div")
document.body.appendChild(container)
const placeholder = document.createElement("div")
container.appendChild(placeholder)
const beforeWidget = registered()
const widgetElement = replaceElementWithRoot(<Widget/>, placeholder)
results.widgetRegisteredWhileMounted = registered() - beforeWidget
removeElementRoot(widgetElement)
results.widgetLog = removedLog.slice()
results.widgetInPage = document.getElementById("widget") !== null
results.widgetRegisteredAfterRemove = registered() - beforeWidget
results.widgetListenersAfterRemove = __vtAppMetadata.listenersF.has("unmount-signal-widget")
// Removing it again, or removing null, does nothing
results.removeAgainThrew = (() => { try { removeElementRoot(widgetElement); removeElementRoot(null); return false } catch (_error) { return true } })()
results.removeAgainWarnings = takeWarnings()
// A root that was never inserted is released too
const beforeDetached = registered()
const detachedRoot = <div><Widget/></div>
removeElementRoot(detachedRoot)
results.detachedRegisteredAfterRemove = registered() - beforeDetached

// 8. A Component releases the RenderObjects it keeps in #private fields, which Velotype can't see, with release() in its unmount()
let keptRows = 0
class KeptRow extends Component<{text: string}> {
    override mount() { keptRows++ }
    override unmount() { keptRows-- }
    override render() { return <li>{this.attrs.text}</li> }
}
class KeepsPrivate extends Component<{release: boolean}> {
    #count = new RenderBasic<number>(1)
    #rows = new RenderObjectArray<string>({renderFunction: text => <KeptRow text={text}/>})
    constructor(attrs: {release: boolean}, children: never[]) {
        super(attrs, children)
        this.#rows.pushAll(["a", "b"])
        this.#count.registerOnChangeListener(() => {})
    }
    countKey() { return "vt-ro-" + this.#count.vtKey }
    override unmount() {
        if (this.attrs.release) {
            this.#count.release()
            this.#rows.release()
        }
    }
    override render() { return <div>{this.#count}<ul>{this.#rows}</ul></div> }
}
function keepPrivate(release: boolean) {
    const before = registered()
    const element: HTMLElement = <KeepsPrivate release={release}/>
    const countKey = getComponent<KeepsPrivate>(element).countKey()
    removeElementRoot(replaceElementWithRoot(element, host()))
    return {
        // The two RenderObjects and the array's two rows
        registeredAfterRemove: registered() - before,
        listening: __vtAppMetadata.listenersF.has(countKey),
        rowsMounted: keptRows,
    }
}
results.privateKept = keepPrivate(false)
results.privateReleased = keepPrivate(true)

// 9. vtwith works on any element, a root too: it isn't wrapped, and goes with that root
const withLog: string[] = []
function tracked(name: string): RenderBasic<string> {
    return new RenderBasic<string>(name).registerOnMount(() => { withLog.push("mount " + name) }, () => { withLog.push("unmount " + name) })
}
function WithRoot(attrs: {name: string}) {
    const label = tracked(attrs.name)
    return <p class="with-root" vtwith={[label]}>{label}</p>
}
let withRenders = 0
class WithRootComponent extends Component<EmptyAttrs> {
    override render() {
        const label = tracked("render " + ++withRenders)
        return <section vtwith={[label]}>{label}</section>
    }
    refreshNow() { this.refresh() }
}
const withData = new RenderObject<string>("a", name => {
    const label = tracked("object " + name)
    return <p vtwith={[label]}>{label}</p>
})
function withCase(run: () => void) {
    const before = registered()
    withLog.length = 0
    run()
    return {log: withLog.slice(), registeredAfter: registered() - before}
}
results.withFunctionRoot = withCase(() => {
    const element: HTMLElement = <WithRoot name="function"/>
    results.withFunctionRootTag = element.className
    removeElementRoot(replaceElementWithRoot(element, host()))
})
results.withComponentRoot = withCase(() => {
    const element: HTMLElement = <WithRootComponent/>
    results.withComponentRootTag = element.tagName
    const wrapper = replaceElementWithRoot(<div>{element}</div>, host())
    getComponent<WithRootComponent>(element).refreshNow()
    removeElementRoot(wrapper)
})
results.withObjectRoot = withCase(() => {
    const wrapper = replaceElementWithRoot(<div>{withData}</div>, host()) as HTMLElement
    results.withObjectRootTag = wrapper.firstElementChild?.tagName
    withData.set("b")
    removeElementRoot(wrapper)
})

class UnmountSignalTest extends Component<EmptyAttrs> {
    override render() {
        return <div id="unmount-signal-tests">
            <pre id="unmount-signal-results">{JSON.stringify(results)}</pre>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<UnmountSignalTest/>, document.getElementById("main-page"))
