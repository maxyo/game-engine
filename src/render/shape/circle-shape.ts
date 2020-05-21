import {Shape} from "./shape";
import {registerClass} from "../../core/network/transport/serializer";
import {NetworkType} from "../../core/network/transport/network-type";

@registerClass
export class CircleShape extends Shape {
    public radius: number;

    static get netScheme() {
        return {
            radius: {type: NetworkType.FLOAT32}
        }
    }

    public get width() {
        return this.radius;
    }

    public get height() {
        return this.radius;
    }
}
