import {Command} from "../network/commands/command";
import {Updatable} from "../scene/atom/interfaces/updatable";

export abstract class Manager implements Updatable {
    public abstract flushCommands(): Command[] | null;

    public abstract update(tick_lag: number): void;
}

