import {replaceElementWithRoot, passthroughAttrsToElement, Component, ChildrenAttr, RenderableElements, setAttrsOnElement} from "@velotype/velotype"
import type {EmptyAttrs, IdAttr, StylePassthroughAttrs} from "@velotype/velotype"

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

class ComponentWithId extends Component<IdAttr> {
    constructor(attrs: IdAttr, children: RenderableElements[]) {
        super(attrs, children)
    }
    override render(attrs: IdAttr, _children: RenderableElements[]) {
        return <div id={attrs.id}>1</div>
    }
}
class ComponentWithStylePassthrough extends Component<IdAttr & StylePassthroughAttrs> {
    constructor(attrs: IdAttr & StylePassthroughAttrs, children: RenderableElements[]) {
        super(attrs, children)
    }
    override render(attrs: IdAttr & StylePassthroughAttrs, _children: RenderableElements[]) {
        return <div id={attrs.id} class={`component-class ${attrs.class}`} style={attrs.style}>1</div>
    }
}
class ComponentWithStyleOverride extends Component<IdAttr & StylePassthroughAttrs> {
    constructor(attrs: IdAttr & StylePassthroughAttrs, children: RenderableElements[]) {
        super(attrs, children)
    }
    override render(attrs: IdAttr & StylePassthroughAttrs, _children: RenderableElements[]) {
        const divElement = <div id={attrs.id} class={`component-class ${attrs.class}`} style={{marginTop: "3px"}}>1</div>
        if (attrs.style) {
            setAttrsOnElement(divElement, {style: attrs.style})
        }
        return divElement
    }
}

class ComponentPassthroughHelperWithId extends Component<IdAttr> {
    constructor(attrs: IdAttr, children: RenderableElements[]) {
        super(attrs, children)
    }
    override render(attrs: IdAttr, _children: RenderableElements[]) {
        return passthroughAttrsToElement(<div>1</div>, attrs)
    }
}
class ComponentPassthroughHelperWithStylePassthrough extends Component<IdAttr & StylePassthroughAttrs> {
    constructor(attrs: IdAttr & StylePassthroughAttrs, children: RenderableElements[]) {
        super(attrs, children)
    }
    override render(attrs: IdAttr & StylePassthroughAttrs, _children: RenderableElements[]) {
        return passthroughAttrsToElement(<div class="component-class">1</div>, attrs)
    }
}
class ComponentPassthroughHelperWithStyleOverride extends Component<IdAttr & StylePassthroughAttrs> {
    constructor(attrs: IdAttr & StylePassthroughAttrs, children: RenderableElements[]) {
        super(attrs, children)
    }
    override render(attrs: IdAttr & StylePassthroughAttrs, _children: RenderableElements[]) {
        return passthroughAttrsToElement(<div class="component-class" style={{marginTop: "3px"}}>1</div>, attrs)
    }
}

class AttrsTypesTest extends Component<EmptyAttrs> {
    override render() {
        return <div>
            <div id="component-children-string"><ComponentWithChildren test="not used">string</ComponentWithChildren></div>
            <div id="component-children-number"><ComponentWithChildren>{1}</ComponentWithChildren></div>
            <div id="component-children-html"><ComponentWithChildren><span>span</span></ComponentWithChildren></div>
            <hr/>
            <div id="component-only-children-string"><ComponentWithOnlyChildren>string</ComponentWithOnlyChildren></div>
            <div id="component-only-children-number"><ComponentWithOnlyChildren>{1}</ComponentWithOnlyChildren></div>
            <div id="component-only-children-html"><ComponentWithOnlyChildren><span>span</span></ComponentWithOnlyChildren></div>
            <hr/>
            <div id="component-children-attr-string"><ComponentWithChildrenAttr ch="string"/></div>
            <div id="component-children-attr-number"><ComponentWithChildrenAttr ch={1}/></div>
            <div id="component-children-attr-html"><ComponentWithChildrenAttr ch={<span>span</span>}/></div>
            <hr/>
            <div><ComponentWithId id="component-with-id"/></div>
            <div><ComponentWithStylePassthrough id="component-with-style-pass-through" class="custom-class" style={{marginTop: "5px"}}/></div>
            <div><ComponentWithStyleOverride id="component-with-style-override-base" class="custom-class"/></div>
            <div><ComponentWithStyleOverride id="component-with-style-override-custom" class="custom-class" style={{marginTop: "5px"}}/></div>
            <hr/>
            <div><ComponentPassthroughHelperWithId id="component-passthrough-helper-with-id"/></div>
            <div><ComponentPassthroughHelperWithStylePassthrough id="component-passthrough-helper-with-style-pass-through" class="custom-class" style={{marginTop: "5px"}}/></div>
            <div><ComponentPassthroughHelperWithStyleOverride id="component-passthrough-helper-with-style-override-base" class="custom-class"/></div>
            <div><ComponentPassthroughHelperWithStyleOverride id="component-passthrough-helper-with-style-override-custom" class="custom-class" style={{marginTop: "5px"}}/></div>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<AttrsTypesTest/>, document.getElementById("main-page"))
