/**
 * Write a new version into each place Velotype records its version
 *
 * Usage: deno task update-version <version>
 */

const version = Deno.args[0]
if (!version || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
    console.error("Usage: deno task update-version <version>  (for example 0.2.2)")
    Deno.exit(1)
}

/** Each file that records the version, and the pattern that finds it */
const locations: Array<{file: URL, pattern: RegExp}> = [
    {file: new URL("../deno.json", import.meta.url), pattern: /^( {2}"version": ")([^"]*)(",)$/m},
    {file: new URL("../src/tsx/globals.ts", import.meta.url), pattern: /^( {4}version: ")([^"]*)(",)$/m},
]

// Check every location before writing any, so that a failure leaves no file updated
const updates = await Promise.all(locations.map(async ({file, pattern}) => {
    const text = await Deno.readTextFile(file)
    const matches = text.match(new RegExp(pattern.source, "gm"))
    if (!matches || matches.length != 1) {
        console.error(`Expected one version in ${file.pathname}, found ${matches ? matches.length : 0}`)
        Deno.exit(1)
    }
    const oldVersion = (text.match(pattern) as RegExpMatchArray)[2]
    return {file, oldVersion, text: text.replace(pattern, `$1${version}$3`)}
}))

for (const {file, oldVersion, text} of updates) {
    await Deno.writeTextFile(file, text)
    console.log(`${file.pathname}: ${oldVersion} -> ${version}`)
}
