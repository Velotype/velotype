// deno-lint-ignore-file no-explicit-any

import type {CSSProperties, ChildrenAttr, Component, FunctionComponent} from "../tsx/tsx-core.ts"
export type {CSSProperties, ChildrenAttr, Component, FunctionComponent}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent */
export interface CommandEvent extends Event {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/source */
    readonly source: Element | null
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/command */
    readonly command: string
}

export declare const CommandEvent: {
    prototype: CommandEvent
    new (type: string, eventInitDict?: CommandEventInit): CommandEvent
}

export interface CommandEventInit extends EventInit {
    source: Element | null;
    command: string
}

/** Either a boolean or a string with `'true' | 'false'` */
export type Booleanish = boolean | "true" | "false"

/**
 * The JSX namespace includes a baseline of HTML types for validating HTML tags and their
 * accepted attributes
 */
export namespace JSXInternal {
    /** A Targeted Event */
    export type TargetedEvent<Target extends EventTarget = EventTarget, TypedEvent extends Event = Event> = Omit<TypedEvent, 'currentTarget'> & {readonly currentTarget: Target}

    /** A targeted event with AnimationEvent event type */
    export type TargetedAnimationEvent<Target extends EventTarget> = TargetedEvent<Target, AnimationEvent>
    /** A targeted event with ClipboardEvent event type */
    export type TargetedClipboardEvent<Target extends EventTarget> = TargetedEvent<Target, ClipboardEvent>
    /** A targeted event with CommandEvent event type */
    export type TargetedCommandEvent<Target extends EventTarget> = TargetedEvent<Target, CommandEvent>
    /** A targeted event with CompositionEvent event type */
    export type TargetedCompositionEvent<Target extends EventTarget> = TargetedEvent<Target, CompositionEvent>
    /** A targeted event with ContentVisibilityAutoStateChangeEvent event type */
    export type TargetedContentVisibilityAutoStateChangeEvent<Target extends EventTarget> = TargetedEvent<Target, ContentVisibilityAutoStateChangeEvent>
    /** A targeted event with DragEvent event type */
    export type TargetedDragEvent<Target extends EventTarget> = TargetedEvent<Target, DragEvent>
    /** A targeted event with FocusEvent event type */
    export type TargetedFocusEvent<Target extends EventTarget> = TargetedEvent<Target, FocusEvent>
    /** A targeted event with InputEvent event type */
    export type TargetedInputEvent<Target extends EventTarget> = TargetedEvent<Target, InputEvent>
    /** A targeted event with KeyboardEvent event type */
    export type TargetedKeyboardEvent<Target extends EventTarget> = TargetedEvent<Target, KeyboardEvent>
    /** A targeted event with MouseEvent event type */
    export type TargetedMouseEvent<Target extends EventTarget> = TargetedEvent<Target, MouseEvent>
    /** A targeted event with PointerEvent event type */
    export type TargetedPointerEvent<Target extends EventTarget> = TargetedEvent<Target, PointerEvent>
    /** A targeted event with SubmitEvent event type */
    export type TargetedSubmitEvent<Target extends EventTarget> = TargetedEvent<Target, SubmitEvent>
    /** A targeted event with TouchEvent event type */
    export type TargetedTouchEvent<Target extends EventTarget> = TargetedEvent<Target, TouchEvent>
    /** A targeted event with ToggleEvent event type */
    export type TargetedToggleEvent<Target extends EventTarget> = TargetedEvent<Target, ToggleEvent>
    /** A targeted event with TransitionEvent event type */
    export type TargetedTransitionEvent<Target extends EventTarget> = TargetedEvent<Target, TransitionEvent>
    /** A targeted event with UIEvent event type */
    export type TargetedUIEvent<Target extends EventTarget> = TargetedEvent<Target, UIEvent>
    /** A targeted event with WheelEvent event type */
    export type TargetedWheelEvent<Target extends EventTarget> = TargetedEvent<Target, WheelEvent>
    /** A targeted event with PictureInPictureEvent event type */
    export type TargetedPictureInPictureEvent<Target extends EventTarget> = TargetedEvent<Target, PictureInPictureEvent>

    /** A pair of an EventHandler and options of `AddEventListenerOptions | boolean` */
    export type EventHandlerOptions<E extends TargetedEvent> = {
        /** The Event handler */
        handler: (event: E) => void,
        /**
         * An options object, if options is a boolean it is the same as `options.capture`
         * 
         * ```ts
         * interface AddEventListenerOptions extends EventListenerOptions {
         *     once?: boolean; // A boolean value indicating that the listener should be invoked at most once after being added. If true, the listener would be automatically removed when invoked. If not specified, defaults to false.
         *     passive?: boolean; // A boolean value that, if true, indicates that the function specified by listener will never call preventDefault(). Reference: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners
         *     signal?: AbortSignal; // An AbortSignal. The listener will be removed when the abort() method of the AbortController which owns the AbortSignal is called.
         *     capture?: boolean; // A boolean value indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
         * }
         * ```
         * 
         * Reference: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
         */
        options: AddEventListenerOptions | boolean
    }
    /** An event handler */
    export type EventHandler<E extends TargetedEvent> = ((event: E) => void) | EventHandlerOptions<E>

