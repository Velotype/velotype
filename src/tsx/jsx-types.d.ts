// deno-lint-ignore-file no-explicit-any

// Note: this file doesn't actually do anything yet,
// it is a placeholder for when I can figure out how to
// export import JSX.IntrinsicElements

import type {CSSProperties, Component, FunctionComponent} from "./tsx-core.ts"

/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent) */
interface CommandEvent extends Event {
    /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/source) */
    readonly source: Element | null
    /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/command) */
    readonly command: string
}

declare const CommandEvent: {
    prototype: CommandEvent
    new (type: string, eventInitDict?: CommandEventInit): CommandEvent
}

interface CommandEventInit extends EventInit {
    source: Element | null;
    command: string
}

type Booleanish = boolean | 'true' | 'false'

export namespace JSXInternal {
    type TargetedEvent<Target extends EventTarget = EventTarget, TypedEvent extends Event = Event> = Omit<TypedEvent, 'currentTarget'> & {readonly currentTarget: Target}

    type TargetedAnimationEvent<Target extends EventTarget> = TargetedEvent<Target, AnimationEvent>
    type TargetedClipboardEvent<Target extends EventTarget> = TargetedEvent<Target, ClipboardEvent>
    type TargetedCommandEvent<Target extends EventTarget> = TargetedEvent<Target, CommandEvent>
    type TargetedCompositionEvent<Target extends EventTarget> = TargetedEvent<Target, CompositionEvent>
    type TargetedDragEvent<Target extends EventTarget> = TargetedEvent<Target, DragEvent>
    type TargetedFocusEvent<Target extends EventTarget> = TargetedEvent<Target, FocusEvent>
    type TargetedInputEvent<Target extends EventTarget> = TargetedEvent<Target, InputEvent>
    type TargetedKeyboardEvent<Target extends EventTarget> = TargetedEvent<Target, KeyboardEvent>
    type TargetedMouseEvent<Target extends EventTarget> = TargetedEvent<Target, MouseEvent>
    type TargetedPointerEvent<Target extends EventTarget> = TargetedEvent<Target, PointerEvent>
    type TargetedSubmitEvent<Target extends EventTarget> = TargetedEvent<Target, SubmitEvent>
    type TargetedTouchEvent<Target extends EventTarget> = TargetedEvent<Target, TouchEvent>
    type TargetedToggleEvent<Target extends EventTarget> = TargetedEvent<Target, ToggleEvent>
    type TargetedTransitionEvent<Target extends EventTarget> = TargetedEvent<Target, TransitionEvent>
    type TargetedUIEvent<Target extends EventTarget> = TargetedEvent<Target, UIEvent>
    type TargetedWheelEvent<Target extends EventTarget> = TargetedEvent<Target, WheelEvent>
    type TargetedPictureInPictureEvent<Target extends EventTarget> = TargetedEvent<Target, PictureInPictureEvent>

    // XXX TODO - figure out what this bivariance hack is
    /*export type EventHandler<E extends TargetedEvent> = {
        bivarianceHack(event: E): void
    }['bivarianceHack']*/
    type EventHandler<E extends TargetedEvent> = (event: E) => void

    type AnimationEventHandler<Target extends EventTarget> = EventHandler<TargetedAnimationEvent<Target>>
    type ClipboardEventHandler<Target extends EventTarget> = EventHandler<TargetedClipboardEvent<Target>>
    type CommandEventHandler<Target extends EventTarget> = EventHandler<TargetedCommandEvent<Target>>
    type CompositionEventHandler<Target extends EventTarget> = EventHandler<TargetedCompositionEvent<Target>>
    type DragEventHandler<Target extends EventTarget> = EventHandler<TargetedDragEvent<Target>>
    type ToggleEventHandler<Target extends EventTarget> = EventHandler<TargetedToggleEvent<Target>>
    type FocusEventHandler<Target extends EventTarget> = EventHandler<TargetedFocusEvent<Target>>
    type GenericEventHandler<Target extends EventTarget> = EventHandler<TargetedEvent<Target>>
    type InputEventHandler<Target extends EventTarget> = EventHandler<TargetedInputEvent<Target>>
    type KeyboardEventHandler<Target extends EventTarget> = EventHandler<TargetedKeyboardEvent<Target>>
    type MouseEventHandler<Target extends EventTarget> = EventHandler<TargetedMouseEvent<Target>>
    type PointerEventHandler<Target extends EventTarget> = EventHandler<TargetedPointerEvent<Target>>
    type SubmitEventHandler<Target extends EventTarget> = EventHandler<TargetedSubmitEvent<Target>>
    type TouchEventHandler<Target extends EventTarget> = EventHandler<TargetedTouchEvent<Target>>
    type TransitionEventHandler<Target extends EventTarget> = EventHandler<TargetedTransitionEvent<Target>>
    type UIEventHandler<Target extends EventTarget> = EventHandler<TargetedUIEvent<Target>>
    type WheelEventHandler<Target extends EventTarget> = EventHandler<TargetedWheelEvent<Target>>
    type PictureInPictureEventHandler<Target extends EventTarget> = EventHandler<TargetedPictureInPictureEvent<Target>>

    interface DOMAttributes<Target extends EventTarget> {
        // Image Events
        onLoad?: GenericEventHandler<Target>
        onLoadCapture?: GenericEventHandler<Target>
        onError?: GenericEventHandler<Target>
        onErrorCapture?: GenericEventHandler<Target>

        // Clipboard Events
        onCopy?: ClipboardEventHandler<Target>
        onCopyCapture?: ClipboardEventHandler<Target>
        onCut?: ClipboardEventHandler<Target>
        onCutCapture?: ClipboardEventHandler<Target>
        onPaste?: ClipboardEventHandler<Target>
        onPasteCapture?: ClipboardEventHandler<Target>

        // Composition Events
        onCompositionEnd?: CompositionEventHandler<Target>
        onCompositionEndCapture?: CompositionEventHandler<Target>
        onCompositionStart?: CompositionEventHandler<Target>
        onCompositionStartCapture?: CompositionEventHandler<Target>
        onCompositionUpdate?: CompositionEventHandler<Target>
        onCompositionUpdateCapture?: CompositionEventHandler<Target>

        // Popover Events
        onBeforeToggle?: ToggleEventHandler<Target>
        onToggle?: ToggleEventHandler<Target>

        // Dialog Events
        onClose?: GenericEventHandler<Target>
        onCancel?: GenericEventHandler<Target>

        // Focus Events
        onFocus?: FocusEventHandler<Target>
        onFocusCapture?: FocusEventHandler<Target>
        onFocusIn?: FocusEventHandler<Target>
        onFocusInCapture?: FocusEventHandler<Target>
        onFocusOut?: FocusEventHandler<Target>
        onFocusOutCapture?: FocusEventHandler<Target>
        onBlur?: FocusEventHandler<Target>
        onBlurCapture?: FocusEventHandler<Target>

