import {Vector} from '../vector';
import {Tile} from "./atom/tile/tile";
import {GameObject} from "./atom/game-object/game-object";
import {Atom} from "./atom/atom";
import {EventSourceTrait} from "../event/event-source-trait";
import {useTrait} from "../util/functions";

export interface Scene extends EventSourceTrait {

}

export class Scene {
    @useTrait(EventSourceTrait)
    private objects: Set<GameObject> = new Set<GameObject>();
    private tiles: Tile[] = [];
    private size: Vector;

    public getObjects(): Set<GameObject> {
        return this.objects;
    }

    public getTiles(): Tile[] {
        return this.tiles;
    }

    public attach(atom: Atom) {
        if (atom instanceof GameObject) {
            this.objects.add(atom as GameObject);
        }
        if (atom instanceof Tile) {
            this.tiles.push(atom as Tile);
        }
        this.trigger('attached', atom);
    }

    public detach(atom: Atom) {
        if (atom instanceof GameObject) {
            this.objects.delete(atom);
        }
        if (atom instanceof Tile) {
            let i = this.tiles.indexOf(atom);
            if (i !== -1) {
                this.tiles.slice(i, 1);
            }
        }
        this.trigger('detached', atom);
    }
}
