import {Component} from "../../core/component/component";
import {Atom} from "../../core/scene/atom";

// @ts-ignore
export class RigidBodyComponent extends Component {

    private static _emptyShape;

    constructor(atom: Atom) {
        super(atom);

    }

    init() {

    }

    update(tick_lag: number): void {
    }
}