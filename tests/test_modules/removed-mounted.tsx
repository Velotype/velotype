import { replaceElementWithRoot, Component, RenderObjectArray, removeElementRoot, warnOnRemovedMounted, getComponent } from "@velotype/velotype"
import type { EmptyAttrs } from "@velotype/velotype"

/** A Component with something set up in mount() - what a Component left mounted would keep */
class Listening extends Component<{label: string}> {
    override mount() {
        document.addEventListener("click", this.#onClick)
    }
    override unmount() {
        document.removeEventListener("click", this.#onClick)
    }
    #onClick = () => {}
    override render() {
        return <span class="listening">{this.attrs.label}</span>
    }
}

class RefreshingHolder extends Component<EmptyAttrs> {
    count = 0
    override render() {
        return <div id="refreshing">refreshed {String(this.count)}<Listening label="inside a refresh"/></div>
    }
}

class RemovedMountedTest extends Component<EmptyAttrs> {
    rows = new RenderObjectArray<string>({renderFunction: label => <div class="row"><Listening label={label}/></div>})
    raw: HTMLElement = <div id="raw-removed"><Listening label="removed raw"/></div>
    throughVelotype: HTMLElement = <div id="velotype-removed"><Listening label="removed through Velotype"/></div>
    moved: HTMLElement = <div id="moved"><Listening label="moved"/></div>
    refreshing: HTMLElement = <RefreshingHolder/>

    override mount() {
        this.rows.pushAll(["kept", "hidden"])
    }

    override render() {
        return <div id="removed-mounted-tests">
            <div id="holder">{this.raw}{this.throughVelotype}{this.moved}{this.refreshing}</div>
            <div id="other-place"></div>
            {this.rows}
            <button id="remove-raw" type="button" onClick={() => this.raw.remove()}>remove raw</button>
            <button id="remove-through-velotype" type="button" onClick={() => removeElementRoot(this.throughVelotype)}>remove through Velotype</button>
            <button id="move" type="button" onClick={() => document.getElementById("other-place")!.append(this.moved)}>move</button>
            <button id="filter" type="button" onClick={() => this.rows.filter(label => label !== "hidden")}>filter</button>
            <button id="refresh" type="button" onClick={() => {
                const holder = getComponent<RefreshingHolder>(this.refreshing)
                holder.count++
                holder.refresh()
            }}>refresh</button>
        </div>
    }
}

warnOnRemovedMounted()

// Place on the page
replaceElementWithRoot(<RemovedMountedTest/>, document.getElementById("main-page"))
