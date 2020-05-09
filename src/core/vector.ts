import {Serializable} from "./network/transport/serializable";
import {useTrait} from "./util/functions";
import {registerClass} from "./network/transport/serializer";
import {NetworkType} from "./network/transport/network-type";

@registerClass
export class Vector {
    @useTrait(Serializable) this;
    private _X: number;
    private _Y: number;

    static netScheme = {
        _X: {type:NetworkType.FLOAT32},
        _Y: {type:NetworkType.FLOAT32}
    };

    public constructor(x: number = 0, y: number = 0) {
        this._X = x;
        this._Y = y;
    }

    public get x(): number {
        return this._X;
    }

    public set x(value: number) {
        this._X = value;
    }

    public get y(): number {
        return this._Y;
    }

    public set y(value: number) {
        this._Y = value;
    }

    public add(value: Vector | number): Vector {
        if (value instanceof Vector) {
            this._X += value.x;
            this._Y += value.y;
        } else {
            this._X += value;
            this._Y += value;
        }
        return this;
    }

    public multiple(value: Vector | number): Vector {
        if (value instanceof Vector) {
            this._X *= value.x;
            this._Y *= value.y;
        } else {
            this._X *= value;
            this._Y *= value;
        }
        return this;
    }

    public normalize(): Vector {
        let length = this.length();
        length = (1 / length);
        this._X *= length;
        this._Y *= length;
        return this;
    }

    public length(): number {
        return Math.sqrt((this._X * this._X) + (this._Y * this._Y));
    }

    public isEqual(vector: Vector): boolean {
        return vector.x === this.x && vector.y === this.y;
    }

    public copy(): Vector {
        return new Vector(this._X, this._Y);
    }
}

export const ZERO = new Vector(0, 0);
export const ONE = new Vector(1, 1);

export const UP = new Vector(0, 1);
export const RIGHT = new Vector(1, 0);
export const DOWN = new Vector(0, -1);
export const LEFT = new Vector(-1, 0);
