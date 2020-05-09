import {Command} from "../command";
import {Game} from "src/core/game";
import {NetworkType} from "../transport/network-type";
import {registerClass} from "../transport/serializer";
import {InputAction} from "../../input/input-action";

@registerClass
export class InputCommand extends Command {

    action: InputAction;

    static get netScheme() {
        return {
            // action: {type: NetworkType.CLASSINSTANCE},
        }
    };

    execute(game: Game) {
        console.log(this.action);
    }

    public static create(inputAction: InputAction): InputCommand {
        let result = new InputCommand();

        result.action = inputAction;

        return result;
    }
}
