import {Game, GameMode} from "../core/game";
import {AtomManager} from "../core/manager/atom-manager";
import {CanvasRenderManager} from "../render/manager/canvas-render-manager";
import {InputManager} from "../core/manager/input-manager";
import {GamePlayerManager} from "../core/manager/game-player-manager";
import {BallManager} from "../core/manager/ball-manager";
import {CollisionManager} from "../core/manager/collision-manager";

let game = new Game({
    mode: GameMode.Front,
    serverAddress: 'localhost',
    port: "3000",
    managers: [
        AtomManager,
        CanvasRenderManager,
        InputManager,
        GamePlayerManager,
        BallManager,
        CollisionManager,
    ]
});

game.start();
