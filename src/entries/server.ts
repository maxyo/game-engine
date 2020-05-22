import {createServer} from "http";
import {Game, GameMode, IGameConfig} from "../core/game";
import {GameObject} from "../core/scene/atom/game-object/game-object";
import {RenderComponent} from "../render/component/render-component";
import {AtomManager} from "../core/manager/atom-manager";
import {HumanComponent} from "../core/component/human-component";
import {PlayerShape} from "../render/shape/player-shape";

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