    /** An event handler for an AnimationEvent */
    export type AnimationEventHandler<Target extends EventTarget> = EventHandler<TargetedAnimationEvent<Target>>
    /** An event handler for an ClipboardEvent */
    export type ClipboardEventHandler<Target extends EventTarget> = EventHandler<TargetedClipboardEvent<Target>>
    /** An event handler for an CommandEvent */
    export type CommandEventHandler<Target extends EventTarget> = EventHandler<TargetedCommandEvent<Target>>
    /** An event handler for an CompositionEvent */
    export type CompositionEventHandler<Target extends EventTarget> = EventHandler<TargetedCompositionEvent<Target>>
    /** An event handler for an ContentVisibilityAutoStateChangeEvent */
    export type ContentVisibilityAutoStateChangeEventHandler<Target extends EventTarget> = EventHandler<TargetedContentVisibilityAutoStateChangeEvent<Target>>
    /** An event handler for an DragEvent */
    export type DragEventHandler<Target extends EventTarget> = EventHandler<TargetedDragEvent<Target>>
    /** An event handler for an ToggleEvent */
    export type ToggleEventHandler<Target extends EventTarget> = EventHandler<TargetedToggleEvent<Target>>
    /** An event handler for an FocusEvent */
    export type FocusEventHandler<Target extends EventTarget> = EventHandler<TargetedFocusEvent<Target>>
    /** An event handler for a generic event */
    export type GenericEventHandler<Target extends EventTarget> = EventHandler<TargetedEvent<Target>>
    /** An event handler for an InputEvent */
    export type InputEventHandler<Target extends EventTarget> = EventHandler<TargetedInputEvent<Target>>
    /** An event handler for an KeyboardEvent */
    export type KeyboardEventHandler<Target extends EventTarget> = EventHandler<TargetedKeyboardEvent<Target>>
    /** An event handler for an MouseEvent */
    export type MouseEventHandler<Target extends EventTarget> = EventHandler<TargetedMouseEvent<Target>>
    /** An event handler for an PointerEvent */
    export type PointerEventHandler<Target extends EventTarget> = EventHandler<TargetedPointerEvent<Target>>
    /** An event handler for an SubmitEvent */
    export type SubmitEventHandler<Target extends EventTarget> = EventHandler<TargetedSubmitEvent<Target>>
    /** An event handler for an TouchEvent */
    export type TouchEventHandler<Target extends EventTarget> = EventHandler<TargetedTouchEvent<Target>>
    /** An event handler for an TransitionEvent */
    export type TransitionEventHandler<Target extends EventTarget> = EventHandler<TargetedTransitionEvent<Target>>
    /** An event handler for an UIEvent */
    export type UIEventHandler<Target extends EventTarget> = EventHandler<TargetedUIEvent<Target>>
    /** An event handler for an WheelEvent */
    export type WheelEventHandler<Target extends EventTarget> = EventHandler<TargetedWheelEvent<Target>>
    /** An event handler for an PictureInPictureEvent */
    export type PictureInPictureEventHandler<Target extends EventTarget> = EventHandler<TargetedPictureInPictureEvent<Target>>

    /** Collection of the Event handlers supported by HTMLInputElement, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement */
    export interface HTMLInputElementEventHandlers<Target extends HTMLInputElement> extends HTMLElementEventHandlers<Target> {
        /** Handler for onCancel event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/cancel_event */
        onCancel?: GenericEventHandler<Target>
        /** Handler for onInvalid event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event */
        onInvalid?: GenericEventHandler<Target>
        // search is non-standard
        /** Handler for onSelect event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event */
        onSelect?: GenericEventHandler<Target>
        /** Handler for onSelect event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/selectionchange_event */
        onSelectionChange?: GenericEventHandler<Target>
    }

    /** Collection of the Event handlers suppoerted by HTMLFormElement, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement */
    export interface HTMLFormElementEventHandlers<Target extends HTMLFormElement> extends HTMLElementEventHandlers<Target> {
        /** Handler for onFormData event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/formdata_event */
        onFormData?: GenericEventHandler<Target>
        /** Handler for onReset event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event */
        onReset?: GenericEventHandler<Target>
        /** Handler for onSubmit event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event */
        onSubmit?: SubmitEventHandler<Target>
    }

    /** Collection of the Event handlers supported by HTMLDialogElement, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement */
    export interface HTMLDialogElementEventHandlers<Target extends HTMLDialogElement> extends HTMLElementEventHandlers<Target> {
        /** Handler for onCancel event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event */
        onCancel?: GenericEventHandler<Target>
        /** Handler for onClose event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event */
        onClose?: GenericEventHandler<Target>
    }

    /** Collection of the Event handlers supported by HTMLMediaElement, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement */
    export interface HTMLMediaElementEventHandlers<Target extends HTMLMediaElement> extends HTMLElementEventHandlers<Target> {
        /** Handler for onAbort event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event */
        onAbort?: GenericEventHandler<Target>
        /** Handler for onCanPlay event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event */
        onCanPlay?: GenericEventHandler<Target>
        /** Handler for onCanPlayThrough event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event */
        onCanPlayThrough?: GenericEventHandler<Target>
        /** Handler for onDurationChange event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event */
        onDurationChange?: GenericEventHandler<Target>
        /** Handler for onEmptied event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event */
        onEmptied?: GenericEventHandler<Target>
        /** Handler for onEncrypted event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/encrypted_event */
        onEncrypted?: GenericEventHandler<Target>
        /** Handler for onEnded event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event */
        onEnded?: GenericEventHandler<Target>
        /** Handler for onError event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event */
        onError?: GenericEventHandler<Target>
        /** Handler for onLoadedData event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event */
        onLoadedData?: GenericEventHandler<Target>
        /** Handler for onLoadedMetadata event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event */
        onLoadedMetadata?: GenericEventHandler<Target>
        /** Handler for onLoadStart event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event */
        onLoadStart?: GenericEventHandler<Target>
        /** Handler for onPause event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event */
        onPause?: GenericEventHandler<Target>
        /** Handler for onPlay event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event */
        onPlay?: GenericEventHandler<Target>
        /** Handler for onPlaying event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event */
        onPlaying?: GenericEventHandler<Target>
        /** Handler for onProgress event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event */
        onProgress?: GenericEventHandler<Target>
        /** Handler for onRateChange event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event */
        onRateChange?: GenericEventHandler<Target>
        /** Handler for onSeeked event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event */
        onSeeked?: GenericEventHandler<Target>
        /** Handler for onSeeking event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event */
        onSeeking?: GenericEventHandler<Target>
        /** Handler for onStalled event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event */
        onStalled?: GenericEventHandler<Target>
        /** Handler for onSuspend event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event */
        onSuspend?: GenericEventHandler<Target>
        /** Handler for onTimeUpdate event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event */
        onTimeUpdate?: GenericEventHandler<Target>
        /** Handler for onVolumeChange event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event */
        onVolumeChange?: GenericEventHandler<Target>
        /** Handler for onWaiting event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event */
        onWaiting?: GenericEventHandler<Target>
        /** Handler for onVWaitingForKey event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waitingforkey_event */
        onWaitingForKey?: GenericEventHandler<Target>
    }

    /** Collection of the Event handlers supported by HTMLTrackElement, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTrackElement */
    export interface HTMLTrackElementEventHandlers<Target extends HTMLTrackElement> {
        /** Handler for onCueChange event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTrackElement/cuechange_event */
        onCueChange?: GenericEventHandler<Target>
    }

    /** Collection of the Event handlers supported by HTMLVideoElement, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement */
    export interface HTMLVideoElementEventHandlers<Target extends HTMLVideoElement> {
        /** Handler for onEnterPictureInPicture event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/enterpictureinpicture_event */
        onEnterPictureInPicture?: PictureInPictureEventHandler<Target>
        /** Handler for onLeavePictureInPicture event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/leavepictureinpicture_event */
        onLeavePictureInPicture?: PictureInPictureEventHandler<Target>
        /** Handler for onResize event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/resize_event */
        onResize?: PictureInPictureEventHandler<Target>
    }

