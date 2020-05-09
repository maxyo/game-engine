import {Game} from "../game";
import {Serializable} from "./transport/serializable";
import Serializer from "./transport/serializer";
import {Client} from "./client/client";

export abstract class Command extends Serializable {
    abstract execute(game: Game, serializer: Serializer);
}

export const COMMANDS = {};

export function registerCommand(constructor: Function) {
    COMMANDS[constructor.name] = constructor;
}
