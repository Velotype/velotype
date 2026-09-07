import {replaceElementWithRoot, Component, RenderBasic, getComponent} from "@velotype/velotype"
import type {EmptyAttrs} from "@velotype/velotype"

// Tracked outside of any Component instance so it survives the child being unmounted
let globalChildUnmountCount = 0

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
