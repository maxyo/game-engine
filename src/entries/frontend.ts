import {Game, GameMode} from "../core/game";
import {Player} from "../core/player";
import {PlayerManager} from "../core/manager/player-manager";

let game = new Game({
    mode: GameMode.Front,
    serverAddress: 'localhost',
    port: "3000"
});

// game.getManager(PlayerManager).registerPlayer(new Player({id: 1, nickname: "maxyo"}));
game.start();
