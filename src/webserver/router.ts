// deno-lint-ignore-file no-explicit-any
import {contentType} from "jsr:@std/media-types@^1.0/content-type"
import {eTag} from "jsr:@std/http@^1.0/etag"

import {Context} from "./context.ts"
import {Mode} from "./mode.ts"

/**
 * RequestInspectors return this object
 * 
 * `this.response` is mutually exclusive with `this.shouldContinue`
 * 
 * if `this.response` is set then the Request call chain is ended early
 * and `response` is used to start the Response call chain
 */
export class RequestInspectorResponse {
    /** The Response to use if the call chain should be halted */
    response?: Response = undefined
    /** A boolean to explicitly flag if the call chain should continue */
    shouldContinue: boolean
    /** Create a new RequestInspectorResponse */
    constructor(shouldContinue: boolean, response?: Response) {
        this.shouldContinue = shouldContinue
        this.response = response
    }
}

/** A Request Handler that processes a Request with a given Context */
export type Handler = (request: Request, context: Context) => Response | Promise<Response>

/** A Request Inspector */
export type RequestInspector = (request: Request, context: Context) => RequestInspectorResponse | Promise<RequestInspectorResponse>

/** A Response Inspector */
export type ResponseInspector = (request: Request, response: Response, context: Context) => void | Promise<void>

/** A pair of Request and Response Inspectors (each optional) */
export class Inspector {
    /** A Request Inspector (if set) */
    requestInspector?: RequestInspector
    /** A Response Inspector (if set) */
    responseInspector?: ResponseInspector
    /** Create a new Inspector pair */
    constructor(requestInspector?: RequestInspector | undefined, responseInspector?: ResponseInspector) {
        this.requestInspector = requestInspector
        this.responseInspector = responseInspector
    }
}

class RouteNode {
    pathSegment: string = ""
    isWildcard: boolean = false
    pathVariable: string = ""
    inspectors: Inspector[] = []
    childNodes: RouteNode[] = []
    handler: Handler | undefined = undefined
    setPathSegment(pathSegment: string): void {
        this.pathSegment = pathSegment
    }
    setIsWildcard(isWildcard: boolean, pathVariable?: string): void {
        this.isWildcard = isWildcard
        if (pathVariable) {
            this.pathVariable = pathVariable
        }
    }
    addInspector(inspector: Inspector): void {
        this.inspectors.push(inspector)
    }
    setHandler(handler: Handler): void {
        if (this.handler) {
            console.log("ERROR RouteNode setHandler called twice for the same route",this)
        } else {
            this.handler = handler
        }
    }
    addChildNode(routeNode: RouteNode): void {
        this.childNodes.push(routeNode)
    }
    addPathHandler(pathSegments: string[], handler: Handler): void {
        this.addPathPropertyHelper(pathSegments, (node: RouteNode) => {
            node.setHandler(handler)
        })
    }
    addPathInspector(pathSegments: string[], inspector: Inspector): void {
        this.addPathPropertyHelper(pathSegments, (node: RouteNode) => {
            node.addInspector(inspector)
        })
    }
    addPathPropertyHelper(pathSegments: string[], setClosure: (node: RouteNode) => void): void {
        if (pathSegments.length == 0) {
            setClosure(this)
            return
        }
        const pathSegment = pathSegments[0]
        pathSegments.shift()
        if (pathSegment == "*") {
            if (pathSegments.length > 0) {
                console.log(`ERROR Route validation error, RouteNode with wildcard child has more path segments, pathSegments.length: ${pathSegments.length}`)
            } else {
                const newChild = new RouteNode()
                newChild.setIsWildcard(true, "*")
                setClosure(newChild)
                this.addChildNode(newChild)
            }
        } else if (pathSegment.length > 1 && pathSegment.charAt(0) == ":") {
            const pathVariable = pathSegment.substring(1)
            if (this.childNodes.length > 1) {
                console.log(`ERROR Route validation error, RouteNode with pathVariable child has more than one child, childNodes.length: ${this.childNodes.length}`)
            }
            const child = this.childNodes.find(node => node.isWildcard)
            if (child) {
                if (child.pathVariable != pathVariable) {
                    console.log(`ERROR Route validation error, path variable segments require global consistency current route pathVariable is: ${child.pathVariable} while trying to register: ${pathVariable}`)
                }
                if (pathSegments.length == 0) {
                    setClosure(child)
                } else {
                    child.addPathPropertyHelper(pathSegments, setClosure)
                }
            } else {
                const newChild = new RouteNode()
                newChild.setIsWildcard(true, pathVariable)
                if (pathSegments.length == 0) {
                    setClosure(newChild)
                } else {
                    newChild.addPathPropertyHelper(pathSegments, setClosure)
                }
                this.addChildNode(newChild)
            }
        } else {
            const child = this.childNodes.find(node => node.pathSegment == pathSegment)
            if (child) {
                if (pathSegments.length == 0) {
                    setClosure(child)
                } else {
                    child.addPathPropertyHelper(pathSegments, setClosure)
                }
            } else {
                const newChild = new RouteNode()
                newChild.setPathSegment(pathSegment)
                if (pathSegments.length == 0) {
                    setClosure(newChild)
                } else {
                    newChild.addPathPropertyHelper(pathSegments, setClosure)
                }
                this.addChildNode(newChild)
            }
        }
    }
}

