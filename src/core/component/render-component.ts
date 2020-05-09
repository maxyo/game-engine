import {Component} from "./component";
import {Serializable} from "../network/transport/serializable";
import {registerClass} from "../network/transport/serializer";
import {NetworkType} from "../network/transport/network-type";

@registerClass
export class RenderComponent extends Component {
    public color: string = 'blue';

    static get netScheme() {
        return {
            ...super.netScheme,
            color: {type: NetworkType.STRING},
        };
    };


    public constructor(go) {
        super(go);
    }
}
