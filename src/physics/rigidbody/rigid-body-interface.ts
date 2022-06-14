import {Shape} from "../shape/shape";
import {Vector} from "../../core";

export interface RigidBodyInterface {
    // todo change to component interface
    mass: number;
    position: Vector;
    gravity: Vector;
    shape: Shape;
    linearVelocity: Vector;
    angularVelocity: Vector;

    applyImpulse(impulse: Vector, point: Vector);
}