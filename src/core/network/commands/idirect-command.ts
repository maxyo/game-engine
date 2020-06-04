import {Client} from "../client/client";
import {Command} from "./command";

export interface IDirectCommand {
    is(client: Client): boolean
}

export function isDirectCommand(command: Command): boolean {
    return command['is'] !== undefined;
}

