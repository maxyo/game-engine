import {Component} from "./component";
import {Serializable} from "../network/transport/serializable";
import {registerClass} from "../network/transport/serializer";

@registerClass
export class RenderComponent extends Component {
    public constructor(go) {
        super(go);
    }
}
