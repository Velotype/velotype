import {replaceElementWithRoot, Component, ErrorBoundary, RenderObject, RenderObjectArray, RenderTemplateArray, UpdateHandlerLink, registerEventListener, emitEvent, VelotypeEvent, getComponent} from "@velotype/velotype"
import type {EmptyAttrs, FunctionComponent} from "@velotype/velotype"
import {__vtAppMetadata} from "@velotype/velotype/devtools"

// Each scenario runs user code that throws, then records what Velotype did into results

// deno-lint-ignore no-explicit-any
const results: {[name: string]: any} = {}

// Errors that Velotype reported with reportError() instead of throwing
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
/** Run fn and return the message of the error it threw, or false */
function threw(fn: () => void): string | false {
    try {
        fn()
        return false
    } catch (error) {
        return (error as Error).message
    }
}
function registered(): number {
    return __vtAppMetadata.domReferences.size
}
function host(): HTMLElement {
    const wrapper = document.createElement("div")
    const placeholder = document.createElement("div")
    wrapper.appendChild(placeholder)
    document.body.appendChild(wrapper)
    return placeholder
}
function texts(selector: string): string[] {
    return Array.from(document.querySelectorAll(selector)).map(element => element.textContent || "")
}

// 1. mount() throws: the Components after it still mount, and the error is reported
const mounted: string[] = []
class MountThrower extends Component<EmptyAttrs> {
    override mount() {
        mounted.push("thrower")
        throw new Error("mount failed")
    }
    override render() { return <span>thrower</span> }
}
class MountSibling extends Component<EmptyAttrs> {
    override mount() { mounted.push("sibling") }
    override render() { return <span>sibling</span> }
}
results.mountThrew = threw(() => replaceElementWithRoot(<div><MountThrower/><MountSibling/></div>, host()))
results.mounted = mounted.slice()
results.mountReported = takeReported()

// 2. unmount() throws during refresh(): the new render is shown, and the error is reported
let unmountFails = true
class UnmountThrower extends Component<EmptyAttrs> {
    override unmount() {
        if (unmountFails) {
            throw new Error("unmount failed")
        }
    }
    override render() { return <span>inner</span> }
}
let refreshRenders = 0
class RefreshHost extends Component<EmptyAttrs> {
    override render() {
        refreshRenders++
        return <div id="refresh-host">render {refreshRenders} <UnmountThrower/></div>
    }
}
const refreshHost = getComponent<RefreshHost>(replaceElementWithRoot(<RefreshHost/>, host()))
const beforeRefresh = registered()
results.unmountThrew = threw(() => refreshHost.refresh())
results.unmountShows = document.getElementById("refresh-host")!.textContent
results.unmountRegisteredChange = registered() - beforeRefresh
results.unmountReported = takeReported()
unmountFails = false

// 3. A RenderObject shown in two places, whose render function throws for the second:
// the value and both places are unchanged, and a later update works
let failRender = false
let renderCalls = 0
const shownTwice = new RenderObject<number>(1, (n: number) => {
    renderCalls++
    if (failRender && renderCalls % 2 === 0) {
        throw new Error("render failed")
    }
    return <b class="shown-twice">{n}</b>
})
replaceElementWithRoot(<div>{shownTwice}{shownTwice}</div>, host())
failRender = true
renderCalls = 0
const beforeShownTwice = registered()
results.renderThrew = threw(() => { shownTwice.value = 2 })
results.renderValue = shownTwice.value
results.renderShows = texts(".shown-twice")
results.renderRegisteredChange = registered() - beforeShownTwice
failRender = false
shownTwice.value = 3
results.renderShowsAfter = texts(".shown-twice")

// 4. A handleUpdate that throws: the value is unchanged
const updated = new RenderObject<string, Text>("a", (data: string) => {
    const text = document.createTextNode(data)
    return new UpdateHandlerLink(<i id="updated">{text}</i>, text)
}, (_element, text: Text, _oldData: string, newData: string) => {
    if (newData === "bad") {
        throw new Error("handleUpdate failed")
    }
    text.data = newData
})
replaceElementWithRoot(<div>{updated}</div>, host())
results.handleUpdateThrew = threw(() => { updated.value = "bad" })
results.handleUpdateValue = updated.value
updated.value = "b"
results.handleUpdateShows = document.getElementById("updated")!.textContent

