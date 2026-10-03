// The devtools hook (for the velodevtools extension)

import { __vtAppMetadata } from "./globals.ts"

/** Per-instance metadata a Velotype instance exposes to the Velotype DevTools browser extension */
export type VelotypeDevtoolsInstanceMetadata = typeof __vtAppMetadata

/**
 * Shape of `globalThis.__VELOTYPE_DEVTOOLS_HOOK__`.
 *
 * Installed by whichever Velotype instance loads first on a page; every Velotype instance
 * (including that first one) then just calls `.register()` to add itself under its own id, so
 * multiple independently-bundled Velotype instances on the same page (e.g. micro-frontends, or
 * version skew across bundles) can coexist without colliding.
 */
export interface VelotypeDevtoolsHook {
    /** All Velotype instances registered on this page, keyed by a hook-assigned instance id */
    instances: Map<number, VelotypeDevtoolsInstanceMetadata>
    /** Register a Velotype instance with the hook, returns its assigned instance id */
    register: (metadata: VelotypeDevtoolsInstanceMetadata) => number
    /** Remove a previously registered instance */
    unregister: (instanceId: number) => void
}

/**
 * Type of `globalThis` augmented with the (possibly not-yet-installed) devtools hook.
 *
 * JSR does not support `declare global` augmentations in published packages (they can affect type
 * checking of other modules), so this is a local intersection type used only to type-check the
 * handful of reads/writes to `globalThis.__VELOTYPE_DEVTOOLS_HOOK__` below - it does not change
 * what any other module sees `globalThis`'s type as.
 */
type GlobalThisWithDevtoolsHook = typeof globalThis & {
    __VELOTYPE_DEVTOOLS_HOOK__?: VelotypeDevtoolsHook
}

/**
 * Get the current value of `globalThis.__VELOTYPE_DEVTOOLS_HOOK__`, typed.
 */
export function getDevtoolsHook(): VelotypeDevtoolsHook | undefined {
    return (globalThis as GlobalThisWithDevtoolsHook).__VELOTYPE_DEVTOOLS_HOOK__
}

/**
 * Install `globalThis.__VELOTYPE_DEVTOOLS_HOOK__` if no other Velotype instance has already
 * installed it on this page, then register this instance's `__vtAppMetadata` with it.
 *
 * Velotype only ever runs in a browser (see `@velotype/velossr` for server-side rendering), so
 * `globalThis` is always the `window` here - no environment check is needed.
 */
function installDevtoolsHook(): void {
    const g = globalThis as GlobalThisWithDevtoolsHook
    if (!g.__VELOTYPE_DEVTOOLS_HOOK__) {
        const instances = new Map<number, VelotypeDevtoolsInstanceMetadata>()
        let nextInstanceId = 1
        g.__VELOTYPE_DEVTOOLS_HOOK__ = {
            instances,
            register(metadata: VelotypeDevtoolsInstanceMetadata): number {
                instances.set(nextInstanceId, metadata)
                return nextInstanceId++
            },
            unregister(instanceId: number): void {
                instances.delete(instanceId)
            }
        }
    }
    g.__VELOTYPE_DEVTOOLS_HOOK__.register(__vtAppMetadata)
}
installDevtoolsHook()
