// Type-level tests for StyleAttrType, these fail at type-check time rather than at run time

import type { StyleAttrType } from "../src/jsx-runtime/jsx-runtime.ts"

/** Marks values as used */
function use(..._values: unknown[]): void {}

Deno.test("StyleAttrType accepts valid styles and rejects invalid ones", () => {
    const valid: StyleAttrType[] = [
        {display: "flex", marginTop: "4px"},
        {"background-color": "red", "-webkit-line-clamp": "2"},
        {opacity: 0.5, zIndex: 3, flexGrow: 1, lineHeight: 1.5, "font-weight": 700},
        {"--brand-color": "red", "--gap": 4, color: "var(--brand-color)"},
        {color: "red !important", float: "left"},
        {display: undefined, color: null},
    ]

    // @ts-expect-error unknown property
    const typo: StyleAttrType = {colr: "red"}
    // @ts-expect-error unknown hyphen-case property
    const hyphenTypo: StyleAttrType = {"backgrund-color": "red"}
    // @ts-expect-error CSSStyleDeclaration method
    const method: StyleAttrType = {setProperty: "x"}
    // @ts-expect-error number on a property that needs a unit
    const unitNumber: StyleAttrType = {width: 10}
    // @ts-expect-error number on a hyphen-case property that needs a unit
    const hyphenUnitNumber: StyleAttrType = {"margin-top": 4}
    // @ts-expect-error boolean value
    const booleanValue: StyleAttrType = {display: true}
    // @ts-expect-error cssText is not a style property
    const cssText: StyleAttrType = {cssText: "color: red"}

    use(valid, typo, hyphenTypo, method, unitNumber, hyphenUnitNumber, booleanValue, cssText)
})

Deno.test("StyleAttrType checks values against each property's value syntax", () => {
    const valid: StyleAttrType[] = [
        {display: "none", position: "sticky", visibility: "hidden", boxSizing: "border-box"},
        {display: "inline flex", "flex-direction": "row-reverse"},
        {width: "50%", height: "calc(100% - 4px)", minWidth: "fit-content", maxWidth: "min(10px, 5vw)", top: "0"},
        {color: "#fff", backgroundColor: "rgb(0 0 0 / 50%)", borderColor: "rebeccapurple", outlineColor: "currentColor"},
        {margin: "0 auto", padding: "4px 8px 4px 8px", marginTop: "-2.5em"},
        {transitionDuration: "200ms, 1s", animationIterationCount: "infinite"},
        {opacity: "0.5", zIndex: "auto", fontWeight: "bold", lineHeight: "normal"},
        {color: "var(--brand)", margin: "0 var(--gap)", width: "env(safe-area-inset-left)"},
        {display: "inherit", color: "revert-layer"},
        {marginTop: "4px !important", display: "block !important"},
        // Properties whose value syntax has no generated type accept any string
        {border: "1px solid red", gridTemplateColumns: "repeat(3, 1fr)"},
    ]

    // @ts-expect-error unknown keyword
    const keyword: StyleAttrType = {display: "flexx"}
    // @ts-expect-error unknown keyword on a hyphen-case property
    const hyphenKeyword: StyleAttrType = {"flex-direction": "rows"}
    // @ts-expect-error length without a unit
    const noUnit: StyleAttrType = {width: "10"}
    // @ts-expect-error unknown unit
    const unknownUnit: StyleAttrType = {marginTop: "10pz"}
    // @ts-expect-error not a color
    const notColor: StyleAttrType = {color: "notacolor"}
    // @ts-expect-error not a number
    const notNumber: StyleAttrType = {opacity: "half"}
    // @ts-expect-error time without a unit
    const timeNoUnit: StyleAttrType = {transitionDuration: "200"}
    // @ts-expect-error misspelled !important
    const important: StyleAttrType = {marginTop: "4px !importnt"}

    use(valid, keyword, hyphenKeyword, noUnit, unknownUnit, notColor, notNumber, timeNoUnit, important)
})
