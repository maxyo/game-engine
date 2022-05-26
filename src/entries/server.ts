import {Game, GameMode, IGameConfig} from "../core/game";
import {AtomManager} from "../core/manager/atom-manager";
import {Atom} from "../core/scene/atom";
import {CanvasComponent} from "../render/canvas/component/canvas.component";
import {BoxShape} from "../render/canvas/shape/box.shape";
import {registerClass} from "../network/transport/serializer";
import {InitPlayerCommand} from "../network/command/init-player-command";
import {Player} from "../core/player";
import {TestComp} from "../tmp/test.component";


registerClass(TestComp)

registerClass(InitPlayerCommand)
registerClass(Player)

let args = {};

for (let i = 2; i < process.argv.length; i += 2) {
    args[process.argv[i].slice(2)] = process.argv[i + 1];
}

let config: IGameConfig = {
    mode: GameMode.Server,
    serverConfig: {
        port: 3000,
    }
};

let game = new Game(config);


const atomManager = game.addManager(AtomManager)

// function initPhysics(game: Game) {
//     let phys = game.addManager(AmmoPhysicsManager);
// }


function addObjects(game: Game): Atom[] {
    let res = [];
    for (let i = -5; i <= 5; i++) {
        let go = new Atom();

        let comp = go.addComponent(CanvasComponent);
        go.transform.position.x = Math.abs(i) % 2 * Math.random() * 100;
        go.transform.position.y = Math.abs(i) % 2 * Math.random() * 100;
        comp.shape = new BoxShape(25, 25);
        comp.color = '#af0f0f'
        res.push(go);
        go.addComponent(TestComp)
    }
    return res;
}

function initGround() {
    let go = new Atom();

    let comp = go.addComponent(CanvasComponent);
    go.transform.position.x = 100
    go.transform.position.y = 100
    comp.color = '#00ff00';
    comp.shape = new BoxShape(1000, 25);
    return go;
}

let objs = addObjects(game);
objs.push(initGround());
game.start();


game.start();


game.attachEventListener('playerAdd', () => {
    objs.forEach(obj => atomManager.spawn(obj))
});