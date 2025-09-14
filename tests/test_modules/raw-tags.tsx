import {replaceElementWithRoot, Component, HTML} from "jsr:@velotype/velotype"
import type {EmptyAttrs} from "jsr:@velotype/velotype"

class RawTagsTest extends Component<EmptyAttrs> {
    override render() {
        return <div id="raw-tags-tests">
            <hr/>
            <HTML tag="span" innerHTML='<div id="raw-html-1-inner-div">raw html 1</div>' elementAttrs={{id: "raw-html-1-outer-div"}}/>
            <HTML<{id: string}> tag="div" innerHTML='<div id="raw-html-2-inner-div">raw html 2</div>' elementAttrs={{id: "raw-html-2-outer-div"}}/>
            <HTML<{id: string, vtk: string}> tag="span" innerHTML='<div id="raw-html-3-inner-div">raw html 3</div>' elementAttrs={{id: "raw-html-3-outer-div", vtk: "raw-html-3-outer-div"}}/>
            <hr/>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<RawTagsTest/>, document.getElementById("main-page"))
