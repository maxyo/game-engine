import {Game} from "../../core/game";
import {Serializable} from "../transport/serializable";
import Serializer from "../transport/serializer";
import {Client} from "../client/client";

export abstract class Command extends Serializable {
    abstract execute(...args);
}

export abstract class ServerCommand extends Command {
    abstract execute(game: Game, serializer: Serializer);
}

export abstract class ClientCommand extends Command {
    abstract execute(game: Game, serializer: Serializer, client: Client);
}

export const COMMANDS = {};

export function registerCommand(constructor: Function) {
    COMMANDS[constructor.name] = constructor;
}
