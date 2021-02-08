import {Game} from "../../core/game";
import {Command} from "./command";
import Serializer, {registerClass} from "../transport/serializer";
import {NetworkType} from "../transport/network-type";
import {Client} from "../client/client";

@registerClass
export class CommandCollection extends Command {
    private commands: Command[] = [];

    static get netScheme() {
        return {
            commands: {type: NetworkType.LIST, itemType: NetworkType.SERIALIZABLE_OBJECT},
        }
    }

    public execute(game: Game, serializer: Serializer, client: Client) {
        this.commands.map((command) => command.execute(game, serializer, client));
    }

    constructor(commands: Command[]) {
        super();
        this.commands = commands;
    }
}
