// deno-lint-ignore-file jsx-boolean-value
import {replaceElementWithRoot, Component, RenderBasic} from "@velotype/velotype"
import type {EmptyAttrs} from "@velotype/velotype"

class BasicDivTest extends Component<EmptyAttrs> {
    buttonClicked = new RenderBasic<boolean>(false)
    buttonClickedTimes = new RenderBasic<number>(0)
    override render() {
        return <div>
            <div id="hello-div">Hello Velotype!</div>
            <hr/>
            <div id="style-object" style={{display:"flex", marginTop:"4px"}}>style object</div>
            <hr/>
            <button id="boolean-attribute-default-true" type="button" disabled>boolean attribute default true</button>
            <button id="boolean-attribute-explicit-true" type="button" disabled={true}>boolean attribute explicit true</button>
            <button id="boolean-attribute-explicit-false" type="button" disabled={false}>boolean attribute explicit false</button>
            <hr/>
            <button id="button-onclick" type="button" onClick={()=>{this.buttonClicked.value = true}}>clickable button has been clicked: {this.buttonClicked}</button>
            <hr/>
            <button id="button-onclick-times" type="button" onClick={()=>{this.buttonClickedTimes.value += 1}}>clickable button has been clicked: {this.buttonClickedTimes} times</button>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<BasicDivTest/>, document.getElementById("main-page"))