const readTrue = {read: true}
const pathSegmentsFromPath = function(path: string) {
    const pathSegments: string[] = path.split("/")
    pathSegments.shift()
    return pathSegments
}

const processResponseInspectors = async (responseInspectors: ResponseInspector[], request: Request, response: Response | Promise<Response>, context: Context): Promise<Response> => {
    const responseObj: Response = (response instanceof Promise) ? await response : response
    for(const responseInspector of responseInspectors) {
        const responseInspectorResponse = responseInspector(request, responseObj, context)
        if (responseInspectorResponse instanceof Promise) {
            await responseInspectorResponse
        }
    }
    return response
}

const default_not_found_handler = function() {
    const response = new Response("<!DOCTYPE html><html><body>Not Found</body></html>", {status: 404})
    response.headers.set("content-type", "text/html; charset=utf-8")
    return response
}
const default_server_error_handler = function() {
    return new Response("Internal Server Error", {status: 500})
}

/**
 * A Router is an object that handles processing requests and routing them to
 * various handlers and inspectors.
 */
export class Router {
    #get_routes: RouteNode = new RouteNode()
    #head_routes: RouteNode = new RouteNode()
    #post_routes: RouteNode = new RouteNode()
    #not_found_handler: Handler
    #server_error_handler: Handler

    /**
     * Create a new Rounter with optional backup Handlers in case of NotFound and InternalServerError cases
     */
    constructor(not_found_handler: Handler = default_not_found_handler, server_error_handler: Handler = default_server_error_handler) {
        this.#not_found_handler = not_found_handler
        this.#server_error_handler = server_error_handler
    }

    /** Convience method to construct an HTTP 200 JSON encoded response */
    static jsonResponse(data: any): Response {
        const response = new Response(JSON.stringify(data),{status:200})
        response.headers.set("content-type", "text/json; charset=utf-8")
        return response
    }

    /** Add a Handler for an HTTP GET path */
    get(path: string, handler: Handler): void {
        this.#get_routes.addPathHandler(pathSegmentsFromPath(path), handler)
    }
    /** Add a Handler for an HTTP HEAD path */
    head(path: string, handler: Handler): void {
        this.#head_routes.addPathHandler(pathSegmentsFromPath(path), handler)
    }
    /** Add a Handler for an HTTP POST path */
    post(path: string, handler: Handler): void {
        this.#post_routes.addPathHandler(pathSegmentsFromPath(path), handler)
    }
    /** Add an Inspector for an HTTP GET path */
    addGetInspector(path: string, inspector: Inspector): void {
        this.#get_routes.addPathInspector(pathSegmentsFromPath(path), inspector)
    }
    /** Add an Inspector for an HTTP HEAD path */
    addHeadInspector(path: string, inspector: Inspector): void {
        this.#head_routes.addPathInspector(pathSegmentsFromPath(path), inspector)
    }
    /** Add an Inspector for an HTTP POST path */
    addPostInspector(path: string, inspector: Inspector): void {
        this.#post_routes.addPathInspector(pathSegmentsFromPath(path), inspector)
    }
    /** Add an Inspector for a HTTP GET, HEAD, and POST path */
    addAllInspector(path: string, inspector: Inspector): void {
        this.addGetInspector(path,inspector)
        this.addHeadInspector(path,inspector)
        this.addPostInspector(path,inspector)
    }

