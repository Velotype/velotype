# Velotype
Fast and small TSX framework for creating high performance websites

Differences from react/preact:
* Focuses on Object Oriented Classes (no use*() function calls)
* Create and manipulate DOM elements directly (no Virtual DOM, no reconciliation engine)
* Write the same as if you are writing native HTML (use element Attributes instead of Properties)
* No state management (use Classes as they are intended with fields and methods)
* High performance (close to hand-written JavaScript)
* Small payload (~17kb minified, ~6kb gzipped, and bundlers can drop the parts that are not imported)

## Setup

Add Velotype to a Deno project with `deno add jsr:@velotype/velotype`, and point the TSX compiler at it in `deno.json`:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@velotype/velotype",
        "lib": ["dom", "deno.ns", "esnext"]
    }
}
```

`"jsx": "react-jsxdev"` uses the dev runtime instead, which supports [hot reloading](#hot-reloading).

### Mounting the app

`replaceElementWithRoot(root, element)` replaces an element that is already in the page with the app's root element and mounts its Components. It accepts `null`, so the result of `document.getElementById()` can be passed directly.

```tsx
replaceElementWithRoot(<App/>, document.getElementById("app"))
```

It is not limited to the app's root element: to add Velotype content to a part of the page that other code manages (such as a dialog or a third-party widget), insert a placeholder element there and replace it.

`removeElementRoot(element)` is its counterpart: it unmounts and releases the Components and RenderObjects in `element`, then removes it. Use it to remove content that is not part of a Component's render, such as the app root or content added to a part of the page that other code manages, before that code removes it. Velotype only unmounts what it removes itself, so content that is removed with DOM methods is not unmounted.

```tsx
const dialogContent = replaceElementWithRoot(<DialogContent/>, dialog.placeholder)
// When the dialog closes
removeElementRoot(dialogContent)
```

## Basic properties of Velotype TSX

### Returns HTMLElements directly

Velotype is built to be nearly native javascript and will return raw HTMLElements directly

```tsx
const divTag: HTMLDivElement = <div>this is a div</div>
```

### Uses HTML Attributes

Velotype calls `HTMLElement.setAttribute()` so you write TSX the same as if you were writing HTML to the page.

```tsx
const divTag: HTMLDivElement = <div class="exampleClass">this is a div</div>
```

### Supports style objects

Velotype resolves style objects to make inline styling quick and easy.

```tsx
const divTag: HTMLDivElement = <div style={{display: "inline", marginTop: "4px"}}>this is a div</div>
```

Style objects are type checked. Property names must be CSS properties, in lowerCamelCase (`marginTop`) or hyphen-case (`"margin-top"`), or custom properties (`"--brand-color"`). The values of commonly used properties are checked too: keywords must be ones the property accepts, lengths and times need a unit, and colors must be a named color, `#hex`, or a color function. Numbers are accepted only for properties that take no unit, such as `opacity` and `zIndex`. A value can end with ` !important`, and values using `var()`, `calc()` and other CSS functions are always accepted. The `style` attribute also accepts a string.

### Event listeners

Attributes that start with `on` add event listeners. Pass `{handler, options}` to set `addEventListener()` options, and use `on-` to listen for a custom event by its exact name.

```tsx
const button = <button type="button" onClick={() => console.log("clicked")}>Click me</button>
const once = <button type="button" onClick={{handler: () => console.log("clicked once"), options: {once: true}}}>Click me once</button>
const custom = <div on-my-event={() => console.log("my-event received")}></div>
```

### Conditional rendering

`false`, `null`, and `undefined` children render nothing, so `{condition && <div/>}` works as expected.

```tsx
const showDetails = false
const element = <div>{showDetails && <div>Details</div>}</div>
```

### Fragments

`<>...</>` groups children without a wrapper element, it returns them as an Array that can be used as children.

```tsx
const items = <><li>one</li><li>two</li></>
const list = <ul>{items}</ul>
```

## Types of Components

Components are the objects that can be created as Tags in tsx `<tag></tag>`

### Function Components

A FunctionComponent can be used in .tsx files to render simple HTML Components.

Note that FunctionComponents must be idempotent with no side effects and do not support mount and unmount lifecycle events.

```tsx
type UserProfile = {
    name: string
    email?: string
    address?: string
}
type UserProfileAttrsType = {
    user: UserProfile
}
export const UserProfile: FunctionComponent<UserProfileAttrsType> = function(attrs: UserProfileAttrsType) {
    return <div>
        <div>Name: {attrs.user.name}</div>
        {attrs.user.email && <div>Email: {attrs.user.email}</div>}
        {attrs.user.address && <div>Address: {attrs.user.address}</div>}
    </div>
}

//Can then be constructed via tsx:
const profile = <div>
    <UserProfile user={{name: "foo", email: "bar@example.com"}} />
</div>
```

