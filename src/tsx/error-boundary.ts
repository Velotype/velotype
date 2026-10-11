// ErrorBoundary: a Component that renders a fallback when rendering its content throws

import { Component } from "./component.ts"
import { releaseVtKeysFrom } from "./dom-references.ts"
import { vtState } from "./globals.ts"
import type { RenderableElements } from "./types.ts"

/**
 * A Component that renders `renderError()` instead when `renderContent()` throws
 *
 * Catches errors thrown while rendering its content, including by the Components that
 * `renderContent()` creates, both on first render and on `refresh()`. What the failed
 * render created is released.
 *
 * Does not catch errors thrown by its children (they are created by the parent before
 * this Component), by event handlers, or by later updates of RenderObjects.
 *
 * ```tsx
 * class SafePanel extends ErrorBoundary<EmptyAttrs> {
 *     override renderContent() {
 *         return <div><RiskyChart/></div>
 *     }
 *     override renderError(error: unknown) {
 *         return <div>The chart could not be shown</div>
 *     }
 * }
 * ```
 */
export abstract class ErrorBoundary<AttrsType> extends Component<AttrsType> {
    /** Render this Component's content */
    protected abstract renderContent(attrs: Readonly<AttrsType>, children: RenderableElements[]): RenderableElements

    /**
     * Render the fallback shown when `renderContent()` throws
     *
     * An error thrown here is thrown to the code that created or refreshed this Component
     */
    protected abstract renderError(error: unknown, attrs: Readonly<AttrsType>, children: RenderableElements[]): RenderableElements

    /** Renders `renderContent()`, or `renderError()` when it throws */
    protected override render(attrs: Readonly<AttrsType>, children: RenderableElements[]): RenderableElements {
        const firstKey = vtState.k
        try {
            return this.renderContent(attrs, children)
        } catch (error) {
            // Release what the failed render created before rendering the fallback
            releaseVtKeysFrom(firstKey)
            return this.renderError(error, attrs, children)
        }
    }
}
