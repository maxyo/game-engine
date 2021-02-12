import {RigidBodyInterface} from "../rigidbody/rigid-body-interface";
import {Shape} from "../shape/shape";
import {AbstractPhysicsManager} from "../manager/abstract-physics-manager";

export abstract class AbstractPhysicsElementsFactory {
    public abstract buildRigidBody(): RigidBodyInterface;

    public abstract buildShape(): Shape;

    public abstract buildJoint();

    public abstract buildManager(): AbstractPhysicsManager;
}