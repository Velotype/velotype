import {replaceElementWithRoot, Component, RenderBasic, RenderObject, emitEvent, VelotypeEvent} from "@velotype/velotype"
import {__vtAppMetadata, getDevtoolsHook} from "@velotype/velotype/devtools"
import type {EmptyAttrs} from "@velotype/velotype"
import {registerEventListener, removeEventListeners} from "@velotype/velotype"

/** A listener owned by the page, so that it needs no Component */
function registerListener(key: string, listener: () => void): void {
    registerEventListener({vtKey: -1}, key, listener)
}

class DevtoolsHookTest extends Component<EmptyAttrs> {
    unregisterResult = new RenderBasic<string>("")
    traceResult = new RenderBasic<string>("")

    override render() {
        return <div id="devtools-hook-tests">
            <div id="hook-instances-size">{getDevtoolsHook()?.instances.size}</div>
            <div id="vtkey-type">{typeof this.vtKey}</div>
            <div id="velotype-version">{__vtAppMetadata.version}</div>
            <button id="unregister-self" type="button" onClick={() => {
                const hook = getDevtoolsHook()
                const ownEntry = hook && Array.from(hook.instances.entries()).find(([, metadata]) => metadata === __vtAppMetadata)
                if (hook && ownEntry) {
                    hook.unregister(ownEntry[0])
                    this.unregisterResult.value = hook.instances.has(ownEntry[0]) ? "still-present" : "removed"
                }
            }}>unregister self</button>
            <div id="unregister-result">{this.unregisterResult}</div>
            <button id="run-trace" type="button" onClick={() => {
                // Events from a RenderObject and from emitEvent() reach a tracer, in front of their listeners, and stopping puts things back
                const traced: string[] = []
                const received: string[] = []
                const counter = new RenderObject<number>(0)
                counter.registerOnChangeListener(() => received.push("change"))
                registerListener("custom", () => received.push("custom"))
                __vtAppMetadata.setEventTracer((key, event) => { traced.push(`${key.startsWith("vt-ro-") ? "vt-ro" : key}:${event.event}:${received.length}`) })
                counter.set(1)
                emitEvent("custom", new VelotypeEvent(counter, "ping"))
                // A tracer that throws changes nothing for the listeners
                __vtAppMetadata.setEventTracer(() => { throw new Error("tracer failed") })
                counter.set(2)
                __vtAppMetadata.setEventTracer(undefined)
                counter.set(3)
                emitEvent("custom", new VelotypeEvent(counter, "ping"))
                // Listeners registered while tracing can be removed by the function that was registered, and removing them while tracing works for the earlier ones too
                const owner = {vtKey: -2}
                const early = () => received.push("early")
                registerEventListener(owner, "later", early)
                __vtAppMetadata.setEventTracer((key) => { traced.push(`later:${key}`) })
                const during = () => received.push("during")
                registerEventListener(owner, "later", during)
                emitEvent("later", new VelotypeEvent(counter, "x"))
                removeEventListeners(owner, "later", early)
                removeEventListeners(owner, "later", during)
                emitEvent("later", new VelotypeEvent(counter, "x"))
                __vtAppMetadata.setEventTracer(undefined)
                this.traceResult.value = JSON.stringify({traced, received})
            }}>trace</button>
            <div id="trace-result">{this.traceResult}</div>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<DevtoolsHookTest/>, document.getElementById("main-page"))
