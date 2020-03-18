import {Game, GameMode} from "../core/game";
import {GameObject} from "../core/scene/atom/game-object/game-object";


let game = new Game({
    mode: GameMode.Front,
    serverAddress: 'localhost',
    port: "3000"
});
game.start();
