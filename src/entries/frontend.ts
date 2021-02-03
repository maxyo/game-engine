import {Game, GameMode} from "../core/game";
import {Player} from "../core/player";
import {PlayerManager} from "../core/manager/player-manager";
import {ThreejsRenderManager} from "../render/managers/threejs-render-manager";
import {BoxGeometry, Light, Material, Mesh, MeshNormalMaterial, Object3D, Vector3, WebGLRenderer} from "three";
import {GameObject} from "../core/scene/atom/game-object/game-object";
import {RenderComponent} from "../render/components/render-component";
import {Geometry} from "three/examples/jsm/deprecated/Geometry";
import {UP, Vector} from "../core/math/vector";

let game = new Game({
    mode: GameMode.Front,
    serverAddress: 'localhost',
    port: "3000"
});

let threejs = game.addManager(ThreejsRenderManager);
let renderer = new WebGLRenderer({
    antialias: true,
    canvas: window.document.getElementById('game-frame') as HTMLCanvasElement,
})
renderer.setSize(window.innerWidth, window.innerHeight);

threejs.setRenderer(
    renderer
);

let go = new GameObject();

let comp = go.addComponent(RenderComponent);
let mesh = comp.object = new Mesh();
mesh.geometry = new BoxGeometry(0.2, 0.2, 0.2);
mesh.material = new MeshNormalMaterial();
game.start();

game.getScene().attach(go);
