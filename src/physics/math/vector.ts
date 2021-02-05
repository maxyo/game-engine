import {Vector as VectorOrigin} from "../../core/math/vector";
import btVector3 = Ammo.btVector3;


export class Vector extends VectorOrigin implements btVector3 {
    // @ts-ignore
    x(): any {
        return this._X;
    }

    // @ts-ignore
    y(): any {
        return this._Y;
    }

    // @ts-ignore
    z(): any {
        return this._Z;
    }

    dot(v: Ammo.btVector3): number {
        return 1;
    }

    op_add(v: Ammo.btVector3): Ammo.btVector3 {
        this.add(v.x(), v.y(), v.z());
        return this;
    }

    op_mul(x: number): Ammo.btVector3 {
        return undefined;
    }

    op_sub(v: Ammo.btVector3): Ammo.btVector3 {
        return undefined;
    }

    rotate(wAxis: Ammo.btVector3, angle: number): Ammo.btVector3 {
        return undefined;
    }

    setValue(x: number, y: number, z: number): void {
    }

    setX(x: number): void {
    }

    setY(y: number): void {
    }

    setZ(z: number): void {
    }

}