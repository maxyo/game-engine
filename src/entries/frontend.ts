import {Game, GameMode} from "../core/game";
import {AtomManager} from "../core/manager/atom-manager";
import {CanvasRenderManager} from "../render/manager/canvas-render-manager";
import {InputManager} from "../core/manager/input-manager";
import {GamePlayerManager} from "../core/manager/game-player-manager";

let game = new Game({
    mode: GameMode.Front,
    serverAddress: 'localhost',
    port: "3000",
    managers: [
        AtomManager,
        CanvasRenderManager,
        InputManager,
        GamePlayerManager,
    ]
});

game.start();
