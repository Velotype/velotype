import {replaceElementWithRoot, Component, RenderBasic} from "jsr:@velotype/velotype"
import type {EmptyAttrs, TargetedInputEvent} from "jsr:@velotype/velotype"

class RenderObjectTest extends Component<EmptyAttrs> {
    str1 = new RenderBasic<string>("default")
    str2 = new RenderBasic<string>("default")
    override render() {
        return <div id="render-object-tests">
            <input id="str1-input" type="text" onInput={(event: TargetedInputEvent<HTMLInputElement>) => {
                if (event.target && (event.target instanceof HTMLInputElement)) {
                    this.str1.set(event.target?.value)
                }
            }}/>
            <div id="str1-default">{this.str1}</div>
            <hr/>
            <input id="str2-input" type="text" onInput={(event: TargetedInputEvent<HTMLInputElement>) => {
                if (event.target && (event.target instanceof HTMLInputElement)) {
                    this.str2.set(event.target?.value)
                }
            }}/>
            <div id="str2-default">{this.str2}</div>
            <div id="str2-custom-1">{this.str2.render((data: string) => {
                return data + " custom render 1"
            })}</div>
            <div id="str2-custom-2">{this.str2.render((data: string) => {
                return data + " custom render 2"
            })}</div>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<RenderObjectTest/>, document.getElementById("main-page"))
