/// <reference lib="deno.ns" />

// Server, Router, Inspector and RequestInspectorResponse are all constructed below, so they are
// value imports; only Context is used purely as a type.
import { Inspector, RequestInspectorResponse, Router, Server } from "@velotype/veloserver"
import type { Context } from "@velotype/veloserver"

/**
 * Closes a test server. Use this rather than `server.close()` in test teardown.
 *
 * `close()` returns before its shutdown callbacks have run, since they fire from a `finished`
 * handler, so a tick here lets them settle before the caller carries on.
 */
export async function closeAppServer(server: Server<ServerContextMetadata>, reason: string): Promise<void> {
    server.close(reason)
    await new Promise((resolve) => setTimeout(resolve, 0))
}

/** Per-request metadata, typed rather than a string-keyed map */
export type ServerContextMetadata = {
    /** Request start time (`performance.now()`), set by the timing inspector below */
    st?: number
}

export async function startAppServer(server_port: number): Promise<Server<ServerContextMetadata>> {
    const router: Router<ServerContextMetadata> = new Router<ServerContextMetadata>({
        context_metadata_constructor: () => ({}),
    })
    router.addAllInspector("", new Inspector<ServerContextMetadata>(
        (request: Request, context: Context<ServerContextMetadata>) => {
            console.log(`START ${request.method} ${request.url}`)
            context.meta.st = performance.now()
            return new RequestInspectorResponse()
        },
        (request: Request, response: Response, context: Context<ServerContextMetadata>) => {
            const startTime = context.meta.st
            if (startTime != undefined) {
                const ms = (performance.now() - startTime).toFixed(2)
                response.headers.set("X-Response-Time", `${ms}ms`);
                console.log(`END ${response.status} ${request.method} ${request.url} ${ms}ms`)
            } else {
                console.error(`END ${response.status} ${request.method} ${request.url} ERROR could not calculate elapsed time`)
            }
        }
    ))
    // TODO calculate dynamically from the test_modules folder
    const setOfModules = ['basic-div','return-types','attrs-types','event-triggers','render-with','raw-tags','render-object',
        'render-object-array','function-components','lifecycle','misc','event-bus','devtools-hook','render-object-advanced']
    // Raw <script> HTML injected before a module's own <script type="module"> tag runs. `type="module"`
    // scripts are deferred, so a plain classic script placed earlier in the document always executes
    // first - used here to seed a fake pre-existing devtools hook instance before Velotype's own
    // installDevtoolsHook() runs, simulating a second Velotype bundle already on the page.
    const extraHeadHtml: Record<string, string> = {
        'devtools-hook': `<script>
window.__VELOTYPE_DEVTOOLS_HOOK__ = {
    instances: new Map([[1, {domKeyName: "vk"}]]),
    register(metadata) { this.instances.set(2, metadata); return 2 },
    unregister(instanceId) { this.instances.delete(instanceId) }
}
</script>`
    }
    setOfModules.forEach((module) => {
        router.get(`/${module}`, function() {
            const response = new Response(`<!DOCTYPE html><html><body>
<div id="main-page"></div>
${extraHeadHtml[module] || ''}
<script src="/build/${module}.js" type="module" ></script>
</body></html>`,{status:200})
            response.headers.set("content-type", "text/html; charset=utf-8")
            return response
        })
    })
    router.get('/', function() {
        const response = new Response(`<!DOCTYPE html><html><body>
${setOfModules.map(module => `<div><a href="/${module}">${module}</a></div>`).join('')}
</body></html>`,{status:200})
        response.headers.set("content-type", "text/html; charset=utf-8")
        return response
    })
    await router.mountFiles("/build/", `${Deno.cwd()}/tests/build/`)
    const app = new Server<ServerContextMetadata>(router)
    const prom = new Promise<Server<ServerContextMetadata>>((resolve) => {
        app.addServerListenCallback(() => {
            resolve(app)
        })
    })
    app.serve('localhost', server_port)
    return prom
}
