import {Atom} from "../atom";
import {Vector} from "../../../vector";
import {NetworkType} from "../../../network/transport/network-type";
import {registerClass} from "../../../network/transport/serializer";

@registerClass
export class GameObject extends Atom {

    public readonly scale: Vector = new Vector;
    public readonly rotation: Vector = new Vector;

    static get netScheme() {
        return {
            ...super.netScheme,
            scale: {type: NetworkType.CLASSINSTANCE},
            rotation: {type: NetworkType.CLASSINSTANCE},
        };
    };
}
