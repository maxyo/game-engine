import {Atom} from "../scene/atom/atom";
import {EventSource} from "../event/event-source";
import {Transportable} from "../network/transport/transportable";
import {applyMixins} from "../util/functions";
import {Event} from "../event/event";

declare type ASd = Transportable & EventSource;


export abstract class TransportableEventSource extends Transportable implements EventSource {
    private eventHandlers: { [key: string]: ((Event) => void)[] } = {};

    attachEventListener: (event: string, handler: (event: Event) => void) => void;

    detachEventListener: (event: string, handler: (event: Event) => void) => void;
    trigger: (event: string, ...args) => void;

}

applyMixins(TransportableEventSource, [Transportable, EventSource]);

export abstract class Component extends TransportableEventSource {
    public readonly go: Atom;

    constructor(go: Atom) {
        super();
        this.go = go;
    }

    public destroy() {

        this.trigger('destroy');
    }
}

Reflect.
