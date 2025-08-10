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

### Example Counter FunctionComponent

This is a Simple Counter FunctionComponent:
```tsx
const Counter: FunctionComponent<EmptyAttrs> = function(_attrs: EmptyAttrs): HTMLDivElement {
    let count = 0
    const counterLabel = <span>{count}</span>
    return <div>
        <div>Counter value: {counterLabel}</div>
        <button type="button" onClick={() => {
            count+=1
            counterLabel.innerText = count
        }}>Increment</button>
        <button type="button" onClick={() => {
            count-=1
            counterLabel.innerText = count
        }}>Decrement</button>
    </div>
}
```
