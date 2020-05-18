import {Game} from "../game";

export abstract class Manager {
    protected game: Game;

    constructor(game: Game) {
        this.game = game;
    }
}

export abstract class ServerManager extends Manager {

}