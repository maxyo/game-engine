import {Vector} from '../vector';
import {Tile} from "./atom/tile/tile";
import {GameObject} from "./atom/game-object/game-object";
import {Atom} from "./atom/atom";
import {EventSource} from "../event/event-source";

export class Scene extends EventSource {
    private objects: GameObject[] = [];
    private tiles: Tile[] = [];
    private size: Vector;

    public getObjects(): GameObject[] {
        return this.objects;
    }

    public getTiles(): Tile[] {
        return this.tiles;
    }

    public attach(atom: Atom) {
        if (atom instanceof GameObject) {
            this.objects.push(atom);
        }
        if (atom instanceof Tile) {
            this.tiles.push(atom);
        }
        this.trigger('attached', atom);
    }

    public detach(atom: Atom) {
        if (atom instanceof GameObject) {
            let i = this.objects.indexOf(atom);
            if (i !== -1) {
                this.objects.slice(i, 1);
            }
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
