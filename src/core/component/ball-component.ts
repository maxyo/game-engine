import {Component} from "./component";
import {IUpdatable} from "../scene/atom/interfaces/IUpdatable";
import {Vector} from "../vector";
import {CollisionComponent} from "./collision-component";
import {CollisionEvent} from "../../collision/collision-event";
import {GameObject} from "../scene/atom/game-object/game-object";
import {MS_PER_TICK} from "../game";
import {registerClass} from "../network/transport/serializer";
import {NetworkType} from "../network/transport/network-type";

@registerClass
export class BallComponent extends Component implements IUpdatable {
    private velocity: Vector = new Vector;
    private listen: boolean = false;

    public static get netScheme() {
        return {
            ...super.netScheme,
            velocity: {type: NetworkType.CLASSINSTANCE}
        };
    }

    update(tick_lag: number): void {
        if (!this.listen) {
            this.listen = true;
            this.go.getComponent(CollisionComponent).attachEventListener('collide', (event) => this.onCollide(event))
        }

        let ratio = (tick_lag * MS_PER_TICK) / 1000;

        this.velocity.y += 9.8 * ratio * 2;
        this.velocity.x = Math.lerp(this.velocity.x, 0, 0.01);

        if (this.go.position.y >= 480) {
            this.velocity.y *= -0.6;
            if (Math.abs(this.velocity.y) < 1) {
                this.velocity.y = 0;
            }
        }
        if (this.go.position.x >= 960) {
            this.velocity.x *= -0.6;
        }
        if (this.go.position.x <= 70) {
            this.velocity.x *= -0.6;
        }

        this.go.position.add(this.velocity);

        if (this.go.position.y > 480) {
            this.go.position.y = 480;
        }
        if (this.go.position.x > 960) {
            this.go.position.x = 960;
        }
        if (this.go.position.x < 70) {
            this.go.position.x = 70;
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

        this.velocity.add(diff.multiple(0.9));

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
}
