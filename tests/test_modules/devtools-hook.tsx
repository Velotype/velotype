import {replaceElementWithRoot, Component, RenderBasic} from "@velotype/velotype"
import {__vtAppMetadata, getDevtoolsHook} from "@velotype/velotype/devtools"
import type {EmptyAttrs} from "@velotype/velotype"

class DevtoolsHookTest extends Component<EmptyAttrs> {
    unregisterResult = new RenderBasic<string>("")

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
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<DevtoolsHookTest/>, document.getElementById("main-page"))
