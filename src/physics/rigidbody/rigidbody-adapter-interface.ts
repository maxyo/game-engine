import {RigidBodyComponent} from "../component/rigid-body-component";

export interface RigidbodyAdapterInterface {
    constructor(component: RigidBodyComponent);

    getPosition();

    setPosition();

    setGravity();

    getGravity();
}