// deno-lint-ignore-file no-explicit-any

// Hot module replacement for development, used only by the jsx-dev-runtime entry point
//
// A development server re-runs changed code (a whole bundle, or single modules), which defines new
// versions of components. Each component's versions are kept in a family: elements are always
// created from the latest version, and live instances of older versions are updated in place.

import { instanceOfComponent, instanceOfInternalComponent, type InternalComponent } from "../tsx/component.ts"
import { createElement } from "../tsx/create-element.ts"
import { getDOMreference } from "../tsx/dom-references.ts"
import { consoleWarn, domKeyProperty, domReferences, styleSectionMounted } from "../tsx/globals.ts"
import { replaceElement, replaceElementWithRoot as coreReplaceElementWithRoot, unmountComponentElement } from "../tsx/mounting.ts"
import { wrapElementIfNeeded } from "../tsx/renderable.ts"
import { setStylesheet as coreSetStylesheet } from "../tsx/stylesheet.ts"
import type { AnchorElement, RenderableElements } from "../tsx/types.ts"

/** The version of the hot API, checked by development servers before they use it */
export const hotApiVersion = 1

/** The query parameter that marks re-run code with its update generation, such as `main.js?vt-hot=3` */
const generationParameter = /[?&]vt-hot=(\d+)/

/** A component version: a class component or a function component */
type ComponentValue = (abstract new (...args: any[]) => any) | ((...args: any[]) => any)

/** A rendered function component output, with the attrs and children it was rendered with */
type FunctionOutput = {element: WeakRef<Element>, attrs: any, children: RenderableElements[]}

/** All of the versions of one component */
type Family = {
    /** The versions of this component, oldest first */
    versions: ComponentValue[]
    /** The update generation of the latest version */
    generation: number
    /** The live outputs of a function component */
    outputs?: Set<FunctionOutput>
}

/** The family of each known component version */
const familyOfValue = new Map<ComponentValue, Family>()
/** The family of each component key (`file#name`) */
const familyOfKey = new Map<string, Family>()
/** Families with a new latest version that has not been applied yet */
const pendingFamilies = new Set<Family>()
/** The current update generation, incremented by beginUpdate() */
let currentGeneration = 0
/** If an update is in progress (between beginUpdate() and endUpdate()) */
let updating = false

