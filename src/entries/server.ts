import {createServer} from "http";
import {Game, GameMode, IGameConfig} from "../core/game";
import {GameObject} from "../core/scene/atom/game-object/game-object";
import {LogicComponent} from "../core/component/logic-component";
import {RenderComponent} from "../render/component/render-component";
import {BoxShape} from "../render/shape/box-shape";
import {AtomManager} from "../core/manager/atom-manager";
import {Vector} from "../core/vector";

let args = {};

for (let i = 2; i < process.argv.length; i += 2) {
    args[process.argv[i].slice(2)] = process.argv[i + 1];
}

let objcount = 0;
let config: IGameConfig = {
    mode: GameMode.Server,
    serverConfig: {
        server: createServer(),
        port: 3000,
    }
};

let game = new Game(config);


game.start();
setInterval(() => {
    if (objcount > 500) {
        return;
    }
    objcount++;
    let go = new GameObject();
    go.position.add(new Vector(Math.random()*1000, Math.random()*1000));
    let render = go.addComponent(RenderComponent);
    render.shape = new BoxShape();
    render.shape.height = Math.random()*10;
    render.shape.width = Math.random()*10;
    go.addComponent(LogicComponent);
    game.getManager(AtomManager).spawn(go);
}, 1000);
