import {Component} from "./component";
import {IUpdatable} from "../scene/atom/interfaces/IUpdatable";
import {Vector} from "../vector";

export class BallComponent extends Component implements IUpdatable {
    private velocity: Vector = new Vector;

    update(tick_lag: number): void {
        this.velocity.y = Math.lerp(this.velocity.y, 1, 0.1);
        this.velocity.x = Math.lerp(this.velocity.x, 0, 0.1);

        this.go.position.add(this.velocity);
    }
}
