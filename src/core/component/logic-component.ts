import {registerClass} from "../network/transport/serializer";
import {Atom} from "../scene/atom/atom";
import {Component} from "./component";

@registerClass
export class LogicComponent extends Component {

    public constructor(go: Atom) {
        super(go);
    }

    public update(tpf: number) {
        this.go.position.add(1);
    }
}
