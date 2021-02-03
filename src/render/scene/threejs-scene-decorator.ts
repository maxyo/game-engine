import {
    Object3D,
    Scene,
} from "three";
import {Scene as OurScene} from "../../core/scene/scene";
import {Scene as TheirScene} from "three";
import {use} from "typescript-mix";
import {Atom} from "../../core/scene/atom/atom";

export interface ThreejsSceneDecorator extends OurScene, TheirScene {
    attach(atom: Atom | Object3D);
}

export class ThreejsSceneDecorator extends TheirScene {
    @use(TheirScene, Scene) this;

    private scene: OurScene;
    private childrenGetter: () => Object3D[];

    constructor(scene: OurScene, childrenGetter: () => Object3D[]) {
        super();
        this.scene = scene;
        this.childrenGetter = childrenGetter;
    }

    attach(object: Object3D): this {
        throw new Error();
    }

    get children() {
        return this.childrenGetter();
    }
    set children(val) {
    }
}