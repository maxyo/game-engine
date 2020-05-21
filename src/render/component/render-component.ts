import {Component} from "../../core/component/component";
import {registerClass} from "../../core/network/transport/serializer";
import {NetworkType} from "../../core/network/transport/network-type";
import {Shape} from "../shape/shape";

@registerClass
export class RenderComponent extends Component {
    public color: string = 'blue';
    public shape: Shape;

    static get netScheme() {
        return {
            ...super.netScheme,
            color: {type: NetworkType.STRING},
            shape: {type: NetworkType.CLASSINSTANCE}
        };
    };

    public constructor(go) {
        super(go);
    }
}
