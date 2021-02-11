import {Vector} from "../math/vector";
import * as Ammo from "ammo.js/ammo";
import {EventSourceTrait} from "../../core/event/event-source-trait";
import {use} from "typescript-mix";

export interface Shape extends EventSourceTrait {

}

export abstract class Shape {
    @use(EventSourceTrait) this;

    private _scale: Vector = new Vector();
    private _margin: number = 1;

    public set scale(value: Vector) {
        this._scale = value;
        this.trigger('setScale', value);
    }

    public get scale(): Vector {
        return this._scale;
    }

    public set margin(value: number) {
        this._margin = value;
        this.trigger('setMargin', value);
    }

    public get margin(): number {
        return this._margin;
    }
}

export class BoxShape extends Shape {
    private _size: Vector;

    public get size() {
        return this._size;
    }

    public set size(value) {
        this._size = value;
        this.trigger('setSize', value);
    }

    constructor(size: Vector) {
        super();
        this._size = size;
    }
}

export class SphereShape extends Shape {
    private _radius: number;

    constructor(radius: number) {
        super();
        this._radius = radius;
    }

    public get radius() {
        return this._radius;
    }

    public set radius(value) {
        this._radius = value;
        this.trigger('setRadius', value);
    }
}