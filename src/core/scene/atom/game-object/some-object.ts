import {GameObject} from "./game-object";
import {Updatable} from "../interfaces/updatable";
import {Vector} from "../../../vector";

export class SomeObject extends GameObject implements Updatable {
    private dirX: boolean = false;
    private dirY: boolean = false;


    update(tick_lag: number): void {

        if (this.transform.position.x > 700 || this.transform.position.x < 0) {
            this.dirX = !this.dirX;
        }

        if (this.transform.position.y > 600 || this.transform.position.y < 0) {
            this.dirY = !this.dirY;
        }

        let addVector = new Vector();

        if (this.dirX) {
            addVector.x = -1;
        } else {
            addVector.x = 1;
        }

        if (this.dirY) {
            addVector.y = -1;
        } else {
            addVector.y = 1;
        }

        this.transform.position.add(addVector);
    }
}
