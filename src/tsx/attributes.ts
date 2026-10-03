// deno-lint-ignore-file no-explicit-any

// Setting attributes, properties, styles, and event listeners on elements

import { setDomKeyOn } from "./dom-references.ts"
import { consoleError, domKeyProperty, prototypeSetterCache, styleSetterCache, upperCaseRegExp, vtState } from "./globals.ts"
import type { AnchorElement, IdAttr, StylePassthroughAttrs } from "./types.ts"
import { WithComponent } from "./with-component.ts"

/**
 * Convinence function to passthrough commonly passed attrs onto an element
 * 
 * Will set:
 * * `id`
 * * `class`
 * * `style`
 */
export function passthroughAttrsToElement<T extends HTMLElement>(element: T, attrs: IdAttr & StylePassthroughAttrs): T {
    if (attrs.id) {
        setAttributeHelper(element, "id", attrs.id)
    }
    if (attrs.class) {
        const elementClass = element.getAttribute("class")
        setAttributeHelper(element, "class", elementClass ? elementClass + " " + attrs.class : attrs.class)
    }
    if (attrs.style) {
        setAttrsOnElement(element, {style: attrs.style})
    }
    return element
}

/** Determines if an `object` has a setter for `fieldName` in its prototype chain */
function hasSetterInPrototypeChain(object: any, fieldName: string): boolean {
    // Own properties are not cached
    if (Object.prototype.hasOwnProperty.call(object, fieldName)) {
        return hasSetterFrom(object, fieldName)
    }
    const prototype = Object.getPrototypeOf(object)
    // Consecutive calls are usually for the same element, so the last prototype's cache is kept at hand
    let setters = prototype === vtState.p ? vtState.s : prototypeSetterCache.get(prototype)
    if (!setters) {
        setters = new Map<string, boolean>()
        prototypeSetterCache.set(prototype, setters)
    }
    vtState.p = prototype
    vtState.s = setters
    let hasSetter = setters.get(fieldName)
    if (hasSetter === undefined) {
        hasSetter = hasSetterFrom(prototype, fieldName)
        setters.set(fieldName, hasSetter)
    }
    return hasSetter
}

/** Walks the prototype chain from `object` looking for a setter for `fieldName` */
function hasSetterFrom(object: any, fieldName: string): boolean {
    let currentObject = object
    while (currentObject) {
        const descriptor = Object.getOwnPropertyDescriptor(currentObject, fieldName)
        if (descriptor && (descriptor.set || descriptor.writable)) {
            return true // Setter found
        }
        currentObject = Object.getPrototypeOf(currentObject)
    }
    return false // No setter found in the prototype chain
}

/**
 * Call either setAttribute() of a setter on element (if defined)
 */
function setAttributeHelper(element: Element, name: string, value: any): void {
    if (hasSetterInPrototypeChain(element, name)) {
        // Detected property, set directly
        ;(element as any)[name] = value
    } else {
        // No property, set as an attribute
        element.setAttribute(name, value.toString())
    }
}

/**
 * Call either setAttribute() of a setter on element (if defined)
 * 
 * Specific to a boolean value to set as empty string when an attribute
 */
function setBooleanAttributeHelper(element: Element, name: string, value: boolean): void {
    if (hasSetterInPrototypeChain(element, name)) {
        // Detected property, set boolean type directly
        ;(element as any)[name] = value
    } else {
        // No property, set as an attribute
        if (name.startsWith('aria-') || name.startsWith('data-')) {
            // Always set the raw boolean attribute for aria- and data- attributes
            element.setAttribute(name, String(value))
        } else {
            // Boolean true gets set to empty string, boolean false does not get set
            if (value) {
                element.setAttribute(name, '')
            }
        }
    }
}

/** Convert from lowerCamelCase to hypen-case */
function lowerCamelToHypenCase(text: string): string {
    return text.replace(upperCaseRegExp, char => '-' + char.toLowerCase())
}

/**
 * Sets attributes on an element
 * 
 * Resolves: eventListeners, style object, and processes boolean values
 * 
 * eventListeners support `<div onClick:{()=>{alert()}} />`
 * 
 * and eventListeners support `<div onClick:{{handler: ()=>{alert()}, options: AddEventListenerOptions | boolean}} />`
 * 
 * Boolean values are set as empty attributes when true and unset when false
 */
export function setAttrsOnElement(element: AnchorElement, attrs?: Readonly<any> | null): void {
    if (!attrs) {
        return
    }
    // A range input clamps value to min/max when set, so its value is set last
    const valueLast = attrs.type == 'range'
    const names = Object.keys(attrs)
    for (let i = 0; i < names.length; i++) {
        const name = names[i]
        if (!valueLast || name != 'value') {
            setAttrOnElement(element, name, attrs[name])
        }
    }
    if (valueLast) {
        setAttrOnElement(element, 'value', attrs.value)
    }
}

/** Set a single attribute on an element, see setAttrsOnElement() */
function setAttrOnElement(element: AnchorElement, name: string, value: any): void {
    if (name.startsWith('on') && name.length > 4) {
        // Special handling for event listener attributes
        //
        // Example attrs:
        //   <div onClick={()=>{}} >
        //   <div onClick={{handler: ()=>{}, options: {once: true}}} >
        //
        // The length check of 4 is to allow the name[2] test below and to guarantee that
        // eventName will be at least one char in length. Works because all standard browser
        // events have at least 2 chars in their name.

        if (value) { // Check for <div onClick={null}>
            let options: boolean | AddEventListenerOptions | undefined = undefined
            let handler: (this: HTMLElement, ev: Event | UIEvent | WheelEvent) => any = value
            if (typeof value !== 'function' && value.handler) {
                handler = value.handler
                options = value.options
            }
            // Extract the event name:
            // If the name has a dash after "on" like: <div on-custom-eventNAME={()=>{}} > then the name is extracted exactly as-is
            // If the name does not have a dash after "on" then the name is lower cased
            const eventName = (name[2] == '-') ? name.slice(3) : name.slice(2).toLowerCase()
            element.addEventListener(eventName, handler, options)
        }
    } else if (name == 'style' && value instanceof Object) {
        // Special handling for style object
        for (const key of Object.keys(value)) {
            const keyValue: string | number = value[key] == null ? '' : value[key]
            const stringKeyValue = (typeof keyValue == 'number') ? keyValue.toString() : keyValue
            const style = element.style
            if (stringKeyValue.endsWith('!important')) {
                // Important requires setProperty() call
                style.setProperty(lowerCamelToHypenCase(key), stringKeyValue.slice(0, -10), 'important')
            } else {
                let hasSetter = styleSetterCache.get(key)
                if (hasSetter === undefined) {
                    hasSetter = hasSetterFrom(style, key)
                    styleSetterCache.set(key, hasSetter)
                }
                if (hasSetter) {
                    // Note: any is used here because "keyof typeof element.style" clashes with "length" and "parentRule" being readonly
                    style[key as any] = stringKeyValue
                } else {
                    style.setProperty(key, stringKeyValue)
                }
            }
        }
    } else if (typeof value == 'boolean') {
        setBooleanAttributeHelper(element, name, value)
    } else if (typeof value == 'function') {
        // Avoid setting the attribute if the value is a function
    } else if (name == "vtwith") {
        const key: number | undefined = (element as any)[domKeyProperty]
        if (key) {
            consoleError("vtwith on a keyed element", key)
        } else {
            const withComponent = new WithComponent(value)
            setDomKeyOn(element, withComponent.k)
        }
    } else if (value || value == "") {
        // Regular attribute
        setAttributeHelper(element, name, value)
    }
}
