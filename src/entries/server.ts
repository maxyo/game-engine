import {createServer} from "http";
import {Game, GameMode, IGameConfig} from "../core/game";

let args = {};

for (let i = 2; i < process.argv.length; i += 2) {
    args[process.argv[i].slice(2)] = process.argv[i + 1];
}

let config: IGameConfig = {
    mode: GameMode.Server,
    serverConfig: {
        server: createServer(),
        port: 3000,
    }
};

let game = new Game(config);

game.start();
