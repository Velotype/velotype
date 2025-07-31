# browser-tsx-core
Fast and small TSX framework for creating high performance websites

** NPM Package export is currently under testing and is not stable yet **

Differences from react/preact:
* Focuses on Object Oriented Classes (no use*() function calls)
* Create and manipulate DOM elements directly (no Virtal DOM, no reconsiliation engine)
* Write the same as if you are writing native HTML (use element Attributes instead of Properties)
* No state management (use Classes as they are intended)
* High performance (same performance as pure javascript)
* Small payload (minimizes to ~9kb)

## Basic properties of Velotype TSX

### TSX Returns HTMLElements directly

Velotype is built to be nearly native javascript and will return HTMLElements

```tsx
const divTag: HTMLDivElement = <div>this is a div</div>
```

### TSX uses HTML Attributes

Velotype calls `HTMLElement.setAttribute()` so you write TSX the same as if you were writing HTML to the page.

```tsx
const divTag: HTMLDivElement = <div class="exampleClass">this is a div</div>
```

### TSX supports style objects

Velotype resolves style objects to make inline styling quick and easy.

```tsx
const divTag: HTMLDivElement = <div style={{display: "inline",marginTop:"4px"}}>this is a div</div>
```

or set style as a string directly:

```tsx
const divTag: HTMLDivElement = <div style="display:inline;margin-top:4pm;">this is a div</div>
```

## Types of Components

Create these objects as Tags in tsx `<tag></tag>`

### Function Components

A Velotype Function Component that can be used in .tsx files to render HTML Components.

Does not support mount and unmount lifecycle events.

### Class Components

A Velotype Class Component that can be used in .tsx files to render HTML Components.

Supports unmount, render, mount lifecycle events.

```tsx
// Define a simple class
class ComplexComponent extends Component<{foo: string}> {
    override render(attrs) {
        return <div>Hello {attrs.foo}</div>
    }
}
//Can then be constructed via tsx:
return <div><ComplexComponent foo="Component!"></ComplexComponent></div>
```

#### Advanced Class Component usage

Class Components are meant to operate as classes directly and are availble to access using the `getComponent()` function which will convert from an Element that was constructed with a given class to the underlying instance of that Class.

```tsx
// Define an advanced class
class ComplexComponent extends Component<EmptyAttrs> {
    override render() {
        return <div>This is a complex Component</div>
    }
    someMethod() {
        console.log("ComplexComponent someMethod() called")
    }
}

//Somewhere else
const foo: ComplexComponent = getComponent(<ComplexComponent/>)
foo.someMethod()

//Can then be used in tsx directly:
const someVariable = <div>{foo}</div>
```

#### More Complex Component example

Components' lifecycle supports a `mount()`, `render()`, then `unmount()` cycle.

```tsx
type MoreComplexAttrsType = {
    requiredAttr: string,
    optionalAttr?: string
}
class MoreComplexComponent extends Component<MoreComplexAttrsType, HTMLElement> {
    someMethodCallCount: number = 0
    otherMethodCallCount = new BasicComponent<number>(0)
    override mount() {
        console.log("This component was just added to the DOM")
    }
    override unmount() {
        console.log("This component is about to be removed from the DOM")
    }
    override render(attrs: Readonly<MoreComplexAttrsType>, children: ChildrenTypes[]) {
        return <div>
            This is a more complex Component
            <button onClick={this.otherMethod}>click me {this.otherMethodCallCount}</button>
            <button onClick={this.someMethod}>click me {this.someMethodCallCount}</button>
            <div>
                Children here:
                <div>{children}</div>
            </div>
        </div>
    }
    otherMethod = () => {
        console.log("MoreComplexComponent otherMethod() called")
        // Update the value of the BasicComponent, this will rerender only the one {this.otherMethodCallCount} element created in render() above
        this.otherMethodCallCount.value+=1
    }
    someMethod = () => {
        console.log("MoreComplexComponent someMethod() called")
        this.someMethodCallCount+=1

        // Trigger a full rerender of this Component, this will unmount and delete all child Components, then call this.render() and consequently new and mount a fresh set of child Components.
        this.refresh()
    }
}
```

### ObjectComponentArray

An optimized Component that represents an Array of data points rendered into a wrapperElement (by default a `<div>` tag)

```ts
type Todo = {
    text: string
}

class TodoList extends Component<EmptyProps> {
    todos: ObjectComponentArray<Todo> = new ObjectComponentArray<Todo>({
        wrapperElementTag="ul"
        renderFunction={function(todo: Todo) {
            return <li>{todo.text}</li>
        }}
    })
    text: string = ''
    addTodo = () => {
        this.todos.push({text: this.text})
        this.textInput.value = ""
    }
    textInput: HTMLInputElement = <input value={this.text} onInput={(event: InputEvent) => {
        if (event.target && (event.target instanceof HTMLInputElement)) {
            this.text = event.target?.value || ""
        }
    }}/>
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

## Types of Signal-like Components

Create these objects with `new ObjectComponent<DataType>()`, usually as fields of Component classes. These can then be used in tsx and will render using the provided render function as many times as that object needs to be rendered. Then later updates to `obj.value` will trigger rerendering to each of those DOM locations.

### ObjectComponent

An ObjectComponent is an efficient way of rendering Objects to potentially multiple HTMLElements, changes to the value of the underlying Data Object will propogate to all attached elements.

```ts
type Person = {
    name: string,
    address: string,
    phone: string
}
class PersonSelector extends Component<EmptyProps> {
    selectedPerson = new ObjectComponent<Person | null>(null, function(person: Person | null) {
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
        let people = [
            {name: "One person", address: "somewhere", phone: "123"},
            {name: "Two person", address: "elsewhere", phone: "456"},
            {name: "Three person", address: "nowhere", phone: "789"}
        ]
        return <div>
            {people.map((person)=>{
                <button onClick={()=>{
                    this.selectedPerson.value=person
                }}>{person.name}</button>
            })}
            <div>Render selected Person in one place: {this.selectedPerson}</div>
            <div>Render selected Person in another place: {this.selectedPerson}</div>
        </div>
    }
}
```

### BasicComponent

A specialization of an ObjectComponent when the DataType is a BasicType, it renders its value as `<span>{value}</span>` and supports `getString()` and `setString()` methods.

The BasicTypes are `string | number | bigint | boolean`

```ts
class Counter extends Component<EmptyProps> {
    count = new BasicComponent<number>(0)
    override render() {
        return <div>
            <div>Counter: {this.count}</div>
            <button type="button" onClick={() => this.count.value+=1}>Increment</button>
            <button type="button" onClick={() => this.count.value-=1}>Decrement</button>
        </div>
    }
}
```
