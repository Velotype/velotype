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

})
