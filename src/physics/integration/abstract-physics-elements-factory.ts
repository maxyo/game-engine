import {RigidbodyInterface} from "../rigidbody/rigidbody-interface";
import {Shape} from "../shape/shape";
import {PhysicsManager} from "../manager/physics-manager";

export abstract class AbstractPhysicsElementsFactory {
    public abstract buildRigidBody(): RigidbodyInterface;

    public abstract buildShape(): Shape;

    public abstract buildJoint();

    public abstract buildManager(): PhysicsManager;
}