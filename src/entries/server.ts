import {createServer} from "http";
import {Game, GameMode, IGameConfig} from "../core/game";
import {AtomManager} from "../core/manager/atom-manager";
import {LogicManager} from "../core/manager/logic-manager";
import {RpcManager} from "../core/manager/rpc-manager";
import {BallManager} from "../core/manager/ball-manager";
import {CollisionManager} from "../core/manager/collision-manager";
import {GamePlayerManager} from "../core/manager/game-player-manager";
import {PlayerManager} from "../core/manager/player-manager";

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
    },
    managers: [
        AtomManager,
        RpcManager,
        BallManager,
        CollisionManager,
        GamePlayerManager,
        PlayerManager,
    ],
};

let game = new Game(config);


game.start();
