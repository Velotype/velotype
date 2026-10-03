// Global and per-element HTML attributes

import type { RenderObject } from "../tsx/tsx-core.ts"
import type { AriaAttributes, AriaRole, Booleanish } from "./aria.d.ts"
import type { HTMLDialogElementEventHandlers, HTMLElementEventHandlers, HTMLFormElementEventHandlers, HTMLInputElementEventHandlers, HTMLMediaElementEventHandlers, HTMLTrackElementEventHandlers, HTMLVideoElementEventHandlers } from "./events.d.ts"

/** Type for the `style={{display: "block"}}` Attribute object */
export type StyleAttrType = {
    [key: string]: string | number | null | undefined
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
     * 
     * Velotype custom attribute
     */
    // deno-lint-ignore no-explicit-any
    vtwith?: RenderObject<any>[]

    /**
     * WAI-ARIA Attributes
     * 
     * Most elements only allow a subset of roles and so this is overwritten in many of the per-element interfaces
     * 
     * Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles
     */
    role?: AriaRole
}

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
export type AreaHTMLAttributes<T extends EventTarget = HTMLAreaElement> = Omit<PartialAreaHTMLAttributes<T>, 'role'> & AreaAriaRoles

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
        multiple?: never
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