/** The URL of this module, to skip its own frames in stack traces */
const ownUrl = import.meta.url.replace(/[?#].*$/, "")

/** Is value a class component or a function component (by the convention of a capitalized name) */
function isComponentValue(value: unknown): value is ComponentValue {
    return typeof value === "function" && (instanceOfComponent(value.prototype) || /^[A-Z]/.test(value.name))
}

/** The update generation of the code that called into this module, from its URL in the stack trace */
function callerGeneration(): number {
    const stack = new Error().stack || ""
    const urls = stack.match(/(?:https?|file|blob):[^\s)]+/g) || []
    for (const url of urls) {
        if (!url.startsWith(ownUrl)) {
            const match = url.match(generationParameter)
            return match ? Number(match[1]) : 0
        }
    }
    return 0
}

/** Add a component version under key, returning its family */
function registerVersion(key: string, value: ComponentValue, generation: number): Family {
    const known = familyOfValue.get(value)
    if (known) {
        if (!familyOfKey.has(key)) {
            familyOfKey.set(key, known)
        }
        return known
    }
    const family = familyOfKey.get(key)
    if (!family || family.generation === generation) {
        // A new component, or a different component of the same name from the same generation
        const newFamily: Family = {versions: [value], generation}
        familyOfValue.set(value, newFamily)
        if (!family) {
            familyOfKey.set(key, newFamily)
        }
        return newFamily
    }
    familyOfValue.set(value, family)
    if (generation > family.generation) {
        family.versions.push(value)
        family.generation = generation
        pendingFamilies.add(family)
        if (!updating) {
            // Found after an update ended, such as a component first rendered later
            queueMicrotask(applyPendingFamilies)
        }
    } else {
        // An older version, rendered for the first time after a newer one
        family.versions.unshift(value)
    }
    return family
}

/** The latest version of a component */
function latestOf(family: Family): ComponentValue {
    return family.versions[family.versions.length - 1]
}

/**
 * The tag that jsxDEV() creates an element from: the latest version of a component, registering it
 * by the file it is used in and its name the first time it is seen
 */
export function hotTag(tag: any, fileName: string | undefined): any {
    if (typeof tag !== "function") {
        return tag
    }
    let family = familyOfValue.get(tag)
    if (!family) {
        const key = (fileName || "") + "#" + tag.name
        // A different value under a known key is a new or old version, told apart by the generation of the calling code
        family = registerVersion(key, tag, familyOfKey.has(key) ? callerGeneration() : currentGeneration)
    }
    return latestOf(family)
}

/** Record a function component's output, so that it can be rendered again when the function changes */
export function trackFunctionOutput(tag: ComponentValue, output: unknown, attrs: any, children: RenderableElements[]): void {
    const family = familyOfValue.get(tag)
    if (family && !instanceOfComponent(tag.prototype) && output instanceof Element) {
        if (!family.outputs) {
            family.outputs = new Set<FunctionOutput>()
        }
        family.outputs.add({element: new WeakRef(output), attrs, children})
    }
}

/** Can the prototype of each older version be replaced with the latest version's (keeping instance state) */
function canPatch(latest: ComponentValue, older: ComponentValue[]): boolean {
    // Methods that use #private names only work on instances constructed by their own class
    if (/#[A-Za-z_$]/.test(Function.prototype.toString.call(latest))) {
        return false
    }
    const latestBase = Object.getPrototypeOf(latest)
    return older.every(version => {
        const base = Object.getPrototypeOf(version)
        // The base class is unchanged, or is another version of the same component
        return base === latestBase || (familyOfValue.get(base) !== undefined && familyOfValue.get(base) === familyOfValue.get(latestBase))
    })
}

/** Replace target's methods and static properties with those of source */
function patchClass(target: ComponentValue, source: ComponentValue): void {
    const targetPrototype = target.prototype
    const sourcePrototype = source.prototype
    for (const key of Reflect.ownKeys(targetPrototype)) {
        if (key !== "constructor" && !Object.prototype.hasOwnProperty.call(sourcePrototype, key)) {
            delete targetPrototype[key]
        }
    }
    for (const key of Reflect.ownKeys(sourcePrototype)) {
        if (key !== "constructor") {
            Object.defineProperty(targetPrototype, key, Object.getOwnPropertyDescriptor(sourcePrototype, key)!)
        }
    }
    for (const key of Reflect.ownKeys(source)) {
        if (key !== "length" && key !== "name" && key !== "prototype") {
            try {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)!)
            } catch {
                // Not configurable
            }
        }
    }
}

/** The InternalComponent whose root element is element, such as a component that renders a function component directly */
function componentWithRoot(element: Element): InternalComponent | undefined {
    const key: number | undefined = (element as any)[domKeyProperty]
    const reference = key ? getDOMreference(key) : undefined
    return reference && instanceOfInternalComponent(reference) && reference.e === element ? reference : undefined
}

/** The result of applying an update */
export type HotUpdateResult = {
    /** Components re-rendered with their state kept */
    refreshed: number
    /** Components replaced with new instances (losing their state) */
    remounted: number
}

/** Update the live instances and outputs of every family with a new latest version */
function applyPendingFamilies(): HotUpdateResult {
    const refresh = new Set<InternalComponent>()
    const remount = new Set<InternalComponent>()
    const replaceOutputs: {family: Family, output: FunctionOutput, element: Element}[] = []
    for (const family of pendingFamilies) {
        const latest = latestOf(family)
        const latestSource = Function.prototype.toString.call(latest)
        // Versions with identical code are unchanged, such as the other components of a re-run bundle
        const changed = family.versions.slice(0, -1).filter(version => Function.prototype.toString.call(version) !== latestSource)
        if (changed.length === 0) {
            continue
        }
        if (instanceOfComponent(latest.prototype)) {
            const patch = canPatch(latest, changed)
            if (patch) {
                changed.forEach(version => patchClass(version, latest))
            }
            domReferences.forEach(reference => {
                if (instanceOfInternalComponent(reference) && reference.e.isConnected && changed.some(version => reference.c instanceof version)) {
                    (patch ? refresh : remount).add(reference)
                }
            })
        } else if (family.outputs) {
            for (const output of family.outputs) {
                const element = output.element.deref()
                if (!element || !element.isConnected) {
                    family.outputs.delete(output)
                    continue
                }
                // An output is replaced in place, so that the components around it keep their state, unless it is
                // a component's root element, which the component renders again
                const owner = componentWithRoot(element)
                if (owner) {
                    refresh.add(owner)
                } else {
                    replaceOutputs.push({family, output, element})
                }
            }
        }
    }
    pendingFamilies.clear()

    // Components inside another updated component are rendered again by it
    const all = [...refresh, ...remount]
    const outermost = (component: InternalComponent) => !all.some(other => other !== component && other.e.contains(component.e))
    let refreshed = 0
    let remounted = 0
    for (const component of refresh) {
        if (outermost(component)) {
            component.f()
            refreshed++
        }
    }
    for (const component of remount) {
        if (outermost(component)) {
            const family = familyOfValue.get(component.c.constructor as ComponentValue)
            const latest = family ? latestOf(family) : component.c.constructor
            replaceElement(component.e, createElement(latest as any, component.a, ...component.h) as AnchorElement, true)
            remounted++
        }
    }
    for (const {family, output, element} of replaceOutputs) {
        if (element.isConnected) {
            const newElement = wrapElementIfNeeded((latestOf(family) as any)(output.attrs, output.children))
            replaceElement(element as AnchorElement, newElement, true)
            family.outputs!.delete(output)
            family.outputs!.add({element: new WeakRef(newElement), attrs: output.attrs, children: output.children})
        }
    }
    return {refreshed, remounted}
}

