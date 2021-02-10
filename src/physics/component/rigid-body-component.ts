import {Component} from "../../core/component/component";
import {Atom} from "../../core/scene/atom";
import * as Ammo from "ammo.js/ammo";
import {RigidbodyInterface} from "../rigidbody/rigidbody-interface";
import {AmmoRigidbody} from "../rigidbody/ammo-rigidbody";

// @ts-ignore
export class RigidBodyComponent extends Component implements IUpdatable {
    public readonly rb: RigidbodyInterface;

    private static _emptyShape;

    constructor(atom: Atom) {
        super(atom);

        // todo move rb creating to init()
        this.rb = new AmmoRigidbody();

        this.rb.position.set(
            this.go.transform.position.x,
            this.go.transform.position.y,
            this.go.transform.position.z,
        );
    }

    init() {

    }

    update(tick_lag: number): void {
        this.go.transform.position.set(
            this.rb.position.x(),
            this.rb.position.y(),
            this.rb.position.z(),
        );
    }
}