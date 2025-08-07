// deno-lint-ignore-file no-explicit-any

export class Context {
    url: URL
    pathVariables: Map<string,string> | undefined
    metadata: Map<string,any> = new Map<string,any>()
    jsonBody: any | undefined
    constructor(request: Request) {
        this.url = new URL(request.url)
    }
    getPathParts(): string[] {
        return (this.url.pathname || "/").split("/")
    }
    addPathVariable(pathVariableName: string, pathVariableValue: string): void {
        if (!this.pathVariables) {
            this.pathVariables = new Map<string,string>()
        }
        this.pathVariables.set(pathVariableName, pathVariableValue)
    }
    addMetadata(key: string, data: any): void {
        this.metadata.set(key, data)
    }
}
