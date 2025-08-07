import {Mode} from "./mode.ts"
import type {Router} from "./router.ts"

export type Callback = (()=>void) | (()=>Promise<void>)

export class App {
    #router: Router
    #server_finished_callbacks: Callback[] = []
    constructor(router: Router) {
        this.#router = router
    }

    addServerFinishedCallback(callback: Callback) {
        this.#server_finished_callbacks.push(callback)
    }

    serve(hostname: string, port: number) {
        const abortController = new AbortController()
        const server = Deno.serve({
            port: port,
            hostname: hostname,
            handler: this.#router.processRequest,
            signal: abortController.signal,
            onListen: function({ port, hostname }) {
                console.log(`Server started at http://${hostname}:${port} on host: ${Deno.hostname()} with run mode: ${Mode.runMode} deno version: ${Deno.version.deno}`)
            },
        })
        server.finished.then(async () => {
            console.log("Server closing")
            for (const callback of this.#server_finished_callbacks) {
                try {
                    await callback()
                } catch (e) {
                    console.log("Caught error during closing", e)
                }
            }
            console.log("Server closed")
            Deno.exit(0)
        })
        const signals: Deno.Signal[] = ["SIGINT", "SIGTERM", "SIGUSR1"]
        signals.forEach(signal => {
            Deno.addSignalListener(signal,
                function() {
                    console.log(`Received ${signal} signal - Starting shutdown`)
                    abortController.abort(`Received ${signal}`)
                }
            )
        })
    }
}
