import {Command} from "../network/commands/command";
import {IUpdatable} from "../scene/atom/interfaces/IUpdatable";
import {Game} from "../game";

export abstract class Manager {
    protected game: Game;
    constructor(game:Game) {
        this.game = game;
    }
}

