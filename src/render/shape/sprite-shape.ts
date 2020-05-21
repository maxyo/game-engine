import {Shape} from "./shape";
import {registerClass} from "../../core/network/transport/serializer";

@registerClass
export class SpriteShape extends Shape {
    public sprite: ImageData;

    public get height() {
        return this.sprite.height;
    }

    public get width() {
        return this.sprite.width;
    }

    public imageData() {
        ImageData
    }
}