        // Form Events
        onChange?: GenericEventHandler<Target>
        onChangeCapture?: GenericEventHandler<Target>
        onInput?: InputEventHandler<Target>
        onInputCapture?: InputEventHandler<Target>
        onBeforeInput?: InputEventHandler<Target>
        onBeforeInputCapture?: InputEventHandler<Target>
        onSearch?: GenericEventHandler<Target>
        onSearchCapture?: GenericEventHandler<Target>
        onSubmit?: SubmitEventHandler<Target>
        onSubmitCapture?: SubmitEventHandler<Target>
        onInvalid?: GenericEventHandler<Target>
        onInvalidCapture?: GenericEventHandler<Target>
        onReset?: GenericEventHandler<Target>
        onResetCapture?: GenericEventHandler<Target>
        onFormData?: GenericEventHandler<Target>
        onFormDataCapture?: GenericEventHandler<Target>

        // Keyboard Events
        onKeyDown?: KeyboardEventHandler<Target>
        onKeyDownCapture?: KeyboardEventHandler<Target>
        onKeyPress?: KeyboardEventHandler<Target>
        onKeyPressCapture?: KeyboardEventHandler<Target>
        onKeyUp?: KeyboardEventHandler<Target>
        onKeyUpCapture?: KeyboardEventHandler<Target>

        // Media Events
        onAbort?: GenericEventHandler<Target>
        onAbortCapture?: GenericEventHandler<Target>
        onCanPlay?: GenericEventHandler<Target>
        onCanPlayCapture?: GenericEventHandler<Target>
        onCanPlayThrough?: GenericEventHandler<Target>
        onCanPlayThroughCapture?: GenericEventHandler<Target>
        onDurationChange?: GenericEventHandler<Target>
        onDurationChangeCapture?: GenericEventHandler<Target>
        onEmptied?: GenericEventHandler<Target>
        onEmptiedCapture?: GenericEventHandler<Target>
        onEncrypted?: GenericEventHandler<Target>
        onEncryptedCapture?: GenericEventHandler<Target>
        onEnded?: GenericEventHandler<Target>
        onEndedCapture?: GenericEventHandler<Target>
        onLoadedData?: GenericEventHandler<Target>
        onLoadedDataCapture?: GenericEventHandler<Target>
        onLoadedMetadata?: GenericEventHandler<Target>
        onLoadedMetadataCapture?: GenericEventHandler<Target>
        onLoadStart?: GenericEventHandler<Target>
        onLoadStartCapture?: GenericEventHandler<Target>
        onPause?: GenericEventHandler<Target>
        onPauseCapture?: GenericEventHandler<Target>
        onPlay?: GenericEventHandler<Target>
        onPlayCapture?: GenericEventHandler<Target>
        onPlaying?: GenericEventHandler<Target>
        onPlayingCapture?: GenericEventHandler<Target>
        onProgress?: GenericEventHandler<Target>
        onProgressCapture?: GenericEventHandler<Target>
        onRateChange?: GenericEventHandler<Target>
        onRateChangeCapture?: GenericEventHandler<Target>
        onSeeked?: GenericEventHandler<Target>
        onSeekedCapture?: GenericEventHandler<Target>
        onSeeking?: GenericEventHandler<Target>
        onSeekingCapture?: GenericEventHandler<Target>
        onStalled?: GenericEventHandler<Target>
        onStalledCapture?: GenericEventHandler<Target>
        onSuspend?: GenericEventHandler<Target>
        onSuspendCapture?: GenericEventHandler<Target>
        onTimeUpdate?: GenericEventHandler<Target>
        onTimeUpdateCapture?: GenericEventHandler<Target>
        onVolumeChange?: GenericEventHandler<Target>
        onVolumeChangeCapture?: GenericEventHandler<Target>
        onWaiting?: GenericEventHandler<Target>
        onWaitingCapture?: GenericEventHandler<Target>

        // MouseEvents
        onClick?: MouseEventHandler<Target>
        onClickOptions?: boolean | AddEventListenerOptions //TODO add Options to all other on*
        onClickCapture?: MouseEventHandler<Target>
        onContextMenu?: MouseEventHandler<Target>
        onContextMenuCapture?: MouseEventHandler<Target>
        onDblClick?: MouseEventHandler<Target>
        onDblClickCapture?: MouseEventHandler<Target>
        onDrag?: DragEventHandler<Target>
        onDragCapture?: DragEventHandler<Target>
        onDragEnd?: DragEventHandler<Target>
        onDragEndCapture?: DragEventHandler<Target>
        onDragEnter?: DragEventHandler<Target>
        onDragEnterCapture?: DragEventHandler<Target>
        onDragExit?: DragEventHandler<Target>
        onDragExitCapture?: DragEventHandler<Target>
        onDragLeave?: DragEventHandler<Target>
        onDragLeaveCapture?: DragEventHandler<Target>
        onDragOver?: DragEventHandler<Target>
        onDragOverCapture?: DragEventHandler<Target>
        onDragStart?: DragEventHandler<Target>
        onDragStartCapture?: DragEventHandler<Target>
        onDrop?: DragEventHandler<Target>
        onDropCapture?: DragEventHandler<Target>
        onMouseDown?: MouseEventHandler<Target>
        onMouseDownCapture?: MouseEventHandler<Target>
        onMouseEnter?: MouseEventHandler<Target>
        onMouseEnterCapture?: MouseEventHandler<Target>
        onMouseLeave?: MouseEventHandler<Target>
        onMouseLeaveCapture?: MouseEventHandler<Target>
        onMouseMove?: MouseEventHandler<Target>
        onMouseMoveCapture?: MouseEventHandler<Target>
        onMouseOut?: MouseEventHandler<Target>
        onMouseOutCapture?: MouseEventHandler<Target>
        onMouseOver?: MouseEventHandler<Target>
        onMouseOverCapture?: MouseEventHandler<Target>
        onMouseUp?: MouseEventHandler<Target>
        onMouseUpCapture?: MouseEventHandler<Target>
        // TODO: Spec for `auxclick` events was changed to make it a PointerEvent but only
        // Chrome has support for it yet. When more browsers align we should change this.
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event#browser_compatibility
        onAuxClick?: MouseEventHandler<Target>
        onAuxClickCapture?: MouseEventHandler<Target>

        // Selection Events
        onSelect?: GenericEventHandler<Target>
        onSelectCapture?: GenericEventHandler<Target>

        // Touch Events
        onTouchCancel?: TouchEventHandler<Target>
        onTouchCancelCapture?: TouchEventHandler<Target>
        onTouchEnd?: TouchEventHandler<Target>
        onTouchEndCapture?: TouchEventHandler<Target>
        onTouchMove?: TouchEventHandler<Target>
        onTouchMoveCapture?: TouchEventHandler<Target>
        onTouchStart?: TouchEventHandler<Target>
        onTouchStartCapture?: TouchEventHandler<Target>

        // Pointer Events
        onPointerOver?: PointerEventHandler<Target>
        onPointerOverCapture?: PointerEventHandler<Target>
        onPointerEnter?: PointerEventHandler<Target>
        onPointerEnterCapture?: PointerEventHandler<Target>
        onPointerDown?: PointerEventHandler<Target>
        onPointerDownCapture?: PointerEventHandler<Target>
        onPointerMove?: PointerEventHandler<Target>
        onPointerMoveCapture?: PointerEventHandler<Target>
        onPointerUp?: PointerEventHandler<Target>
        onPointerUpCapture?: PointerEventHandler<Target>
        onPointerCancel?: PointerEventHandler<Target>
        onPointerCancelCapture?: PointerEventHandler<Target>
        onPointerOut?: PointerEventHandler<Target>
        onPointerOutCapture?: PointerEventHandler<Target>
        onPointerLeave?: PointerEventHandler<Target>
        onPointerLeaveCapture?: PointerEventHandler<Target>
        onGotPointerCapture?: PointerEventHandler<Target>
        onGotPointerCaptureCapture?: PointerEventHandler<Target>
        onLostPointerCapture?: PointerEventHandler<Target>
        onLostPointerCaptureCapture?: PointerEventHandler<Target>

