import {Atom} from "../../scene/atom/atom";
import {Command} from "./command";

export class SyncAtomCommand extends Command {
    objects: Array<Atom> = [];

    execute() {
    }
}
