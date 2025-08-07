// deno-lint-ignore-file no-explicit-any

export class Context {
    url: URL
    pathVariables: Map<string,string> | undefined
    metadata: Map<string,any> = new Map<string,any>()
    jsonBody: any | undefined
    constructor(request: Request) {
        this.url = new URL(request.url)
    }
    getPathParts() {
        return (this.url.pathname || "/").split("/")
    }
    addPathVariable(pathVariableName: string, pathVariableValue: string) {
        if (!this.pathVariables) {
            this.pathVariables = new Map<string,string>()
        }
        this.pathVariables.set(pathVariableName, pathVariableValue)
    }
    addMetadata(key: string, data: any) {
        this.metadata.set(key, data)
    }
}
