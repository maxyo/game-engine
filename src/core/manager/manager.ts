import {Command} from "../network/commands/command";
import {Updatable} from "../scene/atom/interfaces/updatable";
import {Game} from "../game";

export abstract class Manager implements Updatable {
    protected readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public abstract update(tick_lag: number): void;

}