    /** Collection of the Event handlers supported by HTMLElement, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement */
    export interface HTMLElementEventHandlers<Target extends EventTarget> extends ElementEventHandlers<Target> {
        /** Handler for onBeforeToggle event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforetoggle_event */
        onBeforeToggle?: ToggleEventHandler<Target>
        /** Handler for onChange event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event */
        onChange?: GenericEventHandler<Target>
        /** Handler for onCommand event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/command_event */
        onCommand?: CommandEventHandler<Target>
        /** Handler for onDrag event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event */
        onDrag?: DragEventHandler<Target>
        /** Handler for onDragEnd event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event */
        onDragEnd?: DragEventHandler<Target>
        /** Handler for onDragEnter event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event */
        onDragEnter?: DragEventHandler<Target>
        /** Handler for onDragLeave event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragleave_event */
        onDragLeave?: DragEventHandler<Target>
        /** Handler for onDragOver event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event */
        onDragOver?: DragEventHandler<Target>
        /** Handler for onDragStart event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event */
        onDragStart?: DragEventHandler<Target>
        /** Handler for onDrop event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event */
        onDrop?: DragEventHandler<Target>
        /** Handler for onError event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/error_event */
        onError?: GenericEventHandler<Target>
        /** Handler for onLoad event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/load_event */
        onLoad?: GenericEventHandler<Target>
        /** Handler for onToggle event, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/toggle_event */
        onToggle?: ToggleEventHandler<Target>
    }

    /** Collection of the Event handlers supported by Element, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element */
    export interface ElementEventHandlers<Target extends EventTarget> {
        /** Handler for onAnimationCancel event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event */
        onAnimationCancel?: AnimationEventHandler<Target>
        /** Handler for onAnimationEnd event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event */
        onAnimationEnd?: AnimationEventHandler<Target>
        /** Handler for onAnimationIteration event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event */
        onAnimationIteration?: AnimationEventHandler<Target>
        /** Handler for onAnimationStart event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event */
        onAnimationStart?: AnimationEventHandler<Target>
        /** Handler for onAuxClick event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event */
        onAuxClick?: PointerEventHandler<Target>
        /** Handler for onBeforeInput event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event */
        onBeforeInput?: InputEventHandler<Target>
        /** Handler for onBeforeMatch event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/beforematch_event */
        onBeforeMatch?: GenericEventHandler<Target>
        /** Handler for onBlur event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event */
        onBlur?: FocusEventHandler<Target>
        /** Handler for onClick event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event */
        onClick?: MouseEventHandler<Target>
        /** Handler for onCompositionEnd event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event */
        onCompositionEnd?: CompositionEventHandler<Target>
        /** Handler for onCompositionStart event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event */
        onCompositionStart?: CompositionEventHandler<Target>
        /** Handler for onCompositionUpdate event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event */
        onCompositionUpdate?: CompositionEventHandler<Target>
        /** Handler for onContentVisibilityAutoStateChange event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/contentvisibilityautostatechange_event */
        onContentVisibilityAutoStateChange?: ContentVisibilityAutoStateChangeEventHandler<Target>
        /** Handler for onContextMenu event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event */
        onContextMenu?: MouseEventHandler<Target>
        /** Handler for onCopy event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event */
        onCopy?: ClipboardEventHandler<Target>
        /** Handler for onCut event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event */
        onCut?: ClipboardEventHandler<Target>
        /** Handler for onDblClick event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event */
        onDblClick?: MouseEventHandler<Target>
        // DOMActivate is deprecated
        // DOMMouseScroll is deprecated
        /** Handler for onFocus event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event */
        onFocus?: FocusEventHandler<Target>
        /** Handler for onFocusIn event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/focusin_event */
        onFocusIn?: FocusEventHandler<Target>
        /** Handler for onFocusOut event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/focusout_event */
        onFocusOut?: FocusEventHandler<Target>
        /** Handler for onFullScreenChange event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/fullscreenchange_event */
        onFullScreenChange?: GenericEventHandler<Target>
        /** Handler for onFullScreenError event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/fullscreenerror_event */
        onFullScreenError?: GenericEventHandler<Target>
        // gesturechange is non-standard
        // gestureend is non-standard
        // gesturestart is non-standard
        /** Handler for onGotPointerCapture event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event */
        onGotPointerCapture?: PointerEventHandler<Target>
        /** Handler for onInput event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event */
        onInput?: InputEventHandler<Target>
        /** Handler for onKeyDown event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event */
        onKeyDown?: KeyboardEventHandler<Target>
        // keypress is deprecated
        /** Handler for onKeyUp event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event */
        onKeyUp?: KeyboardEventHandler<Target>
        /** Handler for onLostPointerCapture event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event */
        onLostPointerCapture?: PointerEventHandler<Target>
        /** Handler for onMouseDown event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event */
        onMouseDown?: MouseEventHandler<Target>
        /** Handler for onMouseEnter event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event */
        onMouseEnter?: MouseEventHandler<Target>
        /** Handler for onMouseLeave event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event */
        onMouseLeave?: MouseEventHandler<Target>
        /** Handler for onMouseMove event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event */
        onMouseMove?: MouseEventHandler<Target>
        /** Handler for onMouseOut event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event */
        onMouseOut?: MouseEventHandler<Target>
        /** Handler for onMouseOver event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseover_event */
        onMouseOver?: MouseEventHandler<Target>
        /** Handler for onMouseUp event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event */
        onMouseUp?: MouseEventHandler<Target>
        // mousewheel is deprecated
        // MozMousePixelScroll is deprecated
        /** Handler for onPaste event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event */
        onPaste?: ClipboardEventHandler<Target>
        /** Handler for onPointerCancel event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event */
        onPointerCancel?: PointerEventHandler<Target>
        /** Handler for onPointerDown event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event */
        onPointerDown?: PointerEventHandler<Target>
        /** Handler for onPointerEnter event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event */
        onPointerEnter?: PointerEventHandler<Target>
        /** Handler for onPointerLeave event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event */
        onPointerLeave?: PointerEventHandler<Target>
        /** Handler for onPointerMove event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event */
        onPointerMove?: PointerEventHandler<Target>
        /** Handler for onPointerOut event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event */
        onPointerOut?: PointerEventHandler<Target>
        /** Handler for onPointerOver event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerover_event */
        onPointerOver?: PointerEventHandler<Target>
        /** Handler for onPointerRawUpdate event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerrawupdate_event */
        onPointerRawUpdate?: PointerEventHandler<Target>
        /** Handler for onPointerUp event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event */
        onPointerUp?: PointerEventHandler<Target>
        /** Handler for onScroll event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event */
        onScroll?: UIEventHandler<Target>
        /** Handler for onScrollEnd event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollend_event */
        onScrollEnd?: UIEventHandler<Target>
        // scrollsnapchange is experimental
        // scrollsnapchanging is experimental
        // securitypolicyviolation - "While HTML elements can technically be the target of the securitypolicyviolation event, in reality this event does not fire on them"
        /** Handler for onTouchCancel event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event */
        onTouchCancel?: TouchEventHandler<Target>
        /** Handler for onTouchEnd event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event */
        onTouchEnd?: TouchEventHandler<Target>
        /** Handler for onTouchMove event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event */
        onTouchMove?: TouchEventHandler<Target>
        /** Handler for onTouchStart event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event */
        onTouchStart?: TouchEventHandler<Target>
        /** Handler for onTransitionCancel event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event */
        onTransitionCancel?: TransitionEventHandler<Target>
        /** Handler for onTransitionEnd event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event */
        onTransitionEnd?: TransitionEventHandler<Target>
        /** Handler for onTransitionRun event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event */
        onTransitionRun?: TransitionEventHandler<Target>
        /** Handler for onTransitionStart event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event */
        onTransitionStart?: TransitionEventHandler<Target>
        // webkitmouseforcechanged is non-standard
        // webkitmouseforcedown is non-standard
        // webkitmouseforceup is non-standard
        // webkitmouseforcewillbegin is non-standard
        /** Handler for onWheel event, reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event */
        onWheel?: WheelEventHandler<Target>
    }

