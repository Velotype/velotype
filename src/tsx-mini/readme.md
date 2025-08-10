# browser-tsx-micro
Micro TSX framework

This is a strictly minimal TSX framework to serve as an example of how TSX rendering works. A full TSX framework is available in [velotype/browser-tsx-core](velotype/browser-tsx-core)

** NPM Package export is currently under testing and is not stable yet **


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
const foo: ComplexComponent = getComponent<ComplexComponent>(<ComplexComponent/>)
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
        // Update the value of the BasicComponent, this will rerender the one {this.otherMethodCallCount} element created by render() above
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
