import { App, Context, Inspector, RequestInspectorResponse, Router } from "jsr:@velotype/veloserver"

export async function startAppServer(server_port: number): Promise<App> {
    const router: Router = new Router()
    router.addAllInspector("", new Inspector(
        (request: Request, context: Context) => {
            console.log(`START ${request.method} ${request.url}`)
            const startTime = performance.now()
            context.metadata.set("st", startTime)
            return new RequestInspectorResponse(true)
        },
        (request: Request, response: Response, context: Context) => {
            const startTime = context.metadata.get("st")
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
    const setOfModules = ['basic-div','return-types','attrs-types','event-triggers']
    setOfModules.forEach((module) => {
        router.get(`/${module}`, function() {
            const response = new Response(`<!DOCTYPE html><html><body>
<div id="main-page"></div>
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
    const app = new App(router)
    const prom = new Promise<App>((resolve) => {
        app.addServerListenCallback(() => {
            resolve(app)
        })
    })
    app.serve('localhost', server_port)
    return prom
}
