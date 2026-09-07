
import { afterAll, beforeAll, describe, it } from "@std/testing/bdd"
import { fail, assertEquals } from "@std/assert"

import {App} from "@velotype/veloserver"

import { launch } from "@astral/astral"
import type { Browser, ElementHandle, Page } from "@astral/astral"
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
                        fail(`ERROR: Selector not found: ${selector}`)
                    }
                } catch (e) {
                    console.log("Exception",e)
                    fail("ERROR: Thrown exception")
                }
            }
        })
    }
    type TestVariation = {
        selector: string
        text?: string
        html?: string
        attributes?: {
            name: string
            value: string
        }[]
    }
    const testVariations = async (setOfVariations: TestVariation[]) => {
        for (const variant of setOfVariations) {
            console.log("testing variant:", variant)
            const selection = await page.waitForSelector(variant.selector)
            if (selection) {
                if (variant.text) {
                    assertEquals(await selection.innerText(),variant.text)
                }
                if (variant.html) {
                    assertEquals(await selection.innerHTML(),variant.html)
                }
                if (variant.attributes) {
                    for (const attribute of variant.attributes) {
                        assertEquals(await selection.getAttribute(attribute.name),attribute.value)
                    }
                }
            } else {
                fail(`ERROR: Selector not found: #${variant}`)
            }
        }
    }

    itWrap("set of basic-div tests", "basic-div", "#hello-div", async (_pageLoadSelection: ElementHandle) => {
        let selection: ElementHandle
        selection = await page.waitForSelector("#boolean-attribute-default-true")
        assertEquals(await selection.getAttribute("disabled"),"")

        selection = await page.waitForSelector("#boolean-attribute-explicit-true")
        assertEquals(await selection.getAttribute("disabled"),"")

        selection = await page.waitForSelector("#boolean-attribute-explicit-false")
        assertEquals(await selection.getAttribute("disabled"),null)

        // button onclick with RenderBasic<boolean>
        const text = await (await page.waitForSelector("#button-onclick span")).innerHTML()
        assertEquals(text,"false")
        await (await page.waitForSelector("#button-onclick")).click()
        const text2 = await (await page.waitForSelector("#button-onclick span")).innerHTML()
        assertEquals(text2,"true")

        // button onclick with RenderBasic<number>
        const textNum0 = await (await page.waitForSelector("#button-onclick-times span")).innerHTML()
        assertEquals(textNum0,"0")
        await (await page.waitForSelector("#button-onclick-times")).click()
        const textNum1 = await (await page.waitForSelector("#button-onclick-times span")).innerHTML()
        assertEquals(textNum1,"1")
        await (await page.waitForSelector("#button-onclick-times")).click()
        const textNum2 = await (await page.waitForSelector("#button-onclick-times span")).innerHTML()
        assertEquals(textNum2,"2")
        await (await page.waitForSelector("#button-onclick-times")).click()
        const textNum3 = await (await page.waitForSelector("#button-onclick-times span")).innerHTML()
        assertEquals(textNum3,"3")

        const setOfVariations = [
            {selector: "#hello-div", html: "Hello Velotype!"},

            {selector: "#style-object", attributes: [{name: "style", value: "display: flex; margin-top: 4px;"}]},
        ]
        await testVariations(setOfVariations)
    })

    itWrap("set of return-type tests", "return-types", "#component-return-void", async (_pageLoadSelection: ElementHandle) => {
        const setOfVariations = [
            {selector: "#component-return-void div", attributes: [{name: "style", value: "display: none;"}]},
            {selector: "#component-return-null div", attributes: [{name: "style", value: "display: none;"}]},
            {selector: "#component-return-undefined div", attributes: [{name: "style", value: "display: none;"}]},

            {selector: "#component-return-text div", attributes: [{name: "style", value: "display: contents;"}], html: "test text"},

            {selector: "#component-return-boolean div", attributes: [{name: "style", value: "display: contents;"}], html: "true"},
            {selector: "#component-return-number div", attributes: [{name: "style", value: "display: contents;"}], html: "1"},
            {selector: "#component-return-string div", attributes: [{name: "style", value: "display: contents;"}], html: "test string"},
            {selector: "#component-return-bigint div", attributes: [{name: "style", value: "display: contents;"}], html: "1"},

            {selector: "#component-return-array div", attributes: [{name: "style", value: "display: contents;"}], html: "<div>1</div><span>2</span>3456false"},

            {selector: "#component-return-component div", attributes: [{name: "style", value: "display: contents;"}], text: "test string"},
            {selector: "#component-return-render-object div", attributes: [{name: "style", value: "display: contents;"}], text: "2"},
            {selector: "#component-return-render-basic div", attributes: [{name: "style", value: "display: contents;"}], text: "2"},

            {selector: "#component-return-html-element div", attributes: [{name: "style", value: "display: inline-block;"}]},
            {selector: "#component-return-svg-element svg", attributes: [{name: "style", value: "test style"}]},
            {selector: "#component-return-mathml-element math", attributes: [{name: "style", value: "test style"}]}
        ]
        await testVariations(setOfVariations)
    })

    itWrap("set of attrs-types tests", "attrs-types", "#component-children-string", async (_pageLoadSelection: ElementHandle) => {
        const setOfVariations = [
            {selector: "#component-children-string div", text: "string"},
            {selector: "#component-children-number div", text: "1"},
            {selector: "#component-children-html span", text: "span"},

            {selector: "#component-only-children-string div", text: "string"},
            {selector: "#component-only-children-number div", text: "1"},
            {selector: "#component-only-children-html span", text: "span"},

            {selector: "#component-children-attr-string div", text: "string"},
            {selector: "#component-children-attr-number div", text: "1"},
            {selector: "#component-children-attr-html span", text: "span"},

            {selector: "#component-with-id", text: "1"},
            {selector: "#component-with-style-pass-through", attributes: [{name: "class", value: "component-class custom-class"},{name: "style", value: "margin-top: 5px;"}]},
            {selector: "#component-with-style-override-base", attributes: [{name: "class", value: "component-class custom-class"},{name: "style", value: "margin-top: 3px;"}]},
            {selector: "#component-with-style-override-custom", attributes: [{name: "class", value: "component-class custom-class"},{name: "style", value: "margin-top: 5px;"}]},

            {selector: "#component-passthrough-helper-with-id", text: "1"},
            {selector: "#component-passthrough-helper-with-style-pass-through", attributes: [{name: "class", value: "component-class custom-class"},{name: "style", value: "margin-top: 5px;"}]},
            {selector: "#component-passthrough-helper-with-style-override-base", attributes: [{name: "class", value: "component-class custom-class"},{name: "style", value: "margin-top: 3px;"}]},
            {selector: "#component-passthrough-helper-with-style-override-custom", attributes: [{name: "class", value: "component-class custom-class"},{name: "style", value: "margin-top: 5px;"}]}
        ]
        await testVariations(setOfVariations)
    })

    itWrap("set of event-triggers tests", "event-triggers", "#div-toggle-one-layer-refresh", async (_pageLoadSelection: ElementHandle) => {
        const setOfVariations = ["div-toggle-one-layer-refresh", "div-toggle-two-layers-refresh", "div-toggle-same-layer-refresh",
            "div-toggle-one-layer-replace-child", "div-toggle-two-layers-replace-child", "div-toggle-same-layer-replace-child",
            "button-toggle-one-layer-refresh button", "button-toggle-two-layers-refresh button", "button-toggle-same-layer-refresh button",
            "button-toggle-one-layer-replace-child button", "button-toggle-two-layers-replace-child button", "button-toggle-same-layer-replace-child button"
        ]
        for (const variant of setOfVariations) {
            console.log("testing variant:", variant)
            let selection = await page.waitForSelector(`#${variant}`)
            if (selection) {
                assertEquals(await selection.innerText(),"Close")
                await selection.click()
                selection = await page.waitForSelector(`#${variant}`)
                assertEquals(await selection.innerText(),"Open")
                await selection.click()
                selection = await page.waitForSelector(`#${variant}`)
                assertEquals(await selection.innerText(),"Close")
            } else {
                fail(`ERROR: Selector not found: #${variant}`)
            }
        }
    })

    itWrap("set of raw-tags tests", "raw-tags", "#raw-tags-tests", async (_pageLoadSelection: ElementHandle) => {
        const setOfVariations = [
            {selector: "#raw-html-1-outer-div", html: '<div id="raw-html-1-inner-div">raw html 1</div>'},
            {selector: "#raw-html-1-inner-div", text: 'raw html 1'},
            {selector: "#raw-html-2-outer-div", html: '<div id="raw-html-2-inner-div">raw html 2</div>'},
            {selector: "#raw-html-2-inner-div", text: 'raw html 2'},
            {selector: "#raw-html-3-outer-div", html: '<div id="raw-html-3-inner-div">raw html 3</div>', attributes: [{name: "vtk", value: "raw-html-3-outer-div"}]},
            {selector: "#raw-html-3-inner-div", text: 'raw html 3'},
        ]
        await testVariations(setOfVariations)
    })
    itWrap("set of render-object tests", "render-object", "#render-object-tests", async (_pageLoadSelection: ElementHandle) => {
        let setOfVariations = [
            {selector: "#str1-default", text: 'default'},
            {selector: "#str2-default", text: 'default'},
            {selector: "#str2-custom-1", text: 'default custom render 1'},
            {selector: "#str2-custom-2", text: 'default custom render 2'}
        ]
        await testVariations(setOfVariations)

        let selection: ElementHandle
        selection = await page.waitForSelector("#str1-input")
        await selection.type("str1")
        selection = await page.waitForSelector("#str2-input")
        await selection.type("str2")
        selection = await page.waitForSelector("#str4-input")
        await selection.type("str4")

        setOfVariations = [
            {selector: "#str1-default", text: 'str1'},
            {selector: "#str2-default", text: 'str2'},
            {selector: "#str2-custom-1", text: 'str2 custom render 1'},
            {selector: "#str2-custom-2", text: 'str2 custom render 2'},
            {selector: "#str3-default", text: 'str4'},
            {selector: "#str4-default", text: 'str4'},
        ]
        await testVariations(setOfVariations)
    })

    itWrap("set of render-object-array tests", "render-object-array", "#render-object-array-tests", async (_pageLoadSelection: ElementHandle) => {
        const innerTextOf = async (selector: string) => (await (await page.waitForSelector(selector)).innerText()).replace(/\s+/g, " ").trim()

        assertEquals(await innerTextOf("#todos-length"), "0")

        await (await page.waitForSelector("#push-one")).click()
        assertEquals(await innerTextOf("#todos-length"), "1")
        assertEquals(await innerTextOf("#todo-list"), "one")
        assertEquals(await (await page.waitForSelector("#todo-list")).getAttribute("class"), "todo-wrapper")

        await (await page.waitForSelector("#push-all")).click()
        assertEquals(await innerTextOf("#todos-length"), "3")
        assertEquals(await innerTextOf("#todo-list"), "one two three")

        await (await page.waitForSelector("#set-at-0")).click()
        assertEquals(await innerTextOf("#todo-list"), "one-updated two three")

        await (await page.waitForSelector("#delete-at-0")).click()
        assertEquals(await innerTextOf("#todos-length"), "2")
        assertEquals(await innerTextOf("#todo-list"), "two three")

        await (await page.waitForSelector("#delete-value")).click()
        assertEquals(await innerTextOf("#todos-length"), "1")
        assertEquals(await innerTextOf("#todo-list"), "two")

        await (await page.waitForSelector("#clear-all")).click()
        assertEquals(await innerTextOf("#todos-length"), "0")
        assertEquals(await innerTextOf("#todo-list"), "")
    })

    itWrap("set of function-components tests", "function-components", "#function-components-tests", async (_pageLoadSelection: ElementHandle) => {
        const setOfVariations = [
            {selector: "#greeting", text: "Hello Velotype"},
            {selector: "#wrapper-with-children", text: "Note: important text"},
            {selector: "#fragment-one", text: "fragment-one"},
            {selector: "#fragment-two", text: "fragment-two"},
        ]
        await testVariations(setOfVariations)
    })

    itWrap("set of lifecycle tests", "lifecycle", "#lifecycle-tests", async (_pageLoadSelection: ElementHandle) => {
        const innerTextOf = async (selector: string) => (await (await page.waitForSelector(selector)).innerText()).replace(/\s+/g, " ").trim()

        // mount() fires when the child first appears
        assertEquals(await innerTextOf("#lifecycle-child"), "mounts: 1")

        // toggling off must unmount() the old instance, toggling back on mounts a fresh one exactly once
        await (await page.waitForSelector("#toggle-child")).click()
        assertEquals(await innerTextOf("#unmount-count"), "1")

        await (await page.waitForSelector("#toggle-child")).click()
        assertEquals(await innerTextOf("#lifecycle-child"), "mounts: 1")

        // getComponent() reaches back into the live class instance behind a rendered element
        await (await page.waitForSelector("#call-get-component")).click()
        assertEquals(await innerTextOf("#get-component-result"), "called")

        // imperative child-mutation helpers operate on real, already-mounted DOM nodes
        await (await page.waitForSelector("#append-item")).click()
        assertEquals(await innerTextOf("#child-ops-list"), "a b c")

        await (await page.waitForSelector("#prepend-item")).click()
        assertEquals(await innerTextOf("#child-ops-list"), "z a b c")

        await (await page.waitForSelector("#remove-item-a")).click()
        assertEquals(await innerTextOf("#child-ops-list"), "z b c")

        await (await page.waitForSelector("#replace-children")).click()
        assertEquals(await innerTextOf("#child-ops-list"), "only")
    })

    itWrap("set of misc tests", "misc", "#misc-tests", async (_pageLoadSelection: ElementHandle) => {
        const innerTextOf = async (selector: string) => (await (await page.waitForSelector(selector)).innerText()).replace(/\s+/g, " ").trim()

        // setStylesheet() actually applies computed styles via an adopted stylesheet
        const color = await page.evaluate(() => {
            const el = document.getElementById("stylesheet-test-class")
            return el ? getComputedStyle(el).color : null
        })
        assertEquals(color, "rgb(255, 0, 0)")

        // RenderBasic.setString()/getString() round-trip through real string<->number parsing
        await (await page.waitForSelector("#set-string-btn")).click()
        assertEquals(await innerTextOf("#number-value"), "42")

        await (await page.waitForSelector("#get-string-btn")).click()
        assertEquals(await innerTextOf("#string-result"), "42")

        // The {handler, options} event attr form honors AddEventListenerOptions (here: {once: true})
        const onceButton = await page.waitForSelector("#once-button")
        await onceButton.click()
        await onceButton.click()
        await onceButton.click()
        assertEquals(await innerTextOf("#once-button span"), "1")

        // on-<name> attrs register a listener under the literal (non-lowercased) event name
        await (await page.waitForSelector("#dispatch-custom-event")).click()
        await (await page.waitForSelector("#dispatch-custom-event")).click()
        assertEquals(await innerTextOf("#custom-event-target span"), "2")
    })

    itWrap("set of event-bus tests", "event-bus", "#event-bus-tests", async (_pageLoadSelection: ElementHandle) => {
        const innerTextOf = async (selector: string) => (await (await page.waitForSelector(selector)).innerText()).replace(/\s+/g, " ").trim()

        // registerEventListener() ran during mount() for subscribers a, b, c and the emitter itself
        assertEquals(await innerTextOf("#listeners-count"), "4")

        // emitEvent() delivers a VelotypeEvent (event name + data + emittingObject) to every listener on the key
        await (await page.waitForSelector("#emit-button")).click()
        for (const label of ["a", "b", "c"]) {
            assertEquals(await innerTextOf(`#subscriber-${label} .received-count`), "1")
            assertEquals(await innerTextOf(`#subscriber-${label} .last-event-name`), "custom-event-name")
            assertEquals(await innerTextOf(`#subscriber-${label} .last-event-data`), "hello")
            assertEquals(await innerTextOf(`#subscriber-${label} .last-emitting-object-matches`), "true")
        }
        // The emitter passed itself as emitEvent()'s hasVtKey, so its own same-key listener must be skipped
        assertEquals(await innerTextOf("#emitter-received-own-event-count"), "0")

        // Unmounting subscriber a must automatically remove its listener (registerEventListener's documented cleanup contract)
        await (await page.waitForSelector("#unmount-subscriber-a")).click()
        assertEquals(await innerTextOf("#listeners-count"), "3")
        assertEquals((await (await page.waitForSelector("#subscriber-a-wrapper")).innerText()).trim(), "")

        await (await page.waitForSelector("#emit-button")).click()
        assertEquals(await innerTextOf("#subscriber-b .received-count"), "2")
        assertEquals(await innerTextOf("#subscriber-c .received-count"), "2")
        assertEquals(await innerTextOf("#emitter-received-own-event-count"), "0")

        // removeEventListeners() manually unregisters a still-mounted Component's listener
        await (await page.waitForSelector("#remove-subscriber-c-listener")).click()
        assertEquals(await innerTextOf("#listeners-count"), "2")

        await (await page.waitForSelector("#emit-button")).click()
        assertEquals(await innerTextOf("#subscriber-b .received-count"), "3")
        // c is still mounted but its listener was removed, so its count must not have advanced
        assertEquals(await innerTextOf("#subscriber-c .received-count"), "2")
    })

    itWrap("set of devtools-hook tests", "devtools-hook", "#devtools-hook-tests", async (_pageLoadSelection: ElementHandle) => {
        const innerTextOf = async (selector: string) => (await (await page.waitForSelector(selector)).innerText()).replace(/\s+/g, " ").trim()

        // The test page pre-seeds a fake hook instance claiming domKeyName "vk" before this bundle loads,
        // so installDevtoolsHook() must detect the collision and pick a non-colliding name instead
        assertEquals(await innerTextOf("#dom-key-name"), "vk-2")
        // Both the fake pre-seeded instance and this page's real Velotype instance must be registered
        assertEquals(await innerTextOf("#hook-instances-size"), "2")

        // unregister() removes this instance from the hook's registry
        await (await page.waitForSelector("#unregister-self")).click()
        assertEquals(await innerTextOf("#unregister-result"), "removed")
    })

    itWrap("set of render-object-advanced tests", "render-object-advanced", "#render-object-advanced-tests", async (_pageLoadSelection: ElementHandle) => {
        const innerTextOf = async (selector: string) => (await (await page.waitForSelector(selector)).innerText()).replace(/\s+/g, " ").trim()

        // RenderObject.registerOnMount()'s onMount callback fires when the owning Component mounts
        assertEquals(await innerTextOf("#register-on-mount-child"), "on-mount calls: 1")

        // registerOnMount()'s onUnmount callback fires when the owning Component unmounts
        await (await page.waitForSelector("#unmount-register-on-mount-child")).click()
        assertEquals(await innerTextOf("#global-on-unmount-call-count"), "1")

        // UpdateHandlerLink/handleUpdate: the first render calls the renderFunction exactly once
        assertEquals(await innerTextOf("#full-render-call-count"), "1")
        assertEquals(await innerTextOf("#handle-update-call-count"), "0")

        // Subsequent updates must take the handleUpdate fast path instead of calling the renderFunction again
        await (await page.waitForSelector("#increment-counter")).click()
        assertEquals(await innerTextOf("#full-render-call-count"), "1")
        assertEquals(await innerTextOf("#handle-update-call-count"), "1")
        assertEquals(await innerTextOf(".counter-value"), "1")

        await (await page.waitForSelector("#increment-counter")).click()
        await (await page.waitForSelector("#increment-counter")).click()
        assertEquals(await innerTextOf("#full-render-call-count"), "1")
        assertEquals(await innerTextOf("#handle-update-call-count"), "3")
        assertEquals(await innerTextOf(".counter-value"), "3")
    })
})
