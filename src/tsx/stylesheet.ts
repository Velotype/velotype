// CSS stylesheet handling

import { styleSectionMounted } from "./globals.ts"

/** Represents a mounted CSS StyleSheet object */
export type StyleSection = {
    /** Created CSSStyleSheet object that got mounted */
    sheet: CSSStyleSheet
    /** Original CSS text used to create the sheet */
    text: string
    /** Unique key for this sheet */
    key: string
}

/**
 * Append a section of CSS Styles to the page.
 * 
 * @param sheetText The CSS text to inject onto the page.
 * @param sheetKey A unique header, used to detect if this style is already added.
 * @param resetSheet If the Stylesheet should be reset if already set (default: false)
 */
export function setStylesheet(sheetText: string, sheetKey: string, resetSheet: boolean = false): void {
    const sheet = styleSectionMounted.get(sheetKey)
    const sheets = document.adoptedStyleSheets
    if (sheet) {
        // If we should not reset the style, then return
        if (!resetSheet) {
            return
        }
        // Remove old stylesheet, then continue
        const index = sheets.indexOf(sheet.sheet)
        if (index >= 0) {
            sheets.splice(index, 1)
        }
    }
    const styleSheet = new CSSStyleSheet()
    styleSheet.replace(sheetText)
    sheets.push(styleSheet)
    styleSectionMounted.set(sheetKey, {
        sheet: styleSheet,
        text: sheetText,
        key: sheetKey
    })
}
