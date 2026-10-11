import {replaceElementWithRoot, Component, RenderObjectArray, RenderTemplateArray} from "@velotype/velotype"
import type {EmptyAttrs} from "@velotype/velotype"

// Each scenario inserts into a RenderObjectArray or RenderTemplateArray, then records the data and the rendered rows into results

// deno-lint-ignore no-explicit-any
const results: {[name: string]: any} = {}

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
function threw(fn: () => void): string | false {
    try {
        fn()
        return false
    } catch (error) {
        return (error as Error).message
    }
}

// 1. RenderObjectArray, rendered in two places, with a Component in each row
const mounted: string[] = []
class Row extends Component<{text: string}> {
    override mount() { mounted.push(this.attrs.text) }
    override render(attrs: Readonly<{text: string}>) { return <li>{attrs.text}</li> }
}
const objects = new RenderObjectArray<string>({
    wrapperElementTag: "ul",
    renderFunction: (text: string) => {
        if (text === "bad") {
            throw new Error("row failed")
        }
        return <Row text={text}/>
    },
})
replaceElementWithRoot(<div><div id="objects-a">{objects}</div><div id="objects-b">{objects}</div></div>, host())
objects.pushAll(["b", "d"])
objects.insertAt(1, "c")
objects.insertAt(0, "a")
objects.insertAt(4, "f")
objects.insertAt(-1, "e")
objects.insertAt(99, "g")
objects.insertAllAt(2, ["b1", "b2"])
results.objectsData = objects.value.map(obj => obj.value)
results.objectsShowsA = texts("#objects-a li")
results.objectsShowsB = texts("#objects-b li")
results.objectsMounted = mounted.slice().sort()
// Index-based methods still change the matching rows
objects.deleteAt(2)
objects.swap(0, 1)
objects.setAt(1, "A")
results.objectsAfterShowsA = texts("#objects-a li")
results.objectsAfterShowsB = texts("#objects-b li")
// A failed insert leaves the data and rows unchanged
results.objectsFailedThrew = threw(() => objects.insertAllAt(1, ["x", "bad"]))
results.objectsFailedData = objects.value.map(obj => obj.value)
results.objectsFailedShowsA = texts("#objects-a li")
results.objectsFailedShowsB = texts("#objects-b li")

// 2. RenderTemplateArray, rendered in two places, with an `on` listener that reports the row's index
const clicked: string[] = []
const templates = new RenderTemplateArray<string, null>({
    wrapperElementTag: "ul",
    template: <li></li>,
    renderFunction: (row: HTMLElement, text: string) => {
        if (text === "bad") {
            throw new Error("row failed")
        }
        row.textContent = text
        return null
    },
    on: {
        click: (_event, _row, data, index) => {
            clicked.push(data + "@" + index)
        },
    },
})
replaceElementWithRoot(<div><div id="templates-a">{templates}</div><div id="templates-b">{templates}</div></div>, host())
templates.pushAll(["b", "d"])
templates.insertAt(1, "c")
templates.insertAt(0, "a")
templates.insertAt(4, "f")
templates.insertAt(-1, "e")
templates.insertAt(99, "g")
templates.insertAllAt(2, ["b1", "b2"])
results.templatesData = templates.value.slice()
results.templatesShowsA = texts("#templates-a li")
results.templatesShowsB = texts("#templates-b li")
;(document.querySelectorAll("#templates-b li")[3] as HTMLElement).click()
results.templatesClicked = clicked.slice()
templates.deleteAt(2)
templates.swap(0, 1)
templates.setAt(1, "A")
results.templatesAfterShowsA = texts("#templates-a li")
results.templatesAfterShowsB = texts("#templates-b li")
results.templatesFailedThrew = threw(() => templates.insertAllAt(1, ["x", "bad"]))
results.templatesFailedData = templates.value.slice()
results.templatesFailedShowsA = texts("#templates-a li")
results.templatesFailedShowsB = texts("#templates-b li")
// Inserting the Array's own data
templates.insertAllAt(0, templates.value)
results.templatesSelfData = templates.value.slice()
results.templatesSelfShowsA = texts("#templates-a li")

// 3. Data points that are Arrays themselves: insertAt() inserts one data point, insertAllAt() several
const pairs = new RenderTemplateArray<number[], null>({
    wrapperElementTag: "ul",
    wrapperAttrs: {id: "pairs"},
    template: <li></li>,
    renderFunction: (row: HTMLElement, pair: number[]) => {
        row.textContent = pair.join("+")
        return null
    },
})
replaceElementWithRoot(<div>{pairs}</div>, host())
pairs.push([1, 2])
pairs.insertAt(0, [3, 4])
pairs.insertAllAt(1, [[5, 6], [7, 8]])
results.pairsShows = texts("#pairs li")

class ArrayInsertTest extends Component<EmptyAttrs> {
    override render() {
        return <div id="array-insert-tests">
            <pre id="array-insert-results">{JSON.stringify(results)}</pre>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<ArrayInsertTest/>, document.getElementById("main-page"))
