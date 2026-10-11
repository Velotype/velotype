import {replaceElementWithRoot, Component, RenderObjectArray, RenderTemplateArray} from "@velotype/velotype"
import type {EmptyAttrs} from "@velotype/velotype"

// Each scenario sorts, reorders, moves, and filters a RenderTemplateArray or RenderObjectArray, then
// records the data and the rendered rows into results

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
/** Counts the elements that fn inserts or moves into the children of each element matching selector */
function moves(selector: string, fn: () => void): number {
    const observer = new MutationObserver(() => {})
    document.querySelectorAll(selector).forEach(element => observer.observe(element, {childList: true}))
    fn()
    const count = observer.takeRecords().reduce((sum, record) => sum + record.addedNodes.length, 0)
    observer.disconnect()
    return count
}
/** Marks every row element, to check later that the same elements are still shown */
function mark(selector: string): void {
    document.querySelectorAll<HTMLElement>(selector).forEach(element => { element.dataset.mark = element.textContent || "" })
}
/** Are the shown rows the marked elements (not new ones), each with its own text? */
function sameRows(selector: string): boolean {
    return Array.from(document.querySelectorAll<HTMLElement>(selector)).every(element => element.dataset.mark === element.textContent)
}
const byText = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0

// 1. RenderTemplateArray, rendered in two places
let templateRenders = 0
const clicked: string[] = []
const templates = new RenderTemplateArray<string, null>({
    wrapperElementTag: "ul",
    template: <li></li>,
    renderFunction: (row: HTMLElement, text: string) => {
        templateRenders++
        row.textContent = text
        return null
    },
    on: {
        click: (_event, _row, data, index) => {
            clicked.push(`${data}@${index}`)
        },
    },
})
replaceElementWithRoot(<div><div id="templates-a">{templates}</div><div id="templates-b">{templates}</div></div>, host())
const templateRows = "#templates-a li, #templates-b li"
const shownA = () => texts("#templates-a li")
const shownB = () => texts("#templates-b li")
templates.pushAll(["d", "b", "e", "a", "c"])
mark(templateRows)
const rendersBefore = templateRenders

templates.sort(byText)
results.tSorted = [templates.value.slice(), shownA(), shownB()]
templates.reorder([4, 3, 2, 1, 0])
results.tReordered = [templates.value.slice(), shownA(), shownB()]
// Reordering to the same order moves nothing, re-sorting after one change moves only that row (in each place)
results.tUnchangedMoves = moves("#templates-a ul, #templates-b ul", () => templates.reorder([0, 1, 2, 3, 4]))
templates.sort(byText)
templates.swap(1, 3)
results.tNearlySortedMoves = moves("#templates-a ul, #templates-b ul", () => templates.sort(byText))
results.tResorted = shownA()
// Invalid reorders throw and change nothing
results.tReorderThrows = [
    threw(() => templates.reorder([0, 1, 2, 3])),
    threw(() => templates.reorder([0, 0, 1, 2, 3])),
    threw(() => templates.reorder([0, 1, 2, 3, 5])),
    threw(() => templates.reorder([0, 1, 2, 3, 0.5])),
    threw(() => templates.sort(() => { throw new Error("compare failed") })),
]
results.tAfterThrows = [templates.value.slice(), shownA()]

templates.move(0, 4)
results.tMovedDown = [templates.value.slice(), shownA(), shownB()]
templates.move(4, 0)
templates.move(1, 1)
templates.move(9, 0)
results.tMovedBack = [templates.value.slice(), shownA()]
// None of that rendered a row again
results.tSameRows = sameRows(templateRows)
results.tRendersAfterMoves = templateRenders - rendersBefore

// Filtering keeps the hidden data points, and counts them in indexes
templates.filter(text => text !== "b" && text !== "d")
results.tFiltered = [templates.value.slice(), shownA(), shownB(), templates.getAt(1), templates.length]
templates.reorder([4, 3, 2, 1, 0])
results.tFilteredReordered = [templates.value.slice(), shownA(), shownB()]
templates.swap(0, 1)
results.tSwapShownHidden = [templates.value.slice(), shownA(), shownB()]
templates.swap(1, 3)
results.tSwapHiddenShown = [templates.value.slice(), shownA(), shownB()]
templates.move(4, 0)
results.tMoveFiltered = [templates.value.slice(), shownA(), shownB()]
// New data points are filtered too
templates.insertAt(1, "bb")
templates.push("d2")
results.tInsertFiltered = [templates.value.slice(), shownA(), shownB()]
// setAt() applies the filter to the new data point
templates.setAt(templates.value.indexOf("c"), "b")
results.tSetHides = [templates.value.slice(), shownA(), shownB()]
templates.setAt(2, "x")
results.tSetShows = [templates.value.slice(), shownA(), shownB()]
// Events in the shown rows get the index counting every data point
;(document.querySelectorAll("#templates-b li")[3] as HTMLElement).click()
results.tClicked = clicked.slice()
results.tFilterThrows = threw(() => templates.filter(() => { throw new Error("filter failed") }))
results.tAfterFilterThrows = shownA()
templates.filter(undefined)
results.tUnfiltered = [templates.value.slice(), shownA(), shownB()]
results.tSameRowsAfterFilter = sameRows("#templates-a li[data-mark], #templates-b li[data-mark]")
// Setting the whole value applies the filter
templates.filter(text => text.length === 1)
templates.value = ["p", "qq", "r"]
results.tValueFiltered = [shownA(), shownB()]
templates.sort((a, b) => byText(b, a))
results.tValueSorted = [templates.value.slice(), shownA()]
templates.clear()
templates.pushAll(["s", "tt", "u"])
results.tAfterClear = [templates.value.slice(), shownA(), shownB()]

