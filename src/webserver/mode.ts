const runMode = Deno.env.get("RUN_MODE")
const domainName: string = Deno.env.get("DOMAIN_NAME") || "http://localhost"

console.log(`Running in run mode: ${runMode} on domain: ${domainName}`)

export const Mode: {
    runMode: string | undefined;
    isLocal: boolean | undefined;
    useOptimizations: boolean;
    isProduction: boolean;
    domainName: string;
} = {
    runMode: runMode,
    isLocal: runMode?.startsWith("local"),
    useOptimizations: runMode == "local-optimized",
    isProduction: runMode == "production",
    domainName: domainName
}
