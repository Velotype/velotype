/// <reference lib="dom" />

import {replaceElementWithRoot, Component, RenderBasic, __vtAppMetadata} from "jsr:@velotype/velotype"
import type {EmptyAttrs} from "jsr:@velotype/velotype"

class RenderWithTest extends Component<EmptyAttrs> {
    buttonClicked: boolean = false
    override render() {
        console.log(__vtAppMetadata.domReferences)
        let elementSection: HTMLDivElement
        if (this.buttonClicked) {
            const num1 = new RenderBasic<number>(1)
            const num2 = new RenderBasic<number>(2)
            elementSection = <div vtwith={[num1,num2]}>{num1}{num2}</div>
        } else {
            const str = new RenderBasic<string>("render string")
            elementSection = <div vtwith={[str]}>{str}</div>
        }
        console.log(__vtAppMetadata.domReferences)
        return <div>
            <button id="button" type="button" onClick={() => {
                this.buttonClicked = !this.buttonClicked
                this.refresh()
            }}>toggle</button>
            <div id="dom-references-size">{__vtAppMetadata.domReferences.size}</div>
            <hr/>
            {elementSection}
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<RenderWithTest/>, document.getElementById("main-page"))
