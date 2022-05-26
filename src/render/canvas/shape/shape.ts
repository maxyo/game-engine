import {Serializable} from "../../../network/transport/serializable";
import {Vector} from "../../../core/math/vector";

export abstract class Shape extends Serializable {
    public offset: Vector = new Vector();
    public rotation: number = 0;
}