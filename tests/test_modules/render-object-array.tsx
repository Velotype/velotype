import {replaceElementWithRoot, Component, RenderObjectArray} from "@velotype/velotype"
import type {EmptyAttrs} from "@velotype/velotype"

type Todo = {
    text: string
}

class RenderObjectArrayTest extends Component<EmptyAttrs> {
    // Kept by reference so delete() (which compares by reference) can find it later
    itemThree: Todo = {text: "three"}

    todos = new RenderObjectArray<Todo>({
        wrapperElementTag: "ul",
        wrapperAttrs: {id: "todo-list", class: "todo-wrapper"},
        renderFunction: (todo: Todo) => <li>{todo.text}</li>
    })

    override render() {
        return <div id="render-object-array-tests">
            <div id="todos-length">{this.todos.length}</div>
            {this.todos}
            <button id="push-one" type="button" onClick={() => {
                this.todos.push({text: "one"})
                this.refresh()
            }}>push one</button>
            <button id="push-all" type="button" onClick={() => {
                this.todos.pushAll([{text: "two"}, this.itemThree])
                this.refresh()
            }}>push all</button>
            <button id="set-at-0" type="button" onClick={() => {
                this.todos.setAt(0, {text: "one-updated"})
                this.refresh()
            }}>set at 0</button>
            <button id="delete-at-0" type="button" onClick={() => {
                this.todos.deleteAt(0)
                this.refresh()
            }}>delete at 0</button>
            <button id="delete-value" type="button" onClick={() => {
                this.todos.delete(this.itemThree)
                this.refresh()
            }}>delete value</button>
            <button id="clear-all" type="button" onClick={() => {
                this.todos.clear()
                this.refresh()
            }}>clear all</button>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<RenderObjectArrayTest/>, document.getElementById("main-page"))
