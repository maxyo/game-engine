import {Component} from "./component";
import {IUpdatable} from "../scene/atom/interfaces/IUpdatable";
import {Vector} from "../vector";
import {CollisionComponent} from "./collision-component";
import {CollisionEvent} from "../../collision/collision-event";
import {GameObject} from "../scene/atom/game-object/game-object";
import {HumanComponent} from "./human-component";

export class BallComponent extends Component implements IUpdatable {
    private velocity: Vector = new Vector;
    private listen: boolean = false;

    update(tick_lag: number): void {
        if (!this.listen) {
            this.listen = true;
            this.go.getComponent(CollisionComponent).attachEventListener('collide', (event) => this.onCollide(event))
        }

        this.velocity.y = Math.lerp(this.velocity.y, Math.max(this.velocity.y + 9.8, 1), 0.1);
        this.velocity.x = Math.lerp(this.velocity.x, 0, 0.01);

        this.go.position.add(this.velocity);

        if (this.go.position.y > 498) {
            this.velocity.y *= -0.9;
            this.go.position.y = 480;
        }
        if (this.go.position.x > 1000) {
            this.velocity.x *= -0.9;
            this.go.position.x = 1000;
        }
        if (this.go.position.x < 52) {
            this.velocity.x *= -0.9;
            this.go.position.x = 52;
        }

    }

    onCollide(event: CollisionEvent) {
        let other: GameObject = event.data[0].data.go;
        // if (other.getComponent(HumanComponent)) {
        //     this.velocity.x -= (other.position.x - this.go.position.x) * 0.2;
        //     this.velocity.add(other.getComponent(HumanComponent).velocity.copy().multiple(0.5));
        // }

        // if (other.getComponent(HumanComponent)) {
        //     this.velocity.add(other.getComponent(HumanComponent).velocity.copy().multiple(0.1));
        // }
        //
        // if (other.getComponent(BallComponent)) {
        //     this.velocity.add(other.getComponent(BallComponent).velocity.copy().multiple(0.1));
        // }

        let betweenVector = new Vector(other.position.x - this.go.position.x, other.position.y - this.go.position.y);

        let currentDistance = Vector.distance(this.go.position, other.position);
        let correctDistance = other.getComponent(CollisionComponent).shape.width + this.go.getComponent(CollisionComponent).shape.width;
        let ratio = 2 - currentDistance / correctDistance;

        let willBe = betweenVector.copy().multiple(ratio);
        let diff = new Vector(betweenVector.x - willBe.x, betweenVector.y - willBe.y);

        this.go.position.add(diff);

        this.velocity.add(diff.multiple(1.2));
    }
}
