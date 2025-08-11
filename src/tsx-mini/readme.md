# Velotype tsx-mini
Mini TSX framework

This is a mostly minimal TSX framework to serve as an example of how TSX rendering works. It introduces basic classes in addition to the tsx-micro module.

## Basic properties of Velotype TSX Mini

### Returns HTMLElements directly

Velotype is built to be nearly native javascript and will return HTMLElements

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

### Class Components

A Velotype Class Component that can be used in .tsx files to render HTML Components.

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
