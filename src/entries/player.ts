import {Game, GameMode} from "../core/game";
import {Player} from "../core/player";
import {PlayerManager} from "../core/manager/player-manager";
import {AtomManager} from "../core/manager/atom-manager";
import {CanvasRenderManager} from "../render/manager/canvas-render-manager";
import {InputManager} from "../core/manager/input-manager";
import {BallManager} from "../core/manager/ball-manager";
import {CollisionManager} from "../core/manager/collision-manager";
import {GamePlayerManager} from "../core/manager/game-player-manager";

let game = new Game({
    mode: GameMode.Front,
    serverAddress: '192.168.84.27',
    port: "3000",
    managers: [
        AtomManager,
        CanvasRenderManager,
        InputManager,
    ]
});

game.start();
