import {Manager} from "../../core/manager/manager";
import {IUpdatableManager} from "../../core/manager/manager-types";
import {RenderComponent} from "../components/render-component";
import {Camera, Color, DirectionalLight, PerspectiveCamera, PointLight, Renderer, Scene, Vector3} from "three";
import {Game} from "../../core/game";
import {ThreejsSceneDecorator} from "../scene/threejs-scene-decorator";
import {LightComponent} from "../components/light-component";


export class ThreejsRenderManager extends Manager implements IUpdatableManager {

    private components: RenderComponent[] = [];
    private lights: LightComponent[] = [];

    protected scene: Scene;
    public camera: Camera;

    private renderer: Renderer;

    constructor(game: Game) {
        super(game);
        this.scene = new ThreejsSceneDecorator(game.getScene(), () => this.getObjects());
        this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.z = 10;
        this.camera.position.y = 10;
        this.camera.lookAt(new Vector3(0, 0, 0));
    }

    init() {
        this.handleComponentsAt(RenderComponent, this.components);
        this.handleComponentsAt(LightComponent, this.lights);
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