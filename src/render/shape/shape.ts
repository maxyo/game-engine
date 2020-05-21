import {Serializable} from "../../core/network/transport/serializable";
import {NetworkType} from "../../core/network/transport/network-type";
import {registerClass} from "../../core/network/transport/serializer";

@registerClass
export class Shape extends Serializable {
    height: number;
    width: number;

    static get netScheme(): any {
        return {
            height: {type: NetworkType.FLOAT32},
            width: {type: NetworkType.FLOAT32}
        }
    }
}
