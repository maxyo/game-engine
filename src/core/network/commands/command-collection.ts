import {Serializable} from "../transport/serializable";
import {Game} from "../../game";
import {Command} from "../command";
import Serializer, {registerClass} from "../transport/serializer";
import {NetworkType} from "../transport/network-type";

@registerClass
export class CommandCollection extends Command {
    private commands: Command[] = [];

    static get netScheme() {
        return {
            ...super.netScheme,
            commands: {type: NetworkType.LIST, itemType: NetworkType.CLASSINSTANCE},
        }
    }

    public execute(game: Game, serializer: Serializer) {
        this.commands.map((command) => command.execute(game, serializer));
    }

    constructor(commands: Command[]) {
        super();
        this.commands = commands;
    }
}
