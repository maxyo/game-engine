import {Manager} from "../../core/manager/manager";
import {IUpdatableManager} from "../../core/manager/manager-types";
import {RenderComponent} from "../components/render-component";
import {Camera, CubeCamera, OrthographicCamera, PerspectiveCamera, Renderer, Scene} from "three";
import {Game} from "../../core/game";
import {ThreejsSceneDecorator} from "../scene/threejs-scene-decorator";
import {CinematicCamera} from "three/examples/jsm/cameras/CinematicCamera";


export class ThreejsRenderManager extends Manager implements IUpdatableManager {

    private components: RenderComponent[] = [];

    protected scene: Scene;
    public camera: Camera;

    private renderer: Renderer;

    constructor(game: Game) {
        super(game);
        this.scene = new ThreejsSceneDecorator(game.getScene(), () => this.getObjects());
        this.camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        this.camera.position.z = 1;
    }

    init() {
        this.handleComponentsAt(RenderComponent, this.components);
    }

    setRenderer(renderer: Renderer) {
        this.renderer = renderer;
    }

    update(tpf: number) {
        this.renderer.render(this.scene, this.camera);
    }

    getObjects() {
        let res = [];
        for (let a of this.components) {
            res.push(a.object);
        }
        return res;
    }
}