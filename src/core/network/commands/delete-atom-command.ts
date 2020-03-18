import {Command} from "../command";
import {Atom} from "../../scene/atom/atom";
import { Game } from "src/core/game";

export class DeleteAtomCommand extends Command {
    objects: Array<Atom> = [];

    execute(game: Game) {
    }
}
