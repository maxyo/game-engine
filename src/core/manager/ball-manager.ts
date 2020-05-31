import {Manager} from "./manager";
import {BallComponent} from "../component/ball-component";
import {IUpdatableManager} from "./manager-types";
import {GameObject} from "../scene/atom/game-object/game-object";
import {Tile} from "../scene/atom/tile/tile";
import {Atom} from "../scene/atom/atom";

export class BallManager extends Manager implements IUpdatableManager {
    private components: BallComponent[] = [];
    private groundY = 500;

    public init() {
        this.game.getScene().attachEventListener('attached', (event) => this.onSceneAtomAttached(event.data[0]));
        this.game.getScene().attachEventListener('detached', (event) => this.onSceneAtomDetached(event.data[0]));

        this.game.getScene().getObjects().forEach((obj: GameObject) => this.onSceneAtomAttached(obj));
        this.game.getScene().getTiles().forEach((obj: Tile) => this.onSceneAtomAttached(obj));
    }

    update(tpf: number) {
        this.components.forEach((ball) => {
            ball.update(tpf)
        });
    }

    private onSceneAtomAttached(atom: Atom) {
        if (atom.getComponent(BallComponent)) {
            this.components.push(atom.getComponent(BallComponent));
        }
    }

    private onSceneAtomDetached(atom: Atom) {
        if (atom.getComponent(BallComponent)) {
            this.components.remove(atom.getComponent(BallComponent));
        }
    }
}
