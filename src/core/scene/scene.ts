import {Atom} from "./atom";
import {EventSourceTrait} from "../event/event-source-trait";
import {useTrait} from "../util/utils";

export interface Scene extends EventSourceTrait {

}

export class Scene {
    @useTrait(EventSourceTrait)
    private objects: Set<Atom> = new Set<Atom>();

    public getObjects(): Set<Atom> {
        return this.objects;
    }

    public attach(atom: Atom) {
        if (atom instanceof Atom) {
            this.objects.add(atom as Atom);
        }
        this.trigger('attached', atom);
    }

    public detach(atom: Atom) {
        if (atom instanceof Atom) {
            this.objects.delete(atom);
        }
        this.trigger('detached', atom);
    }
}
