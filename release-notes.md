# Release notes

Changes in each version of `@velotype/velotype` published to [JSR](https://jsr.io/@velotype/velotype), newest first. Dates are JSR publish dates.

**Breaking** marks a change that can require updates to code that uses Velotype.

## Unreleased

- **Breaking:** `StyleAttrType` (the type of the `style` attribute and of `StylePassthroughAttrs.style`) only accepts known CSS properties, taken from the DOM lib's `CSSStyleDeclaration`. Properties can be written in lowerCamelCase (`marginTop`) or hyphen-case (`"margin-top"`), and custom properties (`"--name"`) are accepted. Numbers are only accepted for custom properties and for properties that take no unit, such as `opacity`, `zIndex`, and `flexGrow`.
- **Breaking:** the values of 135 commonly used CSS properties are checked, such as `display`, `position`, `width`, `margin`, `color`, `opacity`, and `transitionDuration`. Keywords must be ones the property accepts, lengths and times need a unit, and colors must be a named color, `#hex`, or a color function. Values using `var()`, `env()`, `attr()`, math functions such as `calc()`, and the CSS-wide keywords (`inherit`, `initial`, ...) are always accepted. Other properties accept any string.
- New `CSSPropertyName`, `UnitlessCSSPropertyName`, `CSSPropertyValues`, `CSSValue`, `CSSLength`, `CSSPercentage`, `CSSLengthPercentage`, `CSSNumber`, `CSSTime`, `CSSColor`, `CSSNamedColor`, and related types.
- Fix: a custom property with an `!important` value had its name converted to hyphen-case (`--brandColor` set `--brand-color`), and a `webkit` property with an `!important` value was set without its leading `-`.

## 0.2.2 — 2026-10-03

- Velotype core is split into one file per concern under `src/tsx/`, and `dom-types.d.ts` into `events.d.ts`, `aria.d.ts`, and `html-attributes.d.ts`. The public API and import paths are unchanged.
- Fix: `<u>` and `<ul>` had each other's attribute types. `<ul>` now only accepts the roles allowed on a list, and `<u>` accepts any role.

## 0.2.1 — 2026-10-03

- **Breaking:** `vtKey` (and `HasVtKey.vtKey`) is now a `number` instead of a `string`.
- `Component`'s `refresh()`, `replaceChild()`, `appendToChild()`, `prependToChild()`, `replaceChildrenOfChild()`, and `removeChild()` are created on first use instead of on construction, making Components faster to create.
- Faster `emitEvent()`, which now only checks for listeners removed during dispatch after a removal has happened.
- Shorter log messages, each prefixed with `vt:`. Warnings now use `console.warn()` instead of `console.log()`.
- `__vtAppMetadata` includes the Velotype `version`, which the devtools hook reports to the velodevtools extension. velodevtools supports 0.2.1 and later.

## 0.2.0 — 2026-10-03

- New `RenderTemplateArray`: renders an array of data by cloning a template element for each row. It is much faster than `RenderObjectArray` for rows that do not contain Components or RenderObjects, and supports `push()`, `pushAll()`, `deleteAt()`, `delete()`, `getAt()`, `setAt()`, `swap()`, and `clear()`. Its `on` option adds event listeners to the wrapper element that are called with the row, data, and index of the event.
- New `UpdateRefsType` type parameter on `RenderObject`, `RenderObjectArray`, `UpdateHandlerLink`, `RenderObjectHandleUpdateType`, and `RenderObjectRenderFunctionType`, so that `updateRefs` no longer needs to be `any`.
- New `BubblingEventName` and `NonBubblingEventName` types.
- **Breaking:** the debugging exports (`__vtAppMetadata`, `VtAppMetadata`, `getDevtoolsHook`, `VelotypeDevtoolsHook`, `VelotypeDevtoolsInstanceMetadata`) moved to the new `@velotype/velotype/devtools` entry point.
- **Breaking:** `MultiRenderable` and `Mountable` are no longer exported.
- **Breaking:** `Component.mount()`, `unmount()`, and `render()`, and the internal methods of `RenderObject`, are now `protected`. Subclasses can still override them.
- **Breaking:** `Component.attrs` and `children`, `UpdateHandlerLink.result` and `updateRefs`, and the fields of `VelotypeEvent` are now `readonly`.

## 0.1.1 — 2026-09-29

- New `RenderObjectArray.swap(indexA, indexB)`: swaps two data points and moves their rendered elements, without re-rendering.

## 0.1.0 — 2026-09-28

Performance and correctness release.

- **Breaking:** elements no longer carry a `vk` attribute. Velotype tracks elements with a Symbol property instead, and `setDomKey()` is removed. In `__vtAppMetadata`, `domKeyName` is replaced by `domKeyProperty`.
- **Breaking:** `RenderObject`'s internal `renderDefault()` and `unmountKey()` methods are renamed.
- The event bus supports multiple listeners on the same key from the same owner.
- `registerOnChangeListener()`'s `eventDispatchDelay` applies per listener. A delayed listener is skipped if it is removed, or its owner unmounts, during the delay.
- `registerOnChangeListener()` and `registerOnMount()` return `this`, typed as the subclass.
- Fix: a RenderObject's event listeners leaked after it was released.
- Fix: `createElement()` now sets attributes after appending children, so that attributes like `<select value>` apply to the children. `<input type="range">` sets `value` last, after `min` and `max`.
- Fix: `false` children render nothing instead of the text "false", and a Component that renders `0` shows `0` instead of a hidden placeholder.
- Fix: `RenderBasic.setString("false")` set `true` for boolean RenderBasics.
- Fix: `passthroughAttrsToElement()` produced an invalid class when the element had no class.
- Fix: `replaceChild()` did not unmount the replaced element itself, or mount its replacement.
- The `{handler, options}` form of event listener attributes no longer requires `options`.
- `RenderObject.set()` compares with `!==` instead of `!=`.
- `RenderBasic` updates its text node in place instead of re-rendering.
- Performance: wrapper and placeholder elements are cloned from templates, setter lookups are cached per prototype and per style property, the DOM tree walk is faster, `jsx()` no longer copies attrs that have no children, and fewer arrays are allocated.

## 0.0.30 — 2026-09-25

- A `RenderObjectArray` with a custom `wrapperElementTag` no longer sets `display:contents` on its wrapper element.
- `replaceElementWithRoot()` accepts `null` (for example from `getElementById()`) and returns `null`.

## 0.0.29 — 2026-09-24

- Components and RenderObjects track whether they are mounted. Each `mount()` runs once until the next `unmount()`, and `unmount()` only runs after a `mount()`.
- RenderObjects attached with `vtwith` are now mounted as well as unmounted.

## 0.0.28 — 2026-09-24

- Fixes for Components changed while not attached to the DOM. Elements are only mounted when connected to the document, and Components that never mounted are not unmounted.
- Rows pushed onto a mounted `RenderObjectArray` are mounted.

## 0.0.27 — 2026-09-08

- New `__VELOTYPE_DEVTOOLS_HOOK__` global for the velodevtools extension, with the `getDevtoolsHook()` function and the `VtAppMetadata`, `VelotypeDevtoolsHook`, and `VelotypeDevtoolsInstanceMetadata` types. Several Velotype instances on one page each register with the hook.
- `passthroughAttrsToElement()` accepts `HTMLElement`s (it previously accepted SVG and MathML elements too).
- Fixed JSR slow-types errors.
- 0.0.26 was not published; its changes (comments and tests) are included here.

## 0.0.25 — 2025-11-23

- **Breaking:** `registerOnChangeListener(listener, options?)` replaces `registerOnChangeListener(component, listener, triggerOnRegistration?, eventDispatchDelay?)`. The listener is released with the `options.hasVtKey` object, which defaults to the RenderObject itself.
- **Breaking:** the `style` attribute only accepts an object, not a string. `StyleObjectAttrType` is renamed to `StyleAttrType`.

## Early development versions (0.0.1 – 0.0.24)

Published between 2025-08-06 and 2025-09-21, while the API was taking shape. 0.0.1 – 0.0.8 are yanked on JSR.

- **0.0.24** (2025-09-21): **Breaking:** removed the `./tsx-micro` and `./tsx-mini` entry points, which moved to their own packages (velomicro and velomini).
- **0.0.23** (2025-09-15): new `vtwith` attribute, which attaches RenderObjects to an element so that they are mounted and released with it. `passthroughAttrsToElement()` returns the same element type it is given.
- **0.0.22** (2025-09-13): new `passthroughAttrsToElement()`, which applies `id`, `class`, and `style` attrs to an element.
- **0.0.21** (2025-09-13): new `IdAttr` type. `StylePassthroughAttrs.style` only accepts an object.
- **0.0.20** (2025-09-09): new `StylePassthroughAttrs` type. `CSSProperties` is renamed to `StyleObjectAttrType`, and the new `StyleAttrType` accepts a style object or a string.
- **0.0.19** (2025-09-07): **Breaking:** `ChildTypes` and `ChildrenTypes` are replaced by `RenderableElements`, and `Component` takes one type parameter, `Component<AttrsType>`.
- **0.0.18** (2025-08-25): **Breaking:** removed the `./webserver` entry point, which moved to [`@velotype/veloserver`](https://jsr.io/@velotype/veloserver).
- **0.0.17** (2025-08-23): fix for boolean attributes on custom elements, and other attributes without a property setter. `true` sets an empty attribute and `false` omits it, while `aria-` and `data-` attributes are set to `"true"` or `"false"`.
- **0.0.16** (2025-08-23): event listener attributes that start with `on-` use the rest of the name exactly, for custom events with uppercase letters (`on-myEvent`), and other event names are lowercased. `jsxDEV()` records the source file name, line number, and column number on each element's attrs.
- **0.0.15** (2025-08-23): faster `RenderObjectArray.pushAll()`. Fix: `RenderObjectArray.deleteAt()` without a `deleteCount` deletes one data point.
- **0.0.14** (2025-08-22): fix: `RenderObjectArray.pushAll()` did not pass `handleUpdate` to new rows.
- **0.0.13** (2025-08-21): `RenderBasic` renders into a `<span style="display:contents;">` so that it does not affect layout. A RenderObject's render function receives the RenderObject as its second argument (`thisArg`). Documentation for all of the DOM types.
- **0.0.12** (2025-08-18): a RenderObject can render each of its elements with a different render function, using `render(renderFunction, handleUpdate)`. New exports `setAttrsOnElement()` and `replaceElementWithRoot()`. The JSX types are split into `jsx-types.d.ts` and `dom-types.d.ts`, and types that are not JSX-specific moved out of the `JSX` namespace.
- **0.0.11** (2025-08-16): **Breaking:** the main entry point (`.`) is now the jsx-runtime, the `./tsx` entry point is removed, and `EventListener` is renamed to `VelotypeEventListener`.
- **0.0.10** (2025-08-13): new `./tsx-micro` and `./tsx-mini` entry points, and new exports `createFragment()`, `setDomKey()`, and the `Source` type (in the jsx-dev-runtime). HTML attribute types use lowercase names. Removed the `*Capture` event handler attributes and deprecated event types.
- **0.0.9** (2025-08-09): children typing fixes. The earliest version that is not yanked.
- **0.0.4 – 0.0.8** (2025-08-09, yanked): children typing fixes, the `ChildrenAttr` type, `RenderBasic` and `RenderObjectArray` children, and documentation. `RenderObjectArrayRenderFunctionType` is renamed to `RenderObjectRenderFunctionType`.
- **0.0.3** (2025-08-09, yanked): only the `react-jsx` transform is supported. Event listeners accept `AddEventListenerOptions`, custom elements are supported, and `StyleSection` is exported.
- **0.0.2** (2025-08-07, yanked): jsx-runtime support for the `react-jsx` transform, the `./jsx-runtime`, `./jsx-dev-runtime`, and `./webserver` entry points, and explicit return types for JSR.
- **0.0.1** (2025-08-06, yanked): first JSR release, with `ObjectComponent` renamed to `RenderObject`.