    /**
     * Process a Request, passed to Deno.serve() by the wrapped App
     */
    processRequest = async (request: Request): Promise<Response> => {
        const context: Context = new Context(request)
        try {
            let nextRouteNode: RouteNode | undefined
            if (request.method == "GET") {
                nextRouteNode = this.#get_routes
            } else if (request.method == "HEAD") {
                nextRouteNode = this.#head_routes
            } else if (request.method == "POST") {
                nextRouteNode = this.#post_routes
            }
            if (!nextRouteNode) {
                // Unsupported method
                console.log(`WARN Called with unsupported method: ${request.method}`)
                return this.#not_found_handler(request,context)
            }
            const pathParts = context.getPathParts()
            pathParts.shift()
            const responseInspectors: ResponseInspector[] = []
            let closestWildcard = undefined
            while(nextRouteNode) {
                // Process inspectors for this node
                for(const inspector of nextRouteNode.inspectors) {
                    if (inspector.requestInspector) {
                        let requestInspectorResponse = inspector.requestInspector(request, context)
                        if (requestInspectorResponse instanceof Promise) {
                            requestInspectorResponse = await requestInspectorResponse
                        }
                        if (requestInspectorResponse.response) {
                            return processResponseInspectors(responseInspectors, request, requestInspectorResponse.response, context)
                        } else if (!requestInspectorResponse.shouldContinue) {
                            console.log(`ERROR Middleware did not provide a response yet shouldContinue was false request pathname: ${context.url.pathname}`)
                            return processResponseInspectors(responseInspectors, request, this.#server_error_handler(request,context), context)
                        }
                    }
                    if (inspector.responseInspector) {
                        responseInspectors.push(inspector.responseInspector)
                    }
                }
                // No more parts, so time to process the route's handler
                if (pathParts.length == 0) {
                    if (nextRouteNode.handler) {
                        return processResponseInspectors(responseInspectors, request, nextRouteNode.handler(request,context), context)
                    }
                    return processResponseInspectors(responseInspectors, request, this.#not_found_handler(request,context), context)
                }
                const pathSegment = pathParts[0]
                pathParts.shift()

                // If there is a splat wildcard child, capture for later
                const wildcardSplitChild = nextRouteNode.childNodes.find(routeNode => (routeNode.isWildcard && routeNode.pathVariable == "*"))
                if (wildcardSplitChild && wildcardSplitChild.handler) {
                    closestWildcard = wildcardSplitChild
                }

                nextRouteNode = nextRouteNode.childNodes.find(routeNode => (routeNode.isWildcard || routeNode.pathSegment == pathSegment))
                if (nextRouteNode && nextRouteNode.isWildcard && nextRouteNode.pathVariable != "*") {
                    context.addPathVariable(nextRouteNode.pathVariable, pathSegment)
                }
            }
            if (closestWildcard && closestWildcard.handler) {
                return processResponseInspectors(responseInspectors, request, closestWildcard.handler(request,context), context)
            }
            return processResponseInspectors(responseInspectors, request, this.#not_found_handler(request,context), context)
        } catch (error) {
            console.log("ERROR", error)
            return this.#server_error_handler(request, context)
        }
    }

    /**
     * Mount a directory of files to a given path (mounts the files on HTTP GET)
     * 
     * This will reread the files from disk on every request
     */
    mountFiles(mountDir: string, targetDir: string): void {
        console.log(`Mounting target dir: ${targetDir} to mount: ${mountDir}`)
        for (const dirEntry of Deno.readDirSync(targetDir)) {
            if (dirEntry.isFile) {
                this.get(mountDir + dirEntry.name, this.#serveFile(targetDir + dirEntry.name))
            } else if (dirEntry.isDirectory) {
                this.mountFiles(mountDir + dirEntry.name + "/", targetDir + dirEntry.name + "/")
            } else if (dirEntry.isSymlink) {
                console.log(`ERROR Attempted to mount a symlink, this is not supported name: ${dirEntry.name}`)
            }
        }
    }
    /**
     * Mount a directory of files to a given path (mounts the files on HTTP GET)
     * 
     * This will preload the files into memory and serve from memory on each request
     */
    async mountMemoizedFiles(mountDir: string, targetDir: string): Promise<void> {
        console.log(`Mounting memoized target dir: ${targetDir} to mount: ${mountDir}`)
        for (const dirEntry of Deno.readDirSync(targetDir)) {
            if (dirEntry.isFile) {
                if (Mode.isLocal) {
                    console.log(`Serving file directly: ${targetDir + dirEntry.name}`)
                    this.get(mountDir + dirEntry.name, this.#serveFile(targetDir + dirEntry.name))
                } else {
                    console.log(`Serving file memoized: ${targetDir + dirEntry.name}`)
                    this.get(mountDir + dirEntry.name, await this.#serveMemoizedFile(targetDir + dirEntry.name))
                }
            } else if (dirEntry.isDirectory) {
                this.mountMemoizedFiles(mountDir + dirEntry.name + "/", targetDir + dirEntry.name + "/")
            } else if (dirEntry.isSymlink) {
                console.log(`ERROR Attempted to mount a symlink, this is not supported name: ${dirEntry.name}`)
            }
        }
    }

    #serveFile(path: string): Handler {
        console.log(`Loaded file path: ${path}`)
        return async (request: Request, context: Context) => {
            const fileInfo = await Deno.stat(path)
            if (fileInfo.isFile) {
                const file = await Deno.open(path, readTrue)
                const response = new Response(file.readable)
                const ext = path.substring(1 + path.lastIndexOf("."))
                response.headers.set("content-type", contentType(ext) || "application/text")
                return response
            } else {
                return this.#not_found_handler(request,context)
            }
        }
    }

    //TODO compress early as part of memoization
    // https://docs.deno.com/runtime/fundamentals/http_server/#automatic-body-compression
    // https://github.com/oakserver/oak/blob/main/send.ts#L167
    //TODO support Cache-Control
    async #serveMemoizedFile(path: string) {
        const fileInfo = Deno.statSync(path)
        if (fileInfo.isFile) {
            const ext = path.substring(1 + path.lastIndexOf("."))
            const contentTypeHeader = contentType(ext) || "application/text"
            const file = Deno.openSync(path, readTrue)
            const buf = new Uint8Array(fileInfo.size)
            const numberOfBytesRead = file.readSync(buf)
            const etag = await eTag(buf)
            console.log(`Loaded memoized file path: ${path} bytes: ${numberOfBytesRead} etag: ${etag}`)
            if (numberOfBytesRead == fileInfo.size) {
                return (request: Request, _context: Context) => {
                    const ifNoneMatch = request.headers.get("if-none-match")
                    if (ifNoneMatch && ifNoneMatch == etag) {
                        const response = new Response(null,{status: 304})
                        response.headers.set("content-type", contentTypeHeader)
                        response.headers.set("etag", etag)
                        return response
                    } else {
                        const response = new Response(buf)
                        response.headers.set("content-type", contentTypeHeader)
                        response.headers.set("etag", etag)
                        return response
                    }
                }
            } else {
                return this.#server_error_handler
            }
        } else {
            console.log(`ERROR failed to load file, is not a file at path: ${path}`)
            return this.#server_error_handler
        }
    }
}
