import {Command} from "../network/command";
import {Client} from "../network/client/client";

export interface ISelectiveNetworkManager {
    getCommandsForClient(client: Client): Command[] | null;
}

export interface INetworkManager {
    getCommands(): Command[] | null;
}

export interface IUpdatableManager {
    update(tpf: number);
}

export function isNetworkManager(manager: any): boolean {
    return manager.getCommands !== undefined;
}

export function isSelectiveNetworkManager(manager: any): boolean {
    return manager.getCommandsForClient !== undefined;
}

export function isUpdatableManager(manager: any): boolean {
    return manager.update !== undefined;
}

