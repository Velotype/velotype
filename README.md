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
// Define a simple class
class ComplexComponent extends Component<EmptyAttrs> {
    override render() {
        return <div>This is an advanced Component</div>
    }
    someMethod() {
        console.log("ComplexComponent method called")
    }
}

//Somewhere else
const foo: ComplexComponent = getComponent<ComplexComponent>(<ComplexComponent/>)
foo.someMethod()

//Can then be used in tsx directly:
return <div>{foo}</div>
```

### ObjectComponentArray

An optimized Component that represents an Array of data points rendered into a wrapperElement (by default a \<div> tag)

```ts
type todo = {
    text: string
}

class TodoList extends Component<EmptyProps> {
    todos: ObjectComponentArray<todo> = getComponent(<ObjectComponentArray<todo>
        wrapperElement={<ul/>}
        renderFunction={function(todo: todo) {
            return <li>{todo.text}</li>
        }}
    />)
    text: string = ''
    addTodo = () => {
        this.todos.push({text: this.text})
        this.textInput.value = ""
    }
    textInput: HTMLInputElement = <input value={this.text} onInput={(event: InputEvent)=>{
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

## Types of Signalish Components

Create these objects with `new ObjectComponent<DataType>()`, usually as fields of Component classes. These can then be used in tsx and will render using the provided render function as many times as that object needs to be rendered. Then later updates to `obj.value` will trigger rerendering to each of those DOM locations.

### ObjectComponent

An ObjectComponent is an efficient way of rendering Objects to potentially multiple HTMLElements, changes to the value of the underlying Data Object will propogate to all attached elements.

### BasicComponent

A specialization of an ObjectComponent when the DataType is a BasicType

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
