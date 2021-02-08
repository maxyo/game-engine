import {Vector} from "../math/vector";
import * as Ammo from "ammo.js/ammo";

export abstract class Shape {
    protected shape: Ammo.btCollisionShape;

    public set scale(val: Vector) {
        this.shape.setLocalScaling(val);
    }

    public get scale() {
        let tmp = this.shape.getLocalScaling();
        return new Vector(tmp.x(), tmp.y(), tmp.z());
    }

    calculateLocalInertia(mass: number, inertia: Vector): void {
        this.shape.calculateLocalInertia(mass, inertia);
    }

    public set margin(val: number) {
        this.shape.setMargin(val);
    }

    public get margin(): number {
        return this.shape.getMargin();
    }
}

export class BoxShape extends Shape {
    protected shape: Ammo.btBoxShape;

    constructor(size: Vector) {
        super();
        this.shape = new Ammo.btBoxShape(size);
    }
}

export class SphereShape extends Shape {
    protected shape: Ammo.btSphereShape;

    constructor(radius: number) {
        super();
        this.shape = new Ammo.btSphereShape(radius);
    }
}