import {replaceElementWithRoot, Component} from "jsr:@velotype/velotype"
import type {EmptyAttrs} from "jsr:@velotype/velotype"

/**
 * Test scenarios similar to:
 * https://www.jovidecroock.com/blog/browser-timings/
 * https://github.com/preactjs/preact/pull/3608
 * https://github.com/preactjs/preact/issues/2887
 * https://github.com/preactjs/preact/issues/3596
 * https://github.com/preactjs/preact/pull/4322/files
 * https://github.com/preactjs/preact/issues/3927
 */

class DivToggleOneLayerRefresh extends Component<EmptyAttrs> {
    isOpen = true
    toggle = () => {
        console.log("toggle")
        this.isOpen = !this.isOpen
        this.refresh()
    }
    override render() {
        console.log(this.isOpen)
        if (this.isOpen) {
            return <div>
                <div onClick={this.toggle}>Close</div>
            </div>
        } else {
            return <div onClick={this.toggle}>Open</div>
        }
    }
}

class DivToggleTwoLayersRefresh extends Component<EmptyAttrs> {
    isOpen = true
    toggle = () => {
        console.log("toggle")
        this.isOpen = !this.isOpen
        this.refresh()
    }
    override render() {
        console.log(this.isOpen)
        if (this.isOpen) {
            return <div>
                <div onClick={this.toggle}>Close</div>
            </div>
        } else {
            return <div>
                <div>
                    <div onClick={this.toggle}>Open</div>
                </div>
            </div>
        }
    }
}

class DivToggleSameLayerRefresh extends Component<EmptyAttrs> {
    isOpen = true
    toggle = () => {
        console.log("toggle")
        this.isOpen = !this.isOpen
        this.refresh()
    }
    override render() {
        console.log(this.isOpen)
        if (this.isOpen) {
            return <div>
                <div onClick={this.toggle}>Close</div>
            </div>
        } else {
            return <div>
                <div onClick={this.toggle}>Open</div>
            </div>
        }
    }
}


class DivToggleOneLayerReplaceChild extends Component<EmptyAttrs> {
    override render() {
        let isOpen = true
        const toggle = () => {
            console.log("toggle")
            isOpen = !isOpen
            if (isOpen) {
                this.replaceChild(current, openedState)
                current = openedState
            } else {
                this.replaceChild(current, closedState)
                current = closedState
            }
        }
        const openedState = <div>
            <div onClick={toggle}>Close</div>
        </div>
        const closedState = <div onClick={toggle}>Open</div>
        let current = openedState
        return <div>{current}</div>
    }
}

class DivToggleTwoLayersReplaceChild extends Component<EmptyAttrs> {
    override render() {
        let isOpen = true
        const toggle = () => {
            console.log("toggle")
            isOpen = !isOpen
            if (isOpen) {
                this.replaceChild(current, openedState)
                current = openedState
            } else {
                this.replaceChild(current, closedState)
                current = closedState
            }
        }
        const openedState = <div>
            <div onClick={toggle}>Close</div>
        </div>
        const closedState = <div>
            <div>
                <div onClick={toggle}>Open</div>
            </div>
        </div>
        let current = openedState
        return <div>{current}</div>
    }
}


class DivToggleSameLayerReplaceChild extends Component<EmptyAttrs> {
    override render() {
        let isOpen = true
        const toggle = () => {
            console.log("toggle")
            isOpen = !isOpen
            if (isOpen) {
                this.replaceChild(current, openedState)
                current = openedState
            } else {
                this.replaceChild(current, closedState)
                current = closedState
            }
        }
        const openedState = <div>
            <div onClick={toggle}>Close</div>
        </div>
        const closedState = <div>
            <div onClick={toggle}>Open</div>
        </div>
        let current = openedState
        return <div>{current}</div>
    }
}


class ButtonToggleOneLayerRefresh extends Component<EmptyAttrs> {
    isOpen = true
    toggle = () => {
        console.log("toggle")
        this.isOpen = !this.isOpen
        this.refresh()
    }
    override render() {
        console.log(this.isOpen)
        if (this.isOpen) {
            return <div>
                <button type="button" onClick={this.toggle}>Close</button>
            </div>
        } else {
            return <button type="button" onClick={this.toggle}>Open</button>
        }
    }
}

