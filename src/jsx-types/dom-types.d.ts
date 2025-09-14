import { RenderObject } from "../tsx/tsx-core.ts";

/** Either a boolean or a string with `'true' | 'false'` */
export type Booleanish = boolean | "true" | "false"

/** Type for the `style={{display: "block"}}` Attribute object */
export type StyleObjectAttrType = {
    [key: string]: string | number | null | undefined
}

/** Type for the `style=` Attribute (either a Style object or string) */
export type StyleAttrType = StyleObjectAttrType | string

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

/** Either a WAI-ARIA 1.0 or WAI-ARIA 1.2 role */
export type AriaRole = WAIAriaRole | DPubAriaRole

/** How much of the referrer to send when following a link. */
export type HTMLAttributeReferrerPolicy =
    | '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin'
    | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'

/**
 * The name for a browsing context (a tab, window, or `<iframe>`)
 * 
 * Used by `<a>`, `<area>` and `<base>` elements' `target` attribute
 * 
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#target
 */
// deno-lint-ignore ban-types
export type HTMLAttributeAnchorTarget = '_self' | '_blank' | '_parent' | '_top' | (string & {})

/** Partial set of attributions for HTMLAnchorElement (to be combined with AnchorAriaRoles) */
export type PartialAnchorHTMLAttributes<T extends EventTarget> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#download */
    download?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#hreflang */
    hreflang?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#ping */
    ping?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#referrerpolicy */
    referrerpolicy?: HTMLAttributeReferrerPolicy
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#rel */
    rel?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#target */
    target?: HTMLAttributeAnchorTarget
}

/** Valid aria combinations for HTMLAnchorElement */
export type AnchorAriaRoles =
    | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#href */
        href: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#technical_summary */
        role?: 'link' | 'button' | 'checkbox' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio'
            | 'option' | 'radio' | 'switch' | 'tab' | 'treeitem' }
    | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#href */
        href?: never,
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#technical_summary */
        role?: AriaRole
    }

/**
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#attributes
 * 
 * Spec: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element
 */
export type AnchorHTMLAttributes<T extends EventTarget = HTMLAnchorElement> = Omit<PartialAnchorHTMLAttributes<T>, 'role'> & AnchorAriaRoles

/** Partial set of attributions for HTMLAreaElement (to be combined with AreaAriaRoles) */
export type PartialAreaHTMLAttributes<T extends EventTarget> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area#alt */
    alt?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area#coords */
    coords?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area#download */
    download?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area#ping */
    ping?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area#referrerpolicy */
    referrerpolicy?: HTMLAttributeReferrerPolicy
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area#rel */
    rel?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area#shape */
    shape?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area#target */
    target?: HTMLAttributeAnchorTarget
}

/** Valid aria combinations for HTMLAreaElement */
export type AreaAriaRoles =
    | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area#href */
        href: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'link'
    }
    | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area#href */
        href?: never
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'button' | 'link'
    }

/**
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area#attributes
 * 
 * Spec: https://html.spec.whatwg.org/multipage/image-maps.html#the-area-element
 */
export type AreaHTMLAttributes<T extends EventTarget = HTMLAreaElement> = Omit<PartialAreaHTMLAttributes<T>, 'role'> & AreaAriaRoles;

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/article#attributes */
export type ArticleHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'article' | 'application' | 'document' | 'feed' | 'main' | 'none' | 'presentation' | 'region'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/aside#attributes */
export type AsideHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'complementary' | 'feed' | 'none' | 'note' | 'presentation' | 'region' | 'search' | 'doc-dedication'
        | 'doc-example' | 'doc-footnote' | 'doc-glossary' | 'doc-pullquote' | 'doc-tip'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/audio#attributes */
export type AudioHTMLAttributes<T extends HTMLAudioElement = HTMLAudioElement> = MediaHTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'application'
}

/**
 * Warning: A `<base>` element must have an `href` attribute, a `target` attribute, or both. If at least one
 * of these attributes are specified, the `<base>` element must come before other elements with attribute values
 * that are URLs, such as a `<link>`'s `href` attribute.
 * 
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/base#attributes
 */
