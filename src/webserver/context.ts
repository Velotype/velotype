// deno-lint-ignore-file no-explicit-any

/**
 * A generic Request Context, used to hold metadata about a request during processing
 */
export class Context {
    /** The original URL of the Request */
    url: URL
    /** Captured path variables (if any) */
    pathVariables: Map<string,string> | undefined
    /** A location to stash generic custom metadata about a request */
    metadata: Map<string,any> = new Map<string,any>()
    /** A location to stash the parsed jsonBody of a Request */
    jsonBody: any | undefined

    /** Create a new Context from a Request */
    constructor(request: Request) {
        this.url = new URL(request.url)
    }
    /**
     * Get the array of path parts
     * 
     * This is the `url.pathname.split("/")`
     */
    getPathParts(): string[] {
        return (this.url.pathname || "/").split("/")
    }
    /** Capture a path variable in the context */
    addPathVariable(pathVariableName: string, pathVariableValue: string): void {
        if (!this.pathVariables) {
            this.pathVariables = new Map<string,string>()
        }
        this.pathVariables.set(pathVariableName, pathVariableValue)
    }
    /** Stash generic metadata in the context */
    addMetadata(key: string, data: any): void {
        this.metadata.set(key, data)
    }
}
