import {Manager} from "./manager";
import {BallComponent} from "../component/ball-component";
import {IUpdatableManager} from "./manager-types";

export class BallManager extends Manager implements IUpdatableManager{
    private ball: BallComponent;

    update(tpf: number) {
        if(!this.ball) {
            for (let go of this.game.getScene().getObjects()) {
                if(go.getComponent(BallComponent)) {
                    this.ball = go.getComponent(BallComponent);
                }
            }
        }

        if(this.ball) {
            this.ball.update(tpf);
        }
    }
}
