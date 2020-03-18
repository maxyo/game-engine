import {Atom} from "../../scene/atom/atom";
import {Command} from "../command";
import {Game} from "src/core/game";
import {transportable} from "../transport/transportable";

@transportable
export class CreateAtomCommand extends Command {
    objects: Array<Atom> = [];

    execute(game: Game) {
        this.objects.forEach((atom: Atom) => game.getScene().attach(atom));
    }

}
