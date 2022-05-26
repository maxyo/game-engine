import {Shape} from "./shape";
import {NetworkType} from "../../../network/transport/network-type";
import {registerClass} from "../../../network/transport/serializer";

@registerClass
export class BoxShape extends Shape {
    constructor(
        public readonly width: number,
        public readonly height: number
    ) {
        super()
    }

    static get netScheme() {
        return {
            ...super.netScheme,
            width: {type: NetworkType.FLOAT32},
            height: {type: NetworkType.FLOAT32},
        };
    };
}
