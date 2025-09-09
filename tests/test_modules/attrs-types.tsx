import {replaceElementWithRoot, Component, ChildrenAttr, RenderableElements} from "jsr:@velotype/velotype"
import type {EmptyAttrs} from "jsr:@velotype/velotype"

type TestAttrs = {
    test?: string
}
class ComponentWithChildren extends Component<TestAttrs & ChildrenAttr> {
    constructor(attrs: TestAttrs & ChildrenAttr, children: RenderableElements[]) {
        super(attrs, children)
    }
    override render(_attrs: TestAttrs, children: RenderableElements[]) {
        return children
    }
}

class ComponentWithOnlyChildren extends Component<ChildrenAttr> {
    constructor(attrs: ChildrenAttr, children: RenderableElements[]) {
        super(attrs, children)
    }
    override render(_attrs: EmptyAttrs, children: RenderableElements[]) {
        return children
    }
}

type TestChildrenAttr = {
    ch: RenderableElements
}
class ComponentWithChildrenAttr extends Component<TestChildrenAttr> {
    constructor(attrs: TestChildrenAttr, children: RenderableElements[]) {
        super(attrs, children)
    }
    override render(attrs: TestChildrenAttr) {
        return attrs.ch
    }
}

class AttrsTypesTest extends Component<EmptyAttrs> {
    override render() {
        return <div>
            <div id="component-children-string"><ComponentWithChildren test="not used">string</ComponentWithChildren></div>
            <div id="component-children-number"><ComponentWithChildren>{1}</ComponentWithChildren></div>
            <div id="component-children-html"><ComponentWithChildren><span>span</span></ComponentWithChildren></div>

            <div id="component-only-children-string"><ComponentWithOnlyChildren>string</ComponentWithOnlyChildren></div>
            <div id="component-only-children-number"><ComponentWithOnlyChildren>{1}</ComponentWithOnlyChildren></div>
            <div id="component-only-children-html"><ComponentWithOnlyChildren><span>span</span></ComponentWithOnlyChildren></div>

            <div id="component-children-attr-string"><ComponentWithChildrenAttr ch="string"/></div>
            <div id="component-children-attr-number"><ComponentWithChildrenAttr ch={1}/></div>
            <div id="component-children-attr-html"><ComponentWithChildrenAttr ch={<span>span</span>}/></div>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<AttrsTypesTest/>, document.getElementById("main-page"))
