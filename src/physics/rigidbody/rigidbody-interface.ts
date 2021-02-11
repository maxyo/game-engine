import {Vector} from "../math/vector";
import {Shape} from "../shape/shape";

export interface RigidbodyInterface {
    mass: number;
    position: Vector;
    gravity: Vector;
    shape: Shape;
    linearVelocity: Vector;
    angularVelocity: Vector;

    applyImpulse(impulse: Vector, point: Vector);
}