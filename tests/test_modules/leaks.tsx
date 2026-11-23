import {replaceElementWithRoot, removeElementRoot, getComponent, Component, RenderObject, RenderObjectArray} from "@velotype/velotype"
import {findLeaks} from "@velotype/velotype/devtools"
import type {EmptyAttrs} from "@velotype/velotype"

// Each scenario leaves the page in a state, then records what findLeaks() lists, by name

// deno-lint-ignore no-explicit-any
const results: {[name: string]: any} = {}

function host(): HTMLElement {
    const placeholder = document.createElement("div")
    document.body.appendChild(placeholder)
    return placeholder
}
/** What findLeaks() lists, by name: a Component's class, or a RenderObject's value */
function listed() {
    const leaks = findLeaks()
    return {
        mountedOffPage: leaks.mountedOffPage.map(c => c.constructor.name),
        neverPlaced: leaks.neverPlaced.map(c => c.constructor.name),
        heldOffPage: leaks.heldOffPage.map(o => String(o.get())),
    }
}

class Plain extends Component<EmptyAttrs> {
    override render() { return <p>plain</p> }
}
class KeepsPrivate extends Component<{release: boolean}> {
    #note = new RenderObject<string>(this.attrs.release ? "released note" : "kept note", text => <span>{text}</span>)
    override unmount() { if (this.attrs.release) {this.#note.release()} }
    override render() { return <div>{this.#note}</div> }
}
function Drawn() {
    const label = new RenderObject<string>("vtwith label", text => <b>{text}</b>)
    return <p vtwith={[label]}>{label}</p>
}

// 1. A page with everything placed lists nothing
const page = replaceElementWithRoot(<div><Plain/><KeepsPrivate release/><Drawn/></div>, host())
results.placed = listed()

// 2. Taken out through velotype, released or listed in vtwith: nothing; a #private RenderObject
// left unreleased: held off the page
removeElementRoot(page)
const kept = replaceElementWithRoot(<div><KeepsPrivate release={false}/></div>, host())
removeElementRoot(kept)
results.removed = listed()

// 3. Taken out with a DOM call: still mounted off the page
const plainElement: HTMLElement = <Plain/>
replaceElementWithRoot(<div>{plainElement}</div>, host())
plainElement.remove()
results.domRemoved = listed()
removeElementRoot(plainElement)

// 4. Created and never placed
const unplaced: HTMLElement = <Plain/>
results.unplaced = listed()
getComponent(unplaced)

// 5. Rows a filter hid stay mounted on purpose, and aren't listed
const rows = new RenderObjectArray<string>({renderFunction: text => <li><Plain/>{text}</li>})
rows.pushAll(["a", "bb"])
const list = replaceElementWithRoot(<ul>{rows}</ul>, host())
rows.filter(text => text.length === 1)
results.filtered = listed()
removeElementRoot(list)

class LeaksTest extends Component<EmptyAttrs> {
    override render() {
        return <div id="leaks-tests">
            <pre id="leaks-results">{JSON.stringify(results)}</pre>
        </div>
    }
}
replaceElementWithRoot(<LeaksTest/>, document.getElementById("main-page"))
