import {BoxShape, Shape, SphereShape} from "../../shape/shape";

export class AmmoShapeExporter {
    static export(shape: Shape) {
        if (shape instanceof BoxShape) {
            let newShape = new Ammo.btBoxShape(shape.size);
            newShape.setMargin(shape.margin);
            shape.attachEventListener('setScale', () => {
                // @ts-ignore
                newShape.setLocalScaling(shape.size.multiple(shape.scale));
            })
            shape.attachEventListener('setMargin', () => {
                newShape.setMargin(shape.margin);
            });
            shape.attachEventListener('setSize', () => {
                // @ts-ignore
                newShape.setLocalScaling(shape.size.multiple(shape.scale));
            });
            return newShape;
        } else if (shape instanceof SphereShape) {
            let newShape = new Ammo.btSphereShape(shape.radius);
            shape.attachEventListener('setMargin', () => {
                newShape.setMargin(shape.margin);
            });
            shape.attachEventListener('setRadius', () => {
                // @ts-ignore
                newShape.setLocalScaling(shape.scale.multiple(shape.radius));
            });
            return newShape;
        } else {
            throw new Error('Invalid shape type: ' + typeof shape);
        }
    }
}
