import {Command} from "../command";
import {Game} from "src/core/game";

export class ActionCommand extends Command {
    action: string;
    target: string;

    execute(game: Game) {
    }

}