### Class Components

A Velotype Class Component that can be used in .tsx files to render HTML Components.

Supports mount, render, and unmount lifecycle events. Override these methods in your Component, Velotype calls them for you.

```tsx
// Define a simple class
class SimpleComponent extends Component<{foo: string}> {
    override render(attrs: Readonly<{foo: string}>) {
        return <div>Hello {attrs.foo}</div>
    }
}
//Can then be constructed via tsx:
const simple = <div><SimpleComponent foo="Component!"></SimpleComponent></div>
```

#### Advanced Class Component usage

Class Components are meant to operate as classes directly and are available to access using the `getComponent()` function which will convert from an Element that was constructed with a given class to the underlying instance of that Class.

```tsx
// Define an advanced class
class AdvancedComponent extends Component<EmptyAttrs> {
    override render() {
        return <div>This is an advanced Component</div>
    }
    someMethod() {
        console.log("AdvancedComponent someMethod() called")
    }
}

//Somewhere else
const foo: AdvancedComponent = getComponent(<AdvancedComponent/>)
foo.someMethod()

//And can be used in tsx directly:
const someVariable = <div>{foo}</div>
```

#### More Complex Component example

Components' lifecycle supports a `mount()`, `render()`, then `unmount()` cycle.

```tsx
type MoreComplexAttrsType = {
    requiredAttr: string,
    optionalAttr?: string
}
class MoreComplexComponent extends Component<MoreComplexAttrsType> {
    renderCallCount: number = 0
    someMethodCallCount: number = 0
    otherMethodCallCount = new RenderBasic<number>(0)
    override mount() {
        console.log("This component was just added to the DOM")
    }
    override unmount() {
        console.log("This component is about to be removed from the DOM")
    }
    override render(attrs: Readonly<MoreComplexAttrsType>, children: RenderableElements[]) {
        this.renderCallCount++
        return <div>
            This is a more complex Component for {attrs.requiredAttr}
            <div>render() has been called: {this.renderCallCount} times</div>
            <button type="button" onClick={this.otherMethod}>click me (RenderBasic) {this.otherMethodCallCount}</button>
            <button type="button" onClick={this.someMethod}>click me (refresh) {this.someMethodCallCount}</button>
            <div>
                Children here:
                <div>{children}</div>
            </div>
        </div>
    }
    otherMethod = () => {
        console.log("MoreComplexComponent otherMethod() called")
        // Update the value of the RenderBasic object, this will rerender only the one {this.otherMethodCallCount} element created in render() above
        this.otherMethodCallCount.value += 1
    }
    someMethod = () => {
        console.log("MoreComplexComponent someMethod() called")
        this.someMethodCallCount += 1

        // Trigger a full rerender of this Component, this will unmount and delete all child Components, then call this.render() and consequently new and mount a fresh set of child Components.
        this.refresh()
    }
}
```

#### Cleaning up with unmountSignal

`this.unmountSignal` is an `AbortSignal` that is aborted just after `unmount()` returns. Pass it to what `mount()` starts, and it is cleaned up without an `unmount()`:

```tsx
class WindowWidth extends Component<EmptyAttrs> {
    width = new RenderBasic<number>(globalThis.innerWidth)
    override mount() {
        globalThis.addEventListener("resize", () => {
            this.width.value = globalThis.innerWidth
        }, {signal: this.unmountSignal})
    }
    override render() {
        return <div>Window width: {this.width}</div>
    }
}
```

It also works with `fetch(url, {signal: this.unmountSignal})`, so a response that arrives after the Component unmounts is not used. The signal is created on first use, and is also aborted when a Component is released without being mounted, such as when its `render()` throws.

#### When lifecycle methods run

