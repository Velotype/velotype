// deno-lint-ignore-file no-explicit-any
import {jsxDEV, replaceElementWithRoot, setStylesheet, Component, RenderBasic} from "@velotype/velotype/jsx-dev-runtime"
import type {EmptyAttrs} from "@velotype/velotype/jsx-dev-runtime"

/** The hot API that the dev runtime installs */
const hot = (globalThis as any).__VELOTYPE_HOT__

/** Create an element through jsxDEV(), as the react-jsxdev transform does */
function dev(tag: any, fileName: string, attrs: any = {}): any {
    return jsxDEV(tag, attrs, undefined, false, {fileName, lineNumber: 1, columnNumber: 1}, undefined)
}

const results: Record<string, string> = {}
function check(name: string, condition: boolean, detail: string) {
    results[name] = condition ? "pass" : "fail: " + detail
}

const area = document.createElement("div")
document.body.appendChild(area)
function mount(element: HTMLElement): HTMLElement {
    const holder = document.createElement("div")
    area.appendChild(holder)
    replaceElementWithRoot(element, holder)
    return element
}

check("hot-api-version", hot && hot.version === 1, String(hot && hot.version))

// A changed class: live instances get the new methods and keep their state
{
    class Counter extends Component<EmptyAttrs> {
        count = new RenderBasic(5)
        override render() { return <span>v1 {this.count}</span> }
    }
    const Counter1 = Counter
    hot.registerModule("file:///hot/counter.tsx", {Counter: Counter1})
    mount(dev(Counter1, "file:///hot/app.tsx"))
    const before = area.lastElementChild!.textContent
    const Counter2 = class Counter extends Component<EmptyAttrs> {
        count = new RenderBasic(0)
        override render() { return <span>v2 {this.count}</span> }
    }
    hot.beginUpdate()
    hot.registerModule("file:///hot/counter.tsx?vt-hot=1", {Counter: Counter2})
    const result = hot.endUpdate()
    const after = area.lastElementChild!.textContent
    check("class-refresh-count", result.refreshed === 1 && result.remounted === 0, JSON.stringify(result))
    check("class-new-render", before === "v1 5" && after === "v2 5", `${before} -> ${after}`)
    // New elements created from the old class are created from the latest version
    const created = dev(Counter1, "file:///hot/app.tsx")
    check("class-latest-version", created.textContent === "v2 0", String(created.textContent))
}

// State changed at run time is kept through an update
{
    let instance: any
    class Toggle extends Component<EmptyAttrs> {
        on = new RenderBasic("off")
        constructor(attrs: EmptyAttrs, children: any[]) { super(attrs, children); instance = this }
        override render() { return <span>a {this.on}</span> }
    }
    hot.registerModule("file:///hot/toggle.tsx", {Toggle})
    mount(dev(Toggle, "file:///hot/app.tsx"))
    instance.on.value = "on"
    hot.beginUpdate()
    hot.registerModule("file:///hot/toggle.tsx", {Toggle: class Toggle extends Component<EmptyAttrs> {
        on = new RenderBasic("off")
        override render() { return <span>b {(this as any).on}</span> }
    }})
    hot.endUpdate()
    check("state-kept", area.lastElementChild!.textContent === "b on", String(area.lastElementChild!.textContent))
}

// Versions with identical code are not updated
{
    const make = () => class Same extends Component<EmptyAttrs> {
        override render() { return <span>same</span> }
    }
    const Same1 = make()
    hot.registerModule("file:///hot/same.tsx", {Same: Same1})
    mount(dev(Same1, "file:///hot/app.tsx"))
    hot.beginUpdate()
    hot.registerModule("file:///hot/same.tsx", {Same: make()})
    const result = hot.endUpdate()
    check("unchanged-skipped", result.refreshed === 0 && result.remounted === 0, JSON.stringify(result))
}