    /** All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/ */
    export interface AriaAttributes {
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

    /** WAI-ARIA 1.2 role attribute values from https://www.w3.org/TR/wai-aria-1.2/#role_definitions */
    export type WAIAriaRole =
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

    /** Digital Publishing WAI-ARIA 1.0 role attribute values from https://www.w3.org/TR/dpub-aria-1.0/#role_definitions */
    export type DPubAriaRole =
        | 'doc-abstract' | 'doc-acknowledgments' | 'doc-afterword'
        | 'doc-appendix' | 'doc-backlink' | 'doc-biblioentry' | 'doc-bibliography' | 'doc-biblioref' | 'doc-chapter'
        | 'doc-colophon' | 'doc-conclusion' | 'doc-cover' | 'doc-credit' | 'doc-credits' | 'doc-dedication'
        | 'doc-endnote' | 'doc-endnotes' | 'doc-epigraph' | 'doc-epilogue' | 'doc-errata' | 'doc-example'
        | 'doc-footnote' | 'doc-foreword' | 'doc-glossary' | 'doc-glossref' | 'doc-index' | 'doc-introduction'
        | 'doc-noteref' | 'doc-notice' | 'doc-pagebreak' | 'doc-pagelist' | 'doc-part' | 'doc-preface'
        | 'doc-prologue' | 'doc-pullquote' | 'doc-qna' | 'doc-subtitle' | 'doc-tip' | 'doc-toc'

    export type AriaRole = WAIAriaRole | DPubAriaRole

    export type HTMLAttributeReferrerPolicy =
        | '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin'
        | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'

    // TODO resolve the "deno-lint(ban-types)" error on this line
    // deno-lint-ignore ban-types
    export type HTMLAttributeAnchorTarget = '_self' | '_blank' | '_parent' | '_top' | (string & {})

    /** Partial set of attributions for HTMLAnchorElement (to be combined with AnchorAriaRoles) */
    export interface PartialAnchorHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        download?: any
        hreflang?: string
        media?: string
        ping?: string
        rel?: string
        target?: HTMLAttributeAnchorTarget
        type?: string
        referrerpolicy?: HTMLAttributeReferrerPolicy
    }

    /** Valid aria combinations for HTMLAnchorElement */
    export type AnchorAriaRoles =
        | { href: string
            role?: 'link' | 'button' | 'checkbox' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio'
                | 'option' | 'radio' | 'switch' | 'tab' | 'treeitem' | 'doc-backlink'
                | 'doc-biblioref' | 'doc-glossref' | 'doc-noteref' }
        | { href?: never, role?: AriaRole }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#attributes */
    export type AnchorHTMLAttributes<T extends EventTarget = HTMLAnchorElement> = Omit<PartialAnchorHTMLAttributes<T>, 'role'> & AnchorAriaRoles

