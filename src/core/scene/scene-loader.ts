import {Scene} from './scene';
import * as fs from 'fs';

export class SceneLoader {
    static load(path: string): Scene {
        return JSON.parse(fs.readFileSync(path, 'utf8')) as Scene;
    }

    static save(path: string, scene: Scene): void {
        const data = JSON.stringify(scene);
        fs.writeFileSync(path, data);
    }
}
