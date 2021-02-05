import {Game, GameMode} from "../core/game";
import {ThreejsRenderManager} from "../render/managers/threejs-render-manager";
import {
    AdditiveBlending,
    Blending, BlendingDstFactor,
    BoxGeometry, Color,
    Light,
    Material,
    Mesh, MeshLambertMaterial,
    MeshNormalMaterial,
    MeshPhysicalMaterial, MeshStandardMaterial, MultiplyBlending,
    Object3D, PlaneGeometry, RepeatWrapping, SpriteMaterial, sRGBEncoding, SubtractiveBlending, Texture, TextureLoader,
    Vector3,
    WebGLRenderer
} from "three";
import {GameObject} from "../core/scene/atom/game-object/game-object";
import {RenderComponent} from "../render/components/render-component";
import {AmmojsPhysicsManager} from "../physics/managers/ammojs-physics-manager";
import {RigidBodyComponent} from "../physics/components/rigid-body-component";
import {Vector} from "../core/math/vector";
import btCollisionObject = Ammo.btCollisionObject;
import * as Ammo from "ammo.js/ammo";

let game = new Game({
    mode: GameMode.Front,
    serverAddress: 'localhost',
    port: "3000"
});


initPhysics(game);
initThreejs(game);

let objs = addObjects(game);
objs.push(initGround());
game.start();

objs.forEach(obj => game.getScene().attach(obj))


function addObjects(game: Game): GameObject[] {

    let res = [];
    for (let i = -1; i <= 1; i++) {
        let go = new GameObject();

        let comp = go.addComponent(RenderComponent);
        let mesh = comp.object = new Mesh();
        mesh.geometry = new BoxGeometry(1, 1, 1);
        mesh.material = new MeshNormalMaterial();
        // go.position.x = i / 2;
        // go.position.y = i + 2;
        // go.position.z = i / 2;
        // go.position.z = i*2;
        let phys = go.addComponent(RigidBodyComponent);
        phys.rb.setCollisionFlags(0);
        res.push(go);
    }

    return res;
}

function initGround() {
    let go = new GameObject();

    let comp = go.addComponent(RenderComponent);
    let mesh = comp.object = new Mesh();
    mesh.geometry = new PlaneGeometry(9999, 1, 9999);
    const loader = new TextureLoader();
    const groundTexture = loader.load('textures/terrain/grasslight-big.jpg');
    groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = sRGBEncoding;


    let material = new MeshLambertMaterial({
        map: groundTexture,
    });
    mesh.material = material;
    go.position.x = 0;
    go.position.y = -10;
    // go.position.z = i*2;
    let phys = go.addComponent(RigidBodyComponent);
    phys.rb.setCollisionShape(new Ammo.btBoxShape(new Ammo.btVector3(9999, 2, 9999)));
    phys.rb.setCollisionFlags(2);
    return go;
}

function initPhysics(game: Game) {
    let phys = game.addManager(AmmojsPhysicsManager);
}

function initThreejs(game: Game) {
    let threejs = game.addManager(ThreejsRenderManager);
    let renderer = new WebGLRenderer({
        antialias: true,
        canvas: window.document.getElementById('game-frame') as HTMLCanvasElement,
    })
    renderer.setSize(window.innerWidth, window.innerHeight);

    threejs.setRenderer(
        renderer
    );
}