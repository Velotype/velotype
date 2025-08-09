# Velotype tsx-micro
Micro TSX framework

This is a strictly minimal TSX framework to serve as an example of how TSX rendering works. A full TSX framework is available in `jsr:@velotype/velotype/tsx`


## Basic properties of Velotype TSX Micro

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
return <div><ComplexComponent foo="Component!" /></div>
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
const foo: ComplexComponent = getComponent(<ComplexComponent />)
foo.someMethod()

//Can then be used in tsx directly:
const someVariable = <div>{foo}</div>
```

#### Example Counter Component

This is a Simple Counter component:
```tsx
class SimpleCounter extends Component<EmptyAttrs> {
    count = 0
    override render() {
        return <div>
            <div>Counter value: {this.count}</div>
            <button type="button" onClick={() => {
                this.count+=1
                this.refresh()
            }}>Increment</button>
            <button type="button" onClick={() => {
                this.count-=1
                this.refresh()
            }}>Decrement</button>
        </div>
    }
}
```

This SimpleCounter works, but has some flaws - for example because the buttons get rerendered with each `refresh()` they lose focus when interacted with. A way to fix that in TSX Micro is to manipulate the HTML more directly:
```tsx
class FancyCounter extends Component<EmptyAttrs> {
    count = 0
    counterLabel = <span>{this.count}</span>
    override render() {
        return <div>
            <div>Counter value: {this.counterLabel}</div>
            <button type="button" onClick={() => {
                this.count+=1
                this.counterLabel.innerText = this.count
            }}>Increment</button>
            <button type="button" onClick={() => {
                this.count-=1
                this.counterLabel.innerText = this.count
            }}>Decrement</button>
        </div>
    }
}
```