export type BaseHTMLAttributes<T extends EventTarget = HTMLBaseElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/base#href */
    href?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/base#target */
    target?: HTMLAttributeAnchorTarget
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/blockquote#attributes */
export type BlockquoteHTMLAttributes<T extends EventTarget = HTMLQuoteElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/blockquote#cite */
    cite?: string
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/br#attributes */
export type BrHTMLAttributes<T extends EventTarget = HTMLBRElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'none' | 'presentation'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#attributes */
export type ButtonHTMLAttributes<T extends EventTarget = HTMLButtonElement> = HTMLAttributes<T> & {
    /**
     * This Boolean attribute specifies that the button should have input focus when the page loads. Only one element in a document can have this attribute.
     * 
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#autofocus
     */
    autofocus?: boolean
    /**
     * Valid values: 'show-modal' | 'close' | 'request-close' | 'show-popover' | 'hide-popover' | 'toggle-popover'
     * 
     * OR a custom value prefixed with '--'
     * 
     * This attribute can represent custom values that are prefixed with a two hyphen characters (--). Buttons with a custom value will dispatch the CommandEvent on the controlled element.
     * 
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#command
     */
    command?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#commandfor */
    commandfor?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#disabled */
    disabled?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#form */
    form?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#formaction */
    formaction?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#formenctype */
    formenctype?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#formmethod */
    formmethod?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#formnovalidate */
    formnovalidate?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#formtarget */
    formtarget?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#name */
    name?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#popovertarget */
    popovertarget?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#popovertargetaction */
    popovertargetaction?: 'hide' | 'show' | 'toggle'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link' | 'menuitem'
        | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio' | 'separator'
        | 'slider' | 'switch' | 'tab' | 'treeitem'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#type */
    type?: 'submit' | 'reset' | 'button'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#value */
    value?: string | number
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas#attributes */
export type CanvasHTMLAttributes<T extends EventTarget = HTMLCanvasElement> = HTMLAttributes<T> & {
    /**
     * The height of the coordinate space in CSS pixels. Defaults to 150.
     * 
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas#height
     */
    height?: number | string
    /**
     * The width of the coordinate space in CSS pixels. Defaults to 300.
     * 
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas#width
     */
    width?: number | string
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/caption#attributes */
export type CaptionHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/structural_roles */
    role?: 'caption'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/col#attributes */
export type ColHTMLAttributes<T extends EventTarget = HTMLTableColElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/col#span */
    span?: number
    // align is deprecated
    // bgcolor is deprecated
    // char is deprecated
    // charoff is deprecated
    // valign is deprecated
    // width is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/colgroup#attributes */
export type ColgroupHTMLAttributes<T extends EventTarget = HTMLTableColElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/colgroup#span */
    span?: number
    // align is deprecated
    // bgcolor is deprecated
    // char is deprecated
    // charoff is deprecated
    // valign is deprecated
    // width is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/data#attributes */
export type DataHTMLAttributes<T extends EventTarget = HTMLDataElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/data#value */
    value?: string | number
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist#attributes */
export type DataListHTMLAttributes<T extends EventTarget = HTMLDataListElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/listbox_role */
    role?: 'listbox'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dd#attributes */
export type DdHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/del#attributes */
export type DelHTMLAttributes<T extends EventTarget = HTMLModElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/del#cite */
    cite?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/del#datetime */
    datetime?: string
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#attributes */
export type DetailsHTMLAttributes<T extends EventTarget = HTMLDetailsElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#open */
    open?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#name */
    name?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/group_role */
    role?: 'group'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#attributes */
export type DialogHTMLAttributes<T extends HTMLDialogElement = HTMLDialogElement> = HTMLAttributes<T> & HTMLDialogElementEventHandlers<T> & {
    /** Do not add the tabindex property to the <dialog> element as it is not interactive and does not receive focus. */
    tabindex?: never
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby */
    closedby?: 'none' | 'closerequest' | 'any'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#open */
    open?: boolean
    role?: 'dialog' | 'alertdialog'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl#attributes */
export type DlHTMLAttributes<T extends EventTarget = HTMLDListElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'group' | 'list' | 'none' | 'presentation'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dt#attributes */
export type DtHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/listitem_role */
    role?: 'listitem'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/embed#attributes */
export type EmbedHTMLAttributes<T extends EventTarget = HTMLEmbedElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/embed#height */
    height?: number | string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/embed#src */
    src?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/embed#type */
    type?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/embed#width */
    width?: number | string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'application' | 'document' | 'img' | 'none' | 'presentation'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset#attributes */
export type FieldsetHTMLAttributes<T extends EventTarget = HTMLFieldSetElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset#disabled */
    disabled?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset#form */
    form?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset#name */
    name?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'group' | 'none' | 'presentation' | 'radiogroup'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figcaption#attributes */
export type FigcaptionHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'group' | 'none' | 'presentation'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/footer#attributes */
export type FooterHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'contentinfo' | 'group' | 'none' | 'presentation' | 'doc-footnote'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#attributes */
export type FormHTMLAttributes<T extends HTMLFormElement = HTMLFormElement> = HTMLAttributes<T> & HTMLFormElementEventHandlers<T> & {
    // accept is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#accept-charset */
    'accept-charset'?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#autocomplete */
    autocomplete?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#name */
    name?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#rel */
    rel?: string

    // Attributes for form submission

    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#action */
    action?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#enctype */
    enctype?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#method */
    method?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#novalidate */
    novalidate?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#target */
    target?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'form' | 'none' | 'presentation' | 'search'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
export type HeadingHTMLAttributes<T extends EventTarget = HTMLHeadingElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'heading' | 'none' | 'presentation' | 'tab' | 'doc-subtitle'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/head#attributes */
export type HeadHTMLAttributes<T extends EventTarget = HTMLHeadElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/header#attributes */
export type HeaderHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'banner' | 'group' | 'none' | 'presentation'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr#attributes */
export type HrHTMLAttributes<T extends EventTarget = HTMLHRElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'separator' | 'none' | 'presentation' | 'doc-pagebreak'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/html#attributes */
export type HtmlHTMLAttributes<T extends EventTarget = HTMLHtmlElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/document_role */
    role?: 'document'
}

/**
 * The <iframe> HTML element represents a nested browsing context, embedding another HTML page into the current one.
 * 
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#attributes
 */
export type IframeHTMLAttributes<T extends EventTarget = HTMLIFrameElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#allow */
    allow?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#allowfullscreen */
    allowfullscreen?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#height */
    height?: number | string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#loading */
    loading?: 'eager' | 'lazy'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#name */
    name?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#referrerpolicy */
    referrerpolicy?: HTMLAttributeReferrerPolicy
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#sandbox */
    sandbox?: 'allow-downloads' | 'allow-forms' | 'allow-modals' | 'allow-orientation-lock' | 'allow-pointer-lock'
        | 'allow-popups' | 'allow-popups-to-escape-sandbox' | 'allow-presentation' | 'allow-same-origin'
        | 'allow-scripts' | 'allow-top-navigation' | 'allow-top-navigation-by-user-activation'
        | 'allow-top-navigation-to-custom-protocols'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#src */
    src?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#srcdoc */
    srcdoc?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#width */
    width?: number | string
    // align is deprecated
    // allowpaymentrequest is non-standard and deprecated
    // frameborder is deprecated
    // longdesc is deprecated
    // marginheight is deprecated
    // marginwidth is deprecated
    // scrolling is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'application' | 'document' | 'img' | 'none' | 'presentation'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/crossorigin */
export type HTMLAttributeCrossOrigin = 'anonymous' | 'use-credentials'

/** Partial set of attributions for HTMLImageElement (to be combined with ImgAriaRoles) */
export type PartialImgHTMLAttributes<T extends EventTarget> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#crossorigin */
    crossorigin?: HTMLAttributeCrossOrigin
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#decoding */
    decoding?: 'async' | 'auto' | 'sync'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#elementtiming */
    elementtiming?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#fetchpriority */
    fetchpriority?: 'high' | 'auto' | 'low'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#height */
    height?: number | string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#ismap */
    ismap?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#loading */
    loading?: 'eager' | 'lazy'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#referrerpolicy */
    referrerpolicy?: HTMLAttributeReferrerPolicy
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#sizes */
    sizes?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#src */
    src?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#srcset */
    srcset?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#width */
    width?: number | string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#usemap */
    usemap?: string
    // align is deprecated
    // border is deprecated
    // hspace is deprecated
    // longdesc is deprecated
    // name is deprecated
    // vspace is deprecated
}

/** Valid aria roles for HTMLImageElement */
export type ImgAriaRolesAccessibleName = 
    | 'img' | 'button' | 'checkbox' | 'link' | 'menuitem' | 'menuitemcheckbox'
    | 'menuitemradio' | 'meter' | 'option' | 'progressbar' | 'radio' | 'scrollbar'
    | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem' | 'doc-cover'

/** Valid aria combinations for HTMLImageElement */
export type ImgAriaRoles =
    | {
        'aria-label': string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: ImgAriaRolesAccessibleName
    } | {
        'aria-labelledby': string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: ImgAriaRolesAccessibleName
    } | {
        /**
         * Defines text that can replace the image in the page.
         * 
         * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#alt
         */
        alt: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: ImgAriaRolesAccessibleName
    } | {
        title: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: ImgAriaRolesAccessibleName
    } | {
        'aria-label'?: never
        'aria-labelledby'?: never
        /** Reference: Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#alt */
        alt?: never
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/title */
        title?: never
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'img' | 'none' | 'presentation'
    }

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#attributes */
export type ImgHTMLAttributes<T extends EventTarget = HTMLImageElement> =
    Omit<PartialImgHTMLAttributes<T>,'role' | 'aria-label' | 'aria-labelledby' | 'title'>
    & ImgAriaRoles

/** Partial set of attributions for HTMLInputElement (to be combined with InputAriaRoles) */
export type PartialInputHTMLAttributes<T extends HTMLInputElement> = HTMLAttributes<T> & HTMLInputElementEventHandlers<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#autocomplete */
    autocomplete?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#autocomplete */
    autofocus?: boolean
    /**
     * The capture attribute specifies that, optionally, a new file should be captured, and which device
     * should be used to capture that new media of a type defined by the accept attribute.
     * 
     * The capture attribute takes as its value a string that specifies which camera to use for capture of
     * image or video data, if the accept attribute indicates that the input should be of one of those types.
     * 
     * Values:
     * * `user` - The user-facing camera and/or microphone should be used.
     * * `environment` - The outward-facing camera and/or microphone should be used
     * 
     * References:
     * * Input capture: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#capture
     * 
     * * Media capture: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture
     * 
     * * W3 spec: https://www.w3.org/TR/html-media-capture/#the-capture-attribute */
    capture?: 'user' | 'environment'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#disabled */
    disabled?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#form */
    form?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#formaction */
    formaction?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#formenctype */
    formenctype?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#formmethod */
    formmethod?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#formnovalidate */
    formnovalidate?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#formtarget */
    formtarget?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#name */
    name?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#value */
    value?: string | number
}

/** Valid aria type + role combinations for HTMLInputElement */
export type InputAriaRoles =
    | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/button */
        type: 'button'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#popovertarget */
        popovertarget?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#popovertargetaction */
        popovertargetaction?: 'hide' | 'show' | 'toggle'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link'
        | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio'
        | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox */
        type: 'checkbox'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#checked */
        checked?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#required */
        required?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox#indeterminate_state_checkboxes */
        indeterminate?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'checkbox' | 'button' | 'menuitemcheckbox' | 'option' | 'switch'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color */
        type: 'color'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#list */
        list?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: never
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email */
        type: 'email'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#maxlength */
        maxlength?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#minlength */
        minlength?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#dirname */
        dirname?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#list */
        list?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#multiple */
        multiple?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#pattern */
        pattern?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#placeholder_2 */
        placeholder?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#readonly */
        readonly?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#required */
        required?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#size_2 */
        size?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'textbox' | 'combobox'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/image */
        type: 'image'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#height */
        height?: number | string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#width */
        width?: number | string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#alt */
        alt?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#src */
        src?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'button' | 'checkbox' | 'gridcell' | 'link' | 'menuitem'
        | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'separator' | 'slider'
        | 'switch' | 'tab' | 'treeitem'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number */
        type: 'number'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#list */
        list?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#max */
        max?: number | string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#min */
        min?: number | string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#placeholder_2 */
        placeholder?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#readonly */
        readonly?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#required */
        required?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#step */
        step?: number | string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'spinbutton'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio */
        type: 'radio'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#checked */
        checked?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#required */
        required?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'radio' | 'menuitemradio'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range */
        type: 'range'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#list */
        list?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#max */
        max?: number | string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#min */
        min?: number | string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#step */
        step?: number | string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'slider'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/reset */
        type: 'reset'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link'
        | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio'
        | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search */
        type?: 'search'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#dirname */
        dirname?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#maxlength */
        maxlength?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#minlength */
        minlength?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#list */
        list?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#pattern */
        pattern?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#placeholder_2 */
        placeholder?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#readonly */
        readonly?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#required */
        required?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'combobox' | 'searchbox'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/submit */
        type: 'submit'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'button' | 'checkbox' | 'combobox' | 'gridcell' | 'link'
        | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'radio'
        | 'separator' | 'slider' | 'switch' | 'tab' | 'treeitem'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/tel */
        type: 'tel'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#maxlength */
        maxlength?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#minlength */
        minlength?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#dirname */
        dirname?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#list */
        list?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#pattern */
        pattern?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#placeholder_2 */
        placeholder?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#readonly */
        readonly?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#required */
        required?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#size_2 */
        size?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'textbox' | 'combobox'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/text */
        type?: 'text'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#maxlength */
        maxlength?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#minlength */
        minlength?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#dirname */
        dirname?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#list */
        list?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#pattern */
        pattern?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#placeholder_2 */
        placeholder?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#readonly */
        readonly?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#required */
        required?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#size_2 */
        size?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'textbox' | 'combobox' | 'searchbox' | 'spinbutton'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/url */
        type: 'url'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#maxlength */
        maxlength?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#minlength */
        minlength?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#dirname */
        dirname?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#list */
        list?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#pattern */
        pattern?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#placeholder_2 */
        placeholder?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#readonly */
        readonly?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#required */
        required?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#size_2 */
        size?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'textbox' | 'combobox'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email */
        type: 'file'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#accept */
        accept?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#multiple */
        multiple?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#required */
        required?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: never
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/hidden */
        type: 'hidden'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#dirname */
        dirname?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: never
    } | {
        /**
         * References:
         * * date - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date
         * * datetime-local - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/datetime-local
         * * month - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/month
         * * week - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/week
         * * time - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/time
         */
        type: 'date' | 'datetime-local' | 'month' | 'time' | 'week'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#list */
        list?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#max */
        max?: number | string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#min */
        min?: number | string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#readonly */
        readonly?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#required */
        required?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#step */
        step?: number | string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: never
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/password */
        type: 'password'
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#maxlength */
        maxlength?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#minlength */
        minlength?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#pattern */
        pattern?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#placeholder_2 */
        placeholder?: string
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#readonly */
        readonly?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#required */
        required?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#size_2 */
        size?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: never
    }

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#attributes */
export type InputHTMLAttributes<T extends HTMLInputElement = HTMLInputElement> = PartialInputHTMLAttributes<T> & InputAriaRoles

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ins#attributes */
export type InsHTMLAttributes<T extends EventTarget = HTMLModElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ins#cite */
    cite?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ins#datetime */
    datetime?: string
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label#attributes */
export type LabelHTMLAttributes<T extends EventTarget = HTMLLabelElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label#for */
    for?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label#technical_summary */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/legend#attributes */
