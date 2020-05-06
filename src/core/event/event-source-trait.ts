import {Event} from "./event";

export class EventSourceTrait {
    private _eventHandlers: { [key: string]: ((Event) => void)[] };

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

    private get eventHandlers() {
        if (!this._eventHandlers) {
            this._eventHandlers = {};
        }

        return this._eventHandlers;
    }
}
