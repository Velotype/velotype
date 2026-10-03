// DOM event types and the event handler attributes of elements

/** Reference: https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent */
export interface CommandEvent extends Event {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/source */
    readonly source: Element | null
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/command */
    readonly command: string
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent */
export declare const CommandEvent: {
    prototype: CommandEvent
    new (type: string, eventInitDict?: CommandEventInit): CommandEvent
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent */
export interface CommandEventInit extends EventInit {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/source */
    source: Element | null
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/command */
    command: string
}

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
     *     once?: boolean // A boolean value indicating that the listener should be invoked at most once after being added. If true, the listener would be automatically removed when invoked. If not specified, defaults to false.
     *     passive?: boolean // A boolean value that, if true, indicates that the function specified by listener will never call preventDefault(). Reference: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners
     *     signal?: AbortSignal // An AbortSignal. The listener will be removed when the abort() method of the AbortController which owns the AbortSignal is called.
     *     capture?: boolean // A boolean value indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
     * }
     * ```
     * 
     * Reference: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     */
    options?: AddEventListenerOptions | boolean
}
/** An event handler */
export type EventHandler<E extends TargetedEvent> = ((event: E) => void) | EventHandlerOptions<E>

/**
 * Names of events that do not bubble, so cannot be listened for on an ancestor element
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles
 */
export type NonBubblingEventName = 'abort' | 'beforetoggle' | 'blur' | 'canplay' | 'canplaythrough' | 'close' | 'contextlost' | 'contextrestored' | 'cuechange' | 'durationchange' | 'emptied' | 'ended' | 'error' | 'focus' | 'invalid' | 'load' | 'loadeddata' | 'loadedmetadata' | 'loadstart' | 'mouseenter' | 'mouseleave' | 'pause' | 'play' | 'playing' | 'pointerenter' | 'pointerleave' | 'progress' | 'ratechange' | 'resize' | 'scroll' | 'scrollend' | 'seeked' | 'seeking' | 'stalled' | 'suspend' | 'timeupdate' | 'toggle' | 'volumechange' | 'waiting'
/**
 * Names of events that bubble, so can be listened for on an ancestor element
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles
 */
export type BubblingEventName = Exclude<keyof HTMLElementEventMap, NonBubblingEventName>

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
