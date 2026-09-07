import {replaceElementWithRoot, Component, RenderObject, RenderBasic, UpdateHandlerLink} from "@velotype/velotype"
import type {EmptyAttrs, AnchorElement} from "@velotype/velotype"

// Tracked outside of any Component instance so it survives the child being unmounted
let globalOnUnmountCallCount = 0

class RegisterOnMountChild extends Component<EmptyAttrs> {
    onMountCallCount = new RenderObject<number>(0, (data: number) => <span>{data}</span>).registerOnMount(
        () => {
            this.onMountCallCount.value += 1
        },
        () => {
            globalOnUnmountCallCount += 1
        }
    )
    override render() {
        return <div id="register-on-mount-child">on-mount calls: {this.onMountCallCount}</div>
    }
}

type UpdateRefs = {
    span: HTMLSpanElement
}
class HandleUpdateCounter extends Component<EmptyAttrs> {
    count = 0
    fullRenderCallCount = new RenderBasic<number>(0)
    handleUpdateCallCount = new RenderBasic<number>(0)

    // Uses the UpdateHandlerLink/handleUpdate fast path: after the first render, subsequent value
    // changes patch the cached <span> directly via handleUpdate instead of calling the renderFunction again
    counter = new RenderObject<number>(0, (data: number) => {
        this.fullRenderCallCount.value += 1
        const span = <span class="counter-value">{data}</span> as HTMLSpanElement
        return new UpdateHandlerLink(<div>{span}</div>, {span} as UpdateRefs)
    }, (_element: AnchorElement, updateRefs: UpdateRefs, _oldData: number, newData: number) => {
        this.handleUpdateCallCount.value += 1
        updateRefs.span.textContent = String(newData)
    })

    override render() {
        return <div id="handle-update-counter-tests">
            {this.counter}
            <div id="full-render-call-count">{this.fullRenderCallCount}</div>
            <div id="handle-update-call-count">{this.handleUpdateCallCount}</div>
            <button id="increment-counter" type="button" onClick={() => {
                this.count += 1
                this.counter.value = this.count
            }}>increment</button>
        </div>
    }
}

class RenderObjectAdvancedTest extends Component<EmptyAttrs> {
    globalOnUnmountCallCountDisplay = new RenderBasic<number>(0)

    override render() {
        // Uses replaceChild() (not refresh()) so unmounting the child is isolated - see event-triggers.tsx
        // for the same in-place-swap idiom, and event-bus.tsx for why replaceChild()'s cleanup requires a
        // plain wrapper div (no vtKey of its own) around the Component being removed.
        let childWrapper = <div id="register-on-mount-child-wrapper"><RegisterOnMountChild/></div>
        const placeholderWrapper = <div id="register-on-mount-child-wrapper"/>
        const unmountChild = () => {
            this.replaceChild(childWrapper, placeholderWrapper)
            childWrapper = placeholderWrapper
            this.globalOnUnmountCallCountDisplay.value = globalOnUnmountCallCount
        }

        return <div id="render-object-advanced-tests">
            <button id="unmount-register-on-mount-child" type="button" onClick={unmountChild}>unmount child</button>
            {childWrapper}
            <div id="global-on-unmount-call-count">{this.globalOnUnmountCallCountDisplay}</div>
            <hr/>
            <HandleUpdateCounter/>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<RenderObjectAdvancedTest/>, document.getElementById("main-page"))
