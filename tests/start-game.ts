import {Game, GameMode, IGameConfig} from "../src/core/game";
import {createServer} from "http";

let game = new Game({
    mode: GameMode.Server,
    serverConfig: {
        httpServer: createServer().listen(3000),
    }
} as IGameConfig);

game.start();
//
// let client = new TestClient({
//     address: 'localhost',
//     port: 3000,
//     nickname: 'asd'
// });
//
