import {Component} from "../../../core/component/component";
import {NetworkType} from "../../../network/transport/network-type";
import {Shape} from "../shape/shape";
import {registerClass} from "../../../network/transport/serializer";

@registerClass
export class CanvasComponent extends Component {
    color: string;
    shape: Shape;
    fill: boolean = true;
    layer: number = 1;

    static get netScheme() {
        return {
            ...super.netScheme,
            color: {type: NetworkType.STRING},
            shape: {type: NetworkType.SERIALIZABLE_OBJECT}
        };
    };
}
