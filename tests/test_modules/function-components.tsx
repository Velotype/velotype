import {replaceElementWithRoot, Component} from "@velotype/velotype"
import type {FunctionComponent, EmptyAttrs, RenderableElements} from "@velotype/velotype"

type GreetingAttrs = {
    name: string
}
const Greeting: FunctionComponent<GreetingAttrs> = function(attrs: GreetingAttrs) {
    return <div>Hello {attrs.name}</div>
}

type WrapperAttrs = {
    label: string
}
const Wrapper: FunctionComponent<WrapperAttrs> = function(attrs: WrapperAttrs, children: RenderableElements[]) {
    return <div>{attrs.label}: {children}</div>
}

const FragmentPair: FunctionComponent<EmptyAttrs> = function() {
    return <>
        <span id="fragment-one">fragment-one</span>
        <span id="fragment-two">fragment-two</span>
    </>
}

class FunctionComponentsTest extends Component<EmptyAttrs> {
    override render() {
        return <div id="function-components-tests">
            <div id="greeting"><Greeting name="Velotype"/></div>
            <div id="wrapper-with-children"><Wrapper label="Note">important text</Wrapper></div>
            <div id="fragment-pair"><FragmentPair/></div>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<FunctionComponentsTest/>, document.getElementById("main-page"))
