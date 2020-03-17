import {Atom} from "../scene/atom/atom";
import {EventSource} from "../event/event-source";

export abstract class Component extends EventSource {
    public readonly go: Atom;

    public destroy() {
        this.trigger('destroy');
    }
}
