import {RigidbodyInterface} from "./rigidbody-interface";
import btDefaultMotionState = Ammo.btDefaultMotionState;
import {Vector} from "../math/vector";
import {Shape} from "../shape/shape";

export class AmmoRigidbody implements RigidbodyInterface {

    private readonly rb: Ammo.btRigidBody;
    private _mass: number;

    constructor() {
        this.rb = new Ammo.btRigidBody(
            new Ammo.btRigidBodyConstructionInfo(
                this._mass = 1,
                new btDefaultMotionState(),
                new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1))
            )
        );
    }

    get angularVelocity(): Vector {
        return this.rb.getAngularVelocity() as Vector;
    }

    set angularVelocity(value) {
        this.rb.setAngularVelocity(value);
    }


    get gravity(): Vector {
        return this.rb.getGravity() as Vector;
    }

    set gravity(value) {
        this.rb.setGravity(value);
    }

    get linearVelocity(): Vector {
        return this.rb.getLinearVelocity() as Vector;
    }

    set linearVelocity(value) {
        this.rb.setLinearVelocity(value);
    }

    get mass(): number {
        return this._mass;
    }

    set mass(value) {
        this._mass = value;
        this.updateMass();
    }

    get position(): Vector {
        return this.rb.getWorldTransform().getOrigin() as Vector;
    }

    set position(value) {
        this.rb.getWorldTransform().getOrigin().setValue(
            value.x(),
            value.y(),
            value.z()
        );
    }

    get shape(): Shape {
        // todo implement
        throw new Error();
    }

    set shape(shape) {
        // todo implement
    }

    applyImpulse(impulse: Vector, point: Vector) {
        this.rb.applyImpulse(impulse, point);
    }

    private updateMass() {
        this.rb.setMassProps(this._mass, new Vector());
    }
}