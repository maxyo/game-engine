import {Atom} from "../atom";
import {sync, transportable} from "../../../network/transport/transportable";
import { Vector } from "../../../vector";

@transportable
export class GameObject extends Atom{

    @sync
    scale: Vector = new Vector;
    @sync
    rotation: Vector = new Vector;

    constructor(name?: string) {
        super(name);
    }

    public destroy() {
        super.destroy();
    }

}