class ButtonToggleTwoLayersRefresh extends Component<EmptyAttrs> {
    isOpen = true
    toggle = () => {
        console.log("toggle")
        this.isOpen = !this.isOpen
        this.refresh()
    }
    override render() {
        console.log(this.isOpen)
        if (this.isOpen) {
            return <div>
                <button type="button" onClick={this.toggle}>Close</button>
            </div>
        } else {
            return <div>
                <div>
                    <button type="button" onClick={this.toggle}>Open</button>
                </div>
            </div>
        }
    }
}

class ButtonToggleSameLayerRefresh extends Component<EmptyAttrs> {
    isOpen = true
    toggle = () => {
        console.log("toggle")
        this.isOpen = !this.isOpen
        this.refresh()
    }
    override render() {
        console.log(this.isOpen)
        if (this.isOpen) {
            return <div>
                <button type="button" onClick={this.toggle}>Close</button>
            </div>
        } else {
            return <div>
                <button type="button" onClick={this.toggle}>Open</button>
            </div>
        }
    }
}


class ButtonToggleOneLayerReplaceChild extends Component<EmptyAttrs> {
    override render() {
        let isOpen = true
        const toggle = () => {
            console.log("toggle")
            isOpen = !isOpen
            if (isOpen) {
                this.replaceChild(current, openedState)
                current = openedState
            } else {
                this.replaceChild(current, closedState)
                current = closedState
            }
        }
        const openedState = <div>
            <button type="button" onClick={toggle}>Close</button>
        </div>
        const closedState = <button type="button" onClick={toggle}>Open</button>
        let current = openedState
        return <div>{current}</div>
    }
}

class ButtonToggleTwoLayersReplaceChild extends Component<EmptyAttrs> {
    override render() {
        let isOpen = true
        const toggle = () => {
            console.log("toggle")
            isOpen = !isOpen
            if (isOpen) {
                this.replaceChild(current, openedState)
                current = openedState
            } else {
                this.replaceChild(current, closedState)
                current = closedState
            }
        }
        const openedState = <div>
            <button type="button" onClick={toggle}>Close</button>
        </div>
        const closedState = <div>
            <div>
                <button type="button" onClick={toggle}>Open</button>
            </div>
        </div>
        let current = openedState
        return <div>{current}</div>
    }
}


class ButtonToggleSameLayerReplaceChild extends Component<EmptyAttrs> {
    override render() {
        let isOpen = true
        const toggle = () => {
            console.log("toggle")
            isOpen = !isOpen
            if (isOpen) {
                this.replaceChild(current, openedState)
                current = openedState
            } else {
                this.replaceChild(current, closedState)
                current = closedState
            }
        }
        const openedState = <div>
            <button type="button" onClick={toggle}>Close</button>
        </div>
        const closedState = <div>
            <button type="button" onClick={toggle}>Open</button>
        </div>
        let current = openedState
        return <div>{current}</div>
    }
}

class EventTogglesTest extends Component<EmptyAttrs> {
    override render() {
        return <div>
            <div id="div-toggle-one-layer-refresh"><DivToggleOneLayerRefresh/></div>
            <div id="div-toggle-two-layers-refresh"><DivToggleTwoLayersRefresh/></div>
            <div id="div-toggle-same-layer-refresh"><DivToggleSameLayerRefresh/></div>
            <hr/>
            <div id="div-toggle-one-layer-replace-child"><DivToggleOneLayerReplaceChild/></div>
            <div id="div-toggle-two-layers-replace-child"><DivToggleTwoLayersReplaceChild/></div>
            <div id="div-toggle-same-layer-replace-child"><DivToggleSameLayerReplaceChild/></div>
            <hr/>
            <div id="button-toggle-one-layer-refresh"><ButtonToggleOneLayerRefresh/></div>
            <div id="button-toggle-two-layers-refresh"><ButtonToggleTwoLayersRefresh/></div>
            <div id="button-toggle-same-layer-refresh"><ButtonToggleSameLayerRefresh/></div>
            <hr/>
            <div id="button-toggle-one-layer-replace-child"><ButtonToggleOneLayerReplaceChild/></div>
            <div id="button-toggle-two-layers-replace-child"><ButtonToggleTwoLayersReplaceChild/></div>
            <div id="button-toggle-same-layer-replace-child"><ButtonToggleSameLayerReplaceChild/></div>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<EventTogglesTest/>, document.getElementById("main-page"))