        // UI Events
        onScroll?: UIEventHandler<Target>
        onScrollEnd?: UIEventHandler<Target>
        onScrollCapture?: UIEventHandler<Target>

        // Wheel Events
        onWheel?: WheelEventHandler<Target>
        onWheelCapture?: WheelEventHandler<Target>

        // Animation Events
        onAnimationStart?: AnimationEventHandler<Target>
        onAnimationStartCapture?: AnimationEventHandler<Target>
        onAnimationEnd?: AnimationEventHandler<Target>
        onAnimationEndCapture?: AnimationEventHandler<Target>
        onAnimationIteration?: AnimationEventHandler<Target>
        onAnimationIterationCapture?: AnimationEventHandler<Target>

        // Transition Events
        onTransitionCancel?: TransitionEventHandler<Target>
        onTransitionCancelCapture?: TransitionEventHandler<Target>
        onTransitionEnd?: TransitionEventHandler<Target>
        onTransitionEndCapture?: TransitionEventHandler<Target>
        onTransitionRun?: TransitionEventHandler<Target>
        onTransitionRunCapture?: TransitionEventHandler<Target>
        onTransitionStart?: TransitionEventHandler<Target>
        onTransitionStartCapture?: TransitionEventHandler<Target>

        // PictureInPicture Events
        onEnterPictureInPicture?: PictureInPictureEventHandler<Target>
        onEnterPictureInPictureCapture?: PictureInPictureEventHandler<Target>
        onLeavePictureInPicture?: PictureInPictureEventHandler<Target>
        onLeavePictureInPictureCapture?: PictureInPictureEventHandler<Target>
        onResize?: PictureInPictureEventHandler<Target>
        onResizeCapture?: PictureInPictureEventHandler<Target>

        onCommand?: CommandEventHandler<Target>
    }

    // All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
    interface AriaAttributes {
        /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
        'aria-activedescendant'?: string
        /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
        'aria-atomic'?: Booleanish
        /**
         * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
         * presented if they are made.
         */
        'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'
        /**
         * Defines a string value that labels the current element, which is intended to be converted into Braille.
         * @see aria-label.
         */
        'aria-braillelabel'?: string
        /**
         * Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille.
         * @see aria-roledescription.
         */
        'aria-brailleroledescription'?: string
        /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
        'aria-busy'?: Booleanish
        /**
         * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
         * @see aria-pressed
         * @see aria-selected.
         */
        'aria-checked'?: Booleanish | 'mixed'
        /**
         * Defines the total number of columns in a table, grid, or treegrid.
         * @see aria-colindex.
         */
        'aria-colcount'?: number
        /**
         * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
         * @see aria-colcount
         * @see aria-colspan.
         */
        'aria-colindex'?: number
        /**
         * Defines a human readable text alternative of aria-colindex.
         * @see aria-rowindextext.
         */
        'aria-colindextext'?: string
        /**
         * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-colindex
         * @see aria-rowspan.
         */
        'aria-colspan'?: number
        /**
         * Identifies the element (or elements) whose contents or presence are controlled by the current element.
         * @see aria-owns.
         */
        'aria-controls'?: string
        /** Indicates the element that represents the current item within a container or set of related elements. */
        'aria-current'?: Booleanish | 'page' | 'step' | 'location' | 'date' | 'time'
        /**
         * Identifies the element (or elements) that describes the object.
         * @see aria-labelledby
         */
        'aria-describedby'?: string
        /**
         * Defines a string value that describes or annotates the current element.
         * @see related aria-describedby.
         */
        'aria-description'?: string
        /**
         * Identifies the element that provides a detailed, extended description for the object.
         * @see aria-describedby.
         */
        'aria-details'?: string
        /**
         * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
         * @see aria-hidden
         * @see aria-readonly.
         */
        'aria-disabled'?: Booleanish
        /**
         * Identifies the element that provides an error message for the object.
         * @see aria-invalid
         * @see aria-describedby.
         */
        'aria-errormessage'?: string
        /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
        'aria-expanded'?: Booleanish
        /**
         * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
         * allows assistive technology to override the general default of reading in document source order.
         */
        'aria-flowto'?: string
        /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
        'aria-haspopup'?: Booleanish | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
        /**
         * Indicates whether the element is exposed to an accessibility API.
         * @see aria-disabled.
         */
        'aria-hidden'?: Booleanish
        /**
         * Indicates the entered value does not conform to the format expected by the application.
         * @see aria-errormessage.
         */
        'aria-invalid'?: Booleanish | 'grammar' | 'spelling'
        /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
        'aria-keyshortcuts'?: string
        /**
         * Defines a string value that labels the current element.
         * @see aria-labelledby.
         */
        'aria-label'?: string
        /**
         * Identifies the element (or elements) that labels the current element.
         * @see aria-describedby.
         */
        'aria-labelledby'?: string
        /** Defines the hierarchical level of an element within a structure. */
        'aria-level'?: number
        /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
        'aria-live'?: 'off' | 'assertive' | 'polite'
        /** Indicates whether an element is modal when displayed. */
        'aria-modal'?: Booleanish
        /** Indicates whether a text box accepts multiple lines of input or only a single line. */
        'aria-multiline'?: Booleanish
        /** Indicates that the user may select more than one item from the current selectable descendants. */
        'aria-multiselectable'?: Booleanish
        /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
        'aria-orientation'?: 'horizontal' | 'vertical'
        /**
         * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
         * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
         * @see aria-controls.
         */
        'aria-owns'?: string
        /**
         * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
         * A hint could be a sample value or a brief description of the expected format.
         */
        'aria-placeholder'?: string
        /**
         * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-setsize.
         */
        'aria-posinset'?: number
        /**
         * Indicates the current "pressed" state of toggle buttons.
         * @see aria-checked
         * @see aria-selected.
         */
        'aria-pressed'?: Booleanish | 'mixed'
        /**
         * Indicates that the element is not editable, but is otherwise operable.
         * @see aria-disabled.
         */
        'aria-readonly'?: Booleanish
        /**
         * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
         * @see aria-atomic.
         */
        'aria-relevant'?: 'additions' | 'additions removals' | 'additions text' | 'all' | 'removals'
            | 'removals additions' | 'removals text' | 'text' | 'text additions' | 'text removals'
        /** Indicates that user input is required on the element before a form may be submitted. */
        'aria-required'?: Booleanish
        /** Defines a human-readable, author-localized description for the role of an element. */
        'aria-roledescription'?: string
        /**
         * Defines the total number of rows in a table, grid, or treegrid.
         * @see aria-rowindex.
         */
        'aria-rowcount'?: number
        /**
         * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
         * @see aria-rowcount
         * @see aria-rowspan.
         */
        'aria-rowindex'?: number
        /**
         * Defines a human readable text alternative of aria-rowindex.
         * @see aria-colindextext.
         */
        'aria-rowindextext'?: string
        /**
         * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-rowindex
         * @see aria-colspan.
         */
        'aria-rowspan'?: number
        /**
         * Indicates the current "selected" state of various widgets.
         * @see aria-checked
         * @see aria-pressed.
         */
        'aria-selected'?: Booleanish
        /**
         * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-posinset.
         */
        'aria-setsize'?: number
        /** Indicates if items in a table or grid are sorted in ascending or descending order. */
        'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other'
        /** Defines the maximum allowed value for a range widget. */
        'aria-valuemax'?: number
        /** Defines the minimum allowed value for a range widget. */
        'aria-valuemin'?: number
        /**
         * Defines the current value for a range widget.
         * @see aria-valuetext.
         */
        'aria-valuenow'?: number
        /** Defines the human readable text alternative of aria-valuenow for a range widget. */
        'aria-valuetext'?: string
    }

