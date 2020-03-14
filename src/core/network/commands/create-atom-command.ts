import {Atom} from "../../scene/atom/atom";
import {Command} from "./command";

export class CreateAtomCommand extends Command {
    objects: Array<Atom> = [];

    execute() {
    }
}
