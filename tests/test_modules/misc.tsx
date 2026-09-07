import {replaceElementWithRoot, Component, RenderBasic, setStylesheet} from "@velotype/velotype"
import type {EmptyAttrs} from "@velotype/velotype"

setStylesheet(".stylesheet-test-class { color: rgb(255, 0, 0); }", "misc-test-stylesheet")

class MiscTest extends Component<EmptyAttrs> {
    numberValue = new RenderBasic<number>(5)
    stringResult = new RenderBasic<string>("")
    onceClickCount = new RenderBasic<number>(0)
    customEventCount = new RenderBasic<number>(0)

    override render() {
        return <div id="misc-tests">
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
