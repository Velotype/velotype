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
            <div id="style-hyphen-unitless-custom" style={{"background-color": "red", opacity: 0.5, "--gap": 4}}>style hyphen-case, unitless number, custom property</div>
            <div id="style-important" style={{marginTop: "2px !important", "--brandColor": "red !important", webkitLineClamp: "2 !important"}}>style important</div>
            <hr/>
            <button id="boolean-attribute-default-true" type="button" disabled>boolean attribute default true</button>
            <button id="boolean-attribute-explicit-true" type="button" disabled={true}>boolean attribute explicit true</button>
            <button id="boolean-attribute-explicit-false" type="button" disabled={false}>boolean attribute explicit false</button>
            <button id="aria-boolean-attributes" type="button" aria-expanded={false} aria-hidden={true} data-open={false}>aria and data booleans</button>
            <hr/>
            <img id="empty-alt" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt=""/>
            <input id="zero-values" type="number" tabindex={0} min={0} value={0}/>
            <div id="null-values" title={null} lang={undefined}>null and undefined values</div>
            <hr/>
            <button id="button-onclick" type="button" onClick={()=>{this.buttonClicked.value = true}}>clickable button has been clicked: {this.buttonClicked}</button>
            <hr/>
            <button id="button-onclick-times" type="button" onClick={()=>{this.buttonClickedTimes.value += 1}}>clickable button has been clicked: {this.buttonClickedTimes} times</button>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<BasicDivTest/>, document.getElementById("main-page"))
