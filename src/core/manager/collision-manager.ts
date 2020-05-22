import {Manager} from "./manager";
import {IUpdatableManager} from "./manager-types";
import {GameObject} from "../scene/atom/game-object/game-object";
import {Tile} from "../scene/atom/tile/tile";
import {Atom} from "../scene/atom/atom";
import {CollisionComponent} from "../component/collision-component";
import {Collision} from "../../collision/collision";

export class CollisionManager extends Manager implements IUpdatableManager {

    private components: CollisionComponent[] = [];

    public init() {
        this.game.getScene().attachEventListener('attached', (event) => this.onSceneAtomAttached(event.data[0]));
        this.game.getScene().attachEventListener('detached', (event) => this.onSceneAtomDetached(event.data[0]));

        this.game.getScene().getObjects().forEach((obj: GameObject) => this.onSceneAtomAttached(obj));
        this.game.getScene().getTiles().forEach((obj: Tile) => this.onSceneAtomAttached(obj));

    }

    update(tpf: number) {
        this.components.forEach((component: CollisionComponent) => component.update(tpf));
        this.processCollisions();
    }

    private processCollisions() {
        this.components.forEach((comp) => this.searchForCollisions(comp));
    }

    private searchForCollisions(comp: CollisionComponent) {
        for (let otherComp of this.components) {
            if (otherComp.go.position.x - otherComp.shape.width / 2 > comp.go.position.x - comp.shape.width / 2 ||
                otherComp.go.position.x + otherComp.shape.width / 2 < comp.go.position.x + comp.shape.width / 2 ||
                otherComp.go.position.y - otherComp.shape.height / 2 > comp.go.position.y - comp.shape.height / 2 ||
                otherComp.go.position.y + otherComp.shape.height / 2 < comp.go.position.y + comp.shape.height / 2
            ) {
                let collision = this.getCollision(comp, otherComp);
            }
        }
    }

    private getCollision(comp1, comp2): Collision | null {

    }

    private onSceneAtomAttached(atom: Atom) {
        if (atom.getComponent(CollisionComponent)) {
            this.components.push(atom.getComponent(CollisionComponent));
        }
    }

    private onSceneAtomDetached(atom: Atom) {
        if (atom.getComponent(CollisionComponent)) {
            this.components.remove(atom.getComponent(CollisionComponent));
        }
    }
}
