import {replaceElementWithRoot, Component, RenderBasic, setStylesheet} from "@velotype/velotype"
import type {EmptyAttrs} from "@velotype/velotype"

setStylesheet(".stylesheet-test-class { color: rgb(255, 0, 0); }", "misc-test-stylesheet")

const probeCounts = {mounts: 0, unmounts: 0}
class Probe extends Component<EmptyAttrs> {
    override mount() { probeCounts.mounts += 1 }
    override unmount() { probeCounts.unmounts += 1 }
    override render() { return <div>probe</div> }
}

class RendersZero extends Component<EmptyAttrs> {
    override render() { return 0 }
}

class MiscTest extends Component<EmptyAttrs> {
    numberValue = new RenderBasic<number>(5)
    boolValue = new RenderBasic<boolean>(true)
    mixedValue = new RenderBasic<number | string>(0)
    stringResult = new RenderBasic<string>("")
    onceClickCount = new RenderBasic<number>(0)
    handlerOnlyCount = new RenderBasic<number>(0)
    customEventCount = new RenderBasic<number>(0)

    override render() {
        let probeSlot: HTMLElement = <div>empty</div>
        const probeResult = new RenderBasic<string>("")
        const updateProbeResult = () => {
            probeResult.value = `${probeCounts.mounts}/${probeCounts.unmounts}`
        }
        const showFalse = false
        return <div id="misc-tests">
            {probeSlot}
            <button id="probe-in" type="button" onClick={() => {
                probeSlot = this.replaceChild(probeSlot, <Probe/>) as HTMLElement
                updateProbeResult()
            }}>probe in</button>
            <button id="probe-out" type="button" onClick={() => {
                probeSlot = this.replaceChild(probeSlot, <div>empty</div>) as HTMLElement
                updateProbeResult()
            }}>probe out</button>
            <div id="probe-result">{probeResult}</div>
            <select id="select-value" value="b">
                <option value="a">a</option>
                <option value="b">b</option>
            </select>
            <div id="renders-zero"><RendersZero/></div>
            <div id="false-child">{false}{showFalse && <span>shown</span>}</div>
            <div id="true-child">{true}</div>
            <input id="range-value" type="range" value="150" max="200"/>
            <button id="handler-only-button" type="button" onClick={{handler: () => {this.handlerOnlyCount.value += 1}}}>handler only {this.handlerOnlyCount}</button>
            <div id="stylesheet-test-class" class="stylesheet-test-class">styled text</div>
            <hr/>
            <div id="number-value">{this.numberValue}</div>
            <button id="set-string-btn" type="button" onClick={() => {
                this.numberValue.setString("42")
            }}>set string</button>
            <button id="get-string-btn" type="button" onClick={() => {
                this.stringResult.value = this.numberValue.getString()
            }}>get string</button>
            <div id="string-result">{this.stringResult}</div>
            <div id="bool-value">{this.boolValue}</div>
            <button id="set-bool-string-btn" type="button" onClick={() => {
                this.boolValue.setString("false")
            }}>set bool string</button>
            <div id="mixed-value">{this.mixedValue}</div>
            <button id="set-mixed-btn" type="button" onClick={() => {
                this.mixedValue.value = ""
            }}>set mixed</button>
            <hr/>
            <button id="once-button" type="button" onClick={{handler: () => {this.onceClickCount.value += 1}, options: {once: true}}}>once button {this.onceClickCount}</button>
            <hr/>
            <div id="custom-event-target" on-custom-thing={() => {this.customEventCount.value += 1}}>custom event target {this.customEventCount}</div>
            <button id="dispatch-custom-event" type="button" onClick={() => {
                document.getElementById("custom-event-target")?.dispatchEvent(new CustomEvent("custom-thing"))
            }}>dispatch custom event</button>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<MiscTest/>, document.getElementById("main-page"))
