# Velotype
Fast and small TSX framework for creating high performance websites

Differences from react/preact:
* Focuses on Object Oriented Classes (no use*() function calls)
* Create and manipulate DOM elements directly (no Virtual DOM, no reconciliation engine)
* Write the same as if you are writing native HTML (use element Attributes instead of Properties)
* No state management (use Classes as they are intended with fields and methods)
* High performance (close to hand-written JavaScript)
* Small payload (~13kb minified, ~5kb gzipped, and bundlers can drop the parts that are not imported)

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

## Types of Components

Components are the objects that can be created as Tags in tsx `<tag></tag>`

### Function Components

A FunctionComponent can be used in .tsx files to render simple HTML Components.

Note that FunctionComponents must be idempotent with no side affects and do not support mount and unmount lifecycle events.

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

A specialization of a RenderObject when the DataType is a BasicType, it renders its value as text inside a `<span style="display:contents;">` and supports `getString()` and `setString()` methods.

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

Use `push()`, `pushAll()`, `deleteAt()`, `delete()`, `getAt()`, `setAt()`, `swap()`, `clear()`, and `length` to change and read the Array. Only the affected rows are rendered, moved, or removed.

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

It has the same methods as RenderObjectArray: `push()`, `pushAll()`, `deleteAt()`, `delete()`, `getAt()`, `setAt()`, `swap()`, `clear()`, and `length`.

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

## Debugging

`@velotype/velotype/devtools` exports read-only access to Velotype's internal state (`__vtAppMetadata`) and the devtools hook (`getDevtoolsHook()`), for debugging and for the Velotype DevTools browser extension. Applications do not need to import it, Velotype registers with the devtools hook from any entry point.
