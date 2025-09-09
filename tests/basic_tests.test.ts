/// <reference lib="deno.ns" />

import { afterAll, beforeAll, describe, it } from "jsr:@std/testing/bdd"
import { fail, assertEquals } from "jsr:@std/assert"

import {App} from "jsr:@velotype/veloserver"

import { launch } from "jsr:@astral/astral"
import type { Browser, ElementHandle, Page } from "jsr:@astral/astral"
import { startAppServer } from "./base_server.ts"

const server_port = 3000
const baseUrl = `http://localhost:${server_port}`


describe('basic component rendering', () => {
    let server: App
    let browser: Browser
    let page: Page

    beforeAll(async () => {
        server = await startAppServer(server_port)
        browser = await launch({
            headless: true,
            args: ['--no-sandbox']
        })
        page = await browser.newPage()
        await page.setViewportSize({ width: 400, height: 200 })
    })
    afterAll(async () => {
        await page?.close()
        await browser?.close()
        await server?.close('End basic tests')
    })

    const itWrap = (name: string, module: string, selector: string, testFn: (selection: ElementHandle) => void | Promise<void>) => {
        it({name,
            fn: async () => {
                try {
                    await page.goto(`${baseUrl}/${module}`, {waitUntil: 'networkidle2'})
                    const selection = await page.waitForSelector(selector)
                    if (selection) {
                        await testFn(selection)
                    } else {
                        fail(`ERROR: Selector not found`)
                    }
                } catch (e) {
                    console.log("Exception",e)
                    fail("ERROR: Thrown exception")
                }
            }
        })
    }

    itWrap("render div with text", "basic-div", "#hello-div",
        async (selection: ElementHandle) => {
            const text = await selection.innerHTML()
            assertEquals(text,`Hello Velotype!`)
        }
    )

    itWrap("render div with style string", "basic-div", "#style-string",
        async (selection: ElementHandle) => {
            console.log("styleText-start")
            const styleText = await selection.getAttribute("style")
            console.log("styleText",styleText)
            assertEquals(styleText,`display: flex; margin-top: 4px;`)
        }
    )
    itWrap("render div with style object", "basic-div", "#style-object",
        async (selection: ElementHandle) => {
            const styleText = await selection.getAttribute("style")
            console.log("styleText",styleText)
            assertEquals(styleText,`display: flex; margin-top: 4px;`)
        }
    )

    itWrap("render div with boolean attribute default true", "basic-div", "#boolean-attribute-default-true",
        async (selection: ElementHandle) => {
            assertEquals(await selection.getAttribute("disabled"),"")
        }
    )
    itWrap("render div with boolean attribute default true", "basic-div", "#boolean-attribute-explicit-true",
        async (selection: ElementHandle) => {
            assertEquals(await selection.getAttribute("disabled"),"")
        }
    )
    itWrap("render div with boolean attribute default true", "basic-div", "#boolean-attribute-explicit-false",
        async (selection: ElementHandle) => {
            assertEquals(await selection.getAttribute("disabled"),null)
        }
    )

    itWrap("button onclick with RenderBasic", "basic-div", "#button-onclick",
        async (_selection: ElementHandle) => {
            const text = await (await page.waitForSelector("#button-onclick span")).innerHTML()
            assertEquals(text,"false")
            
            await (await page.waitForSelector("#button-onclick")).click()

            const text2 = await (await page.waitForSelector("#button-onclick span")).innerHTML()
            assertEquals(text2,"true")
        }
    )

    itWrap("render void", "return-types", "#component-return-void div", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"display: none;")
    })
    itWrap("render null", "return-types", "#component-return-null div", async (selection: ElementHandle) => {
            assertEquals(await selection.getAttribute("style"),"display: none;")
    })
    itWrap("render undefined", "return-types", "#component-return-undefined div", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"display: none;")
    })

    itWrap("render text", "return-types", "#component-return-text div", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"display: contents;")
        assertEquals(await selection.innerHTML(),"test text")
    })

    itWrap("render boolean", "return-types", "#component-return-boolean div", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"display: contents;")
        assertEquals(await selection.innerHTML(),"true")
    })
    itWrap("render number", "return-types", "#component-return-number div", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"display: contents;")
        assertEquals(await selection.innerHTML(),"1")
    })
    itWrap("render string", "return-types", "#component-return-string div", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"display: contents;")
        assertEquals(await selection.innerHTML(),"test string")
    })
    itWrap("render bigint", "return-types", "#component-return-bigint div", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"display: contents;")
        assertEquals(await selection.innerHTML(),"1")
    })

    itWrap("render array", "return-types", "#component-return-array div", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"display: contents;")
        assertEquals(await selection.innerHTML(),"<div>1</div><span>2</span>3456false")
    })

    itWrap("render component", "return-types", "#component-return-component div", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"display: contents;")
        assertEquals(await selection.innerText(),"test string")
    })
    itWrap("render render-object", "return-types", "#component-return-render-object div", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"display: contents;")
        assertEquals(await selection.innerText(),"2")
    })
    itWrap("render render-basic", "return-types", "#component-return-render-basic div", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"display: contents;")
        assertEquals(await selection.innerText(),"2")
    })

    itWrap("render html-element", "return-types", "#component-return-html-element div", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"display: inline-block;")
    })
    itWrap("render svg-element", "return-types", "#component-return-svg-element svg", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"test style")
    })
    itWrap("render mathml-element", "return-types", "#component-return-mathml-element math", async (selection: ElementHandle) => {
        assertEquals(await selection.getAttribute("style"),"test style")
    })

    itWrap("render component-children-string", "attrs-types", "#component-children-string div", async (selection: ElementHandle) => {
        assertEquals(await selection.innerText(),"string")
    })
    itWrap("render component-children-number", "attrs-types", "#component-children-number div", async (selection: ElementHandle) => {
        assertEquals(await selection.innerText(),"1")
    })
    itWrap("render component-children-html", "attrs-types", "#component-children-html span", async (selection: ElementHandle) => {
        assertEquals(await selection.innerText(),"span")
    })

    itWrap("render component-only-children-string", "attrs-types", "#component-only-children-string div", async (selection: ElementHandle) => {
        assertEquals(await selection.innerText(),"string")
    })
    itWrap("render component-only-children-number", "attrs-types", "#component-only-children-number div", async (selection: ElementHandle) => {
        assertEquals(await selection.innerText(),"1")
    })
    itWrap("render component-only-children-html", "attrs-types", "#component-only-children-html span", async (selection: ElementHandle) => {
        assertEquals(await selection.innerText(),"span")
    })

    itWrap("render component-children-attr-string", "attrs-types", "#component-children-attr-string div", async (selection: ElementHandle) => {
        assertEquals(await selection.innerText(),"string")
    })
    itWrap("render component-children-attr-number", "attrs-types", "#component-children-attr-number div", async (selection: ElementHandle) => {
        assertEquals(await selection.innerText(),"1")
    })
    itWrap("render component-children-attr-html", "attrs-types", "#component-children-attr-html span", async (selection: ElementHandle) => {
        assertEquals(await selection.innerText(),"span")
    })

})
