import {Shape} from "./shape";

export class CircleShape extends Shape {
    constructor(public radius: number = 1) {
        super();
    }
}