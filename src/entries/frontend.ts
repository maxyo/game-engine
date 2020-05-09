import {Game, GameMode} from "../core/game";

let game = new Game({
    mode: GameMode.Front,
    serverAddress: 'localhost',
    port: "3000"
});

game.start();