export type LegendHTMLAttributes<T extends EventTarget = HTMLLegendElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/li#attributes */
export type LiHTMLAttributes<T extends EventTarget = HTMLLIElement> = HTMLAttributes<T> & {
    /** Reference:  */
    value?: string | number
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#attributes */
export type LinkHTMLAttributes<T extends EventTarget = HTMLLinkElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#as */
    as?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#blocking */
    blocking?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#crossorigin */
    crossorigin?: HTMLAttributeCrossOrigin
    /**
     * For rel="stylesheet" only, the disabled Boolean attribute indicates whether the described stylesheet
     * should be loaded and applied to the document. If disabled is specified in the HTML when it is loaded,
     * the stylesheet will not be loaded during page load. Instead, the stylesheet will be loaded on-demand,
     * if and when the disabled attribute is changed to false or removed.
     * 
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#disabled
     */
    disabled?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#fetchpriority */
    fetchpriority?: 'high' | 'low' | 'auto'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#href */
    href?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#hreflang */
    hreflang?: string
    /**
     * For rel="preload" and as="image" only, the imagesrcset attribute has similar syntax and semantics
     * as the srcset attribute that indicates to preload the appropriate resource used by an img element
     * with corresponding values for its srcset and sizes attributes.
     * 
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#imagesizes
     */
    imagesizes?: string
    /**
     * For rel="preload" and as="image" only, the imagesrcset attribute has similar syntax and semantics
     * as the srcset attribute that indicates to preload the appropriate resource used by an img element
     * with corresponding values for its srcset and sizes attributes.
     * 
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#imagesrcset
     */
    imagesrcset?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#integrity */
    integrity?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#media */
    media?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#referrerpolicy */
    referrerpolicy?: HTMLAttributeReferrerPolicy
    /**
     * This attribute names a relationship of the linked document to the current document. The attribute
     * must be a space-separated list of link type values.
     * 
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#rel
     * 
     * Rel attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel
     */
    rel?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#sizes */
    sizes?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link#type */
    type?: string
    // target is deprecated
    // charset is deprecated
    // rev is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/main#attributes */
export type MainHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'main'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/map#attributes */
export type MapHTMLAttributes<T extends EventTarget = HTMLMapElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/map#name */
    name?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Common attributes for HTMLMediaElements, reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement */
export type MediaHTMLAttributes<T extends HTMLMediaElement = HTMLMediaElement> = HTMLAttributes<T> & HTMLMediaElementEventHandlers<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/autoplay */
    autoplay?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controls */
    controls?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList */
    controlslist?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/crossOrigin */
    crossorigin?: HTMLAttributeCrossOrigin
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime */
    currenttime?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/defaultMuted */
    defaultmuted?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/defaultPlaybackRate */
    defaultplaybackrate?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/disableRemotePlayback */
    disableremoteplayback?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop */
    loop?: boolean
    // mediagroup is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted */
    muted?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate */
    playbackrate?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preload */
    preload?: 'auto' | 'metadata' | 'none'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preservesPitch */
    preservespitch?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src */
    src?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject */
    srcobject?: MediaStream | MediaSource | Blob | File | null
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume */
    volume?: string | number
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/menu#attributes */
export type MenuHTMLAttributes<T extends EventTarget = HTMLMenuElement> = HTMLAttributes<T> & {
    // type is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role: 'list' | 'group' | 'listbox' | 'menu' | 'menubar' | 'none'
        | 'presentation' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta#attributes */
export type MetaHTMLAttributes<T extends EventTarget = HTMLMetaElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta#charset */
    charset?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta#attributes */
    content?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta#http-equiv */
    'http-equiv'?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta#media */
    media?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta#name */
    name?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#attributes */
export type MeterHTMLAttributes<T extends EventTarget = HTMLMeterElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#value */
    value?: string | number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#min */
    min?: number | string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#max */
    max?: number | string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#low */
    low?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#high */
    high?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#optimum */
    optimum?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'meter'
}

/** https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/nav#attributes */
export type NavHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'navigation' | 'menu' | 'menubar' | 'none' | 'presentation' | 'tablist'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/noscript#attributes */
export type NoScriptHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/object#attributes */
export type ObjectHTMLAttributes<T extends EventTarget = HTMLObjectElement> = HTMLAttributes<T> & {
    // archive is deprecated
    // border is deprecated
    // classid is deprecated
    // codebase is deprecated
    // codetype is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/object#data */
    data?: string
    // declare is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/object#form */
    form?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/object#height */
    height?: number | string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/object#name */
    name?: string
    // standby is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/object#type */
    type?: string
    // usemap is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/object#width */
    width?: number | string
    // wmode is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'application' | 'document' | 'img'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ol#attributes */
export type OlHTMLAttributes<T extends EventTarget = HTMLOListElement> = HTMLAttributes<T> & {
    // compact is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ol#reversed */
    reversed?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ol#start */
    start?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ol#type */
    type?: '1' | 'a' | 'A' | 'i' | 'I'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'list' | 'group' | 'listbox' | 'menu' | 'menubar' | 'none'
        | 'presentation' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/optgroup#attributes */
export type OptgroupHTMLAttributes<T extends EventTarget = HTMLOptGroupElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/optgroup#disabled */
    disabled?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/optgroup#label */
    label?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'group'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/option#attributes */
export type OptionHTMLAttributes<T extends EventTarget = HTMLOptionElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/option#disabled */
    disabled?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/option#label */
    label?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/option#selected */
    selected?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/option#value */
    value?: string | number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'option'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output#attributes */
export type OutputHTMLAttributes<T extends EventTarget = HTMLOutputElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output#for */
    for?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output#form */
    form?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output#name */
    name?: string
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture#attributes */
export type PictureHTMLAttributes<T extends EventTarget = HTMLPictureElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress#attributes */
export type ProgressHTMLAttributes<T extends EventTarget = HTMLProgressElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress#max */
    max?: number | string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress#value */
    value?: string | number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'progressbar'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/q#attributes */
export type QuoteHTMLAttributes<T extends EventTarget = HTMLQuoteElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/q#cite */
    cite?: string
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#attributes */
export type ScriptHTMLAttributes<T extends EventTarget = HTMLScriptElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#async */
    async?: boolean
    // attributionsrc is experimental
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#blocking */
    blocking?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#crossorigin */
    crossorigin?: HTMLAttributeCrossOrigin
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#defer */
    defer?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#fetchpriority */
    fetchpriority?: 'high' | 'low' | 'auto'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#integrity */
    integrity?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#nomodule */
    nomodule?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#nonce */
    nonce?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#referrerpolicy */
    referrerpolicy?: HTMLAttributeReferrerPolicy
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#src */
    src?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#type */
    type?: string
    // charset is deprecated
    // language is deprecated
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search#attributes */
export type SearchHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'search' | 'form' | 'group' | 'none' | 'presentation' | 'region'
}

/** Partial set of attributions for HTMLSelectElement (to be combined with SelectAriaRoles) */
export type PartialSelectHTMLAttributes<T extends EventTarget> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#autocomplete */
    autocomplete?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#autofocus */
    autofocus?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#disabled */
    disabled?: boolean
    /** Reference:  */
    defaultvalue?: string | number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#form */
    form?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#name */
    name?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#required */
    required?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#size */
    size?: number
    /** Reference: https://html.spec.whatwg.org/multipage/form-elements.html#dom-select-value */
    value?: string | number
}

/** Valid aria combinations for HTMLSelectElement */
export type SelectAriaRoles =
    | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#multiple */
        multiple?: never;
        /**
         * Spec states this branch is limited to "no `multiple` attribute AND no `size` attribute greater than 1".
         * `1` as a default, however, caused some web compat issues and forced Firefox to default to `0` instead.
         * 
         * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#size
         */
        size?: 0 | 1 | never
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'combobox' | 'menu'
    } | {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#multiple */
        multiple?: boolean
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#size */
        size?: number
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
        role?: 'listbox'
    }

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select#attributes */
export type SelectHTMLAttributes<T extends EventTarget = HTMLSelectElement> = Omit<PartialSelectHTMLAttributes<T>, 'role'> & SelectAriaRoles

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/slot#attributes */
export type SlotHTMLAttributes<T extends EventTarget = HTMLSlotElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/slot#name */
    name?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source#attributes */