    /** Partial set of attributions for HTMLAreaElement (to be combined with AreaAriaRoles) */
    export interface PartialAreaHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        alt?: string
        coords?: string
        download?: any
        hreflang?: string
        media?: string
        referrerpolicy?: HTMLAttributeReferrerPolicy
        rel?: string
        shape?: string
        target?: HTMLAttributeAnchorTarget
    }

    /** Valid aria combinations for HTMLAreaElement */
    export type AreaAriaRoles =
        | { href: string, role?: 'link' }
        | { href?: never, role?: 'button' | 'link' }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area#attributes */
    export type AreaHTMLAttributes<T extends EventTarget = HTMLAreaElement> = Omit<PartialAreaHTMLAttributes<T>, 'role'> & AreaAriaRoles;

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/article#attributes */
    export interface ArticleHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'article' | 'application' | 'document' | 'feed' | 'main' | 'none' | 'presentation' | 'region'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/aside#attributes */
    export interface AsideHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'complementary' | 'feed' | 'none' | 'note' | 'presentation' | 'region' | 'search' | 'doc-dedication'
            | 'doc-example' | 'doc-footnote' | 'doc-glossary' | 'doc-pullquote' | 'doc-tip'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/audio#attributes */
    export interface AudioHTMLAttributes<T extends HTMLAudioElement = HTMLAudioElement> extends MediaHTMLAttributes<T> {
        role?: 'application'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/base#attributes */
    export interface BaseHTMLAttributes<T extends EventTarget = HTMLBaseElement> extends HTMLAttributes<T> {
        href?: string
        role?: never;
        target?: HTMLAttributeAnchorTarget
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/blockquote#attributes */
    export interface BlockquoteHTMLAttributes<T extends EventTarget = HTMLQuoteElement> extends HTMLAttributes<T> {
        cite?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/br#attributes */
    export interface BrHTMLAttributes<T extends EventTarget = HTMLBRElement> extends HTMLAttributes<T> {
        role?: 'none' | 'presentation'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#attributes */
    export interface ButtonHTMLAttributes<T extends EventTarget = HTMLButtonElement> extends HTMLAttributes<T> {
        command?: string
        commandfor?: string
        disabled?: boolean
        form?: string
        formaction?: string
        formenctype?: string
        formmethod?: string
        formnovalidate?: boolean
        formtarget?: string
        name?: string
        popovertarget?: string
        popovertargetaction?: 'hide' | 'show' | 'toggle'
        role?: 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link' | 'menuitem'
            | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio' | 'separator'
            | 'slider' | 'switch' | 'tab' | 'treeitem'
        type?: 'submit' | 'reset' | 'button'
        value?: string | number
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas#attributes */
    export interface CanvasHTMLAttributes<T extends EventTarget = HTMLCanvasElement> extends HTMLAttributes<T> {
        height?: number | string
        width?: number | string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/caption#attributes */
    export interface CaptionHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'caption'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/col#attributes */
    export interface ColHTMLAttributes<T extends EventTarget = HTMLTableColElement> extends HTMLAttributes<T> {
        role?: never
        span?: number
        width?: number | string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/colgroup#attributes */
    export interface ColgroupHTMLAttributes<T extends EventTarget = HTMLTableColElement> extends HTMLAttributes<T> {
        role?: never
        span?: number
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/data#attributes */
    export interface DataHTMLAttributes<T extends EventTarget = HTMLDataElement> extends HTMLAttributes<T> {
        value?: string | number
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist#attributes */
    export interface DataListHTMLAttributes<T extends EventTarget = HTMLDataListElement> extends HTMLAttributes<T> {
        role?: 'listbox'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dd#attributes */
    export interface DdHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: never
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/del#attributes */
    export interface DelHTMLAttributes<T extends EventTarget = HTMLModElement> extends HTMLAttributes<T> {
        cite?: string
        datetime?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#attributes */
    export interface DetailsHTMLAttributes<T extends EventTarget = HTMLDetailsElement> extends HTMLAttributes<T> {
        name?: string
        open?: boolean
        role?: 'group'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#attributes */
    export interface DialogHTMLAttributes<T extends HTMLDialogElement = HTMLDialogElement> extends HTMLAttributes<T>, HTMLDialogElementEventHandlers<T> {
        /** Do not add the tabindex property to the <dialog> element as it is not interactive and does not receive focus. */
        tabindex?: never
        open?: boolean
        closedby?: 'none' | 'closerequest' | 'any'
        role?: 'dialog' | 'alertdialog'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl#attributes */
    export interface DlHTMLAttributes<T extends EventTarget = HTMLDListElement> extends HTMLAttributes<T> {
        role?: 'group' | 'list' | 'none' | 'presentation'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dt#attributes */
    export interface DtHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'listitem'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/embed#attributes */
    export interface EmbedHTMLAttributes<T extends EventTarget = HTMLEmbedElement> extends HTMLAttributes<T> {
        height?: number | string
        role?: 'application' | 'document' | 'img' | 'none' | 'presentation'
        src?: string
        type?: string
        width?: number | string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset#attributes */
    export interface FieldsetHTMLAttributes<T extends EventTarget = HTMLFieldSetElement> extends HTMLAttributes<T> {
        disabled?: boolean
        form?: string
        name?: string
        role?: 'group' | 'none' | 'presentation' | 'radiogroup'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figcaption#attributes */
    export interface FigcaptionHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'group' | 'none' | 'presentation'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/footer#attributes */
    export interface FooterHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'contentinfo' | 'group' | 'none' | 'presentation' | 'doc-footnote'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#attributes */
    export interface FormHTMLAttributes<T extends HTMLFormElement = HTMLFormElement> extends HTMLAttributes<T>, HTMLFormElementEventHandlers<T> {
        'accept-charset'?: string
        action?: string
        autocomplete?: string
        enctype?: string
        method?: string
        name?: string
        novalidate?: boolean
        rel?: string
        role?: 'form' | 'none' | 'presentation' | 'search'
        target?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
    export interface HeadingHTMLAttributes<T extends EventTarget = HTMLHeadingElement> extends HTMLAttributes<T> {
        role?: 'heading' | 'none' | 'presentation' | 'tab' | 'doc-subtitle'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/head#attributes */
    export interface HeadHTMLAttributes<T extends EventTarget = HTMLHeadElement> extends HTMLAttributes<T> {
        role?: never
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/header#attributes */
    export interface HeaderHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'banner' | 'group' | 'none' | 'presentation'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr#attributes */
    export interface HrHTMLAttributes<T extends EventTarget = HTMLHRElement> extends HTMLAttributes<T> {
        role?: 'separator' | 'none' | 'presentation' | 'doc-pagebreak'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/html#attributes */
    export interface HtmlHTMLAttributes<T extends EventTarget = HTMLHtmlElement> extends HTMLAttributes<T> {
        role?: 'document'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#attributes */
    export interface IframeHTMLAttributes<T extends EventTarget = HTMLIFrameElement> extends HTMLAttributes<T> {
        allow?: string
        allowfullscreen?: boolean
        allowtransparency?: boolean
        height?: number | string
        loading?: 'eager' | 'lazy'
        name?: string
        referrerpolicy?: HTMLAttributeReferrerPolicy
        role?: 'application' | 'document' | 'img' | 'none' | 'presentation'
        sandbox?: string
        seamless?: boolean
        src?: string
        srcdoc?: string
        width?: number | string
    }

    export type HTMLAttributeCrossOrigin = 'anonymous' | 'use-credentials'

    /** Partial set of attributions for HTMLImageElement (to be combined with ImgAriaRoles) */
    export interface PartialImgHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        crossorigin?: HTMLAttributeCrossOrigin
        decoding?: 'async' | 'auto' | 'sync'
        fetchpriority?: 'high' | 'auto' | 'low'
        height?: number | string
        loading?: 'eager' | 'lazy'
        referrerpolicy?: HTMLAttributeReferrerPolicy
        sizes?: string
        src?: string
        srcset?: string
        usemap?: string
        width?: number | string
    }

    /** Valid aria roles for HTMLImageElement */
    export type ImgAriaRolesAccessibleName = 
        | 'img' | 'button' | 'checkbox' | 'link' | 'menuitem' | 'menuitemcheckbox'
        | 'menuitemradio' | 'meter' | 'option' | 'progressbar' | 'radio' | 'scrollbar'
        | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem' | 'doc-cover'

    /** Valid aria combinations for HTMLImageElement */
    export type ImgAriaRoles =
        | { 'aria-label': string, role?: ImgAriaRolesAccessibleName }
        | { 'aria-labelledby': string, role?: ImgAriaRolesAccessibleName }
        | { alt: string, role?: ImgAriaRolesAccessibleName }
        | { title: string, role?: ImgAriaRolesAccessibleName }
        | { 'aria-label'?: never, 'aria-labelledby'?: never, alt?: never, title?: never, role?: 'img' | 'none' | 'presentation' }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#attributes */
    export type ImgHTMLAttributes<T extends EventTarget = HTMLImageElement> = Omit<
        PartialImgHTMLAttributes<T>,
        'role' | 'aria-label' | 'aria-labelledby' | 'title'
    > & ImgAriaRoles

    /** Partial set of attributions for HTMLInputElement (to be combined with InputAriaRoles) */
    export interface PartialInputHTMLAttributes<T extends HTMLInputElement> extends HTMLAttributes<T>, HTMLInputElementEventHandlers<T> {
        accept?: string
        alt?: string
        autocomplete?: string
        /** https://www.w3.org/TR/html-media-capture/#the-capture-attribute */
        capture?: 'user' | 'environment'
        checked?: boolean
        defaultchecked?: boolean
        defaultvalue?: string | number
        disabled?: boolean
        enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
        form?: string
        formaction?: string
        formenctype?: string
        formmethod?: string
        formnovalidate?: boolean
        formtarget?: string
        height?: number | string
        indeterminate?: boolean
        max?: number | string
        maxlength?: number
        min?: number | string
        minlength?: number
        multiple?: boolean
        name?: string
        pattern?: string
        placeholder?: string
        readonly?: boolean
        required?: boolean
        size?: number
        src?: string
        step?: number | string
        value?: string | number
        width?: number | string
    }

    /** Valid aria type + role combinations for HTMLInputElement */
    export type InputAriaRoles =
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

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#attributes */
    export type InputHTMLAttributes<T extends HTMLInputElement = HTMLInputElement> = PartialInputHTMLAttributes<T> & InputAriaRoles

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ins#attributes */
    export interface InsHTMLAttributes<T extends EventTarget = HTMLModElement> extends HTMLAttributes<T> {
        cite?: string
        datetime?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label#attributes */
    export interface LabelHTMLAttributes<T extends EventTarget = HTMLLabelElement> extends HTMLAttributes<T> {
        for?: string
        form?: string
        htmlfor?: string
        role?: never
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/legend#attributes */
    export interface LegendHTMLAttributes<T extends EventTarget = HTMLLegendElement> extends HTMLAttributes<T> {
        role?: never
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/li#attributes */
    export interface LiHTMLAttributes<T extends EventTarget = HTMLLIElement> extends HTMLAttributes<T> {
        value?: string | number
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#attributes */
    export interface LinkHTMLAttributes<T extends EventTarget = HTMLLinkElement> extends HTMLAttributes<T> {
        as?: string
        crossorigin?: HTMLAttributeCrossOrigin
        fetchpriority?: 'high' | 'low' | 'auto'
        href?: string
        hreflang?: string
        integrity?: string
        media?: string
        imagesrcset?: string
        referrerpolicy?: HTMLAttributeReferrerPolicy
        rel?: string
        role?: never;
        sizes?: string
        type?: string
        charset?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/main#attributes */
    export interface MainHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'main'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/map#attributes */
    export interface MapHTMLAttributes<T extends EventTarget = HTMLMapElement> extends HTMLAttributes<T> {
        name?: string
        role?: never
    }

    /** Common attributes for HTMLMediaElements, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement */
    export interface MediaHTMLAttributes<T extends HTMLMediaElement = HTMLMediaElement> extends HTMLAttributes<T>, HTMLMediaElementEventHandlers<T> {
        autoplay?: boolean
        controls?: boolean
        controlslist?: string
        crossorigin?: HTMLAttributeCrossOrigin
        currenttime?: number
        defaultmuted?: boolean
        defaultplaybackrate?: number
        disableremoteplayback?: boolean
        loop?: boolean
        mediagroup?: string
        muted?: boolean
        playbackrate?: number
        preload?: 'auto' | 'metadata' | 'none'
        preservespitch?: boolean
        src?: string
        srcobject?: MediaStream | MediaSource | Blob | File | null
        volume?: string | number
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/menu#attributes */
    export interface MenuHTMLAttributes<T extends EventTarget = HTMLMenuElement> extends HTMLAttributes<T> {
        role: 'list' | 'group' | 'listbox' | 'menu' | 'menubar' | 'none'
            | 'presentation' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'
        type?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta#attributes */
    export interface MetaHTMLAttributes<T extends EventTarget = HTMLMetaElement> extends HTMLAttributes<T> {
        charset?: string
        content?: string
        'http-equiv'?: string
        httpEquiv?: string
        name?: string
        media?: string
        role?: never
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#attributes */
    export interface MeterHTMLAttributes<T extends EventTarget = HTMLMeterElement> extends HTMLAttributes<T> {
        form?: string
        high?: number
        low?: number
        max?: number | string
        min?: number | string
        optimum?: number
        role?: 'meter'
        value?: string | number
    }

    /** https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/nav#attributes */
    export interface NavHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'navigation' | 'menu' | 'menubar' | 'none' | 'presentation' | 'tablist'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/noscript#attributes */
    export interface NoScriptHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: never
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/object#attributes */
    export interface ObjectHTMLAttributes<T extends EventTarget = HTMLObjectElement> extends HTMLAttributes<T> {
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

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ol#attributes */
    export interface OlHTMLAttributes<T extends EventTarget = HTMLOListElement> extends HTMLAttributes<T> {
        reversed?: boolean
        role?: 'list' | 'group' | 'listbox' | 'menu' | 'menubar' | 'none'
            | 'presentation' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'
        start?: number
        type?: '1' | 'a' | 'A' | 'i' | 'I'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/optgroup#attributes */
    export interface OptgroupHTMLAttributes<T extends EventTarget = HTMLOptGroupElement> extends HTMLAttributes<T> {
        disabled?: boolean
        label?: string
        role?: 'group'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/option#attributes */
    export interface OptionHTMLAttributes<T extends EventTarget = HTMLOptionElement> extends HTMLAttributes<T> {
        disabled?: boolean
        label?: string
        role?: 'option'
        selected?: boolean
        value?: string | number
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output#attributes */
    export interface OutputHTMLAttributes<T extends EventTarget = HTMLOutputElement> extends HTMLAttributes<T> {
        for?: string
        form?: string
        htmlFor?: string
        name?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture#attributes */
    export interface PictureHTMLAttributes<T extends EventTarget = HTMLPictureElement> extends HTMLAttributes<T> {
        role?: never
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress#attributes */
    export interface ProgressHTMLAttributes<T extends EventTarget = HTMLProgressElement> extends HTMLAttributes<T> {
        max?: number | string
        role?: 'progressbar'
        value?: string | number
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/q#attributes */
    export interface QuoteHTMLAttributes<T extends EventTarget = HTMLQuoteElement> extends HTMLAttributes<T> {
        cite?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#attributes */
    export interface ScriptHTMLAttributes<T extends EventTarget = HTMLScriptElement> extends HTMLAttributes<T> {
        async?: boolean
        crossorigin?: HTMLAttributeCrossOrigin
        defer?: boolean
        integrity?: string
        nomodule?: boolean
        noModule?: boolean
        referrerpolicy?: HTMLAttributeReferrerPolicy
        role?: never;
        src?: string
        type?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search#attributes */
    export interface SearchHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'search' | 'form' | 'group' | 'none' | 'presentation' | 'region'
    }

    export interface PartialSelectHTMLAttributes<T extends EventTarget> extends HTMLAttributes<T> {
        autocomplete?: string
        defaultvalue?: string | number
        disabled?: boolean
        form?: string
        name?: string
        required?: boolean
        size?: number
        value?: string | number
        onChange?: GenericEventHandler<T>
    }

    export type SelectAriaRoles =
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

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#attributes */
    export type SelectHTMLAttributes<T extends EventTarget = HTMLSelectElement> = Omit<PartialSelectHTMLAttributes<T>, 'role'> & SelectAriaRoles

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/slot#attributes */
    export interface SlotHTMLAttributes<T extends EventTarget = HTMLSlotElement> extends HTMLAttributes<T> {
        name?: string
        role?: never
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source#attributes */
    export interface SourceHTMLAttributes<T extends EventTarget = HTMLSourceElement> extends HTMLAttributes<T> {
        height?: number | string
        media?: string
        role?: never
        sizes?: string
        src?: string
        srcset?: string
        type?: string
        width?: number | string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/style#attributes */
    export interface StyleHTMLAttributes<T extends EventTarget = HTMLStyleElement> extends HTMLAttributes<T> {
        media?: string
        role?: never;
        scoped?: boolean
        type?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table#attributes */
    export interface TableHTMLAttributes<T extends EventTarget = HTMLTableElement> extends HTMLAttributes<T> {
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/td#attributes */
    export interface TdHTMLAttributes<T extends EventTarget = HTMLTableCellElement> extends HTMLAttributes<T> {
        align?:  'left' | 'center' | 'right' | 'justify' | 'char'
        colspan?: number
        headers?: string
        rowspan?: number
        scope?: string
        abbr?: string
        height?: number | string
        width?: number | string
        valign?: 'top' | 'middle' | 'bottom' | 'baseline'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template#attributes */
    export interface TemplateHTMLAttributes<T extends EventTarget = HTMLTemplateElement> extends HTMLAttributes<T> {
        role?: never
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#attributes */
    export interface TextareaHTMLAttributes<T extends EventTarget = HTMLTextAreaElement> extends HTMLAttributes<T> {
        autocomplete?: string
        cols?: number
        defaultvalue?: string | number
        dirname?: string
        disabled?: boolean
        form?: string
        maxlength?: number
        minlength?: number
        name?: string
        placeholder?: string
        readonly?: boolean
        required?: boolean
        role?: 'textbox'
        rows?: number
        value?: string | number
        wrap?: 'hard' | 'soft' | 'off'
        onChange?: GenericEventHandler<T>
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th#attributes */
    export interface ThHTMLAttributes<T extends EventTarget = HTMLTableCellElement> extends HTMLAttributes<T> {
        align?:  'left' | 'center' | 'right' | 'justify' | 'char'
        colspan?: number
        headers?: string
        rowspan?: number
        scope?: string
        abbr?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/time#attributes */
    export interface TimeHTMLAttributes<T extends EventTarget = HTMLTimeElement> extends HTMLAttributes<T> {
        datetime?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title#attributes */
    export interface TitleHTMLAttributes<T extends EventTarget = HTMLTitleElement> extends HTMLAttributes<T> {
        role?: never
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track#attributes */
    export interface TrackHTMLAttributes<T extends HTMLTrackElement = HTMLTrackElement> extends HTMLAttributes<T>, HTMLTrackElementEventHandlers<T> {
        default?: boolean
        kind?: string
        label?: string
        role?: never
        srclang?: string
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul#attributes */
    export interface UlHTMLAttributes<T extends EventTarget = HTMLUListElement> extends HTMLAttributes<T> {
        role?: 'list' | 'group' | 'listbox' | 'menu' | 'menubar' | 'none'
            | 'presentation' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video#attributes */
    export interface VideoHTMLAttributes<T extends HTMLVideoElement = HTMLVideoElement> extends MediaHTMLAttributes<T>, HTMLVideoElementEventHandlers<T> {
        disablePictureInPicture?: boolean
        height?: number | string
        playsinline?: boolean
        poster?: string
        width?: number | string
        role?: 'application'
    }

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/wbr#attributes */
    export interface WbrHTMLAttributes<T extends EventTarget = HTMLElement> extends HTMLAttributes<T> {
        role?: 'none' | 'presentation'
    }

    export interface HTMLAttributes<RefType extends EventTarget = EventTarget> extends HTMLElementEventHandlers<RefType>, AriaAttributes {
        // Standard HTML Attributes
        accesskey?: string
        autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
        autocorrect?: string
        autofocus?: boolean
        class?: string
        contenteditable?: Booleanish | '' | 'plaintext-only' | 'inherit'
        dir?: 'auto' | 'rtl' | 'ltr'
        draggable?: boolean
        enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
        exportparts?: string
        hidden?: boolean | 'hidden' | 'until-found'
        id?: string
        inert?: boolean
        inputmode?: string
        is?: string
        lang?: string
        nonce?: string
        part?: string
        popover?: 'auto' | 'hint' | 'manual' | boolean
        slot?: string
        spellcheck?: boolean
        style?: CSSProperties | string
        tabindex?: number
        title?: string
        translate?: boolean

        // WAI-ARIA Attributes
        // Most elements only allow a subset of roles and so this
        // is overwritten in many of the per-element interfaces
        role?: AriaRole
    }

    /** Types that are allowed as a `<tag/>` */
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
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a */
        a: AnchorHTMLAttributes<HTMLAnchorElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/abbr */
        abbr: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/address */
        address: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area */
        area: AreaHTMLAttributes<HTMLAreaElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/article */
        article: ArticleHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/aside */
        aside: AsideHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/audio */
        audio: AudioHTMLAttributes<HTMLAudioElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/b */
        b: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/base */
        base: BaseHTMLAttributes<HTMLBaseElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/bdi */
        bdi: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/bdo */
        bdo: HTMLAttributes<HTMLElement> & ChildrenAttr
        // big is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/blockquote */
        blockquote: BlockquoteHTMLAttributes<HTMLQuoteElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/body */
        body: HTMLAttributes<HTMLBodyElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/br */
        br: BrHTMLAttributes<HTMLBRElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button */
        button: ButtonHTMLAttributes<HTMLButtonElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas */
        canvas: CanvasHTMLAttributes<HTMLCanvasElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/caption */
        caption: CaptionHTMLAttributes<HTMLTableCaptionElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/cite */
        cite: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/code */
        code: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/col */
        col: ColHTMLAttributes<HTMLTableColElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/colgroup */
        colgroup: ColgroupHTMLAttributes<HTMLTableColElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/data */
        data: DataHTMLAttributes<HTMLDataElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist */
        datalist: DataListHTMLAttributes<HTMLDataListElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dd */
        dd: DdHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/del */
        del: DelHTMLAttributes<HTMLModElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details */
        details: DetailsHTMLAttributes<HTMLDetailsElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dfn */
        dfn: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog */
        dialog: DialogHTMLAttributes<HTMLDialogElement> & ChildrenAttr
        // dir is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div */
        div: HTMLAttributes<HTMLDivElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl */
        dl: DlHTMLAttributes<HTMLDListElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dt */
        dt: DtHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/em */
        em: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/embed */
        embed: EmbedHTMLAttributes<HTMLEmbedElement> // void element (no children allowed)
        // fencedframe has limited availability - TODO, implement: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fencedframe
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset */
        fieldset: FieldsetHTMLAttributes<HTMLFieldSetElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figcaption */
        figcaption: FigcaptionHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figure */
        figure: HTMLAttributes<HTMLElement> & ChildrenAttr
        // font is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/footer */
        footer: FooterHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form */
        form: FormHTMLAttributes<HTMLFormElement> & ChildrenAttr
        // frame is deprecated
        // frameset is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
        h1: HeadingHTMLAttributes<HTMLHeadingElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
        h2: HeadingHTMLAttributes<HTMLHeadingElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
        h3: HeadingHTMLAttributes<HTMLHeadingElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
        h4: HeadingHTMLAttributes<HTMLHeadingElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
        h5: HeadingHTMLAttributes<HTMLHeadingElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
        h6: HeadingHTMLAttributes<HTMLHeadingElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/head */
        head: HeadHTMLAttributes<HTMLHeadElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/header */
        header: HeaderHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hgroup */
        hgroup: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr */
        hr: HrHTMLAttributes<HTMLHRElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/html */
        html: HtmlHTMLAttributes<HTMLHtmlElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/i */
        i: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe */
        iframe: IframeHTMLAttributes<HTMLIFrameElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img */
        img: ImgHTMLAttributes<HTMLImageElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input */
        input: InputHTMLAttributes<HTMLInputElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ins */
        ins: InsHTMLAttributes<HTMLModElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd */
        kbd: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label */
        label: LabelHTMLAttributes<HTMLLabelElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/legend */
        legend: LegendHTMLAttributes<HTMLLegendElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/li */
        li: LiHTMLAttributes<HTMLLIElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link */
        link: LinkHTMLAttributes<HTMLLinkElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/main */
        main: MainHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/map */
        map: MapHTMLAttributes<HTMLMapElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/mark */
        mark: HTMLAttributes<HTMLElement> & ChildrenAttr
        // marquee is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/menu */
        menu: MenuHTMLAttributes<HTMLMenuElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/menuitem */
        menuitem: HTMLAttributes<HTMLUnknownElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta */
        meta: MetaHTMLAttributes<HTMLMetaElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter */
        meter: MeterHTMLAttributes<HTMLMeterElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/nav */
        nav: NavHTMLAttributes<HTMLElement> & ChildrenAttr
        // nobr is deprecated
        // noembed is deprecated
        // noiframe is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/noscript */
        noscript: NoScriptHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/object */
        object: ObjectHTMLAttributes<HTMLObjectElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ol */
        ol: OlHTMLAttributes<HTMLOListElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/optgroup */
        optgroup: OptgroupHTMLAttributes<HTMLOptGroupElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/option */
        option: OptionHTMLAttributes<HTMLOptionElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output */
        output: OutputHTMLAttributes<HTMLOutputElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p */
        p: HTMLAttributes<HTMLParagraphElement> & ChildrenAttr
        // param is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture */
        picture: PictureHTMLAttributes<HTMLPictureElement> & ChildrenAttr
        // plaintext is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/pre */
        pre: HTMLAttributes<HTMLPreElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress */
        progress: ProgressHTMLAttributes<HTMLProgressElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/q */
        q: QuoteHTMLAttributes<HTMLQuoteElement> & ChildrenAttr
        // rp is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/rp */
        rp: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/rt */
        rt: HTMLAttributes<HTMLElement> & ChildrenAttr
        // rtc is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ruby */
        ruby: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/s */
        s: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/samp */
        samp: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script */
        script: ScriptHTMLAttributes<HTMLScriptElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search */
        search: SearchHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section */
        section: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select */
        select: SelectHTMLAttributes<HTMLSelectElement> & ChildrenAttr
        // selectedcontent has limited availability - TODO, implement: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/selectedcontent
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/slot */
        slot: SlotHTMLAttributes<HTMLSlotElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/small */
        small: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source */
        source: SourceHTMLAttributes<HTMLSourceElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span */
        span: HTMLAttributes<HTMLSpanElement> & ChildrenAttr
        // strike is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/strong */
        strong: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/style */
        style: StyleHTMLAttributes<HTMLStyleElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/sub */
        sub: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary */
        summary: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/sup */
        sup: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table */
        table: TableHTMLAttributes<HTMLTableElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tbody */
        tbody: HTMLAttributes<HTMLTableSectionElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/td */
        td: TdHTMLAttributes<HTMLTableCellElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template */
        template: TemplateHTMLAttributes<HTMLTemplateElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea */
        textarea: TextareaHTMLAttributes<HTMLTextAreaElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tfoot */
        tfoot: HTMLAttributes<HTMLTableSectionElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th */
        th: ThHTMLAttributes<HTMLTableCellElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/thead */
        thead: HTMLAttributes<HTMLTableSectionElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/time */
        time: TimeHTMLAttributes<HTMLTimeElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title */
        title: TitleHTMLAttributes<HTMLTitleElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tr */
        tr: HTMLAttributes<HTMLTableRowElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track */
        track: TrackHTMLAttributes<HTMLTrackElement> // void element (no children allowed)
        // tt is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/u */
        u: UlHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul */
        ul: HTMLAttributes<HTMLUListElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/var */
        var: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video */
        video: VideoHTMLAttributes<HTMLVideoElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/wbr */
        wbr: WbrHTMLAttributes<HTMLElement> // void element (no children allowed)
        // xmp is deprecated
    }
}
