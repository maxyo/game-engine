import {Manager} from "../../core/manager/manager";
import {IUpdatableManager} from "../../core/manager/manager-types";
import {RenderComponent} from "../components/render-component";
import {Camera, DirectionalLight, PerspectiveCamera, Renderer, Scene, Vector3} from "three";
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
        this.camera.position.x = 5;
        this.camera.position.y = 10;
        this.camera.lookAt(new Vector3(0, 0, 0));


        const light = new DirectionalLight(0xdfebff, 1);
        light.position.set(50, 200, 100);
        light.position.multiplyScalar(1.3);

        light.castShadow = true;

        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        const d = 300;

        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;

        light.shadow.camera.far = 1000;

        this.scene.add(light);
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