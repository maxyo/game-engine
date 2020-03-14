import {ONE, Vector} from './vector';

export class Transform {
    position: Vector;
    scale: Vector;
    rotation: Vector;

    constructor() {
        this.position = new Vector();
        this.scale = ONE.copy();
        this.rotation = new Vector();
    }
}
