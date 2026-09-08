import {replaceElementWithRoot, Component, RenderBasic, __vtAppMetadata, getDevtoolsHook} from "@velotype/velotype"
import type {EmptyAttrs} from "@velotype/velotype"

class DevtoolsHookTest extends Component<EmptyAttrs> {
    unregisterResult = new RenderBasic<string>("")

    override render() {
        return <div id="devtools-hook-tests">
            {/* The test page pre-seeds a fake devtools hook instance claiming domKeyName "vk" before this
                bundle loads, so installDevtoolsHook() must have picked a non-colliding name instead */}
            <div id="dom-key-name">{__vtAppMetadata.domKeyName}</div>
            <div id="hook-instances-size">{getDevtoolsHook()?.instances.size}</div>
            <button id="unregister-self" type="button" onClick={() => {
                const hook = getDevtoolsHook()
                const ownEntry = hook && Array.from(hook.instances.entries()).find(([, metadata]) => metadata === __vtAppMetadata)
                if (hook && ownEntry) {
                    hook.unregister(ownEntry[0])
                    this.unregisterResult.value = hook.instances.has(ownEntry[0]) ? "still-present" : "removed"
                }
            }}>unregister self</button>
            <div id="unregister-result">{this.unregisterResult}</div>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<DevtoolsHookTest/>, document.getElementById("main-page"))