// 5. RenderTemplateArray renderFunction throws: the rows still match the data
type TemplateRefs = null
const templateRows = new RenderTemplateArray<string, TemplateRefs>({
    wrapperElementTag: "ul",
    wrapperAttrs: {id: "template-rows"},
    template: <li></li>,
    renderFunction: (row: HTMLElement, data: string) => {
        if (data.startsWith("bad")) {
            throw new Error("row failed")
        }
        row.textContent = data
        return null
    },
})
replaceElementWithRoot(<div>{templateRows}</div>, host())
templateRows.pushAll(["a", "b"])
results.templatePushThrew = threw(() => templateRows.push("bad"))
results.templatePushAllThrew = threw(() => templateRows.pushAll(["c", "bad2"]))
templateRows.push("c")
templateRows.deleteAt(2)
results.templateData = templateRows.value.slice()
results.templateShows = texts("#template-rows li")
results.templateSetAtThrew = threw(() => templateRows.setAt(0, "bad"))
results.templateReplaceThrew = threw(() => { templateRows.value = ["x", "bad"] })
results.templateDataAfter = templateRows.value.slice()
results.templateShowsAfter = texts("#template-rows li")

// 6. RenderObjectArray renderFunction throws on push: the data and rows still match, nothing stays registered
const objectRows = new RenderObjectArray<string>({
    wrapperElementTag: "ul",
    wrapperAttrs: {id: "object-rows"},
    renderFunction: (data: string) => {
        if (data === "bad") {
            throw new Error("row failed")
        }
        return <li>{data}</li>
    },
})
replaceElementWithRoot(<div>{objectRows}</div>, host())
objectRows.pushAll(["a", "b"])
const beforeObjectRows = registered()
results.objectPushThrew = threw(() => objectRows.push("bad"))
results.objectLength = objectRows.length
results.objectShows = texts("#object-rows li")
results.objectRegisteredChange = registered() - beforeObjectRows

// 7. An event bus listener throws: the other listeners receive the event, and the error is reported
const received: string[] = []
class BusListener extends Component<{name: string}> {
    override mount() {
        registerEventListener(this, "error-handling-bus", () => {
            if (this.attrs.name === "first") {
                throw new Error("listener failed")
            }
            received.push(this.attrs.name)
        })
    }
    override render() { return <i></i> }
}
replaceElementWithRoot(<div><BusListener name="first"/><BusListener name="second"/></div>, host())
results.emitThrew = threw(() => emitEvent("error-handling-bus", new VelotypeEvent(shownTwice, "event")))
results.received = received.slice()
results.emitReported = takeReported()

// 8. render() throws when creating the root: nothing stays registered
class RenderChild extends Component<EmptyAttrs> {
    count = new RenderObject<number>(1)
    override render() { return <p>{this.count}</p> }
}
class RenderThrower extends Component<EmptyAttrs> {
    override render(): HTMLElement {
        void (<div><RenderChild/></div>)
        throw new Error("render failed")
    }
}
const beforeRootRender = registered()
results.rootRenderThrew = threw(() => replaceElementWithRoot(<RenderThrower/>, host()))
results.rootRenderRegisteredChange = registered() - beforeRootRender

// 9. A Component's constructor throws, and a Function Component throws: nothing stays registered
class ConstructorThrower extends Component<EmptyAttrs> {
    count = new RenderObject<number>(1)
    constructor(attrs: EmptyAttrs, children: never[]) {
        super(attrs, children)
        throw new Error("constructor failed")
    }
    override render() { return <p></p> }
}
const FunctionThrower: FunctionComponent<EmptyAttrs> = () => {
    void (<div><RenderChild/></div>)
    throw new Error("function component failed")
}
const beforeConstructors = registered()
results.constructorThrew = threw(() => void (<ConstructorThrower/>))
results.functionThrew = threw(() => void (<FunctionThrower/>))
results.constructorRegisteredChange = registered() - beforeConstructors

