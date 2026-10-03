// deno-lint-ignore-file no-explicit-any

// Components for raw HTML, SVG, and MathML

import type { HTMLAttributes } from "../jsx-types/dom-types.d.ts"
import { setAttrsOnElement } from "./attributes.ts"
import { Component } from "./component.ts"
import { createElement } from "./create-element.ts"
import { divTag } from "./globals.ts"

/** Attributes type for the HTML Component */
export type HTMLAttrsType<ElementAttrsType> = {
    /** which html tag to use for this element (defaults to `<div>`, does not support `<svg>` or `<math>`) */
    tag?: string
    /** content to use in innerHTML */
    innerHTML: string
    /** attributes to set on the created element */
    elementAttrs?: ElementAttrsType
}
/**
 * Fully custom HTML
 * 
 * Two special attrs:
 * 
 * tag:string - which html tag to use for this element (defaults to \<div>, does not support \<svg> or \<math>)
 * 
 * html:string - content to use in innerHTML
 */
export class HTML<AttrsType = HTMLAttributes> extends Component<HTMLAttrsType<AttrsType>> {
    /**
     * Renders this into a generic HTML element
     */
    override render(attrs: Readonly<HTMLAttrsType<AttrsType>>): HTMLElement {
        const container = createElement(attrs.tag || divTag, attrs.elementAttrs || null) as HTMLElement
        container.innerHTML = attrs.innerHTML
        return container
    }
}

/** Attributes type for the SVG Component */
export type SVGAttrsType = {
    /** content to use in innerHTML of the \<svg> element */
    innerHTML: string
    /** attributes to set on the created element */
    elementAttrs?: any
}

/**
 * Custom SVG element
 * 
 * One special attr:
 * 
 * svg:string - content to use in innerHTML of the \<svg> element
 */
export class SVG extends Component<SVGAttrsType> {
    /**
     * Renders this into a \<svg\> element
     */
    override render(attrs: Readonly<SVGAttrsType>): SVGSVGElement {
        const container = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGSVGElement
        setAttrsOnElement(container, attrs.elementAttrs || null)
        container.innerHTML = attrs.innerHTML || ""
        return container
    }
}

/** Attributes type for the MATH Component */
export type MATHAttrsType = {
    /** content to use in innerHTML of the \<math> element */
    innerHTML: string
    /** attributes to set on the created element */
    elementAttrs?: any
}
/**
 * Custom MathML element
 * 
 * One special attr:
 * 
 * svg:string - content to use in innerHTML of the svg element
 */
export class MATH extends Component<MATHAttrsType> {
    /**
     * Renders this into a \<math\> element
     */
    override render(attrs: Readonly<MATHAttrsType>): MathMLElement {
        const container = document.createElementNS("http://www.w3.org/1998/Math/MathML", "math") as MathMLElement
        setAttrsOnElement(container, attrs.elementAttrs || null)
        container.innerHTML = attrs.innerHTML || ""
        return container
    }
}