    // All the WAI-ARIA 1.2 role attribute values from https://www.w3.org/TR/wai-aria-1.2/#role_definitions
    type WAIAriaRole =
        | 'alert' | 'alertdialog' | 'application' | 'article' | 'banner'
        | 'blockquote' | 'button' | 'caption' | 'cell' | 'checkbox' | 'code'
        | 'columnheader' | 'combobox' | 'command' | 'complementary' | 'composite'
        | 'contentinfo' | 'definition' | 'deletion' | 'dialog' | 'directory' | 'document'
        | 'emphasis' | 'feed' | 'figure' | 'form' | 'grid' | 'gridcell'
        | 'group' | 'heading' | 'img' | 'input' | 'insertion' | 'landmark'
        | 'link' | 'list' | 'listbox' | 'listitem' | 'log' | 'main' | 'marquee' | 'math'
        | 'meter' | 'menu' | 'menubar' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio'
        | 'navigation' | 'none' | 'note' | 'option' | 'paragraph' | 'presentation'
        | 'progressbar' | 'radio' | 'radiogroup' | 'range' | 'region' | 'roletype'
        | 'row' | 'rowgroup' | 'rowheader' | 'scrollbar' | 'search' | 'searchbox'
        | 'section' | 'sectionhead' | 'select' | 'separator' | 'slider' | 'spinbutton'
        | 'status' | 'strong' | 'structure' | 'subscript' | 'superscript' | 'switch'
        | 'tab' | 'table' | 'tablist' | 'tabpanel' | 'term' | 'textbox' | 'time'
        | 'timer' | 'toolbar' | 'tooltip' | 'tree' | 'treegrid' | 'treeitem'
        | 'widget' | 'window' | 'none presentation';

    // All the Digital Publishing WAI-ARIA 1.0 role attribute values from https://www.w3.org/TR/dpub-aria-1.0/#role_definitions
    type DPubAriaRole =
        | 'doc-abstract' | 'doc-acknowledgments' | 'doc-afterword'
        | 'doc-appendix' | 'doc-backlink' | 'doc-biblioentry' | 'doc-bibliography' | 'doc-biblioref' | 'doc-chapter'
        | 'doc-colophon' | 'doc-conclusion' | 'doc-cover' | 'doc-credit' | 'doc-credits' | 'doc-dedication'
        | 'doc-endnote' | 'doc-endnotes' | 'doc-epigraph' | 'doc-epilogue' | 'doc-errata' | 'doc-example'
        | 'doc-footnote' | 'doc-foreword' | 'doc-glossary' | 'doc-glossref' | 'doc-index' | 'doc-introduction'
        | 'doc-noteref' | 'doc-notice' | 'doc-pagebreak' | 'doc-pagelist' | 'doc-part' | 'doc-preface'
        | 'doc-prologue' | 'doc-pullquote' | 'doc-qna' | 'doc-subtitle' | 'doc-tip' | 'doc-toc'

    type AriaRole = WAIAriaRole | DPubAriaRole

    type HTMLAttributeReferrerPolicy =
        | '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin'
        | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'

    // TODO resolve the "deno-lint(ban-types)" error on this line
    // deno-lint-ignore ban-types
    type HTMLAttributeAnchorTarget = '_self' | '_blank' | '_parent' | '_top' | (string & {})

