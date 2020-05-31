import {Manager} from "./manager";
import {IUpdatableManager} from "./manager-types";
import {GameObject} from "../scene/atom/game-object/game-object";
import {Tile} from "../scene/atom/tile/tile";
import {Atom} from "../scene/atom/atom";
import {CollisionComponent} from "../component/collision-component";
import {CollisionEvent} from "../../collision/collisionEvent";
import {Vector} from "../vector";
import {CircleShape} from "../../render/shape/circle-shape";
import {BoxShape} from "../../render/shape/box-shape";
import {BallComponent} from "../component/ball-component";

export class CollisionManager extends Manager implements IUpdatableManager {

    private components: CollisionComponent[] = [];

    public init() {
        this.game.getScene().attachEventListener('attached', (event) => this.onSceneAtomAttached(event.data[0]));
        this.game.getScene().attachEventListener('detached', (event) => this.onSceneAtomDetached(event.data[0]));

        this.game.getScene().getObjects().forEach((obj: GameObject) => this.onSceneAtomAttached(obj));
        this.game.getScene().getTiles().forEach((obj: Tile) => this.onSceneAtomAttached(obj));

    }

    update(tpf: number) {
        this.processCollisions();
    }

    private processCollisions() {
        for (let cursor = 0; cursor <= this.components.length; cursor++) {
            let comp = this.components[cursor];
            for (let otherCursor = cursor + 1; otherCursor <= this.components.length ; otherCursor++) {
                let otherComp = this.components[otherCursor];
                if (otherComp) {
                    this.checkCollision(comp, otherComp);
                }
            }
        }
    }

    private checkCollision(comp1: CollisionComponent, comp2: CollisionComponent): void {
        if (comp1.shape instanceof CircleShape && comp2.shape instanceof CircleShape) {
            if (Vector.distance(comp1.go.position, comp2.go.position) < comp1.shape.radius + comp2.shape.radius) {
                comp1.triggerCollision(new CollisionEvent(comp1, comp2));
                comp2.triggerCollision(new CollisionEvent(comp2, comp1));
            }
        } else if (comp1.shape instanceof BoxShape && comp2.shape instanceof BoxShape) {
            if (comp1.go.position.x < comp2.go.position.x + comp2.shape.width &&
                comp1.go.position.x + comp1.shape.width > comp2.go.position.x &&
                comp1.go.position.y < comp2.go.position.y + comp2.shape.height &&
                comp1.go.position.y + comp1.shape.height > comp2.go.position.y) {
                comp1.triggerCollision(new CollisionEvent(comp1, comp2));
                comp2.triggerCollision(new CollisionEvent(comp2, comp1));
            }
        } else if (comp1.shape instanceof BoxShape && comp2.shape instanceof CircleShape) {
            if (comp1.go.position.x < comp2.go.position.x + comp2.shape.width &&
                comp1.go.position.x + comp1.shape.width > comp2.go.position.x &&
                comp1.go.position.y < comp2.go.position.y + comp2.shape.height &&
                comp1.go.position.y + comp1.shape.height > comp2.go.position.y) {
                if(comp1.go.getComponent(BallComponent) || comp2.go.getComponent(BallComponent)) {
                    console.log(comp1, comp2);
                }
                comp1.triggerCollision(new CollisionEvent(comp1, comp2));
                comp2.triggerCollision(new CollisionEvent(comp2, comp1));
            }
        } else if (comp2.shape instanceof BoxShape && comp1.shape instanceof CircleShape) {
            if (comp1.go.position.x < comp2.go.position.x + comp2.shape.width &&
                comp1.go.position.x + comp1.shape.width > comp2.go.position.x &&
                comp1.go.position.y < comp2.go.position.y + comp2.shape.height &&
                comp1.go.position.y + comp1.shape.height > comp2.go.position.y) {
                if(comp1.go.getComponent(BallComponent) || comp2.go.getComponent(BallComponent)) {
                    console.log(comp1, comp2);
                }
                comp1.triggerCollision(new CollisionEvent(comp1, comp2));
                comp2.triggerCollision(new CollisionEvent(comp2, comp1));
            }
        }

        return null;
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
