import {replaceElementWithRoot, Component, getComponent, RenderBasic, type RenderObject, RenderObjectArray, RenderTemplateArray} from "@velotype/velotype"
import type {EmptyAttrs, RenderableElements} from "@velotype/velotype"

type Todo = {
    text: string
}

class RenderObjectArrayTest extends Component<EmptyAttrs> {
    // Kept by reference so delete() (which compares by reference) can find it later
    itemThree: Todo = {text: "three"}

    todos = new RenderObjectArray<Todo>({
        wrapperElementTag: "ul",
        wrapperAttrs: {id: "todo-list", class: "todo-wrapper"},
        renderFunction: (todo: Todo) => <li>{todo.text}</li>
    })

    override render() {
        return <div id="render-object-array-tests">
            <div id="todos-length">{this.todos.length}</div>
            {this.todos}
            <button id="push-one" type="button" onClick={() => {
                this.todos.push({text: "one"})
                this.refresh()
            }}>push one</button>
            <button id="push-all" type="button" onClick={() => {
                this.todos.pushAll([{text: "two"}, this.itemThree])
                this.refresh()
            }}>push all</button>
            <button id="set-at-0" type="button" onClick={() => {
                this.todos.setAt(0, {text: "one-updated"})
                this.refresh()
            }}>set at 0</button>
            <button id="delete-at-0" type="button" onClick={() => {
                this.todos.deleteAt(0)
                this.refresh()
            }}>delete at 0</button>
            <button id="delete-value" type="button" onClick={() => {
                this.todos.delete(this.itemThree)
                this.refresh()
            }}>delete value</button>
            <button id="clear-all" type="button" onClick={() => {
                this.todos.clear()
                this.refresh()
            }}>clear all</button>
        </div>
    }
}


/*
 * Lifecycle coverage for the array's own mutations.
 *
 * Nothing below calls refresh(): a refresh rebuilds and remounts the whole subtree, so the
 * counters would move whether or not the array's own methods run the lifecycle.
 */

/** Kept outside any Component so the tallies survive the probes being unmounted */
const probeCounts = {mounts: 0, unmounts: 0}
const probeTally = new RenderBasic<string>("0/0")

type Row = {
    label: string
}

/** Records whether velotype ran its lifecycle - the rendered markup is identical either way */
class MountProbe extends Component<{label: string}> {
    override mount() {
        probeCounts.mounts += 1
        probeTally.value = `${probeCounts.mounts}/${probeCounts.unmounts}`
    }
    override unmount() {
        probeCounts.unmounts += 1
        probeTally.value = `${probeCounts.mounts}/${probeCounts.unmounts}`
    }
    override render(attrs: {label: string}) {
        return <span class="probe">{attrs.label}</span>
    }
}

class RenderObjectArrayLifecycleTest extends Component<EmptyAttrs> {
    #next = 0

    // The wrapper element is the tbody itself, with the <tr>s as its direct children
    rows: RenderObjectArray<Row> = new RenderObjectArray<Row>({
        wrapperElementTag: "tbody",
        wrapperAttrs: {id: "probe-rows"},
        renderFunction: (row: Row) => <tr class="probe-row"><td><MountProbe label={row.label}/></td></tr>
    })

    override render() {
        return <div id="render-object-array-lifecycle-tests">
            <div id="probe-tally">{probeTally}</div>
            <table id="probe-table">
                {this.rows}
            </table>
            <button id="probe-push" type="button" onClick={() => {
                this.#next += 1
                this.rows.push({label: `r${this.#next}`})
            }}>push probe</button>
            <button id="probe-push-all" type="button" onClick={() => {
                this.rows.pushAll([{label: `r${this.#next + 1}`}, {label: `r${this.#next + 2}`}])
                this.#next += 2
            }}>push all probes</button>
            <button id="probe-delete" type="button" onClick={() => {
                this.rows.deleteAt(0)
            }}>delete first probe</button>
            <button id="probe-clear" type="button" onClick={() => {
                this.rows.clear()
            }}>clear probes</button>
        </div>
    }
}