    interface PartialAnchorHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        download?: any
        hreflang?: string
        hrefLang?: string
        media?: string
        ping?: string
        rel?: string
        target?: HTMLAttributeAnchorTarget
        type?: string
        referrerpolicy?: HTMLAttributeReferrerPolicy
        referrerPolicy?: HTMLAttributeReferrerPolicy
    }

    type AnchorAriaRoles =
        | { href: string
            role?: 'link' | 'button' | 'checkbox' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio'
                | 'option' | 'radio' | 'switch' | 'tab' | 'treeitem' | 'doc-backlink'
                | 'doc-biblioref' | 'doc-glossref' | 'doc-noteref' }
        | { href?: never, role?: AriaRole }

    type AnchorHTMLAttributes<T extends EventTarget = HTMLAnchorElement> = Omit<PartialAnchorHTMLAttributes<T>, 'role'> & AnchorAriaRoles

    interface PartialAreaHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        alt?: string
        coords?: string
        download?: any
        hreflang?: string
        hrefLang?: string
        media?: string
        referrerpolicy?: HTMLAttributeReferrerPolicy
        referrerPolicy?: HTMLAttributeReferrerPolicy
        rel?: string
        shape?: string
        target?: HTMLAttributeAnchorTarget
    }

    type AreaAriaRoles =
        | { href: string, role?: 'link' }
        | { href?: never, role?: 'button' | 'link' }

    type AreaHTMLAttributes<T extends EventTarget = HTMLAreaElement> = Omit<PartialAreaHTMLAttributes<T>, 'role'> & AreaAriaRoles;

    interface ArticleHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'article' | 'application' | 'document' | 'feed' | 'main' | 'none' | 'presentation' | 'region'
    }

    interface AsideHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'complementary' | 'feed' | 'none' | 'note' | 'presentation' | 'region' | 'search' | 'doc-dedication'
            | 'doc-example' | 'doc-footnote' | 'doc-glossary' | 'doc-pullquote' | 'doc-tip'
    }

    interface AudioHTMLAttributes<T extends EventTarget = HTMLAudioElement> extends MediaHTMLAttributes<T> {
        role?: 'application'
    }

    interface BaseHTMLAttributes<T extends EventTarget = HTMLBaseElement> extends HTMLAttributes<T> {
        href?: string
        role?: never;
        target?: HTMLAttributeAnchorTarget
    }

    interface BlockquoteHTMLAttributes<T extends EventTarget = HTMLQuoteElement> extends HTMLAttributes<T> {
        cite?: string
    }

    interface BrHTMLAttributes<T extends EventTarget = HTMLBRElement> extends HTMLAttributes<T> {
        role?: 'none' | 'presentation'
    }

    interface ButtonHTMLAttributes<T extends EventTarget = HTMLButtonElement>
        extends HTMLAttributes<T> {
        command?: string
        commandfor?: string
        commandFor?: string
        disabled?: boolean
        form?: string
        formaction?: string
        formAction?: string
        formenctype?: string
        formEncType?: string
        formmethod?: string
        formMethod?: string
        formnovalidate?: boolean
        formNoValidate?: boolean
        formtarget?: string
        formTarget?: string
        name?: string
        popovertarget?: string
        popoverTarget?: string
        popovertargetaction?: 'hide' | 'show' | 'toggle'
        popoverTargetAction?: 'hide' | 'show' | 'toggle'
        role?: 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link' | 'menuitem'
            | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio' | 'separator'
            | 'slider' | 'switch' | 'tab' | 'treeitem'
        type?: 'submit' | 'reset' | 'button'
        value?: string | number
    }

    interface CanvasHTMLAttributes<T extends EventTarget = HTMLCanvasElement> extends HTMLAttributes<T> {
        height?: number | string
        width?: number | string
    }

    interface CaptionHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'caption'
    }

    interface ColHTMLAttributes<T extends EventTarget = HTMLTableColElement> extends HTMLAttributes<T> {
        role?: never
        span?: number
        width?: number | string
    }

    interface ColgroupHTMLAttributes<T extends EventTarget = HTMLTableColElement> extends HTMLAttributes<T> {
        role?: never
        span?: number
    }

    interface DataHTMLAttributes<T extends EventTarget = HTMLDataElement> extends HTMLAttributes<T> {
        value?: string | number
    }

    interface DataListHTMLAttributes<T extends EventTarget = HTMLDataListElement> extends HTMLAttributes<T> {
        role?: 'listbox'
    }

    interface DdHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface DelHTMLAttributes<T extends EventTarget = HTMLModElement> extends HTMLAttributes<T> {
        cite?: string
        datetime?: string
        dateTime?: string
    }

    interface DetailsHTMLAttributes<T extends EventTarget = HTMLDetailsElement> extends HTMLAttributes<T> {
        name?: string
        open?: boolean
        role?: 'group'
    }

    interface DialogHTMLAttributes<T extends EventTarget = HTMLDialogElement> extends HTMLAttributes<T> {
        onCancel?: GenericEventHandler<T>
        onClose?: GenericEventHandler<T>
        open?: boolean
        closedby?: 'none' | 'closerequest' | 'any'
        closedBy?: 'none' | 'closerequest' | 'any'
        role?: 'dialog' | 'alertdialog'
    }

    interface DlHTMLAttributes<T extends EventTarget = HTMLDListElement> extends HTMLAttributes<T> {
        role?: 'group' | 'list' | 'none' | 'presentation'
    }

    interface DtHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'listitem'
    }

    interface EmbedHTMLAttributes<T extends EventTarget = HTMLEmbedElement> extends HTMLAttributes<T> {
        height?: number | string
        role?: 'application' | 'document' | 'img' | 'none' | 'presentation'
        src?: string
        type?: string
        width?: number | string
    }

    interface FieldsetHTMLAttributes<T extends EventTarget = HTMLFieldSetElement> extends HTMLAttributes<T> {
        disabled?: boolean
        form?: string
        name?: string
        role?: 'group' | 'none' | 'presentation' | 'radiogroup'
    }

    interface FigcaptionHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'group' | 'none' | 'presentation'
    }

    interface FooterHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'contentinfo' | 'group' | 'none' | 'presentation' | 'doc-footnote'
    }

    interface FormHTMLAttributes<T extends EventTarget = HTMLFormElement> extends HTMLAttributes<T> {
        'accept-charset'?: string
        acceptCharset?: string
        action?: string
        autocomplete?: string
        autoComplete?: string
        enctype?: string
        encType?: string
        method?: string
        name?: string
        novalidate?: boolean
        noValidate?: boolean
        rel?: string
        role?: 'form' | 'none' | 'presentation' | 'search'
        target?: string
    }

    interface HeadingHTMLAttributes<T extends EventTarget = HTMLHeadingElement> extends HTMLAttributes<T> {
        role?: 'heading' | 'none' | 'presentation' | 'tab' | 'doc-subtitle'
    }

    interface HeadHTMLAttributes<T extends EventTarget = HTMLHeadElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface HeaderHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'banner' | 'group' | 'none' | 'presentation'
    }

    interface HrHTMLAttributes<T extends EventTarget = HTMLHRElement> extends HTMLAttributes<T> {
        role?: 'separator' | 'none' | 'presentation' | 'doc-pagebreak'
    }

    interface HtmlHTMLAttributes<T extends EventTarget = HTMLHtmlElement> extends HTMLAttributes<T> {
        role?: 'document'
    }

    interface IframeHTMLAttributes<T extends EventTarget = HTMLIFrameElement> extends HTMLAttributes<T> {
        allow?: string
        allowFullScreen?: boolean
        allowTransparency?: boolean
        height?: number | string
        loading?: 'eager' | 'lazy'
        name?: string
        referrerpolicy?: HTMLAttributeReferrerPolicy
        referrerPolicy?: HTMLAttributeReferrerPolicy
        role?: 'application' | 'document' | 'img' | 'none' | 'presentation'
        sandbox?: string
        seamless?: boolean
        src?: string
        srcdoc?: string
        srcDoc?: string
        width?: number | string
    }

    type HTMLAttributeCrossOrigin = 'anonymous' | 'use-credentials'

    interface PartialImgHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        crossorigin?: HTMLAttributeCrossOrigin
        crossOrigin?: HTMLAttributeCrossOrigin
        decoding?: 'async' | 'auto' | 'sync'
        fetchpriority?: 'high' | 'auto' | 'low'
        fetchPriority?: 'high' | 'auto' | 'low'
        height?: number | string
        loading?: 'eager' | 'lazy'
        referrerpolicy?: HTMLAttributeReferrerPolicy
        referrerPolicy?: HTMLAttributeReferrerPolicy
        sizes?: string
        src?: string
        srcset?: string
        srcSet?: string
        usemap?: string
        useMap?: string
        width?: number | string
    }

    type ImgAriaRolesAccessibleName = 
        | 'img' | 'button' | 'checkbox' | 'link' | 'menuitem' | 'menuitemcheckbox'
        | 'menuitemradio' | 'meter' | 'option' | 'progressbar' | 'radio' | 'scrollbar'
        | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem' | 'doc-cover'

    type ImgAriaRoles =
        | { 'aria-label': string, role?: ImgAriaRolesAccessibleName }
        | { 'aria-labelledby': string, role?: ImgAriaRolesAccessibleName }
        | { alt: string, role?: ImgAriaRolesAccessibleName }
        | { title: string, role?: ImgAriaRolesAccessibleName }
        | { 'aria-label'?: never, 'aria-labelledby'?: never, alt?: never, title?: never, role?: 'img' | 'none' | 'presentation' }

    type ImgHTMLAttributes<T extends EventTarget = HTMLImageElement> = Omit<
        PartialImgHTMLAttributes<T>,
        'role' | 'aria-label' | 'aria-labelledby' | 'title'
    > & ImgAriaRoles

    type HTMLInputTypeAttribute = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file'
        | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range'
        | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week'

    interface PartialInputHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        accept?: string
        alt?: string
        autocomplete?: string
        autoComplete?: string
        capture?: 'user' | 'environment' // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
        checked?: boolean
        defaultChecked?: boolean
        defaultValue?: string | number
        disabled?: boolean
        enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
        form?: string
        formaction?: string
        formAction?: string
        formenctype?: string
        formEncType?: string
        formmethod?: string
        formMethod?: string
        formnovalidate?: boolean
        formNoValidate?: boolean
        formtarget?: string
        formTarget?: string
        height?: number | string
        indeterminate?: boolean
        max?: number | string
        maxlength?: number
        maxLength?: number
        min?: number | string
        minlength?: number
        minLength?: number
        multiple?: boolean
        name?: string
        pattern?: string
        placeholder?: string
        readonly?: boolean
        readOnly?: boolean
        required?: boolean
        size?: number
        src?: string
        step?: number | string
        value?: string | number
        width?: number | string
        onChange?: GenericEventHandler<T>
    }

    type InputAriaRoles =
        | { type: 'button', role?: 
            | 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link'
            | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio'
            | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem' }
        | { type: 'checkbox', role?: 'checkbox' | 'button' | 'menuitemcheckbox' | 'option' | 'switch' }
        | { type: 'email', list?: never, role?: 'textbox' }
        | { type: 'image', role?: 
            | 'button' | 'checkbox' | 'gridcell' | 'link' | 'menuitem'
            | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'separator' | 'slider'
            | 'switch' | 'tab' | 'treeitem' }
        | { type: 'number', role?: 'spinbutton' }
        | { type: 'radio', role?: 'radio' | 'menuitemradio' }
        | { type: 'range', role?: 'slider' }
        | { type: 'reset', role?: 
            | 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link'
            | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio'
            | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem' }
        | { type: 'search', list?: never, role?: 'searchbox' }
        | { type: 'submit', role?: 
            | 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link'
            | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio'
            | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem' }
        | { type: 'tel', list?: never, role?: 'textbox' }
        | { type?: 'text', list?: never, role?: 'textbox' | 'combobox' | 'searchbox' | 'spinbutton' }
        | { type?: 'text' | 'search' | 'tel' | 'url' | 'email', list?: string, role?: 'combobox' }
        | { type: 'url', list?: never, role?: 'textbox' }
        | { type: 'color' | 'date' | 'datetime-local' | 'file' | 'hidden' | 'month' | 'password' | 'time' | 'week', role?: never }

    type InputHTMLAttributes<T extends EventTarget = HTMLInputElement> = Omit<PartialInputHTMLAttributes<T>, 'role'> & InputAriaRoles

    interface InsHTMLAttributes<T extends EventTarget = HTMLModElement> extends HTMLAttributes<T> {
        cite?: string
        datetime?: string
        dateTime?: string
    }

    interface KeygenHTMLAttributes<T extends EventTarget = HTMLUnknownElement> extends HTMLAttributes<T> {
        challenge?: string
        disabled?: boolean
        form?: string
        keyType?: string
        keyParams?: string
        name?: string
    }

    interface LabelHTMLAttributes<T extends EventTarget = HTMLLabelElement> extends HTMLAttributes<T> {
        for?: string
        form?: string
        htmlFor?: string
        role?: never
    }

    interface LegendHTMLAttributes<T extends EventTarget = HTMLLegendElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface LiHTMLAttributes<T extends EventTarget = HTMLLIElement> extends HTMLAttributes<T> {
        value?: string | number
    }

    interface LinkHTMLAttributes<T extends EventTarget = HTMLLinkElement> extends HTMLAttributes<T> {
        as?: string
        crossorigin?: HTMLAttributeCrossOrigin //XXX TODO check casing here
        crossOrigin?: HTMLAttributeCrossOrigin
        fetchpriority?: 'high' | 'low' | 'auto'
        fetchPriority?: 'high' | 'low' | 'auto'
        href?: string
        hreflang?: string
        hrefLang?: string
        integrity?: string
        media?: string
        imageSrcSet?: string
        referrerpolicy?: HTMLAttributeReferrerPolicy
        referrerPolicy?: HTMLAttributeReferrerPolicy
        rel?: string
        role?: never;
        sizes?: string
        type?: string
        charset?: string
        charSet?: string
    }

    interface MainHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'main'
    }

    interface MapHTMLAttributes<T extends EventTarget = HTMLMapElement> extends HTMLAttributes<T> {
        name?: string
        role?: never
    }

    interface MediaHTMLAttributes<T extends EventTarget = HTMLMediaElement> extends HTMLAttributes<T> {
        autoplay?: boolean
        autoPlay?: boolean //XXX TODO Check casing here
        controls?: boolean
        controlslist?: string
        controlsList?: string
        crossorigin?: HTMLAttributeCrossOrigin
        crossOrigin?: HTMLAttributeCrossOrigin
        currentTime?: number
        defaultMuted?: boolean
        defaultPlaybackRate?: number
        disableremoteplayback?: boolean
        disableRemotePlayback?: boolean
        loop?: boolean
        mediaGroup?: string
        muted?: boolean
        playbackRate?: number
        preload?: 'auto' | 'metadata' | 'none'
        preservesPitch?: boolean
        src?: string
        srcObject?: MediaStream | MediaSource | Blob | File | null
        volume?: string | number
    }

    interface MenuHTMLAttributes<T extends EventTarget = HTMLMenuElement> extends HTMLAttributes<T> {
        role: 'list' | 'group' | 'listbox' | 'menu' | 'menubar' | 'none'
            | 'presentation' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'
        type?: string
    }

    interface MetaHTMLAttributes<T extends EventTarget = HTMLMetaElement> extends HTMLAttributes<T> {
        charset?: string
        charSet?: string
        content?: string
        'http-equiv'?: string
        httpEquiv?: string
        name?: string
        media?: string
        role?: never
    }

    interface MeterHTMLAttributes<T extends EventTarget = HTMLMeterElement> extends HTMLAttributes<T> {
        form?: string
        high?: number
        low?: number
        max?: number | string
        min?: number | string
        optimum?: number
        role?: 'meter'
        value?: string | number
    }

    interface NavHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'navigation' | 'menu' | 'menubar' | 'none' | 'presentation' | 'tablist'
    }

    interface NoScriptHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface ObjectHTMLAttributes<T extends EventTarget = HTMLObjectElement> extends HTMLAttributes<T> {
        classID?: string
        data?: string
        form?: string
        height?: number | string
        name?: string
        role?: 'application' | 'document' | 'img'
        type?: string
        usemap?: string
        useMap?: string
        width?: number | string
        wmode?: string
    }

    interface OlHTMLAttributes<T extends EventTarget = HTMLOListElement> extends HTMLAttributes<T> {
        reversed?: boolean
        role?: 'list' | 'group' | 'listbox' | 'menu' | 'menubar' | 'none'
            | 'presentation' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'
        start?: number
        type?: '1' | 'a' | 'A' | 'i' | 'I'
    }

    interface OptgroupHTMLAttributes<T extends EventTarget = HTMLOptGroupElement> extends HTMLAttributes<T> {
        disabled?: boolean
        label?: string
        role?: 'group'
    }

    interface OptionHTMLAttributes<T extends EventTarget = HTMLOptionElement> extends HTMLAttributes<T> {
        disabled?: boolean
        label?: string
        role?: 'option'
        selected?: boolean
        value?: string | number
    }

    interface OutputHTMLAttributes<T extends EventTarget = HTMLOutputElement> extends HTMLAttributes<T> {
        for?: string
        form?: string
        htmlFor?: string
        name?: string
    }

    interface PictureHTMLAttributes<T extends EventTarget = HTMLPictureElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface ProgressHTMLAttributes<T extends EventTarget = HTMLProgressElement> extends HTMLAttributes<T> {
        max?: number | string
        role?: 'progressbar'
        value?: string | number
    }

    interface QuoteHTMLAttributes<T extends EventTarget = HTMLQuoteElement> extends HTMLAttributes<T> {
        cite?: string
    }

    interface ScriptHTMLAttributes<T extends EventTarget = HTMLScriptElement> extends HTMLAttributes<T> {
        async?: boolean
        crossorigin?: HTMLAttributeCrossOrigin //XXX TODO Check casing here
        crossOrigin?: HTMLAttributeCrossOrigin
        defer?: boolean
        integrity?: string
        nomodule?: boolean
        noModule?: boolean
        referrerpolicy?: HTMLAttributeReferrerPolicy
        referrerPolicy?: HTMLAttributeReferrerPolicy
        role?: never;
        src?: string
        type?: string
    }

    interface SearchHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'search' | 'form' | 'group' | 'none' | 'presentation' | 'region'
    }

    interface PartialSelectHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        autocomplete?: string
        autoComplete?: string // XXX TODO Check casing here
        defaultValue?: string | number
        disabled?: boolean
        form?: string
        name?: string
        required?: boolean
        size?: number
        value?: string | number
        onChange?: GenericEventHandler<T>
    }

    type SelectAriaRoles =
        | {
            multiple?: never;
            // Spec states this branch is limited to "no `multiple` attribute AND no `size` attribute greater than 1".
            // `1` as a default, however, caused some web compat issues and forced Firefox to default to `0` instead.
            size?: 0 | 1 | never
            role?: 'combobox' | 'menu'
        }
        | {
            multiple?: boolean
            size?: number
            role?: 'listbox'
        }

    type SelectHTMLAttributes<T extends EventTarget = HTMLSelectElement> = Omit<PartialSelectHTMLAttributes<T>, 'role'> & SelectAriaRoles

    interface SlotHTMLAttributes<T extends EventTarget = HTMLSlotElement> extends HTMLAttributes<T> {
        name?: string
        role?: never
    }

    interface SourceHTMLAttributes<T extends EventTarget = HTMLSourceElement> extends HTMLAttributes<T> {
        height?: number | string
        media?: string
        role?: never
        sizes?: string
        src?: string
        srcset?: string // XXX TODO Check casing here
        srcSet?: string
        type?: string
        width?: number | string
    }

    interface StyleHTMLAttributes<T extends EventTarget = HTMLStyleElement> extends HTMLAttributes<T> {
        media?: string
        role?: never;
        scoped?: boolean
        type?: string
    }

    interface TableHTMLAttributes<T extends EventTarget = HTMLTableElement> extends HTMLAttributes<T> {
        cellPadding?: string // XXX TODO Check casing here
        cellSpacing?: string
        summary?: string
        width?: number | string
    }

    interface TdHTMLAttributes<T extends EventTarget = HTMLTableCellElement> extends HTMLAttributes<T> {
        align?:  'left' | 'center' | 'right' | 'justify' | 'char'
        colspan?: number // XXX TODO Check casing here
        colSpan?: number
        headers?: string
        rowspan?: number
        rowSpan?: number
        scope?: string
        abbr?: string
        height?: number | string
        width?: number | string
        valign?: 'top' | 'middle' | 'bottom' | 'baseline'
    }

    interface TemplateHTMLAttributes<T extends EventTarget = HTMLTemplateElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface TextareaHTMLAttributes<T extends EventTarget = HTMLTextAreaElement> extends HTMLAttributes<T> {
        autocomplete?: string // XXX TODO Check casing here
        autoComplete?: string
        cols?: number
        defaultValue?: string | number
        dirName?: string
        disabled?: boolean
        form?: string
        maxlength?: number
        maxLength?: number
        minlength?: number
        minLength?: number
        name?: string
        placeholder?: string
        readOnly?: boolean
        required?: boolean
        role?: 'textbox'
        rows?: number
        value?: string | number
        wrap?: string
        onChange?: GenericEventHandler<T>
    }

    interface ThHTMLAttributes<T extends EventTarget = HTMLTableCellElement> extends HTMLAttributes<T> {
        align?:  'left' | 'center' | 'right' | 'justify' | 'char'
        colspan?: number // XXX TODO Check casing here
        colSpan?: number
        headers?: string
        rowspan?: number
        rowSpan?: number
        scope?: string
        abbr?: string
    }

    interface TimeHTMLAttributes<T extends EventTarget = HTMLTimeElement> extends HTMLAttributes<T> {
        datetime?: string // XXX TODO Check casing here
        dateTime?: string
    }

    interface TitleHTMLAttributes<T extends EventTarget = HTMLTitleElement> extends HTMLAttributes<T> {
        role?: never
    }

    interface TrackHTMLAttributes<T extends EventTarget = HTMLTrackElement> extends MediaHTMLAttributes<T> {
        default?: boolean
        kind?: string
        label?: string
        role?: never;
        srclang?: string // XXX TODO Check casing here
        srcLang?: string
    }

    interface UlHTMLAttributes<T extends EventTarget = HTMLUListElement> extends HTMLAttributes<T> {
        role?: 'list' | 'group' | 'listbox' | 'menu' | 'menubar' | 'none'
            | 'presentation' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'
    }

    interface VideoHTMLAttributes<T extends EventTarget = HTMLVideoElement> extends MediaHTMLAttributes<T> {
        disablePictureInPicture?: boolean
        height?: number | string
        playsinline?: boolean // XXX TODO Check casing here
        playsInline?: boolean
        poster?: string
        width?: number | string
        role?: 'application'
    }

    interface WbrHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'none' | 'presentation'
    }

    interface HTMLAttributes<RefType extends EventTarget = EventTarget> extends DOMAttributes<RefType>, AriaAttributes {
        // XXX TODO Check casing here
        // TODO determine the correct capitalization of each of all attributes
        // Standard HTML Attributes
        accesskey?: string
        //accessKey?: string
        autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
        //autoCapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
        autocorrect?: string
        //autoCorrect?: string
        autofocus?: boolean
        //autoFocus?: boolean
        class?: string
        contenteditable?: Booleanish | '' | 'plaintext-only' | 'inherit'
        //contentEditable?: Booleanish | '' | 'plaintext-only' | 'inherit'
        dir?: 'auto' | 'rtl' | 'ltr'
        draggable?: boolean
        enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
        exportparts?: string
        hidden?: boolean | 'hidden' | 'until-found'
        id?: string
        inert?: boolean
        inputmode?: string
        //inputMode?: string
        is?: string
        lang?: string
        nonce?: string
        part?: string
        popover?: 'auto' | 'hint' | 'manual' | boolean
        slot?: string
        spellcheck?: boolean
        style?: CSSProperties | string
        tabindex?: number
        //tabIndex?: number
        title?: string
        translate?: boolean

        // WAI-ARIA Attributes
        // Most elements only allow a subset of roles and so this
        // is overwritten in many of the per-element interfaces
        role?: AriaRole
    }

    /** Types that are allowed as a \<tag/> */
    export type ElementType<C extends Component<any,any>> = keyof IntrinsicElements
        | FunctionComponent<any>
        | C

    /**
     * JSX Return type
     * 
     * Note: This is far from optimal, ideally there would be a way of specifying the return type per \<tag/>
     */
    export type Element = any

    /**
     * IntrinsicElements defines the set of allowed
     * string tags and maps their Attributes' types
     * \<tag {attrs}/>
     */
    export interface IntrinsicElements {
        a: AnchorHTMLAttributes<HTMLAnchorElement>
        abbr: HTMLAttributes<HTMLElement>
        address: HTMLAttributes<HTMLElement>
        area: AreaHTMLAttributes<HTMLAreaElement>
        article: ArticleHTMLAttributes<HTMLElement>
        aside: AsideHTMLAttributes<HTMLElement>
        audio: AudioHTMLAttributes<HTMLAudioElement>
        b: HTMLAttributes<HTMLElement>
        base: BaseHTMLAttributes<HTMLBaseElement>
        bdi: HTMLAttributes<HTMLElement>
        bdo: HTMLAttributes<HTMLElement>
        big: HTMLAttributes<HTMLElement>
        blockquote: BlockquoteHTMLAttributes<HTMLQuoteElement>
        body: HTMLAttributes<HTMLBodyElement>
        br: BrHTMLAttributes<HTMLBRElement>
        button: ButtonHTMLAttributes<HTMLButtonElement>
        canvas: CanvasHTMLAttributes<HTMLCanvasElement>
        caption: CaptionHTMLAttributes<HTMLTableCaptionElement>
        cite: HTMLAttributes<HTMLElement>
        code: HTMLAttributes<HTMLElement>
        col: ColHTMLAttributes<HTMLTableColElement>
        colgroup: ColgroupHTMLAttributes<HTMLTableColElement>
        data: DataHTMLAttributes<HTMLDataElement>
        datalist: DataListHTMLAttributes<HTMLDataListElement>
        dd: DdHTMLAttributes<HTMLElement>
        del: DelHTMLAttributes<HTMLModElement>
        details: DetailsHTMLAttributes<HTMLDetailsElement>
        dfn: HTMLAttributes<HTMLElement>
        dialog: DialogHTMLAttributes<HTMLDialogElement>
        div: HTMLAttributes<HTMLDivElement>
        dl: DlHTMLAttributes<HTMLDListElement>
        dt: DtHTMLAttributes<HTMLElement>
        em: HTMLAttributes<HTMLElement>
        embed: EmbedHTMLAttributes<HTMLEmbedElement>
        fieldset: FieldsetHTMLAttributes<HTMLFieldSetElement>
        figcaption: FigcaptionHTMLAttributes<HTMLElement>
        figure: HTMLAttributes<HTMLElement>
        footer: FooterHTMLAttributes<HTMLElement>
        form: FormHTMLAttributes<HTMLFormElement>
        h1: HeadingHTMLAttributes<HTMLHeadingElement>
        h2: HeadingHTMLAttributes<HTMLHeadingElement>
        h3: HeadingHTMLAttributes<HTMLHeadingElement>
        h4: HeadingHTMLAttributes<HTMLHeadingElement>
        h5: HeadingHTMLAttributes<HTMLHeadingElement>
        h6: HeadingHTMLAttributes<HTMLHeadingElement>
        head: HeadHTMLAttributes<HTMLHeadElement>
        header: HeaderHTMLAttributes<HTMLElement>
        hgroup: HTMLAttributes<HTMLElement>
        hr: HrHTMLAttributes<HTMLHRElement>
        html: HtmlHTMLAttributes<HTMLHtmlElement>
        i: HTMLAttributes<HTMLElement>
        iframe: IframeHTMLAttributes<HTMLIFrameElement>
        img: ImgHTMLAttributes<HTMLImageElement>
        input: InputHTMLAttributes<HTMLInputElement>
        ins: InsHTMLAttributes<HTMLModElement>
        kbd: HTMLAttributes<HTMLElement>
        keygen: KeygenHTMLAttributes<HTMLUnknownElement>
        label: LabelHTMLAttributes<HTMLLabelElement>
        legend: LegendHTMLAttributes<HTMLLegendElement>
        li: LiHTMLAttributes<HTMLLIElement>
        link: LinkHTMLAttributes<HTMLLinkElement>
        main: MainHTMLAttributes<HTMLElement>
        map: MapHTMLAttributes<HTMLMapElement>
        mark: HTMLAttributes<HTMLElement>
        menu: MenuHTMLAttributes<HTMLMenuElement>
        menuitem: HTMLAttributes<HTMLUnknownElement>
        meta: MetaHTMLAttributes<HTMLMetaElement>
        meter: MeterHTMLAttributes<HTMLMeterElement>
        nav: NavHTMLAttributes<HTMLElement>
        noscript: NoScriptHTMLAttributes<HTMLElement>
        object: ObjectHTMLAttributes<HTMLObjectElement>
        ol: OlHTMLAttributes<HTMLOListElement>
        optgroup: OptgroupHTMLAttributes<HTMLOptGroupElement>
        option: OptionHTMLAttributes<HTMLOptionElement>
        output: OutputHTMLAttributes<HTMLOutputElement>
        p: HTMLAttributes<HTMLParagraphElement>
        picture: PictureHTMLAttributes<HTMLPictureElement>
        pre: HTMLAttributes<HTMLPreElement>
        progress: ProgressHTMLAttributes<HTMLProgressElement>
        q: QuoteHTMLAttributes<HTMLQuoteElement>
        rp: HTMLAttributes<HTMLElement>
        rt: HTMLAttributes<HTMLElement>
        ruby: HTMLAttributes<HTMLElement> // XXX TODO ?
        s: HTMLAttributes<HTMLElement>
        samp: HTMLAttributes<HTMLElement>
        script: ScriptHTMLAttributes<HTMLScriptElement>
        search: SearchHTMLAttributes<HTMLElement>
        section: HTMLAttributes<HTMLElement>
        select: SelectHTMLAttributes<HTMLSelectElement>
        slot: SlotHTMLAttributes<HTMLSlotElement>
        small: HTMLAttributes<HTMLElement>
        source: SourceHTMLAttributes<HTMLSourceElement>
        span: HTMLAttributes<HTMLSpanElement>
        strong: HTMLAttributes<HTMLElement>
        style: StyleHTMLAttributes<HTMLStyleElement>
        sub: HTMLAttributes<HTMLElement>
        summary: HTMLAttributes<HTMLElement>
        sup: HTMLAttributes<HTMLElement>
        table: TableHTMLAttributes<HTMLTableElement>
        tbody: HTMLAttributes<HTMLTableSectionElement>
        td: TdHTMLAttributes<HTMLTableCellElement>
        template: TemplateHTMLAttributes<HTMLTemplateElement>
        textarea: TextareaHTMLAttributes<HTMLTextAreaElement>
        tfoot: HTMLAttributes<HTMLTableSectionElement>
        th: ThHTMLAttributes<HTMLTableCellElement>
        thead: HTMLAttributes<HTMLTableSectionElement>
        time: TimeHTMLAttributes<HTMLTimeElement>
        title: TitleHTMLAttributes<HTMLTitleElement>
        tr: HTMLAttributes<HTMLTableRowElement>
        track: TrackHTMLAttributes<HTMLTrackElement>
        u: UlHTMLAttributes<HTMLElement>
        ul: HTMLAttributes<HTMLUListElement>
        var: HTMLAttributes<HTMLElement>
        video: VideoHTMLAttributes<HTMLVideoElement>
        wbr: WbrHTMLAttributes<HTMLElement>
    }
}
