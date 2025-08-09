import {Mode} from "./mode.ts"
import type {Router} from "./router.ts"

/** Used to represent a generic Callback function */
export type Callback = (()=>void) | (()=>Promise<void>)

/**
 * The webserver application process
 */
export class App {
    #router: Router
    #server_listen_callbacks: Callback[] = []
    #server_finished_callbacks: Callback[] = []
    /**
     * Construct a new App to serve all routes contained in the given router
     */
    constructor(router: Router) {
        this.#router = router
    }

    /** Add a callback to be called just after the server starts listening */
    addServerListenCallback(callback: Callback) {
        this.#server_listen_callbacks.push(callback)
    }

    /** Add a callback to be called just after the server has finished */
    addServerFinishedCallback(callback: Callback) {
        this.#server_finished_callbacks.push(callback)
    }

    /** Call Deno.serve() on the given hostname and port */
    serve(hostname: string, port: number) {
        const abortController = new AbortController()
        const server = Deno.serve({
            port: port,
            hostname: hostname,
            handler: this.#router.processRequest,
            signal: abortController.signal,
            onListen: async ({ port, hostname }) => {
                console.log(`Server started at http://${hostname}:${port} on host: ${Deno.hostname()} with run mode: ${Mode.runMode} deno version: ${Deno.version.deno}`)
                for (const callback of this.#server_listen_callbacks) {
                    try {
                        await callback()
                    } catch (e) {
                        console.log("Caught error during onListen while processing ListenCallbacks", e)
                    }
                }
            },
        })
        server.finished.then(async () => {
            console.log("Server closing")
            for (const callback of this.#server_finished_callbacks) {
                try {
                    await callback()
                } catch (e) {
                    console.log("Caught error during closing while processing FinishedCallbacks", e)
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
