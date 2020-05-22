import {Shape} from "./shape";
import {CircleShape} from "./circle-shape";
import {registerClass} from "../../core/network/transport/serializer";
import {NetworkType} from "../../core/network/transport/network-type";

@registerClass
export class PlayerShape extends CircleShape {
    public toRightDir: number = 1;

    static get netScheme() {
        return {
            ...super.netScheme,
            toRightDir: {type: NetworkType.INT8}
        }
    }
}
