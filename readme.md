# Velotype

Velotype is a framework to create high performance websites quickly using TSX with velocity!

There are multiple modules as part of Velotype:

In-browser:
* [tsx-micro](src/tsx-micro/readme.md) - 1kb strictly minimal TSX framework (to demonstrate how TSX works)
  * Module status: `stable`
* [tsx-mini](src/tsx-mini/readme.md) - 2kb mostly minimal TSX framework (adds Classes to tsx-micro)
  * Module status: `not stable yet`
* [tsx](src/tsx/readme.md) - a 10kb fully featured TSX framework
  * Module status: `not stable yet`
  * Related modules: `jsx-runtime`, `jsx-dev-runtime`, and the default module

In-server:
* [webserver](src/webserver/readme.md) - a webserver framework
  * Module status: `experimental`


An example Velotype Component:
```tsx
class Counter extends Component<EmptyAttrs> {
    count = new RenderBasic<number>(0)
    override render() {
        return <div>
            <div>Counter value: {this.count}</div>
            <button type="button" onClick={() => this.count.value+=1}>Increment</button>
            <button type="button" onClick={() => this.count.value-=1}>Decrement</button>
        </div>
    }
}
```
