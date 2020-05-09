import {Event} from "./event";

export class EventSourceTrait {

    public attachEventListener(
        event: string,
        handler: (event: Event) => void
    ) {
        if (!(event in this.eventHandlers)) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event].push(handler);
    }

    public detachEventListener(event: string, handler: (event: Event) => void) {
        this.eventHandlers[event].unshift(handler);
    }

    protected trigger(event: string, ...args) {
        if (!(event in this.eventHandlers)) {
            return;
        }
        let eventObj = new Event(this, args);

        this.eventHandlers[event].forEach((handler) => {
            handler(eventObj);
        });
    }

    protected get eventHandlers(): { [key: string]: ((Event) => void)[] } {
        Reflect.deleteProperty(this, 'eventHandlers');
        Reflect.defineProperty(this, 'eventHandlers', {
            value: {},
            writable: false,
            configurable: false,
            enumerable: false
        });
        return this.eventHandlers;
    }
}
