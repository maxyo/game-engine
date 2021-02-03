import {Atom} from "../atom";
import {Vector} from "../../../math/vector";
import {NetworkType} from "../../../network/transport/network-type";
import {registerClass} from "../../../network/transport/serializer";

@registerClass
export class GameObject extends Atom {

    public readonly scale: Vector = new Vector(1, 1, 1);
    public readonly rotation: Vector = new Vector(0,0,1);

    static get netScheme() {
        return {
            ...super.netScheme,
            scale: {type: NetworkType.CLASSINSTANCE},
            rotation: {type: NetworkType.CLASSINSTANCE},
        };
    };
}
