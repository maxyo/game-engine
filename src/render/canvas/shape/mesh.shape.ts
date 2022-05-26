import {Shape} from "./shape";
import {Vector} from "../../../core/math/vector";

export class MeshShape extends Shape {
    constructor(public readonly points: Vector[]) {
        super()
    }
}