// 10. render() throws during refresh(): the current render stays, nothing new stays registered
let refreshFails = false
class RefreshThrower extends Component<EmptyAttrs> {
    override render() {
        if (refreshFails) {
            void (<div><RenderChild/></div>)
            throw new Error("refresh failed")
        }
        return <div id="refresh-thrower">first render</div>
    }
}
const refreshThrower = getComponent<RefreshThrower>(replaceElementWithRoot(<RefreshThrower/>, host()))
refreshFails = true
const beforeRefreshThrow = registered()
results.refreshThrew = threw(() => refreshThrower.refresh())
results.refreshShows = document.getElementById("refresh-thrower")!.textContent
results.refreshRegisteredChange = registered() - beforeRefreshThrow

// 11. A registerOnMount() callback throws: the next callback still runs, and the error is reported
const mountCallbacks: string[] = []
class OnMountHost extends Component<EmptyAttrs> {
    value = new RenderObject<number>(1)
        .registerOnMount(() => { throw new Error("onMount failed") })
        .registerOnMount(() => { mountCallbacks.push("second") })
    override render() { return <div>{this.value}</div> }
}
replaceElementWithRoot(<OnMountHost/>, host())
results.onMountCallbacks = mountCallbacks.slice()
results.onMountReported = takeReported()

// 12. ErrorBoundary: renders renderError() when renderContent() throws, on first render and on refresh()
let boundaryFails = true
class Boundary extends ErrorBoundary<{label: string}> {
    override renderContent(attrs: Readonly<{label: string}>) {
        if (boundaryFails) {
            void (<div><RenderChild/></div>)
            throw new Error("content failed")
        }
        return <div class="boundary">{attrs.label} content <RenderChild/></div>
    }
    override renderError(error: unknown, attrs: Readonly<{label: string}>) {
        return <div class="boundary">{attrs.label} fallback: {(error as Error).message}</div>
    }
}
const beforeBoundary = registered()
let boundaryElement: HTMLElement | null = null
results.boundaryThrew = threw(() => { boundaryElement = replaceElementWithRoot(<Boundary label="a"/>, host()) as HTMLElement })
results.boundaryShows = boundaryElement!.textContent
// Only the boundary itself stays registered
results.boundaryRegisteredChange = registered() - beforeBoundary
boundaryFails = false
getComponent<Boundary>(boundaryElement).refresh()
results.boundaryRefreshShows = texts(".boundary")
boundaryFails = true
const beforeBoundaryRefresh = registered()
results.boundaryRefreshThrew = threw(() => getComponent<Boundary>(document.querySelector(".boundary") as HTMLElement).refresh())
results.boundaryFailedRefreshShows = texts(".boundary")
// The released content (a RenderChild and its RenderObject, 3 keys) is replaced by the fallback
results.boundaryFailedRefreshRegisteredChange = registered() - beforeBoundaryRefresh

// 13. ErrorBoundary whose renderError() throws: the error reaches the caller, nothing stays registered
class FailingBoundary extends ErrorBoundary<EmptyAttrs> {
    override renderContent(): HTMLElement { throw new Error("content failed") }
    override renderError(): HTMLElement { throw new Error("fallback failed") }
}
const beforeFailingBoundary = registered()
results.failingBoundaryThrew = threw(() => void (<FailingBoundary/>))
results.failingBoundaryRegisteredChange = registered() - beforeFailingBoundary

// 14. registerEventListener() in a Component's constructor throws, since vtKey is not set yet
class ConstructorListener extends Component<EmptyAttrs> {
    constructor(attrs: EmptyAttrs, children: never[]) {
        super(attrs, children)
        registerEventListener(this, "error-handling-constructor", () => {})
    }
    override render() { return <p></p> }
}
const beforeConstructorListener = registered()
const constructorListenerError = (() => {
    try {
        void (<ConstructorListener/>)
        return "none"
    } catch (error) {
        return error instanceof TypeError ? "TypeError" : String(error)
    }
})()
results.constructorListenerError = constructorListenerError
results.constructorListenerRegistered = __vtAppMetadata.listenersF.has("error-handling-constructor")
results.constructorListenerRegisteredChange = registered() - beforeConstructorListener

class ErrorHandlingTest extends Component<EmptyAttrs> {
    override render() {
        return <div id="error-handling-tests">
            <pre id="error-handling-results">{JSON.stringify(results)}</pre>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<ErrorHandlingTest/>, document.getElementById("main-page"))
