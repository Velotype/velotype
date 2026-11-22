import {replaceElementWithRoot, Component, RenderBasic, getComponent} from "@velotype/velotype"
import type {EmptyAttrs, RenderableElements} from "@velotype/velotype"

// Tracked outside of any Component instance so it survives the child being unmounted
let globalChildUnmountCount = 0

/** Shows whether it mounted, for insertBeforeChild() */
class InsertedChild extends Component<EmptyAttrs> {
    mounted = new RenderBasic<string>("not mounted")
    override mount() {
        this.mounted.value = "mounted"
    }
    override render() {
        return <span>y {this.mounted}</span>
    }
}

class ChildWithLifecycle extends Component<EmptyAttrs> {
    mountCount = new RenderBasic<number>(0)
    override mount() {
        this.mountCount.value += 1
    }
    override unmount() {
        globalChildUnmountCount += 1
    }
    publicMethod(): string {
        return "called"
    }
    override render() {
        return <div id="lifecycle-child">mounts: {this.mountCount}</div>
    }
}

/** Uses the child methods and refresh() before it has rendered, where they throw */
class UsesChildMethodsBeforeRender extends Component<EmptyAttrs> {
    list: HTMLUListElement = <ul><li>a</li></ul>
    inConstructor: string[] = []
    constructor(attrs: EmptyAttrs, children: RenderableElements[]) {
        super(attrs, children)
        this.inConstructor = [
            attempt(() => this.appendToChild(document.body, <div id="appended-from-constructor"/>)),
            attempt(() => this.refresh()),
        ]
    }
    override render() {
        const inRender = [
            attempt(() => this.appendToChild(this.list, <li id="appended-from-render"/>)),
            attempt(() => this.insertBeforeChild(this.list.firstChild as HTMLElement, <li/>)),
            attempt(() => this.refresh()),
        ]
        return <div id="before-render" data-results={JSON.stringify([...this.inConstructor, ...inRender])}>{this.list}</div>
    }
}

/** The message a call throws, or "did not throw" */
function attempt(call: () => unknown): string {
    try {
        call()
        return "did not throw"
    } catch (error) {
        return (error as Error).message
    }
}

class LifecycleTest extends Component<EmptyAttrs> {
    showChild = true
    unmountCountDisplay = new RenderBasic<number>(0)
    getComponentResult = new RenderBasic<string>("")

    // Set up during render() so imperative child-ops buttons can target real, currently-mounted DOM nodes
    listRef: HTMLUListElement = <ul id="child-ops-list">
        <li id="item-a">a</li>
        <li id="item-b">b</li>
    </ul>

    override render() {
        const childElement = this.showChild ? <ChildWithLifecycle/> : null
        return <div id="lifecycle-tests">
            <button id="toggle-child" type="button" onClick={() => {
                this.showChild = !this.showChild
                this.refresh()
                this.unmountCountDisplay.value = globalChildUnmountCount
            }}>toggle child</button>
            <div id="lifecycle-child-wrapper">{childElement}</div>
            <UsesChildMethodsBeforeRender/>
            <div id="unmount-count">{this.unmountCountDisplay}</div>
            <hr/>
            <button id="call-get-component" type="button" onClick={() => {
                const childEl = document.getElementById("lifecycle-child")
                if (childEl) {
                    const instance = getComponent<ChildWithLifecycle>(childEl)
                    this.getComponentResult.value = instance.publicMethod()
                }
            }}>call via getComponent</button>
            <div id="get-component-result">{this.getComponentResult}</div>
            <hr/>
            {this.listRef}
            <button id="append-item" type="button" onClick={() => {
                this.appendToChild(this.listRef, <li id="item-c">c</li>)
            }}>append</button>
            <button id="prepend-item" type="button" onClick={() => {
                this.prependToChild(this.listRef, <li id="item-z">z</li>)
            }}>prepend</button>
            <button id="insert-before-b" type="button" onClick={() => {
                const itemB = document.getElementById("item-b")
                if (itemB) {
                    this.insertBeforeChild(itemB, <li id="item-y"><InsertedChild/></li>)
                }
            }}>insert before b</button>
            <button id="insert-before-root" type="button" onClick={(event: MouseEvent) => {
                const root = (event.currentTarget as HTMLElement).parentElement as HTMLElement
                root.setAttribute("data-insert-before-root", String(this.insertBeforeChild(root, <span id="outside-root">outside</span>)))
            }}>insert before root</button>
            <button id="remove-item-a" type="button" onClick={() => {
                const itemA = document.getElementById("item-a")
                if (itemA) {
                    this.removeChild(itemA)
                }
            }}>remove item a</button>
            <button id="replace-children" type="button" onClick={() => {
                this.replaceChildrenOfChild(this.listRef, [<li id="item-only">only</li>])
            }}>replace children</button>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<LifecycleTest/>, document.getElementById("main-page"))