* `mount()` runs just after the Component is inserted into the page, before the browser paints, so it can read layout (such as `getBoundingClientRect()`). Child Components mount before their parent. For work that should wait until after the first paint, start it from `mount()` with `requestAnimationFrame()` or `setTimeout()`
* `unmount()` runs just before the Component is removed, while it is still in the page
* `refresh()` unmounts and mounts the Component's children, the Component itself stays mounted
* Moving an element (such as `swap()`, or moving it with DOM methods) does not unmount or mount it
* A Component mounts and unmounts once: once Velotype removes it, it is released, and inserting its element again does not mount it (Velotype warns in the console). Create a new Component instead
* Velotype mounts Components that are inserted through Velotype: `replaceElementWithRoot()`, a Component's child methods, and RenderObjects. An element inserted with DOM methods such as `appendChild()` is not mounted
* Likewise Velotype unmounts Components that are removed through Velotype: `removeElementRoot()`, a Component's child methods, `refresh()`, and RenderObjects. An element removed with DOM methods is not unmounted
* The RenderObjects in a Component's fields mount and unmount with it (calling their `registerOnMount()` callbacks), and the ones in public fields are released when it unmounts. To share a RenderObject between Components, pass it in attrs or keep it in a `#private` field
* Errors thrown by `mount()` and `unmount()` are reported, see [When code throws](#when-code-throws)

#### Changing part of what a Component rendered

A Component's child methods change one element inside what it rendered, without a `refresh()`. Each takes an element from this Component's render, mounts what it inserts, and unmounts what it removes:

* `replaceChild(child, newChild)` replaces `child`, returning the new element
* `appendToChild(child, newChild)` and `prependToChild(child, newChild)` add to the end or start of `child`
* `replaceChildrenOfChild(child, newChildren)` replaces all of `child`'s children
* `removeChild(child)` removes `child`

The methods return `false` (or `child`, for `replaceChild()`) and change nothing when `child` is not part of this Component's render.

```tsx
class Panel extends Component<EmptyAttrs> {
    body: HTMLElement = <div>Loading...</div>
    override mount() {
        fetch("/panel", {signal: this.unmountSignal}).then(response => response.text()).then(text => {
            this.body = this.replaceChild(this.body, <div>{text}</div>) as HTMLElement
        })
    }
    override render() {
        return <section>{this.body}</section>
    }
}
```

## Types of RenderObjects

Create these objects with `new RenderObject<DataType>()` as fields of Component classes (it is advanced behavior to create these in any other way). These can then be used in tsx and will render using the provided render function as many times as that object needs to be rendered and mounted to the DOM. Updates to `obj.value` will trigger rerendering to each rendered instance's location in the DOM.

### RenderObject

A RenderObject is an efficient way of rendering Objects to potentially multiple HTMLElements, changes to the value of the underlying Data Object will propagate to all instance elements.

```tsx
type Person = {
    name: string,
    address: string,
    phone: string
}
class PersonSelector extends Component<EmptyAttrs> {
    selectedPerson = new RenderObject<Person | null>(null, function(person: Person | null) {
        if (!person) {
            return <div></div>
        } else {
            return <div>
                <div>Person:</div>
                <div>Name: {person.name}</div>
                <div>Address: {person.address}</div>
                <div>Phone: {person.phone}</div>
            </div>
        }
    })
    override render() {
        const people = [
            {name: "One person", address: "somewhere", phone: "123"},
            {name: "Two person", address: "elsewhere", phone: "456"},
            {name: "Three person", address: "nowhere", phone: "789"}
        ]
        return <div>
            {people.map((person) => <button type="button" onClick={() => {
                this.selectedPerson.value = person // <-- this is where the RenderObject will trigger rerendering in both the "one place" and the "another place" locations below
            }}>{person.name}</button>)}
            <div>Render selected Person in one place: {this.selectedPerson}</div>
            <div>Render selected Person in another place: {this.selectedPerson}</div>
        </div>
    }
}
```

Setting `value` (or calling `set()`) renders the new value only when it is a different value (`!==`). When the value is an object or Array changed in place, call `rerenderElements(value)` to render it again.

`registerOnMount(onMount, onUnmount)` adds callbacks that run when the Component whose field holds the RenderObject mounts and unmounts. `registerOnChangeListener(listener, options)` runs `listener` after each change of `value`, the options are:

* `hasVtKey`: remove the listener with this Component's lifecycle instead of the RenderObject's (it must already have a `vtKey`, so call this from the Component's `mount()`)
* `triggerOnRegistration`: also run the listener once, just after it is registered
* `eventDispatchDelay`: wait this many milliseconds before running the listener, and run it at most once in that time

#### Updating in place with handleUpdate

By default a new value renders new elements. For elements that change often, return an `UpdateHandlerLink` from the render function with references to the parts that change, and pass a `handleUpdate` function that updates those parts in place. The second type parameter types those references.

```tsx
type Score = {player: string, points: number}
type ScoreRefs = {points: HTMLElement}

class ScoreBoard extends Component<EmptyAttrs> {
    score = new RenderObject<Score, ScoreRefs>({player: "Ada", points: 0}, (score: Score) => {
        const points = <span>{score.points}</span>
        return new UpdateHandlerLink(<div>{score.player}: {points}</div>, {points})
    }, (_element, refs, _oldScore, newScore) => {
        refs.points.textContent = String(newScore.points)
    })
    override render() {
        return <div>
            {this.score}
            <button type="button" onClick={() => {
                this.score.value = {player: this.score.value.player, points: this.score.value.points + 1}
            }}>Add a point</button>
        </div>
    }
}
```

### RenderBasic

A specialization of a RenderObject when the DataType is a BasicType, it renders its value as text inside a `<span style="display:contents;">` and updates that text in place. It supports `getString()` and `setString()` methods, which convert the value to and from a string.

The BasicTypes are `string | number | bigint | boolean`

```tsx
class Counter extends Component<EmptyAttrs> {
    count = new RenderBasic<number>(0)
    override render() {
        return <div>
            <div>Counter value: {this.count}</div>
            <button type="button" onClick={() => this.count.value += 1}>Increment</button>
            <button type="button" onClick={() => this.count.value -= 1}>Decrement</button>
        </div>
    }
}
```

### RenderObjectArray

An optimized RenderObject that represents an Array of data points rendered into a wrapper element (by default a `<div style="display:contents;">` tag). Each data point is rendered by its own RenderObject, so rows can contain anything a render function can return, including Components and RenderObjects.

Use `push()`, `pushAll()`, `insertAt()`, `insertAllAt()`, `deleteAt()`, `delete()`, `getAt()`, `setAt()`, `swap()`, `move()`, `sort()`, `reorder()`, `filter()`, `clear()`, and `length` to change and read the Array. Only the affected rows are rendered, moved, or removed.

`insertAt(index, data)` inserts one data point and `insertAllAt(index, data[])` inserts several, in order, before the data point at `index` (from `0` to `length`, or counting from the end when negative, as `Array.splice()` does). They are separate methods so that a data point can itself be an Array.

#### Sorting, moving, and filtering

These change the order of the rows or which rows are shown by moving the rows that are already rendered, never rendering them again. They are the same on RenderObjectArray and RenderTemplateArray.

* `sort(compareFn)` sorts the data points (as `Array.sort()` does, and stable). Only the rows that change places are moved, so re-sorting a list that is nearly in order, such as a table sorted by a column that a few `setAt()` calls changed, moves only those rows
* `reorder(indexes)` puts the data points in any new order: afterwards the data point at index `k` is the one that was at `indexes[k]`. It throws a `RangeError` unless `indexes` holds each index from `0` to `length - 1` once. Like `sort()`, it moves only the rows that change places
* `move(from, to)` moves one data point and its rows, so that it ends up at index `to` (as removing it with `splice(from, 1)` and inserting it with `splice(to, 0, data)` would)
* `filter(predicate)` shows only the data points that `predicate` returns true for, and `filter(undefined)` shows them all again. The other data points stay in the Array with their rows kept out of the page, so showing them again moves those rows back. Indexes, in `getAt()`, `setAt()`, `swap()`, the `on` listeners of a RenderTemplateArray, and the rest, still count every data point, and `length` is the length of the whole Array. The predicate is also applied to data points added later and to one changed with `setAt()`; call `filter()` again when what it tests for has changed, such as the text in a search box

In a RenderObjectArray, the Components in a row that is filtered out stay mounted while it is out of the page, and a row added while filtered out mounts when it is first shown.

Taking rows out of the page is faster than hiding them (with `hidden` or `display: none`): the browser does less work for each change when a list has fewer rows, and showing them again is faster than rendering them again.

```tsx
type Server = {
    name: string
    cpu: number
}

class ServerList extends Component<EmptyAttrs> {
    servers = new RenderTemplateArray<Server, null>({
        wrapperElementTag: "ul",
        template: <li></li>,
        renderFunction: (row: HTMLElement, server: Server) => {
            row.textContent = `${server.name} ${server.cpu}%`
            return null
        },
    })
    override render() {
        return <div>
            <input type="search" placeholder="Filter" onInput={(event) => {
                const text = (event.target as HTMLInputElement).value
                this.servers.filter(text === "" ? undefined : server => server.name.includes(text))
            }}/>
            <button type="button" onClick={() => this.servers.sort((a, b) => b.cpu - a.cpu)}>Busiest first</button>
            <button type="button" onClick={() => this.servers.move(this.servers.length - 1, 0)}>Last to top</button>
            {this.servers}
        </div>
    }
}
```

```tsx
type Todo = {
    text: string
}

class TodoList extends Component<EmptyAttrs> {
    todos: RenderObjectArray<Todo> = new RenderObjectArray<Todo>({
        wrapperElementTag: "ul",
        renderFunction: (todo: Todo) => <li>{todo.text}</li>
    })
    textInput: HTMLInputElement = <input/>
    addTodo = () => {
        this.todos.push({text: this.textInput.value})
        this.textInput.value = ""
    }
    override render() {
        return <form onSubmit={this.addTodo} action="javascript:">
            <label>
                <span>Add Todo</span>
                {this.textInput}
            </label>
            <button type="submit">Add</button>
            {this.todos}
        </form>
    }
}
```

### RenderTemplateArray

An Array of data points rendered by cloning a template element for each row. Instead of building each row with TSX, the template is built once and every row is a `cloneNode()` of it that `renderFunction` fills in. Rows do not contain Components or RenderObjects, so Velotype has no per-row bookkeeping to do when rows are created, updated, or removed.

It has the same methods as RenderObjectArray: `push()`, `pushAll()`, `insertAt()`, `insertAllAt()`, `deleteAt()`, `delete()`, `getAt()`, `setAt()`, `swap()`, `move()`, `sort()`, `reorder()`, `filter()`, `clear()`, and `length`.

#### When to use RenderTemplateArray

Use RenderTemplateArray for long or frequently rebuilt lists of plain markup, such as tables, logs, and search results, where each row is the same structure with a few changing values. In js-framework-benchmark it creates and replaces rows with about a quarter of the script time of RenderObjectArray, close to hand-written JavaScript, and clears rows in about half the time.

Use RenderObjectArray instead when rows need Components, RenderObjects, or RenderBasics inside them, their own `mount()`/`unmount()` lifecycle, or TSX event handlers on elements inside the row.

#### Rules for templates

* The template must not contain Components, RenderObjects, or event listeners (`cloneNode()` does not copy event listeners)
* Listen for row events with `on`, which adds one listener per event to the wrapper element and calls it with the row element, its data, and its index. Only events that bubble can be listened for (use `focusin`/`focusout` instead of `focus`/`blur`)
* `renderFunction` fills in a new clone with DOM APIs and returns the references that `handleUpdate` needs
* `setAt()` calls `handleUpdate` to update a row in place, without `handleUpdate` the row is replaced with a new clone

```tsx
type Row = {
    id: number
    label: string
}
type RowRefs = {
    label: Text
}

class RowTable extends Component<EmptyAttrs> {
    #nextId = 1
    rows: RenderTemplateArray<Row, RowRefs> = new RenderTemplateArray<Row, RowRefs>({
        wrapperElementTag: "tbody",
        // Built once, then cloned for every row
        template: <tr><td class="id"></td><td class="label"></td><td><button type="button" class="remove">Remove</button></td></tr>,
        // Fill in a new clone, and return the references that handleUpdate needs
        renderFunction: (row: HTMLElement, data: Row) => {
            row.children[0].textContent = String(data.id)
            const label = document.createTextNode(data.label)
            row.children[1].appendChild(label)
            return {label}
        },
        // Update a row in place when setAt() changes its data
        handleUpdate: (_row, refs, _oldData, newData) => {
            refs.label.data = newData.label
        },
        // One click listener on the <tbody> for every row
        on: {
            click: (event, _row, _data, index) => {
                if ((event.target as HTMLElement).closest(".remove")) {
                    this.rows.deleteAt(index)
                }
            }
        }
    })
    override render() {
        return <div>
            <button type="button" onClick={() => this.rows.push({id: this.#nextId++, label: "New row"})}>Add row</button>
            <button type="button" onClick={() => {
                if (this.rows.length > 0) {
                    this.rows.setAt(0, {id: this.rows.getAt(0).id, label: "Renamed row"})
                }
            }}>Rename first row</button>
            <button type="button" onClick={() => this.rows.swap(0, 1)}>Swap first two rows</button>
            <button type="button" onClick={() => this.rows.clear()}>Clear</button>
            <table>{this.rows}</table>
        </div>
    }
}
```

### AsyncRenderObject

A RenderObject for data that arrives later. It shows `pending()` while a Promise is loading, then `render()` with its result, or `onFail()` when it rejects. Pass a Promise, or a function that gets an `AbortSignal` and returns one:

```tsx
type User = {name: string}
class UserCard extends Component<{id: string}> {
    user = new AsyncRenderObject((signal) => fetch(`/users/${this.attrs.id}`, {signal}).then(response => response.json()), {
        pending: () => <p>Loading</p>,
        render: (user: User) => <p>{user.name}</p>,
        onFail: () => <p>Could not load the user</p>,
        keepPrevious: true,
    })
    override render() {
        return <div>
            {this.user}
            <button type="button" onClick={() => this.user.load((signal) => fetch(`/users/${this.attrs.id}`, {signal}).then(response => response.json()))}>Reload</button>
        </div>
    }
}
```

* **Only the latest load is shown**: `load()` replaces the load in progress, so a slower, earlier request that finishes last does not overwrite a newer one
* **Loads are cancelled** when a newer `load()` or `set()` replaces them, and when the AsyncRenderObject unmounts (as a field of a Component, when that Component unmounts): the function's `AbortSignal` is aborted and the result is ignored
* **`keepPrevious: true`** keeps showing the resolved value while `load()` fetches a new one, instead of showing `pending()` again. `loading` is `true` while a load is in progress
* **Errors**: a rejection, or a `render()` that throws, shows `onFail(reason)`. Without `onFail`, the error is reported with `reportError()` and a hidden element is shown
* `value` is the current state, `{status: "pending"}`, `{status: "resolved", value}`, or `{status: "rejected", reason}`. `set(state)` shows a state directly, such as a value that is already known, and cancels the load in progress
* `pending()` is shown first even when the Promise has already resolved, since a Promise's result is only available asynchronously

The same pattern loads code on demand, such as a Component that is only needed after a click:

```tsx
const chart = new AsyncRenderObject(import("./chart.tsx"), {
    pending: () => <p>Loading chart</p>,
    render: (module) => <module.Chart/>,
})
```

To show several loads at once, load `Promise.all()` of them into one AsyncRenderObject. AsyncRenderObject is in its own module, so bundles that do not use it do not include it.

## Keeping the page responsive

An update renders only the RenderObject or rows whose value changed, so most updates are small and finish within a frame, and Velotype has no scheduler to make them interruptible. Updates are slow in two cases: when frequent input, such as typing, starts expensive work each time, and when one update renders thousands of elements.

For frequent input, run the expensive work from a listener with `eventDispatchDelay`, so it runs at most once in that time instead of once per change. The listener runs after the delay, so it reads the latest `value`. Here a search runs at most every 250ms while typing, and AsyncRenderObject shows only the latest search's results and aborts the earlier requests:

```tsx
type Result = {title: string}
class Search extends Component<EmptyAttrs> {
    results = new AsyncRenderObject<Result[]>(Promise.resolve([]), {
        render: (results) => <ul>{results.map((result) => <li>{result.title}</li>)}</ul>,
        keepPrevious: true,
    })
    query = new RenderBasic<string>("").registerOnChangeListener(() => {
        const query = this.query.value
        this.results.load((signal) => fetch(`/search?q=${encodeURIComponent(query)}`, {signal}).then(response => response.json()))
    }, {eventDispatchDelay: 250})
    override render() {
        return <div>
            <input type="search" onInput={(event: Event) => this.query.value = (event.target as HTMLInputElement).value}/>
            {this.results}
        </div>
    }
}
```

To render thousands of rows, use RenderTemplateArray where the rows are plain markup, and add them in batches, giving the browser a chance to paint and handle input between batches:

```tsx
async function pushInBatches<DataType>(array: {pushAll(data: DataType[]): void}, data: DataType[], batchSize = 1000) {
    for (let index = 0; index < data.length; index += batchSize) {
        array.pushAll(data.slice(index, index + batchSize))
        // Let the browser paint and handle input before the next batch
        await new Promise((resolve) => setTimeout(resolve, 0))
    }
}
```

`insertAllAt()` does the same at a position other than the end. Where it is supported, `await scheduler.yield()` instead of `setTimeout()` resumes sooner after the browser has handled input. Work that is slow without rendering anything, such as parsing or sorting a large data set, belongs in a Web Worker.

## Stylesheets

`setStylesheet(css, key)` adds a stylesheet to the page (with `document.adoptedStyleSheets`) once per `key`, so it can be called from a Component's constructor or `render()` every time without adding duplicates. Pass `true` as the third argument to replace the stylesheet already added under `key`.

```tsx
class Card extends Component<EmptyAttrs> {
    constructor(attrs: EmptyAttrs, children: RenderableElements[]) {
        super(attrs, children)
        setStylesheet(`.card { padding: 8px; border-radius: 4px; }`, "card")
    }
    override render() {
        return <div class="card">{this.children}</div>
    }
}
```

## Reusable Components

`passthroughAttrsToElement(element, attrs)` sets the `id`, `class`, and `style` attrs that a caller passed on the element a Component renders. `class` is added to the element's own classes rather than replacing them. Add `IdAttr` and `StylePassthroughAttrs` to the Component's attrs type to accept them.

```tsx
type ButtonAttrs = IdAttr & StylePassthroughAttrs & {label: string}
class FancyButton extends Component<ButtonAttrs> {
    override render(attrs: Readonly<ButtonAttrs>) {
        return passthroughAttrsToElement(<button type="button" class="fancy">{attrs.label}</button>, attrs)
    }
}
const button = <FancyButton label="Save" class="primary" style={{marginTop: "4px"}}/>
```

`setAttrsOnElement(element, attrs)` sets attributes, style objects, and event listeners on an existing element the same way TSX does.

## Raw HTML, SVG, and MathML

Velotype creates TSX tags as HTML elements, so SVG and MathML content is added with the `SVG` and `MATH` Components, which set a string of markup as the `innerHTML` of an `<svg>` or `<math>` element. `HTML` does the same on any HTML tag (`<div>` by default). The markup is not escaped, so only use content that is known to be safe.

```tsx
const icon = <SVG innerHTML={`<path d="M2 2 L10 10"/>`} elementAttrs={{viewBox: "0 0 12 12", width: "12", height: "12"}}/>
const formula = <MATH innerHTML="<mi>x</mi><mo>=</mo><mn>2</mn>"/>
const snippet = <HTML tag="p" innerHTML="Some <b>bold</b> text"/>
```

## Event bus

`registerEventListener(component, key, listener)` registers a listener for the events that `emitEvent(key, event)` sends under `key`, and `removeEventListeners()` removes them. Listeners are removed automatically when the Component they were registered for unmounts. Passing the emitting Component as `emitEvent()`'s third argument skips that Component's own listeners.

```tsx
class Status extends Component<EmptyAttrs> {
    message = new RenderBasic<string>("")
    override mount() {
        registerEventListener(this, "status", (event: VelotypeEvent) => {
            this.message.value = String(event.data)
        })
    }
    override render() {
        return <div>{this.message}</div>
    }
}

// Anywhere else
emitEvent("status", new VelotypeEvent(someComponent, "saved", "Saved"))
```

Register a Component's listeners in `mount()`. A Component gets its `vtKey`, which the listener is registered under, after its constructor returns, so `registerEventListener()` throws a `TypeError` when called from a constructor or a field initializer.

## When code throws

Velotype keeps its own state consistent whatever an app's code throws:

* Errors in rendering are thrown to the caller: a Component's constructor or `render()`, a Function Component, and a RenderObject's render function or `handleUpdate`. What the failed render created is released, `refresh()` keeps the current render, a RenderObject keeps its current value, and RenderObjectArray and RenderTemplateArray keep their data and rows matching
* Errors in `mount()`, `unmount()`, `registerOnMount()` callbacks, and event bus listeners are reported with `reportError()`, which logs them and dispatches an `error` event on the window, and the other Components and listeners still run
* An [AsyncRenderObject](#asyncrenderobject) shows `onFail()` when its Promise rejects or its `render()` throws, and reports the error with `reportError()` when it has no `onFail()`

A `handleUpdate` changes elements in place, so one that throws partway leaves its own elements partly updated.

### ErrorBoundary

To show a fallback instead of throwing, extend `ErrorBoundary` and implement `renderContent()` and `renderError()`. When `renderContent()` throws, on first render or on `refresh()`, what it created is released and `renderError()` is rendered instead.

```tsx
class SafeChart extends ErrorBoundary<EmptyAttrs> {
    override renderContent() {
        return <div><Chart/></div>
    }
    override renderError(error: unknown) {
        return <div>The chart could not be shown</div>
    }
}
```

An ErrorBoundary catches errors from the Components that `renderContent()` creates, but not from its children: in `<SafeChart><Chart/></SafeChart>` the `Chart` is created by the parent before `SafeChart`, so create the Components to protect inside `renderContent()`. It also does not catch errors from event handlers or later RenderObject updates. An error thrown by `renderError()` is thrown to the caller.

## Server rendering and hydration

Velotype renders in the browser. To send a page's HTML from the server, render it with [velossr](https://jsr.io/@velotype/velossr), the server-side version of Velotype, which has its own Components built for rendering on the server (static parts are prepared once, and async parts are streamed).

There is no hydration step that turns the server's HTML into live Velotype Components: Velotype creates elements as TSX runs, so the interactive parts of a page are rendered again in the browser, and each one replaces the server's HTML for it with `replaceElementWithRoot()`. Rendering again is fast, the swap happens in one step when the page's script runs, and the server's HTML is shown until then.

The server renders the markup for each interactive part (an island) and the data its Component is created with, as JSON in a `<script type="application/json">` (velossr 0.0.9 and later writes the contents of a `<script>` so that no string in the JSON can end it early):

```tsx
import { type ChildrenAttr, type ServerVNode, type StaticServerComponent } from "@velotype/velossr"

type CounterData = {start: number, label: string}

// The server's markup for the counter, the same structure the client Component renders
const CounterMarkup: StaticServerComponent<CounterData> = function(attrs) {
    return <div class="counter"><span>{attrs.label}: {attrs.start}</span><input name="note"/><button type="button">+1</button></div>
}

/** Server-rendered markup for a client Component, and the data the client creates it with */
const Island: StaticServerComponent<{id: string, data: unknown} & ChildrenAttr> = function(attrs, children): ServerVNode {
    return [
        <div id={attrs.id}>{children}</div>,
        <script type="application/json" id={attrs.id + "-data"}>{JSON.stringify(attrs.data)}</script>,
    ]
}

const data: CounterData = {start: 5, label: "Clicks </script> & <b>"}
const page = <html><body>
    <Island id="counter" data={data}><CounterMarkup {...data}/></Island>
    <script type="module" src="/main.js"></script>
</body></html>
```

The browser creates each island's Component from its data and swaps it in, keeping what the user typed into the server's form fields before the script ran:

```tsx
import { Component, RenderBasic, replaceElementWithRoot } from "@velotype/velotype"

type CounterData = {start: number, label: string}

class Counter extends Component<CounterData> {
    count = new RenderBasic<number>(this.attrs.start)
    override render(attrs: Readonly<CounterData>) {
        return <div class="counter">
            <span>{attrs.label}: {this.count}</span>
            <input name="note"/>
            <button type="button" onClick={() => { this.count.value += 1 }}>+1</button>
        </div>
    }
}

/** Replace the server-rendered island id with the element that render creates from the island's data */
function hydrate<DataType>(id: string, render: (data: DataType) => HTMLElement): void {
    const serverElement = document.getElementById(id)
    const dataElement = document.getElementById(id + "-data")
    if (!serverElement || !dataElement) {
        return
    }
    const element = render(JSON.parse(dataElement.textContent || "null"))
    // Keep what the user typed or picked before this script ran, pairing form fields by their order
    const fields = "input, textarea, select"
    const serverFields = serverElement.querySelectorAll<HTMLInputElement>(fields)
    const newFields = element.querySelectorAll<HTMLInputElement>(fields)
    let focused: HTMLElement | null = null
    for (let i = 0; i < serverFields.length && i < newFields.length; i++) {
        newFields[i].value = serverFields[i].value
        newFields[i].checked = serverFields[i].checked
        if (serverFields[i] === document.activeElement) {
            focused = newFields[i]
        }
    }
    replaceElementWithRoot(element, serverElement)
    if (focused) {
        focused.focus()
    }
}

hydrate<CounterData>("counter", data => <Counter {...data}/>)
```

* Keep the server's markup and the Component's render the same structure, so that nothing moves when the island is replaced
* The server and browser files use different JSX settings (`"jsxImportSource": "@velotype/velossr"` and `"@velotype/velotype"`), so keep them in separate directories with their own `deno.json`, or set it per file with a `/** @jsxImportSource @velotype/velossr */` comment

## Hot reloading

The jsx-dev-runtime entry point (used by the `react-jsxdev` JSX transform) supports hot updates: when a development server runs changed code again, the components on the page are updated in place and keep their state. The jsx-runtime entry point used in production builds does not include any of it.

The [veloserver](https://jsr.io/@velotype/veloserver) development server (`@velotype/veloserver/dev`) provides two hot update modes:

- `module`: each module is served unbundled, and only the changed modules run again
- `bundle`: the app bundle is rebuilt and runs again

When a class component changes, its live instances get the new methods and render again with their fields kept. When a function component changes, its output is rendered again in place. Changes to constructors and field initializers apply to new instances only, a class with `#private` members is replaced with a new instance (losing its state), and the child components of a component that renders again are created again.

`setStylesheet()` in the dev runtime replaces a sheet whose text has changed, so styles update when their module runs again.

The development server talks to the dev runtime through `globalThis.__VELOTYPE_HOT__`, other development servers can use it too.

## Debugging

`@velotype/velotype/devtools` exports read-only access to Velotype's internal state (`__vtAppMetadata`) and the devtools hook (`getDevtoolsHook()`), for debugging and for the Velotype DevTools browser extension. Applications do not need to import it, Velotype registers with the devtools hook from any entry point.
