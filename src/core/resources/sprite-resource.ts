import {Resource} from "./resource";
import Jimp from 'jimp';

export class SpriteResource extends Resource {
    constructor(
        data: Uint8ClampedArray,
        width: number,
        height: number
    ) {
        super();
    }

    async getImageData() {
        const image = await Jimp.read('')
        const buffer = await new Promise<Buffer>((resolve, reject) => {
            image.getBuffer(image.getMIME(), (error, value) => {
                if (error) {
                    reject(error)
                }
                resolve(value)
            })
        });

        return new SpriteResource(
            Uint8ClampedArray.from(buffer),
            image.getWidth(),
            image.getHeight(),
        );
    }

    static async fromFile(path: string): Promise<SpriteResource> {
        return Promise.resolve(null as any);
    }
}