/*
 * Pushing into an array that is rendered but not yet on the page.
 *
 * getElements() returns the wrapper as soon as the array has been rendered, which happens while
 * the owning component is still being constructed. The item is mounted when that component is
 * placed, once.
 */

const earlyCounts = {mounts: 0, unmounts: 0}
const earlyTally = new RenderBasic<string>("0/0")

class EarlyProbe extends Component<{label: string}> {
    override mount() {
        earlyCounts.mounts += 1
        earlyTally.value = `${earlyCounts.mounts}/${earlyCounts.unmounts}`
    }
    override unmount() {
        earlyCounts.unmounts += 1
        earlyTally.value = `${earlyCounts.mounts}/${earlyCounts.unmounts}`
    }
    override render(attrs: {label: string}) {
        return <span class="early-probe">{attrs.label}</span>
    }
}

class PushBeforeAttachTest extends Component<EmptyAttrs> {
    rows: RenderObjectArray<Row> = new RenderObjectArray<Row>({
        renderFunction: (row: Row) => <EarlyProbe label={row.label}/>
    })

    // Evaluated during construction, so the array is rendered and detached by the time the
    // constructor body below runs
    #root: HTMLDivElement = <div id="push-before-attach">
        <div id="early-tally">{earlyTally}</div>
        {this.rows}
    </div>

    constructor(attrs: EmptyAttrs, children: RenderableElements[]) {
        super(attrs, children)
        // Seeding a row before this component is anywhere near the document
        this.rows.push({label: "early"})
    }

    override render() {
        return this.#root
    }
}


/*
 * A second call site for the same guard, with no RenderObjectArray involved:
 * Component.replaceChildrenOfChild -> replaceChildren -> mountComponentElementChildren, on a
 * component that is fully constructed but not yet placed.
 */

const seedCounts = {mounts: 0, unmounts: 0}
const seedTally = new RenderBasic<string>("0/0")

class SeedProbe extends Component<EmptyAttrs> {
    override mount() {
        seedCounts.mounts += 1
        seedTally.value = `${seedCounts.mounts}/${seedCounts.unmounts}`
    }
    override unmount() {
        seedCounts.unmounts += 1
        seedTally.value = `${seedCounts.mounts}/${seedCounts.unmounts}`
    }
    override render() {
        return <span class="seed-probe">seeded</span>
    }
}

class SeedBeforeAttachTest extends Component<EmptyAttrs> {
    #host: HTMLDivElement = <div class="seed-host"/>

