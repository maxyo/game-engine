import {Component} from "../../core/component/component";
import {Atom} from "../../core/scene/atom";
import * as Ammo from "ammo.js/ammo";
import {RigidBodyInterface} from "../rigidbody/rigid-body-interface";
import {AmmoRigidBody} from "../integration/ammojs/ammo-rigid-body";

// @ts-ignore
export class RigidBodyComponent extends Component implements IUpdatable {
    public readonly rb: RigidBodyInterface;

    private static _emptyShape;

    constructor(atom: Atom) {
        super(atom);

        // todo move rb creating to init()
        this.rb = new AmmoRigidBody();

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