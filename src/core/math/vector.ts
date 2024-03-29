import {Serializable} from "../../network/transport/serializable";
import {useTrait} from "../util/utils";
import {registerClass} from "../../network/transport/serializer";
import {NetworkType} from "../../network/transport/network-type";

@registerClass
export class Vector {
    @useTrait(Serializable) this;
    protected _X: number;
    protected _Y: number;
    protected _Z: number;

    static netScheme = {
        _X: {type: NetworkType.FLOAT32},
        _Y: {type: NetworkType.FLOAT32}
    };

    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        this._X = x;
        this._Y = y;
        this._Z = z;
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

    public get z(): number {
        return this._Z;
    }

    public set y(value: number) {
        this._Y = value;
    }

    public set z(value: number) {
        this._Z = value;
    }

    public set(x: Vector | number, y: number | null = null, z: number | null = null): Vector {
        if (x instanceof Vector) {
            this._X = x.x;
            this._Y = x.y;
            this._Z = x.z;
        } else {
            if (y === null && z === null) {
                this._X = x;
                this._Y = x;
                this._Z = x;
            } else {
                this._X = x;
                this._Y = y as number;
                this._Z = z as number;
            }
        }
        return this;
    }


    public add(x: Vector | number, y: number | null = null, z: number | null = null): Vector {
        if (x instanceof Vector) {
            this._X += x.x;
            this._Y += x.y;
            this._Z += x.z;
        } else {
            if (y === null && z === null) {
                this._X += x;
                this._Y += x;
                this._Z += x;
            } else {
                this._X += x;
                this._Y += y as number;
                this._Z += z as number;
            }
        }
        return this;
    }

    public multiple(value: Vector | number): Vector {
        if (value instanceof Vector) {
            this._X *= value.x;
            this._Y *= value.y;
            this._Z *= value.z;
        } else {
            this._X *= value;
            this._Y *= value;
            this._Z *= value;
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

    [Symbol.iterator] = function* () {
        yield this.x;
        yield this.y;
        yield this.z;
    }
    static readonly ZERO = new Vector(0, 0).finalize();
    static readonly ONE = new Vector(1, 1).finalize();
    static readonly UP = new Vector(0, 1).finalize();
    static readonly RIGHT = new Vector(1, 0).finalize();
    static readonly DOWN = new Vector(0, -1).finalize();
    static readonly LEFT = new Vector(-1, 0).finalize();

    public finalize() {
        //todo implement
        return this;
    }
}