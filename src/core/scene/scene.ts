import {Vector} from '../vector';
import {Tile} from "./atom/tile/tile";
import {GameObject} from "./atom/game-object/game-object";

export class Scene {
    objects: GameObject[];
    tiles: Tile[];
    size: Vector;
}