// 2. RenderObjectArray, rendered in two places, with a Component in each row
const lifecycle: string[] = []
class Row extends Component<{text: string}> {
    override mount() { lifecycle.push("mount " + this.attrs.text) }
    override unmount() { lifecycle.push("unmount " + this.attrs.text) }
    override render(attrs: Readonly<{text: string}>) { return <li>{attrs.text}</li> }
}
const objects = new RenderObjectArray<string>({
    wrapperElementTag: "ul",
    renderFunction: (text: string) => <Row text={text}/>,
})
replaceElementWithRoot(<div><div id="objects-a">{objects}</div><div id="objects-b">{objects}</div></div>, host())
const objectRows = "#objects-a li, #objects-b li"
const oShownA = () => texts("#objects-a li")
const oShownB = () => texts("#objects-b li")
const data = () => objects.value.map(obj => obj.value)
objects.pushAll(["d", "b", "e", "a", "c"])
mark(objectRows)
lifecycle.length = 0

objects.sort(byText)
results.oSorted = [data(), oShownA(), oShownB()]
objects.reorder([4, 3, 2, 1, 0])
results.oReordered = [data(), oShownA(), oShownB()]
results.oUnchangedMoves = moves("#objects-a ul, #objects-b ul", () => objects.reorder([0, 1, 2, 3, 4]))
objects.sort(byText)
objects.swap(1, 3)
results.oNearlySortedMoves = moves("#objects-a ul, #objects-b ul", () => objects.sort(byText))
results.oReorderThrows = [
    threw(() => objects.reorder([0, 1, 2])),
    threw(() => objects.sort(() => { throw new Error("compare failed") })),
]
objects.move(0, 4)
results.oMovedDown = [data(), oShownA(), oShownB()]
objects.move(4, 0)
results.oMovedBack = [data(), oShownA()]
// Moving rows neither unmounts nor mounts their Components
results.oSameRows = sameRows(objectRows)
results.oLifecycleAfterMoves = lifecycle.slice()

// Filtering keeps the hidden rows, with their Components still mounted
objects.filter(text => text !== "b" && text !== "d")
results.oFiltered = [data(), oShownA(), oShownB(), objects.getAt(1), objects.length]
objects.reorder([4, 3, 2, 1, 0])
objects.swap(0, 1)
objects.swap(1, 3)
objects.move(4, 0)
results.oFilteredMoves = [data(), oShownA(), oShownB()]
// A data point added while filtered out mounts when it is first shown
objects.insertAt(1, "b")
objects.push("bb")
results.oInsertFiltered = [data(), oShownA(), oShownB()]
objects.setAt(objects.value.findIndex(obj => obj.value === "c"), "b")
results.oSetHides = [data(), oShownA(), oShownB()]
results.oLifecycleWhileFiltered = lifecycle.slice()
objects.filter(undefined)
results.oUnfiltered = [data(), oShownA(), oShownB()]
results.oLifecycleAfterUnfilter = lifecycle.slice()
results.oSameRowsAfterFilter = sameRows("#objects-a li[data-mark], #objects-b li[data-mark]")
// Rows deleted or cleared while hidden are unmounted
objects.filter(text => text !== "e")
lifecycle.length = 0
objects.deleteAt(objects.value.findIndex(obj => obj.value === "e"))
results.oDeleteHidden = [data(), oShownA(), lifecycle.slice()]
objects.filter(text => text.length === 1)
lifecycle.length = 0
objects.clear()
results.oClearHidden = [data(), oShownA(), lifecycle.slice().sort()]
objects.pushAll(["s", "tt", "u"])
results.oAfterClear = [data(), oShownA(), oShownB()]

class ArrayOrderTest extends Component<EmptyAttrs> {
    override render() {
        return <div id="array-order-tests">
            <pre id="array-order-results">{JSON.stringify(results)}</pre>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<ArrayOrderTest/>, document.getElementById("main-page"))