// Classes with #private members are replaced with new instances
{
    class Secret extends Component<EmptyAttrs> {
        #label = "p1"
        override render() { return <span>{this.#label}</span> }
    }
    hot.registerModule("file:///hot/secret.tsx", {Secret})
    mount(dev(Secret, "file:///hot/app.tsx"))
    hot.beginUpdate()
    hot.registerModule("file:///hot/secret.tsx", {Secret: class Secret extends Component<EmptyAttrs> {
        #label = "p2"
        override render() { return <span>{this.#label}</span> }
    }})
    const result = hot.endUpdate()
    check("private-remount", result.remounted === 1 && area.lastElementChild!.textContent === "p2", `${JSON.stringify(result)} ${area.lastElementChild!.textContent}`)
}

// A changed function component's output is replaced in place, the components around it keep their state
{
    const Label1 = (attrs: {text: string}) => <b>one {attrs.text}</b>
    const Label = Label1
    hot.registerModule("file:///hot/label.tsx", {Label})
    let host: any
    class Host extends Component<EmptyAttrs> {
        count = new RenderBasic(1)
        constructor(attrs: EmptyAttrs, children: any[]) { super(attrs, children); host = this }
        override render() { return <div><i>{this.count}</i>{dev(Label1, "file:///hot/host.tsx", {text: "x"})}</div> }
    }
    mount(dev(Host, "file:///hot/app.tsx"))
    host.count.value = 2
    const before = area.lastElementChild!.textContent
    hot.beginUpdate()
    const Label2 = (attrs: {text: string}) => <b>two {attrs.text}</b>
    hot.registerModule("file:///hot/label.tsx", {Label: Label2})
    const result = hot.endUpdate()
    check("function-component", before === "2one x" && area.lastElementChild!.textContent === "2two x" && result.refreshed === 0, `${before} -> ${area.lastElementChild!.textContent} ${JSON.stringify(result)}`)
}

// A function component that is a component's root element re-renders that component
{
    const Title1 = (attrs: {text: string}) => <h2>title one {attrs.text}</h2>
    hot.registerModule("file:///hot/title.tsx", {Title: Title1})
    class Page extends Component<EmptyAttrs> {
        override render() { return dev(Title1, "file:///hot/page.tsx", {text: "y"}) }
    }
    mount(dev(Page, "file:///hot/app.tsx"))
    hot.beginUpdate()
    hot.registerModule("file:///hot/title.tsx", {Title: (attrs: {text: string}) => <h2>title two {attrs.text}</h2>})
    const result = hot.endUpdate()
    check("function-component-root", area.lastElementChild!.textContent === "title two y" && result.refreshed === 1, `${area.lastElementChild!.textContent} ${JSON.stringify(result)}`)
}

// A module with an export that is not a component cannot be replaced on its own
check("component-module", hot.isComponentModule({A: class A extends Component<EmptyAttrs> { override render() { return null } }}) && !hot.isComponentModule({A: class A extends Component<EmptyAttrs> { override render() { return null } }, value: 1}) && !hot.isComponentModule({}), "isComponentModule")

// setStylesheet() replaces a sheet whose text changed
{
    setStylesheet(".hot-a { color: red; }", "hot-sheet")
    const count = document.adoptedStyleSheets.length
    setStylesheet(".hot-a { color: blue; }", "hot-sheet")
    const sheets = document.adoptedStyleSheets
    const text = sheets[sheets.length - 1].cssRules[0].cssText
    check("stylesheet-replaced", sheets.length === count && text.includes("blue"), `${count} ${sheets.length} ${text}`)
}

// During an update, re-run entry code does not mount a second app
{
    class Root extends Component<EmptyAttrs> {
        override render() { return <span>root</span> }
    }
    const target = document.createElement("div")
    target.id = "hot-root-target"
    area.appendChild(target)
    hot.beginUpdate()
    const result = replaceElementWithRoot(dev(Root, "file:///hot/main.tsx"), target)
    hot.endUpdate()
    check("root-not-remounted", result === null && target.isConnected, `${result} ${target.isConnected}`)
}

// Place the results on the page
const list = document.createElement("div")
list.id = "hot-reload-tests"
for (const name of Object.keys(results)) {
    const row = document.createElement("div")
    row.id = name
    row.textContent = results[name]
    list.appendChild(row)
}
document.getElementById("main-page")!.appendChild(list)
