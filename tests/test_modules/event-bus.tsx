import {replaceElementWithRoot, Component, RenderBasic, getComponent, __vtAppMetadata, registerEventListener, removeEventListeners, emitEvent, VelotypeEvent} from "@velotype/velotype"
import type {EmptyAttrs, RenderableElements, VelotypeEventListener} from "@velotype/velotype"

const EVENT_KEY = "vt-test-event-bus-key"

// Shared across the module so a listener can check event.emittingObject against the real emitter instance
let emitterInstance: Emitter | null = null

type SubscriberAttrs = {
    label: string
}
class Subscriber extends Component<SubscriberAttrs> {
    receivedCount = new RenderBasic<number>(0)
    lastEventName = new RenderBasic<string>("")
    lastEventData = new RenderBasic<string>("")
    lastEmittingObjectMatches = new RenderBasic<string>("")
    override mount() {
        const listener: VelotypeEventListener = (event: VelotypeEvent) => {
            this.receivedCount.value += 1
            this.lastEventName.value = event.event
            this.lastEventData.value = String((event.data as {payload: string})?.payload)
            this.lastEmittingObjectMatches.value = String(event.emittingObject === emitterInstance)
        }
        registerEventListener(this, EVENT_KEY, listener)
    }
    override render(attrs: Readonly<SubscriberAttrs>) {
        return <div id={`subscriber-${attrs.label}`}>
            <div class="received-count">{this.receivedCount}</div>
            <div class="last-event-name">{this.lastEventName}</div>
            <div class="last-event-data">{this.lastEventData}</div>
            <div class="last-emitting-object-matches">{this.lastEmittingObjectMatches}</div>
        </div>
    }
}

class Emitter extends Component<EmptyAttrs> {
    receivedOwnEventCount = new RenderBasic<number>(0)
    constructor(attrs: Readonly<EmptyAttrs>, children: RenderableElements[]) {
        super(attrs, children)
        emitterInstance = this
    }
    override mount() {
        // Registered under the same key it emits on, to prove emitEvent(...,...,this) skips its own listener
        registerEventListener(this, EVENT_KEY, () => {
            this.receivedOwnEventCount.value += 1
        })
    }
    emit = () => {
        emitEvent(EVENT_KEY, new VelotypeEvent(this, "custom-event-name", {payload: "hello"}), this)
    }
    override render() {
        return <div>
            <button id="emit-button" type="button" onClick={this.emit}>emit</button>
            <div id="emitter-received-own-event-count">{this.receivedOwnEventCount}</div>
        </div>
    }
}

class EventBusTest extends Component<EmptyAttrs> {
    listenersCount = new RenderBasic<number>(0)

    updateListenersCount = () => {
        this.listenersCount.value = __vtAppMetadata.listenersF.get(EVENT_KEY)?.size || 0
    }

    override mount() {
        // By now all descendant Subscribers/Emitter have already mounted (children mount before their parent)
        this.updateListenersCount()
    }

    override render() {
        // Uses replaceChild() (not refresh()) to remove only subscriber a in place, so subscribers b/c and the
        // emitter keep their accumulated state and listener registrations undisturbed - see event-triggers.tsx
        // for the same in-place-swap idiom.
        //
        // replaceChild()'s cleanup only unmounts the *children* of the node passed in, not the node itself, so
        // the Subscriber must sit inside a plain wrapper div (no vtKey of its own) rather than being passed directly.
        let subscriberAWrapper = <div id="subscriber-a-wrapper"><Subscriber label="a"/></div>
        const placeholderWrapper = <div id="subscriber-a-wrapper"/>
        const unmountSubscriberA = () => {
            this.replaceChild(subscriberAWrapper, placeholderWrapper)
            subscriberAWrapper = placeholderWrapper
            this.updateListenersCount()
        }

        return <div id="event-bus-tests">
            <button id="unmount-subscriber-a" type="button" onClick={unmountSubscriberA}>unmount subscriber a</button>
            {subscriberAWrapper}
            <Subscriber label="b"/>
            <Subscriber label="c"/>
            <Emitter/>
            <button id="remove-subscriber-c-listener" type="button" onClick={() => {
                const subscriberCElement = document.getElementById("subscriber-c")
                if (subscriberCElement) {
                    removeEventListeners(getComponent<Subscriber>(subscriberCElement), EVENT_KEY)
                }
                this.updateListenersCount()
            }}>remove subscriber c listener</button>
            <div id="listeners-count">{this.listenersCount}</div>
        </div>
    }
}

// Place on the page
replaceElementWithRoot(<EventBusTest/>, document.getElementById("main-page"))
