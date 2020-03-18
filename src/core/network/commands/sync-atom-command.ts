import {Atom} from "../../scene/atom/atom";
import {Command} from "../command";
import { Game } from "src/core/game";

export class SyncAtomCommand extends Command {
    objects: Array<Atom> = [];

    execute(game: Game) {
    }
}