export type SourceHTMLAttributes<T extends EventTarget = HTMLSourceElement> = HTMLAttributes<T> & {
    /** Reference:  */
    height?: number | string
    /** Reference:  */
    media?: string
    /** Reference:  */
    sizes?: string
    /** Reference:  */
    src?: string
    /** Reference:  */
    srcset?: string
    /** Reference:  */
    type?: string
    /** Reference:  */
    width?: number | string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/style#attributes */
export type StyleHTMLAttributes<T extends EventTarget = HTMLStyleElement> = HTMLAttributes<T> & {
    /** Reference:  */
    media?: string
    /** Reference:  */
    scoped?: boolean
    /** Reference:  */
    type?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table#attributes */
export type TableHTMLAttributes<T extends EventTarget = HTMLTableElement> = HTMLAttributes<T>

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/td#attributes */
export type TdHTMLAttributes<T extends EventTarget = HTMLTableCellElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/td#colspan */
    colspan?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/td#headers */
    headers?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/td#rowspan */
    rowspan?: number
    // abbr is deprecated
    // align is deprecated
    // axis is deprecated
    // bgcolor is deprecated
    // char is deprecated
    // charoff is deprecated
    // height is deprecated
    // scope is deprecated
    // valign is deprecated
    // width is deprecated
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template#attributes */
export type TemplateHTMLAttributes<T extends EventTarget = HTMLTemplateElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#attributes */
export type TextareaHTMLAttributes<T extends EventTarget = HTMLTextAreaElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#autocomplete */
    autocomplete?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#autocorrect */
    autocorrect?: 'on' | 'off'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#autofocus */
    autofocus?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#cols */
    cols?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#dirname */
    dirname?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#disabled */
    disabled?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#form */
    form?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#maxlength */
    maxlength?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#minlength */
    minlength?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#name */
    name?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#placeholder */
    placeholder?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#readonly */
    readonly?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#required */
    required?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#rows */
    rows?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/value */
    value?: string | number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#wrap */
    wrap?: 'hard' | 'soft' | 'off'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/textbox_role */
    role?: 'textbox'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th#attributes */
export type ThHTMLAttributes<T extends EventTarget = HTMLTableCellElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th#abbr */
    abbr?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th#colspan */
    colspan?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th#headers */
    headers?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th#rowspan */
    rowspan?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th#scope */
    scope?: string
    // align is deprecated
    // axis is deprecated
    // bgcolor is deprecated
    // char is deprecated
    // charoff is deprecated
    // height is deprecated
    // valign is deprecated
    // width is deprecated
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/time#attributes */
export type TimeHTMLAttributes<T extends EventTarget = HTMLTimeElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/time#datetime */
    datetime?: string
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title#attributes */
export type TitleHTMLAttributes<T extends EventTarget = HTMLTitleElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track#attributes */
export type TrackHTMLAttributes<T extends HTMLTrackElement = HTMLTrackElement> = HTMLAttributes<T> & HTMLTrackElementEventHandlers<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track#default */
    default?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track#kind */
    kind?: 'subtitles' | 'captions' | 'chapters' | 'metadata'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track#label */
    label?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track#src */
    src?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track#srclang */
    srclang?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: never
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul#attributes */
export type UlHTMLAttributes<T extends EventTarget = HTMLUListElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles */
    role?: 'list' | 'group' | 'listbox' | 'menu' | 'menubar' | 'none'
        | 'presentation' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video#attributes */
export type VideoHTMLAttributes<T extends HTMLVideoElement = HTMLVideoElement> = MediaHTMLAttributes<T> & HTMLVideoElementEventHandlers<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video#disablepictureinpicture */
    disablepicturetnpicture?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video#height */
    height?: number | string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video#playsinline */
    playsinline?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video#poster */
    poster?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video#width */
    width?: number | string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/application_role */
    role?: 'application'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/wbr#attributes */
export type WbrHTMLAttributes<T extends EventTarget = HTMLElement> = HTMLAttributes<T> & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/presentation_role */
    role?: 'none' | 'presentation'
}

/** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes#list_of_global_attributes */
export type HTMLAttributes<RefType extends EventTarget = EventTarget> = HTMLElementEventHandlers<RefType> & AriaAttributes & {
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/accesskey */
    accesskey?: string
    // anchor is non-standard
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autocapitalize */
    autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
    // autocorrect is only suppored by one browser
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus */
    autofocus?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/class */
    class?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable */
    contenteditable?: Booleanish | '' | 'plaintext-only' | 'inherit'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir */
    dir?: 'auto' | 'rtl' | 'ltr'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/draggable */
    draggable?: 'auto' | 'true' | 'false'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint */
    enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/exportparts */
    exportparts?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden */
    hidden?: boolean | 'hidden' | 'until-found'
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/id */
    id?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert */
    inert?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode */
    inputmode?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/is */
    is?: string
    /**
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/itemid
     * 
     * Also see section for Microdata attributes: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Microdata
     */
    itemid?: string
    /**
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/itemprop
     * 
     * Also see section for Microdata attributes: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Microdata
     */
    itemprop?: string
    /**
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/itemref
     * 
     * Also see section for Microdata attributes: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Microdata
     */
    itemref?: string
    /**
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/itemscope
     * 
     * Also see section for Microdata attributes: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Microdata
     */
    itemscope?: boolean
    /**
     * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/itemtype
     * 
     * Also see section for Microdata attributes: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Microdata
     */
    itemtype?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang */
    lang?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/nonce */
    nonce?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/part */
    part?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover */
    popover?: 'auto' | 'hint' | 'manual' | boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/slot */
    slot?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/spellcheck */
    spellcheck?: boolean
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/style */
    style?: StyleAttrType
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex */
    tabindex?: number
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/title */
    title?: string
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/translate */
    translate?: boolean
    // virtualkeyboardpolicy is experimental
    /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/writingsuggestions */
    writingsuggestions?: boolean

    /**
     * A set of RenderObjects to pass lifecycle management responsibility to this Element
     * 
     * Cannot be set on an Element that is controlled by a Component or RenderObject
     */
    // deno-lint-ignore no-explicit-any
    with?: RenderObject<any>[]

    /**
     * WAI-ARIA Attributes
     * 
     * Most elements only allow a subset of roles and so this is overwritten in many of the per-element interfaces
     * 
     * Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles
     */
    role?: AriaRole
}