    /** Called while this component is still detached, see the call below */
    seed(): void {
        this.replaceChildrenOfChild(this.#host, [<SeedProbe/>])
    }

    override render() {
        return <div id="seed-before-attach">
            <div id="seed-tally">{seedTally}</div>
            {this.#host}
        </div>
    }
}

// Constructed and rendered but not placed. replaceChildrenOfChild is installed on the instance
// once the constructor returns, so this is the earliest it can be called.
const seededElement: HTMLElement = <SeedBeforeAttachTest/>
const seededInstance = getComponent<SeedBeforeAttachTest>(seededElement)
seededInstance.seed()
// A second seed discards the first probe while still detached; it never mounted, so it is not
// unmounted either
seededInstance.seed()



/*
 * Item-level callbacks, registered by a renderFunction through its thisArg. They follow the same
 * rule as a Component's: an item pushed and dropped again while the array is detached was never
 * live, so it is released without being unmounted.
 */

const itemCounts = {mounts: 0, unmounts: 0}
const itemTally = new RenderBasic<string>("0/0")

class ItemCallbackTest extends Component<EmptyAttrs> {
    rows: RenderObjectArray<Row> = new RenderObjectArray<Row>({
        renderFunction: (row: Row, thisArg: RenderObject<Row>) => {
            thisArg.registerOnMount(() => {
                itemCounts.mounts += 1
                itemTally.value = `${itemCounts.mounts}/${itemCounts.unmounts}`
            }, () => {
                itemCounts.unmounts += 1
                itemTally.value = `${itemCounts.mounts}/${itemCounts.unmounts}`
            })
            return <span class="item-probe">{row.label}</span>
        }
    })

    override render() {
        return <div id="item-callbacks">
            <div id="item-tally">{itemTally}</div>
            {this.rows}
        </div>
    }
}

const itemElement: HTMLElement = <ItemCallbackTest/>
const itemInstance = getComponent<ItemCallbackTest>(itemElement)
// Pushed and dropped again with the array nowhere near the document
itemInstance.rows.push({label: "discarded"})
itemInstance.rows.deleteAt(0)
itemInstance.rows.push({label: "kept"})


/*
 * The same array rendered into two places. RenderObject supports many instance elements, so a
 * push has to reach every one of them, and each instance is its own Component.
 */

const multiCounts = {mounts: 0, unmounts: 0}
const multiTally = new RenderBasic<string>("0/0")

class MultiProbe extends Component<{label: string}> {
    override mount() {
        multiCounts.mounts += 1
        multiTally.value = `${multiCounts.mounts}/${multiCounts.unmounts}`
    }
    override unmount() {
        multiCounts.unmounts += 1
        multiTally.value = `${multiCounts.mounts}/${multiCounts.unmounts}`
    }
    override render(attrs: {label: string}) {
        return <span class="multi-probe">{attrs.label}</span>
    }
}

class MultiPlaceTest extends Component<EmptyAttrs> {
    rows: RenderObjectArray<Row> = new RenderObjectArray<Row>({
        renderFunction: (row: Row) => <MultiProbe label={row.label}/>
    })

    override render() {
        return <div id="multi-place">
            <div id="multi-tally">{multiTally}</div>
            <div class="multi-slot">{this.rows}</div>
            <div class="multi-slot">{this.rows}</div>
            <button id="multi-push" type="button" onClick={() => {
                this.rows.push({label: "m"})
            }}>push to both</button>
            <button id="multi-delete" type="button" onClick={() => {
                this.rows.deleteAt(0)
            }}>delete from both</button>
            <button id="multi-clear" type="button" onClick={() => {
                this.rows.clear()
            }}>clear both</button>
        </div>
    }
}


/*
 * swap() moves the rendered elements, keeping each item's element and Component
 */

const swapCounts = {mounts: 0, unmounts: 0}
const swapTally = new RenderBasic<string>("0/0")

class SwapProbe extends Component<{label: string}> {
    override mount() {
        swapCounts.mounts += 1
        swapTally.value = `${swapCounts.mounts}/${swapCounts.unmounts}`
    }
    override unmount() {
        swapCounts.unmounts += 1
        swapTally.value = `${swapCounts.mounts}/${swapCounts.unmounts}`
    }
    override render(attrs: {label: string}) {
        return <span class="swap-probe">{attrs.label}</span>
    }
}

class SwapTest extends Component<EmptyAttrs> {
    rows: RenderObjectArray<Row> = new RenderObjectArray<Row>({
        wrapperElementTag: "tbody",
        renderFunction: (row: Row) => <tr><td><SwapProbe label={row.label}/></td></tr>
    })

    override render() {
        return <div id="swap-tests">
            <div id="swap-tally">{swapTally}</div>
            <table class="swap-table">{this.rows}</table>
            <table class="swap-table">{this.rows}</table>
            <div id="swap-order"></div>
            <button id="swap-fill" type="button" onClick={() => {
                this.rows.pushAll([{label: "a"}, {label: "b"}, {label: "c"}, {label: "d"}])
            }}>fill</button>
            <button id="swap-apart" type="button" onClick={() => {
                this.rows.swap(0, 2)
            }}>swap apart</button>
            <button id="swap-adjacent" type="button" onClick={() => {
                this.rows.swap(3, 2)
            }}>swap adjacent</button>
            <button id="swap-same" type="button" onClick={() => {
                this.rows.swap(1, 1)
            }}>swap same</button>
            <button id="swap-order-read" type="button" onClick={() => {
                (document.getElementById("swap-order") as HTMLElement).textContent = this.rows.value.map(r => r.value.label).join(",")
            }}>read order</button>
        </div>
    }
}


/*
 * RenderTemplateArray clones a template per row, rendered here into two tables
 */

type Item = {
    name: string
}

const templateClicked = new RenderBasic<string>("")

class TemplateTest extends Component<EmptyAttrs> {
    items: RenderTemplateArray<Item, HTMLElement> = new RenderTemplateArray<Item, HTMLElement>({
        wrapperElementTag: "tbody",
        template: <tr class="template-row"><td class="name"></td><td><button type="button" class="remove">x</button></td></tr>,
        renderFunction: (row: HTMLElement, item: Item) => {
            const name = row.firstChild as HTMLElement
            name.textContent = item.name
            return name
        },
        handleUpdate: (_row: HTMLElement, name: HTMLElement, _oldItem: Item, newItem: Item) => {
            name.textContent = newItem.name
        },
        on: {
            click: (event, _row, item, index) => {
                if ((event.target as HTMLElement).className == "remove") {
                    this.items.deleteAt(index)
                } else {
                    templateClicked.value = `${item.name}@${index}`
                }
            }
        }
    })
    // No handleUpdate, so setAt() replaces the row with a new clone
    replaced: RenderTemplateArray<Item, void> = new RenderTemplateArray<Item, void>({
        template: <span class="replaced"></span>,
        renderFunction: (row: HTMLElement, item: Item) => {
            row.textContent = item.name
        }
    })
    b: Item = {name: "b"}

    override render() {
        return <div id="template-tests">
            <div id="template-clicked">{templateClicked}</div>
            <table class="template-table">{this.items}</table>
            <table class="template-table">{this.items}</table>
            <div id="template-replaced">{this.replaced}</div>
            <button id="template-fill" type="button" onClick={() => {
                this.items.pushAll([{name: "a"}, this.b, {name: "c"}])
                this.items.push({name: "d"})
                this.replaced.pushAll([{name: "x"}, {name: "y"}])
            }}>fill</button>
            <button id="template-set" type="button" onClick={() => {
                this.items.setAt(1, {name: "b2"})
                this.replaced.setAt(1, {name: "y2"})
            }}>set</button>
            <button id="template-swap" type="button" onClick={() => {
                this.items.swap(0, 2)
                this.items.swap(3, 2)
                this.items.swap(1, 1)
            }}>swap</button>
            <button id="template-delete" type="button" onClick={() => {
                this.items.deleteAt(0)
                this.items.delete(this.b)
            }}>delete</button>
            <button id="template-delete-value" type="button" onClick={() => {
                const item = this.items.getAt(0)
                this.items.delete(item)
            }}>delete value</button>
            <button id="template-replace" type="button" onClick={() => {
                this.items.value = [{name: "p"}, {name: "q"}]
            }}>replace</button>
            <button id="template-clear" type="button" onClick={() => {
                this.items.clear()
                this.replaced.clear()
            }}>clear</button>
            <button id="template-length" type="button" onClick={() => {
                templateClicked.value = `length ${this.items.length} ${this.replaced.length}`
            }}>length</button>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<div>
    <RenderObjectArrayTest/>
    <RenderObjectArrayLifecycleTest/>
    <PushBeforeAttachTest/>
    {seededElement}
    {itemElement}
    <MultiPlaceTest/>
    <SwapTest/>
    <TemplateTest/>
</div>, document.getElementById("main-page"))
