import {Vector} from "../math/vector";
import {NetworkType} from "../../network/transport/network-type";
import {Serializable} from "../../network/transport/serializable";
import {registerClass} from "../../network/transport/serializer";

@registerClass
export class Transform extends Serializable {
    public readonly position: Vector = new Vector;
    public readonly scale: Vector = new Vector(1, 1, 1);
    public readonly rotation: Vector = new Vector(0, 0, 1);
    public parent: null | Transform = null;

    static get netScheme() {
        return {
            id: {type: NetworkType.STRING},
            position: {type: NetworkType.SERIALIZABLE_OBJECT},
            scale: {type: NetworkType.SERIALIZABLE_OBJECT},
            rotation: {type: NetworkType.SERIALIZABLE_OBJECT},
        };
    };

}