import {
    Atom,
    AtomManager,
    BoxShape,
    CanvasComponent,
    CanvasManager,
    CircleShape,
    Game,
    GameMode,
    MeshShape,
    Vector
} from "../../src";

let game = new Game({
    mode: GameMode.Front,
});


function initView(game: Game) {
    const canvasManager = game.addManager(CanvasManager);
    const atomManager = game.getManager(AtomManager);
    if (!atomManager || !canvasManager) {
        throw new Error();
    }
    const box = new Atom();
    box.transform.position.add(100, 100);
    const boxComponent = box.addComponent(CanvasComponent);
    boxComponent.shape = new BoxShape(100, 100);
    boxComponent.color = '#00ff00'
    boxComponent.layer = 0
    // boxComponent.fill = false;
    const circle = new Atom();
    circle.transform.position.add(175, 100);
    const circleComponent = circle.addComponent(CanvasComponent);
    circleComponent.shape = new CircleShape(50);
    circleComponent.color = '#ff0000'
    // circleComponent.fill = false;
    const mesh = new Atom();
    mesh.transform.position.add(225, 100);
    const meshComponent = mesh.addComponent(CanvasComponent);
    // meshComponent.fill = false;
    meshComponent.layer = 2
    meshComponent.shape = new MeshShape([
        new Vector(-50, -50),
        new Vector(50, -50),
        new Vector(10, 0),
        new Vector(50, 50),
        new Vector(-50, 50),
        new Vector(-10, 0),
    ]);
    meshComponent.color = '#0000ff';


    atomManager.spawn(mesh);
    atomManager.spawn(circle);
    atomManager.spawn(box);

    canvasManager.setCanvasElement(
        document.getElementById('game-frame') as HTMLCanvasElement
    )
}

game.addManager(AtomManager);
initView(game);

void game.start();
// const playerManager = game.addManager(PlayerManager);
//
//
// playerManager.registerPlayer(new Player({
//     nickname: 'user'
// }));

