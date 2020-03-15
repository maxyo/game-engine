import {Command} from "./command";
import {Atom} from "../../scene/atom/atom";

export class DeleteAtomCommand extends Command {
    objects: Array<Atom> = [];

    execute() {
    }
}