/** Is every export of a module a component, so that the module can be replaced on its own */
function isComponentModule(moduleExports: Record<string, unknown>): boolean {
    const values = Object.values(moduleExports)
    return values.length > 0 && values.every(isComponentValue)
}

/** Register the component exports of a module (as `url#exportName`), new versions when re-run during an update */
function registerModule(url: string, moduleExports: Record<string, unknown>): void {
    const base = url.replace(/[?#].*$/, "")
    for (const name of Object.keys(moduleExports)) {
        const value = moduleExports[name]
        if (isComponentValue(value)) {
            registerVersion(base + "#" + name, value, currentGeneration)
        }
    }
}

/**
 * Start an update, returning its generation (re-run code is loaded with `?vt-hot=<generation>`)
 *
 * @param generation a generation chosen by the development server, used when it is newer than the current one
 */
function beginUpdate(generation?: number): number {
    updating = true
    currentGeneration = Math.max(currentGeneration + 1, generation || 0)
    return currentGeneration
}

/** Finish an update, applying the new versions found */
function endUpdate(): HotUpdateResult {
    updating = false
    return applyPendingFamilies()
}

/** The hot API, read by development servers from `globalThis.__VELOTYPE_HOT__` */
export type VelotypeHotApi = {
    /** The version of this API */
    readonly version: number
    /** Start an update, returning its generation */
    beginUpdate: (generation?: number) => number
    /** Finish an update, applying the new versions found */
    endUpdate: () => HotUpdateResult
    /** Register the component exports of a module */
    registerModule: (url: string, moduleExports: Record<string, unknown>) => void
    /** Is every export of a module a component */
    isComponentModule: (moduleExports: Record<string, unknown>) => boolean
}

/** Type of `globalThis` with the hot API */
type GlobalThisWithHotApi = typeof globalThis & {
    __VELOTYPE_HOT__?: VelotypeHotApi
}

const hotApi: VelotypeHotApi = {
    version: hotApiVersion,
    beginUpdate,
    endUpdate,
    registerModule,
    isComponentModule,
}

const globalWithHotApi = globalThis as GlobalThisWithHotApi
if (globalWithHotApi.__VELOTYPE_HOT__) {
    consoleWarn("Another Velotype dev runtime is on this page, hot updates use the first one")
} else {
    globalWithHotApi.__VELOTYPE_HOT__ = hotApi
}

/**
 * Append a section of CSS Styles to the page.
 *
 * In development a sheet whose text has changed replaces the mounted sheet, so that re-run code updates its styles
 *
 * @param sheetText The CSS text to inject onto the page.
 * @param sheetKey A unique header, used to detect if this style is already added.
 * @param resetSheet If the Stylesheet should be reset if already set (default: false)
 */
export function setStylesheet(sheetText: string, sheetKey: string, resetSheet: boolean = false): void {
    const mounted = styleSectionMounted.get(sheetKey)
    coreSetStylesheet(sheetText, sheetKey, resetSheet || (mounted !== undefined && mounted.text !== sheetText))
}

/**
 * Replaces an element that is on the document with a rootComponent
 *
 * Returns `rootComponent` if successful (and returns `null` if `element` is `null`)
 *
 * In development, during a hot update the app's entry code runs again: its new root is released
 * instead of mounted, since the live app is updated in place
 */
export function replaceElementWithRoot(rootComponent: AnchorElement, element: HTMLElement | null): AnchorElement | null {
    if (updating) {
        unmountComponentElement(rootComponent)
        return null
    }
    return coreReplaceElementWithRoot(rootComponent, element)
}
